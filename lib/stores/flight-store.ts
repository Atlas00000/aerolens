import { create } from "zustand"
import type { AircraftState, FlightStore, OpenSkyResponse } from "@/lib/types/aircraft"

const OPENSKY_API_URL = "https://opensky-network.org/api/states/all"
const FETCH_INTERVAL = 12000 // 12 seconds (OpenSky limit is 10 s per IP)

export const useFlightStore = create<FlightStore>((set, get) => {
  let intervalId: NodeJS.Timeout | null = null
  let lastUpdateTime = 0
  const UPDATE_THROTTLE = 1000 // Only update UI every 1 second

  const parseAircraftData = (states: (string | number | boolean | null)[][]): AircraftState[] => {
    console.log("Parsing aircraft data, states count:", states.length)
    const parsed = states
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
    console.log("Parsed aircraft count:", parsed.length)
    return parsed
  }

  const fetchFlightData = async () => {
    console.log("Fetching flight data...")
    try {
      const response = await fetch(OPENSKY_API_URL)

      // ----- simple rate-limit back-off ------------------------------------
      if (response.status === 429) {
        console.warn("OpenSky rate-limit hit (429); pausing for 30 s")
        // Temporarily stop the normal 12 s polling cycle
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
        // Resume polling after 30 s
        setTimeout(() => {
          fetchFlightData()
          intervalId = setInterval(fetchFlightData, FETCH_INTERVAL)
        }, 30_000)
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: OpenSkyResponse = await response.json()
      console.log("Raw API response:", data)
      const aircraftData = parseAircraftData(data.states || [])

      // Throttle UI updates to improve performance
      const now = Date.now()
      if (now - lastUpdateTime > UPDATE_THROTTLE) {
        set((state) => ({
          ...state,
          isConnected: true,
          lastUpdate: now,
        }))
        lastUpdateTime = now
      }

      get().updateAircraft(aircraftData)
    } catch (error) {
      console.error("Failed to fetch flight data:", error)
      set((state) => ({
        ...state,
        isConnected: false,
      }))
    }
  }

  return {
    aircraft: {},
    selectedAircraft: null,
    isConnected: false,
    lastUpdate: null,

    setSelectedAircraft: (aircraft) => set({ selectedAircraft: aircraft }),

    updateAircraft: (aircraftList) => {
      console.log("Updating aircraft store with:", aircraftList.length, "aircraft")
      const aircraftMap: Record<string, AircraftState> = {}
      aircraftList.forEach((aircraft) => {
        aircraftMap[aircraft.icao24] = aircraft
      })
      set({ aircraft: aircraftMap })
    },

    setConnectionStatus: (connected) => set({ isConnected: connected }),

    startDataFetching: () => {
      console.log("Starting data fetching...")
      if (intervalId) return

      // Initial fetch
      fetchFlightData()

      // Set up interval
      intervalId = setInterval(fetchFlightData, FETCH_INTERVAL)
    },

    stopDataFetching: () => {
      console.log("Stopping data fetching...")
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    },
  }
})
