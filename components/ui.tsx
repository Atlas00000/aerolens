"use client"

import { useFlightStore } from "@/lib/stores/flight-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plane, Wifi, WifiOff, X, Globe, Activity, MapPin, Clock, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { FlightStats } from "./flight-stats"

export function UI() {
  const { aircraft, selectedAircraft, setSelectedAircraft, isConnected, lastUpdate } = useFlightStore()
  const [hoveredAircraft, setHoveredAircraft] = useState<any>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)



  const aircraftCount = Object.keys(aircraft).length

  // Animate in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

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

  if (!isVisible) return null

  return (
    <>
      {/* Header */}
      <div className={`absolute top-6 left-6 z-10 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <Card className="glass-effect-dark border-white/10 shadow-2xl hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Plane className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg blur-sm"></div>
              </div>
              <div>
                <div className="text-gradient font-bold text-xl">AeroLens</div>
                <div className="text-xs text-slate-400 font-normal">Flight Tracker</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse-glow' : 'bg-red-400'}`}></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  {isConnected ? "Connected" : "Disconnected"}
                </div>
                <div className="text-xs text-slate-400">
                  {isConnected ? "Live data streaming" : "Reconnecting..."}
                </div>
              </div>
              {isConnected ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <div className="text-2xl font-bold text-gradient-blue">{aircraftCount}</div>
                <div className="text-xs text-slate-400">Aircraft</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round((aircraftCount / 1000) * 100)}%
                </div>
                <div className="text-xs text-slate-400">Coverage</div>
              </div>
            </div>

            {/* Last Update */}
            {lastUpdate && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Updated {new Date(lastUpdate).toLocaleTimeString()}</span>
              </div>
            )}


          </CardContent>
        </Card>
      </div>

      {/* Aircraft Details Panel */}
      {selectedAircraft && (
        <div className={`absolute top-6 right-6 z-50 transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
          <Card className="glass-effect-dark border-white/10 shadow-2xl w-96 hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">
                      {selectedAircraft.callsign || "Unknown Flight"}
                    </CardTitle>
                    <div className="text-xs text-slate-400 font-mono">
                      {selectedAircraft.icao24}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAircraft(null)}
                  className="text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Flight Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>Position</span>
                  </div>
                  <div className="text-sm text-white font-mono">
                    {selectedAircraft.latitude.toFixed(4)}, {selectedAircraft.longitude.toFixed(4)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Globe className="w-3 h-3" />
                    <span>Country</span>
                  </div>
                  <div className="text-sm text-white">
                    {selectedAircraft.origin_country}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>Altitude</span>
                  </div>
                  <div className="text-sm text-white">
                    {selectedAircraft.baro_altitude ? `${selectedAircraft.baro_altitude.toLocaleString()} ft` : "N/A"}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Activity className="w-3 h-3" />
                    <span>Speed</span>
                  </div>
                  <div className="text-sm text-white">
                    {selectedAircraft.velocity ? `${selectedAircraft.velocity} kt` : "N/A"}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400 text-xs">Heading</div>
                    <div className="text-white">
                      {selectedAircraft.true_track ? `${selectedAircraft.true_track}°` : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Vertical Rate</div>
                    <div className="text-white">
                      {selectedAircraft.vertical_rate ? `${selectedAircraft.vertical_rate} ft/min` : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge 
                  variant={selectedAircraft.on_ground ? "secondary" : "default"}
                  className={`${selectedAircraft.on_ground ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}
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
          className="fixed z-[60] glass-effect-dark border-white/10 shadow-2xl p-3 rounded-lg pointer-events-none animate-scale-in"
          style={{ 
            left: mousePosition.x + 15, 
            top: mousePosition.y - 15 
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="font-bold text-white text-sm">{hoveredAircraft.callsign || "Unknown"}</div>
          </div>
          <div className="space-y-1 text-xs">
            <div className="text-slate-300">
              Alt: <span className="text-white">{hoveredAircraft.baro_altitude || "N/A"}ft</span>
            </div>
            <div className="text-slate-300">
              Speed: <span className="text-white">{hoveredAircraft.velocity || "N/A"}kt</span>
            </div>
            <div className="text-slate-300">
              Heading: <span className="text-white">{hoveredAircraft.true_track || "N/A"}°</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Controls Help */}
      <div className={`absolute bottom-6 left-6 z-10 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <Card className="glass-effect-dark border-white/10 shadow-2xl">
          <CardContent className="p-4">
            <div className="text-sm text-white font-medium mb-3">Controls</div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-xs">🖱️</div>
                <span>Drag to rotate • Scroll to zoom</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-xs">✈️</div>
                <span>Click aircraft for details</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-xs">🌍</div>
                <span>Drag to rotate the globe</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flight Statistics */}
      <FlightStats />
    </>
  )
}
