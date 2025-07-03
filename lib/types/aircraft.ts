export interface AircraftState {
  icao24: string
  callsign: string | null
  origin_country: string
  time_position: number | null
  last_contact: number
  longitude: number
  latitude: number
  baro_altitude: number | null
  on_ground: boolean
  velocity: number | null
  true_track: number | null
  vertical_rate: number | null
  sensors: number[] | null
  geo_altitude: number | null
  squawk: string | null
  spi: boolean
  position_source: number
}

export interface OpenSkyResponse {
  time: number
  states: (string | number | boolean | null)[][]
}

export interface FlightStore {
  aircraft: Record<string, AircraftState>
  selectedAircraft: AircraftState | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
  errorType: 'network' | 'api' | 'data' | 'unknown' | null
  lastUpdate: number | null
  setSelectedAircraft: (aircraft: AircraftState | null) => void
  updateAircraft: (aircraft: AircraftState[]) => void
  setConnectionStatus: (connected: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null, type?: 'network' | 'api' | 'data' | 'unknown') => void
  clearError: () => void
  startDataFetching: () => void
  stopDataFetching: () => void
}
