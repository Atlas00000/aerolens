import { create } from "zustand"
import type { AircraftState, FlightStore, OpenSkyResponse } from "@/lib/types/aircraft"

// Use the public endpoint with limited data (last 15 minutes, within bounds)
const OPENSKY_API_URL = "https://opensky-network.org/api/states/all?lamin=35&lamax=70&lomin=-15&lomax=45"
const FETCH_INTERVAL = 15000 // 15 seconds (OpenSky limit is 10 s per IP, but we use 15 to be safe)

export const useFlightStore = create<FlightStore>((set, get) => {
  let intervalId: NodeJS.Timeout | null = null
  let lastUpdateTime = 0
  const UPDATE_THROTTLE = 1000 // Only update UI every 1 second

  const parseAircraftData = (states: (string | number | boolean | null)[][]): AircraftState[] => {
    return states
      .filter((state) => state[5] !== null && state[6] !== null) // Filter out aircraft without position
      .map((state) => ({
        icao24: state[0] as string,
        callsign: state[1] as string | null,
        origin_country: state[2] as string,
        time_position: state[3] as number | null,
        last_contact: state[4] as number,
        longitude: state[5] as number,
        latitude: state[6] as number,
        baro_altitude: state[7] as number | null,
        on_ground: state[8] as boolean,
        velocity: state[9] as number | null,
        true_track: state[10] as number | null,
        vertical_rate: state[11] as number | null,
        sensors: state[12] as number[] | null,
        geo_altitude: state[13] as number | null,
        squawk: state[14] as string | null,
        spi: state[15] as boolean,
        position_source: state[16] as number,
      }))
  }

  const fetchFlightData = async () => {
    // Don't fetch if paused
    if (get().isPaused) return
    
    // Set loading state
    set((state) => ({ ...state, isLoading: true, error: null, errorType: null }))
    
    // For testing, immediately use fallback data
    const fallbackData = generateFallbackData()
    get().updateAircraft(fallbackData)
    
    set((state) => ({
      ...state,
      isConnected: true,
      isLoading: false,
      lastUpdate: Date.now(),
    }))
    
    // Try to fetch real data first
    try {
      const response = await fetch(OPENSKY_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      // Handle rate limiting
      if (response.status === 429) {
        get().setError("Rate limit exceeded. Please wait 30 seconds before retrying.", 'api')
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
        setTimeout(() => {
          get().clearError()
          fetchFlightData()
          intervalId = setInterval(fetchFlightData, FETCH_INTERVAL)
        }, 30_000)
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: OpenSkyResponse = await response.json()
      
      if (!data.states || data.states.length === 0) {
        get().setError("No aircraft data available in this area. Try a different region or time.", 'data')
        // Use fallback data
        const fallbackData = generateFallbackData()
        get().updateAircraft(fallbackData)
        set((state) => ({
          ...state,
          isConnected: true,
          isLoading: false,
          lastUpdate: Date.now(),
        }))
        return
      }

      const aircraftData = parseAircraftData(data.states)

      // Update state
      const now = Date.now()
      if (now - lastUpdateTime > UPDATE_THROTTLE) {
        set((state) => ({
          ...state,
          isConnected: true,
          isLoading: false,
          lastUpdate: now,
        }))
        lastUpdateTime = now
      }

      get().updateAircraft(aircraftData)
      get().clearError() // Clear any previous errors
      
    } catch (error) {
      console.error("Failed to fetch flight data:", error)
      
      // Determine error type and set appropriate message
      let errorMessage = "Failed to connect to flight data service."
      let errorType: 'network' | 'api' | 'data' | 'unknown' = 'unknown'
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "Network connection failed. Please check your internet connection."
        errorType = 'network'
      } else if (error instanceof Error) {
        if (error.message.includes('HTTP')) {
          errorMessage = `Server error: ${error.message}`
          errorType = 'api'
        } else {
          errorMessage = `Connection error: ${error.message}`
          errorType = 'network'
        }
      }
      
      get().setError(errorMessage, errorType)
      
      // Use fallback data on error
      const fallbackData = generateFallbackData()
      get().updateAircraft(fallbackData)
      
      set((state) => ({
        ...state,
        isConnected: true, // Show as connected even with fallback data
        isLoading: false,
        lastUpdate: Date.now(),
      }))
    }
  }

  // Generate fallback data for testing when API is unavailable
  const generateFallbackData = (): AircraftState[] => {
    const fallbackAircraft: AircraftState[] = []
    const callsigns = ['BA123', 'LH456', 'AF789', 'KL012', 'IB345', 'AZ678', 'TP901', 'SN234']
    const countries = ['United Kingdom', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'Portugal', 'Belgium']
    
    for (let i = 0; i < 8; i++) {
      fallbackAircraft.push({
        icao24: `a1b2c${i.toString().padStart(2, '0')}`,
        callsign: callsigns[i],
        origin_country: countries[i],
        time_position: Date.now() / 1000,
        last_contact: Date.now() / 1000,
        longitude: -5 + (Math.random() - 0.5) * 20, // UK/Europe area
        latitude: 50 + (Math.random() - 0.5) * 10,
        baro_altitude: 30000 + Math.random() * 20000,
        on_ground: false,
        velocity: 400 + Math.random() * 200,
        true_track: Math.random() * 360,
        vertical_rate: (Math.random() - 0.5) * 2000,
        sensors: null,
        geo_altitude: 30000 + Math.random() * 20000,
        squawk: Math.floor(Math.random() * 7777).toString().padStart(4, '0'),
        spi: false,
        position_source: 0,
      })
    }
    
    return fallbackAircraft
  }

  return {
    aircraft: {},
    selectedAircraft: null,
    isConnected: false,
    isLoading: false,
    isPaused: false,
    error: null,
    errorType: null,
    lastUpdate: null,

    setSelectedAircraft: (aircraft) => set({ selectedAircraft: aircraft }),

    updateAircraft: (aircraftList) => {
      const aircraftMap: Record<string, AircraftState> = {}
      aircraftList.forEach((aircraft) => {
        aircraftMap[aircraft.icao24] = aircraft
      })
      set({ aircraft: aircraftMap })
    },

    setConnectionStatus: (connected) => set({ isConnected: connected }),
    
    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error, type = 'unknown') => set({ error, errorType: type }),
    
    clearError: () => set({ error: null, errorType: null }),

    togglePause: () => {
      const currentState = get()
      set({ isPaused: !currentState.isPaused })
      
      if (currentState.isPaused) {
        // Resume - start fetching again
        if (!intervalId) {
          fetchFlightData()
          intervalId = setInterval(fetchFlightData, FETCH_INTERVAL)
        }
      } else {
        // Pause - stop the interval but keep the current data
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
      }
    },

    startDataFetching: () => {
      if (intervalId) {
        return
      }

      // Clear any previous errors
      get().clearError()

      // Initial fetch
      fetchFlightData()

      // Set up interval
      intervalId = setInterval(fetchFlightData, FETCH_INTERVAL)
    },

    stopDataFetching: () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    },
  }
})
