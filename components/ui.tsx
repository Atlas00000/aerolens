"use client"

import { useFlightStore } from "@/lib/stores/flight-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plane, Wifi, WifiOff, X, Globe, Activity, MapPin, Clock, TrendingUp, Zap, Target, Users, Loader, AlertTriangle, RefreshCw, Pause, Play, RotateCcw, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { FlightStats } from "./flight-stats"

// Simple Loading Spinner Component
const LoadingSpinner = ({ size = "sm", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }
  
  return (
    <Loader className={`${sizeClasses[size]} animate-spin text-blue-400 ${className}`} />
  )
}

// Error Message Component
const ErrorMessage = ({ error, errorType, onRetry }: { 
  error: string, 
  errorType: 'network' | 'api' | 'data' | 'unknown' | null,
  onRetry: () => void 
}) => {
  const getErrorIcon = () => {
    switch (errorType) {
      case 'network':
        return <WifiOff className="w-5 h-5 text-red-400" />
      case 'api':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />
      case 'data':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      default:
        return <AlertTriangle className="w-5 h-5 text-red-400" />
    }
  }

  const getErrorTitle = () => {
    switch (errorType) {
      case 'network':
        return "Connection Error"
      case 'api':
        return "API Error"
      case 'data':
        return "Data Error"
      default:
        return "Error"
    }
  }

  const getErrorHelp = () => {
    switch (errorType) {
      case 'network':
        return "Check your internet connection and try again."
      case 'api':
        return "The flight data service is temporarily unavailable. Please try again later."
      case 'data':
        return "Unable to process flight data. This may be temporary."
      default:
        return "An unexpected error occurred. Please try again."
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg status-danger border border-danger">
      {getErrorIcon()}
      <div className="flex-1">
        <div className="text-sm font-medium text-red-400">
          {getErrorTitle()}
        </div>
        <div className="text-xs text-slate-400">
          {error}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {getErrorHelp()}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRetry}
        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>
    </div>
  )
}

export function UI() {
  const { 
    aircraft, 
    selectedAircraft, 
    setSelectedAircraft, 
    isConnected, 
    isLoading, 
    isPaused,
    error, 
    errorType, 
    lastUpdate,
    clearError,
    startDataFetching,
    togglePause
  } = useFlightStore()
  const [hoveredAircraft, setHoveredAircraft] = useState<any>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [aircraftCount, setAircraftCount] = useState(0)
  const [inFlightCount, setInFlightCount] = useState(0)
  const [avgAltitude, setAvgAltitude] = useState(0)
  const [avgSpeed, setAvgSpeed] = useState(0)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [shortcutFeedback, setShortcutFeedback] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [hideUI, setHideUI] = useState(false)

  // Calculate aircraft statistics
  useEffect(() => {
    const aircraftArray = Object.values(aircraft)
    const total = aircraftArray.length
    const inFlight = aircraftArray.filter(a => !a.on_ground).length
    
    const altitudes = aircraftArray
      .map(a => a.baro_altitude)
      .filter(alt => alt !== null && alt > 0)
    const avgAlt = altitudes.length > 0 ? altitudes.reduce((sum, alt) => sum + alt!, 0) / altitudes.length : 0
    
    const speeds = aircraftArray
      .map(a => a.velocity)
      .filter(speed => speed !== null && speed > 0)
    const avgSpd = speeds.length > 0 ? speeds.reduce((sum, speed) => sum + speed!, 0) / speeds.length : 0
    
    setAircraftCount(total)
    setInFlightCount(inFlight)
    setAvgAltitude(avgAlt)
    setAvgSpeed(avgSpd)
  }, [aircraft])

  // Handle retry
  const handleRetry = () => {
    clearError()
    startDataFetching()
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault()
          togglePause()
          setShortcutFeedback(isPaused ? 'Resumed data fetching' : 'Paused data fetching')
          break
        case 'r':
          event.preventDefault()
          // Reset view by dispatching a custom event
          window.dispatchEvent(new CustomEvent('reset-view'))
          setShortcutFeedback('Reset camera view')
          break
        case '?':
        case 'h':
          event.preventDefault()
          setShowShortcuts(prev => !prev)
          break
        case 'escape':
          setShowShortcuts(false)
          setSelectedAircraft(null)
          setSearchQuery("")
          setShowSearch(false)
          break
        case 'f':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            setShowSearch(true)
            setShortcutFeedback('Search activated')
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePause, setSelectedAircraft])

  // Animate in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Clear shortcut feedback after 2 seconds
  useEffect(() => {
    if (shortcutFeedback) {
      const timer = setTimeout(() => setShortcutFeedback(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [shortcutFeedback])

  // Listen for hover events from the 3D scene
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    const handleAircraftHover = (event: CustomEvent) => {
      setHoveredAircraft(event.detail)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('aircraft-hover', handleAircraftHover as EventListener)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('aircraft-hover', handleAircraftHover as EventListener)
    }
  }, [])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-hide UI when interacting with globe
  useEffect(() => {
    if (!isMobile) return
    const handleUserInteraction = () => {
      setHideUI(true)
      setTimeout(() => setHideUI(false), 2500)
    }
    window.addEventListener('user-interaction-start', handleUserInteraction)
    return () => window.removeEventListener('user-interaction-start', handleUserInteraction)
  }, [isMobile])

  // Search functionality
  const filteredAircraft = Object.values(aircraft).filter(plane => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      (plane.callsign && plane.callsign.toLowerCase().includes(query)) ||
      plane.icao24.toLowerCase().includes(query) ||
      plane.origin_country.toLowerCase().includes(query)
    )
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query && filteredAircraft.length === 1) {
      setSelectedAircraft(filteredAircraft[0])
    }
  }

  if (!isVisible || (isMobile && hideUI)) return (
    isMobile && (
      <button
        className="fixed z-50 bottom-4 right-4 bg-black/40 text-white rounded-full p-3 shadow-lg"
        onClick={() => setHideUI(false)}
        style={{ opacity: 0.7 }}
        aria-label="Show UI"
      >
        <Plane className="w-6 h-6" />
      </button>
    )
  )

  return (
    <>
      {/* [1] Mobile Top Bar Header */}
      {isMobile ? (
        <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 glass-effect-dark border-b border-white/10">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-white" />
            <span className="text-gradient font-bold text-base">AeroLens</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="text-slate-400 hover:text-white hover:bg-white/10"
              title="Search flights"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHideUI(true)}
              className="text-slate-400 hover:text-white hover:bg-white/10"
              title="Hide UI"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Enhanced Header - Mobile Responsive */}
          <div className={`absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-auto z-10 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Card className="glass-effect-dark border-white/10 shadow-2xl hover-lift">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Plane className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-primary/20 rounded-lg blur-sm"></div>
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-gradient font-bold text-xl">AeroLens</div>
                      <div className="text-xs text-slate-400 font-normal">Flight Tracker</div>
                    </div>
                    <div className="sm:hidden">
                      <div className="text-gradient font-bold text-lg">AeroLens</div>
                      <div className="text-xs text-slate-400 font-normal">Flight Tracker</div>
                    </div>
                  </CardTitle>
                  
                  {/* Search Button for Mobile */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSearch(!showSearch)}
                      className="text-slate-400 hover:text-white hover:bg-white/10"
                      title="Search flights"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Input */}
                {showSearch && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search by flight number, ICAO24, or country..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 glass-effect border-white/10 text-white placeholder:text-slate-400 focus:border-primary"
                    />
                    {searchQuery && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchQuery("")
                            setSelectedAircraft(null)
                          }}
                          className="text-slate-400 hover:text-white h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Search Results */}
                {searchQuery && (
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {filteredAircraft.length > 0 ? (
                      filteredAircraft.slice(0, 5).map((plane) => (
                        <div
                          key={plane.icao24}
                          className="flex items-center gap-2 p-2 rounded-lg glass-effect hover:bg-white/10 cursor-pointer transition-colors"
                          onClick={() => setSelectedAircraft(plane)}
                        >
                          <Plane className="w-3 h-3 text-blue-400" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white truncate">
                              {plane.callsign || "Unknown"}
                            </div>
                            <div className="text-xs text-slate-400 truncate">
                              {plane.icao24} • {plane.origin_country}
                            </div>
                          </div>
                          <Badge 
                            variant="secondary"
                            className={`text-xs ${plane.on_ground ? 'status-success' : 'status-info'}`}
                          >
                            {plane.on_ground ? "Ground" : "Air"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-sm text-slate-400">
                        No flights found
                      </div>
                    )}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <ErrorMessage 
                    error={error} 
                    errorType={errorType} 
                    onRetry={handleRetry}
                  />
                )}

                {/* Connection Status */}
                <div className="flex items-center gap-3 p-3 rounded-lg glass-effect border border-white/10">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse-glow' : 'bg-red-400'}`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      {isLoading ? "Loading..." : isPaused ? "Paused" : isConnected ? "Connected" : "Disconnected"}
                    </div>
                    <div className="text-xs text-slate-400">
                      {isLoading ? "Fetching aircraft data..." : isPaused ? "Data paused - Press Space to resume" : isConnected ? "Live data streaming" : "Reconnecting..."}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : isPaused ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePause}
                        className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/20"
                        title="Resume (Space)"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    ) : isConnected ? (
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-green-400" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={togglePause}
                          className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
                          title="Pause (Space)"
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>

                {/* Enhanced Aircraft Count Display - Mobile Responsive */}
                <div className="space-y-3">
                  {/* Main Aircraft Count */}
                  <div className="text-center p-3 sm:p-4 rounded-lg glass-effect-accent border border-primary relative overflow-hidden hover-stat animate-stat-pulse">
                    <div className="absolute inset-0 bg-gradient-primary/5 animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary animate-data-flow"></div>
                    <div className="relative z-10">
                      {isLoading ? (
                        <div className="flex flex-col items-center gap-2">
                          <LoadingSpinner size={isMobile ? "md" : "lg"} />
                          <div className="text-sm text-slate-300 font-medium">Loading Aircraft</div>
                          <div className="text-xs text-slate-400">Fetching data...</div>
                        </div>
                      ) : (
                        <>
                          <div className={`font-bold text-gradient-blue animate-count-up ${isMobile ? 'text-3xl' : 'text-4xl'}`}>
                            {aircraftCount}
                          </div>
                          <div className="text-sm text-slate-300 font-medium">Total Aircraft</div>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <div className="text-xs text-slate-400">Live Tracking</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Detailed Stats Grid - Mobile Responsive */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {/* In Flight Count */}
                    <div className="text-center p-2 sm:p-3 rounded-lg glass-effect border border-success hover-stat animate-metric-glow">
                      {isLoading ? (
                        <div className="flex flex-col items-center gap-1">
                          <LoadingSpinner size="sm" />
                          <div className="text-xs text-slate-400">Loading...</div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                            <Zap className="w-3 h-3 text-green-400 stat-icon" />
                            <div className="text-sm sm:text-lg font-bold text-gradient-green animate-count-up">{inFlightCount}</div>
                          </div>
                          <div className="text-xs text-slate-400">In Flight</div>
                        </>
                      )}
                    </div>

                    {/* On Ground Count */}
                    <div className="text-center p-2 sm:p-3 rounded-lg glass-effect border border-warning hover-stat animate-metric-glow">
                      {isLoading ? (
                        <div className="flex flex-col items-center gap-1">
                          <LoadingSpinner size="sm" />
                          <div className="text-xs text-slate-400">Loading...</div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                            <Target className="w-3 h-3 text-orange-400 stat-icon" />
                            <div className="text-sm sm:text-lg font-bold text-gradient-orange animate-count-up">{aircraftCount - inFlightCount}</div>
                          </div>
                          <div className="text-xs text-slate-400">On Ground</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Average Metrics - Mobile Responsive */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="text-center p-2 sm:p-3 rounded-lg glass-effect border border-purple hover-stat">
                      {isLoading ? (
                        <div className="flex flex-col items-center gap-1">
                          <LoadingSpinner size="sm" />
                          <div className="text-xs text-slate-400">Loading...</div>
                        </div>
                      ) : (
                        <>
                          <div className="text-xs sm:text-sm font-bold text-gradient-purple animate-count-up">
                            {avgAltitude > 0 ? `${Math.round(avgAltitude / 1000)}k` : 'N/A'}
                          </div>
                          <div className="text-xs text-slate-400">Avg Altitude</div>
                        </>
                      )}
                    </div>
                    <div className="text-center p-2 sm:p-3 rounded-lg glass-effect border border-info hover-stat">
                      {isLoading ? (
                        <div className="flex flex-col items-center gap-1">
                          <LoadingSpinner size="sm" />
                          <div className="text-xs text-slate-400">Loading...</div>
                        </div>
                      ) : (
                        <>
                          <div className="text-xs sm:text-sm font-bold text-gradient-cyan animate-count-up">
                            {avgSpeed > 0 ? `${Math.round(avgSpeed)}` : 'N/A'}
                          </div>
                          <div className="text-xs text-slate-400">Avg Speed (kt)</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Coverage Indicator */}
                  <div className="flex items-center gap-3 p-3 rounded-lg glass-effect border border-white/10">
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <div className="w-3 h-3 bg-gradient-success rounded-full animate-pulse"></div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {isLoading ? "Calculating..." : `${Math.round((aircraftCount / 1000) * 100)}% Coverage`}
                      </div>
                      <div className="text-xs text-slate-400">
                        {isLoading ? "Processing aircraft data..." : aircraftCount > 0 ? `${aircraftCount} aircraft detected` : 'No aircraft detected'}
                      </div>
                    </div>
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Users className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Last Update */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Updating data...</span>
                    </>
                  ) : lastUpdate ? (
                    <>
                      <Clock className="w-3 h-3" />
                      <span>Updated {new Date(lastUpdate).toLocaleTimeString()}</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" />
                      <span>No data available</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* [4] Mobile Bottom Bar Stats */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-20 px-2 pb-2 pt-1 glass-effect-dark border-t border-white/10 flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-white">
            <div>Total: <span className="font-bold text-gradient-blue">{aircraftCount}</span></div>
            <div>In Flight: <span className="font-bold text-gradient-green">{inFlightCount}</span></div>
            <div>On Ground: <span className="font-bold text-gradient-orange">{aircraftCount - inFlightCount}</span></div>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-300">
            <div>Avg Alt: <span className="font-bold text-gradient-purple">{avgAltitude > 0 ? `${Math.round(avgAltitude / 1000)}k` : 'N/A'} ft</span></div>
            <div>Avg Spd: <span className="font-bold text-gradient-cyan">{avgSpeed > 0 ? `${Math.round(avgSpeed)}` : 'N/A'} kt</span></div>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400">
            <div className={isConnected ? 'status-online' : 'status-offline'}>{isConnected ? 'Live' : 'Offline'}</div>
            <div>{lastUpdate ? `Updated ${new Date(lastUpdate).toLocaleTimeString()}` : 'No data'}</div>
          </div>
        </div>
      )}

      {/* Aircraft Details as Bottom Sheet on Mobile */}
      {selectedAircraft && isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-up">
          <Card className="glass-effect-dark border-white/10 shadow-2xl w-full rounded-t-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Plane className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base">
                      {selectedAircraft.callsign || "Unknown Flight"}
                    </CardTitle>
                    <div className="text-xs text-slate-400 font-mono">
                      {selectedAircraft.icao24}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedAircraft(null)}
                  className="text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-white">
              <div className="flex justify-between">
                <span>Position</span>
                <span className="font-mono">{selectedAircraft.latitude.toFixed(2)}, {selectedAircraft.longitude.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Country</span>
                <span>{selectedAircraft.origin_country}</span>
              </div>
              <div className="flex justify-between">
                <span>Altitude</span>
                <span>{selectedAircraft.baro_altitude ? `${selectedAircraft.baro_altitude.toLocaleString()} ft` : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Speed</span>
                <span>{selectedAircraft.velocity ? `${selectedAircraft.velocity} kt` : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Heading</span>
                <span>{selectedAircraft.true_track ? `${selectedAircraft.true_track}°` : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Vertical Rate</span>
                <span>{selectedAircraft.vertical_rate ? `${selectedAircraft.vertical_rate} ft/min` : "N/A"}</span>
              </div>
              <div className="flex justify-center pt-2">
                <Badge 
                  variant={selectedAircraft.on_ground ? "secondary" : "default"}
                  className={`${selectedAircraft.on_ground ? 'status-success' : 'status-info'}`}
                >
                  {selectedAircraft.on_ground ? "On Ground" : "In Flight"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Tooltip */}
      {hoveredAircraft && (
        <div 
          className="fixed z-[60] glass-effect-dark border-white/10 shadow-2xl rounded-xl pointer-events-none animate-tooltip-slide-in animate-tooltip-glow overflow-hidden"
          style={{ 
            left: mousePosition.x + 15, 
            top: mousePosition.y - 15,
            maxWidth: '280px'
          }}
        >
          {/* Tooltip Header */}
          <div className="glass-effect-accent border-b border-primary p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">
                  {hoveredAircraft.callsign || "Unknown Flight"}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {hoveredAircraft.icao24}
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${hoveredAircraft.on_ground ? 'bg-green-400' : 'bg-purple-400'} animate-pulse`}></div>
            </div>
          </div>

          {/* Tooltip Content */}
          <div className="p-3 space-y-3">
            {/* Primary Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 rounded-lg glass-effect border border-purple tooltip-stat">
                <div className="text-lg font-bold text-gradient-purple">
                  {hoveredAircraft.baro_altitude ? `${Math.round(hoveredAircraft.baro_altitude / 1000)}k` : 'N/A'}
                </div>
                <div className="text-xs text-slate-400">Altitude (ft)</div>
              </div>
              <div className="text-center p-2 rounded-lg glass-effect border border-success tooltip-stat">
                <div className="text-lg font-bold text-gradient-green">
                  {hoveredAircraft.velocity ? Math.round(hoveredAircraft.velocity) : 'N/A'}
                </div>
                <div className="text-xs text-slate-400">Speed (kt)</div>
              </div>
            </div>

            {/* Secondary Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Heading</span>
                <span className="text-white font-mono">
                  {hoveredAircraft.true_track ? `${Math.round(hoveredAircraft.true_track)}°` : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Vertical Rate</span>
                <span className="text-white font-mono">
                  {hoveredAircraft.vertical_rate ? `${Math.round(hoveredAircraft.vertical_rate)} ft/min` : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Country</span>
                <span className="text-white truncate ml-2">
                  {hoveredAircraft.origin_country}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center pt-2 border-t border-white/10">
              <Badge 
                variant="secondary"
                className={`text-xs ${hoveredAircraft.on_ground ? 'status-success' : 'status-info'}`}
              >
                {hoveredAircraft.on_ground ? "On Ground" : "In Flight"}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Controls Help - Mobile Responsive */}
      <div className={`absolute z-10 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${isMobile ? 'bottom-4 left-4 right-4' : 'bottom-6 left-6'}`}>
        <Card className={`glass-effect-dark border-white/10 shadow-2xl ${isMobile ? 'w-full' : ''}`}>
          <CardContent className="p-3 sm:p-4">
            <div className={`text-white font-medium mb-2 sm:mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>Controls</div>
            <div className="space-y-1 sm:space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 glass-effect rounded flex items-center justify-center text-xs">🖱️</div>
                <span className={isMobile ? 'text-xs' : 'text-xs'}>Drag to rotate • Scroll to zoom</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 glass-effect rounded flex items-center justify-center text-xs">✈️</div>
                <span className={isMobile ? 'text-xs' : 'text-xs'}>Click aircraft for details</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 glass-effect rounded flex items-center justify-center text-xs">🌍</div>
                <span className={isMobile ? 'text-xs' : 'text-xs'}>Drag to rotate the globe</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flight Statistics */}
      <FlightStats />

      {/* Keyboard Shortcuts Indicator - Mobile Responsive */}
      <div className={`fixed z-50 ${isMobile ? 'bottom-4 right-4' : 'bottom-4 left-4'}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowShortcuts(true)}
          className="glass-effect-dark border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-xs"
          title="Show keyboard shortcuts (? or H)"
        >
          <span className="mr-1">⌨️</span>
          {!isMobile && "Shortcuts"}
        </Button>
      </div>

      {/* Shortcut Feedback */}
      {shortcutFeedback && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[90] animate-scale-in">
          <div className="glass-effect-dark border-white/20 px-4 py-2 rounded-lg shadow-2xl">
            <div className="text-sm font-medium text-white text-center">
              {shortcutFeedback}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      {showShortcuts && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="glass-effect-dark border-white/10 shadow-2xl w-96 animate-scale-in">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Keyboard Shortcuts</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShortcuts(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg glass-effect">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-warning rounded-lg flex items-center justify-center">
                      <Pause className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Pause/Resume</div>
                      <div className="text-xs text-slate-400">Toggle data fetching</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 glass-effect rounded text-xs font-mono text-white">
                    Space
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg glass-effect">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-success rounded-lg flex items-center justify-center">
                      <RotateCcw className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Reset View</div>
                      <div className="text-xs text-slate-400">Reset camera position</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 glass-effect rounded text-xs font-mono text-white">
                    R
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg glass-effect">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-info rounded-lg flex items-center justify-center">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Search Flights</div>
                      <div className="text-xs text-slate-400">Find aircraft by callsign</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 glass-effect rounded text-xs font-mono text-white">
                    Ctrl+F
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg glass-effect">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-danger rounded-lg flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Close Panel</div>
                      <div className="text-xs text-slate-400">Close aircraft details</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 glass-effect rounded text-xs font-mono text-white">
                    Esc
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg glass-effect">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">?</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Show/Hide Help</div>
                      <div className="text-xs text-slate-400">Toggle this panel</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 glass-effect rounded text-xs font-mono text-white">
                    ? or H
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-xs text-slate-400 text-center">
                  Press any key to close this panel
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
