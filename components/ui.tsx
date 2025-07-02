"use client"

import { useFlightStore } from "@/lib/stores/flight-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plane, Wifi, WifiOff, X, RotateCcw } from "lucide-react"
import { useState, useEffect } from "react"

export function UI() {
  const { aircraft, selectedAircraft, setSelectedAircraft, isConnected, lastUpdate } = useFlightStore()
  const [hoveredAircraft, setHoveredAircraft] = useState<any>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isAutoSpinning, setIsAutoSpinning] = useState(false)

  const aircraftCount = Object.keys(aircraft).length

  // Listen for hover events from the 3D scene
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    const handleAircraftHover = (event: CustomEvent) => {
      setHoveredAircraft(event.detail)
    }

    // Listen for auto-spin state changes
    const handleAutoSpinStart = () => {
      setIsAutoSpinning(true)
    }

    const handleAutoSpinStop = () => {
      setIsAutoSpinning(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('aircraft-hover', handleAircraftHover as EventListener)
    window.addEventListener('auto-spin-start', handleAutoSpinStart)
    window.addEventListener('auto-spin-stop', handleAutoSpinStop)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('aircraft-hover', handleAircraftHover as EventListener)
      window.removeEventListener('auto-spin-start', handleAutoSpinStart)
      window.removeEventListener('auto-spin-stop', handleAutoSpinStop)
    }
  }, [])

  return (
    <>
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="bg-black/80 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Plane className="w-5 h-5" />
              AeroLens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              {isConnected ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
              <span className="text-sm text-gray-300">{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
            <div className="text-sm text-gray-300">
              Aircraft: <Badge variant="secondary">{aircraftCount}</Badge>
            </div>
            {lastUpdate && (
              <div className="text-xs text-gray-400">Last update: {new Date(lastUpdate).toLocaleTimeString()}</div>
            )}
            {/* Auto-spin indicator */}
            {isAutoSpinning && (
              <div className="flex items-center gap-2 text-xs text-blue-400">
                <RotateCcw className="w-3 h-3 animate-spin" />
                <span>Auto-spinning</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Aircraft Details Panel */}
      {selectedAircraft && (
        <div className="absolute top-4 right-4 z-10">
          <Card className="bg-black/80 border-gray-700 w-80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{selectedAircraft.callsign || "Unknown Flight"}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAircraft(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">ICAO24</div>
                  <div className="text-white font-mono">{selectedAircraft.icao24}</div>
                </div>
                <div>
                  <div className="text-gray-400">Origin Country</div>
                  <div className="text-white">{selectedAircraft.origin_country}</div>
                </div>
                <div>
                  <div className="text-gray-400">Altitude</div>
                  <div className="text-white">{selectedAircraft.baro_altitude || "N/A"} ft</div>
                </div>
                <div>
                  <div className="text-gray-400">Ground Speed</div>
                  <div className="text-white">{selectedAircraft.velocity || "N/A"} kt</div>
                </div>
                <div>
                  <div className="text-gray-400">Heading</div>
                  <div className="text-white">{selectedAircraft.true_track || "N/A"}°</div>
                </div>
                <div>
                  <div className="text-gray-400">Vertical Rate</div>
                  <div className="text-white">{selectedAircraft.vertical_rate || "N/A"} ft/min</div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="text-gray-400 text-xs">Position</div>
                <div className="text-white font-mono text-sm">
                  {selectedAircraft.latitude.toFixed(4)}, {selectedAircraft.longitude.toFixed(4)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Simple Tooltip */}
      {hoveredAircraft && (
        <div 
          className="fixed z-50 bg-black/90 text-white p-2 rounded text-xs pointer-events-none"
          style={{ 
            left: mousePosition.x + 10, 
            top: mousePosition.y - 10 
          }}
        >
          <div className="font-bold">{hoveredAircraft.callsign || "Unknown"}</div>
          <div>Alt: {hoveredAircraft.baro_altitude || "N/A"}ft</div>
          <div>Speed: {hoveredAircraft.velocity || "N/A"}kt</div>
        </div>
      )}

      {/* Controls Help */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-black/80 border-gray-700">
          <CardContent className="p-3">
            <div className="text-xs text-gray-300 space-y-1">
              <div>🖱️ Drag to rotate • Scroll to zoom</div>
              <div>✈️ Click aircraft for details</div>
              <div>🌍 Globe auto-spins when idle</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
