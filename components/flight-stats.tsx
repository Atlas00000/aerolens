"use client"

import { useState, useEffect } from "react"
import { useFlightStore } from "@/lib/stores/flight-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Plane, Globe, Activity, Users } from "lucide-react"

interface FlightStats {
  totalAircraft: number
  inFlight: number
  onGround: number
  avgAltitude: number
  avgSpeed: number
  countries: number
}

export function FlightStats() {
  const { aircraft } = useFlightStore()
  const [stats, setStats] = useState<FlightStats>({
    totalAircraft: 0,
    inFlight: 0,
    onGround: 0,
    avgAltitude: 0,
    avgSpeed: 0,
    countries: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (Object.keys(aircraft).length === 0) return

    const aircraftArray = Object.values(aircraft)
    const inFlight = aircraftArray.filter(a => !a.on_ground).length
    const onGround = aircraftArray.filter(a => a.on_ground).length
    
    const altitudes = aircraftArray
      .map(a => a.baro_altitude)
      .filter(alt => alt !== null && alt > 0)
    const avgAltitude = altitudes.length > 0 
      ? altitudes.reduce((sum, alt) => sum + alt!, 0) / altitudes.length 
      : 0

    const speeds = aircraftArray
      .map(a => a.velocity)
      .filter(speed => speed !== null && speed > 0)
    const avgSpeed = speeds.length > 0 
      ? speeds.reduce((sum, speed) => sum + speed!, 0) / speeds.length 
      : 0

    const countries = new Set(aircraftArray.map(a => a.origin_country)).size

    setStats({
      totalAircraft: aircraftArray.length,
      inFlight,
      onGround,
      avgAltitude: Math.round(avgAltitude),
      avgSpeed: Math.round(avgSpeed),
      countries
    })
  }, [aircraft])

  if (!isVisible) return null

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    delay = 0 
  }: {
    title: string
    value: string | number
    icon: any
    color: string
    delay?: number
  }) => (
    <Card 
      className={`glass-effect-dark border-white/10 shadow-2xl hover-lift transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-slate-400">{title}</div>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="absolute bottom-6 right-6 z-40">
      <Card className="glass-effect-dark border-white/10 shadow-2xl w-80">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Flight Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="Total Aircraft"
              value={stats.totalAircraft}
              icon={Plane}
              color="bg-gradient-to-r from-blue-500 to-purple-600"
              delay={0}
            />
            <StatCard
              title="In Flight"
              value={stats.inFlight}
              icon={Activity}
              color="bg-gradient-to-r from-green-500 to-emerald-600"
              delay={100}
            />
            <StatCard
              title="On Ground"
              value={stats.onGround}
              icon={Plane}
              color="bg-gradient-to-r from-yellow-500 to-orange-600"
              delay={200}
            />
            <StatCard
              title="Countries"
              value={stats.countries}
              icon={Globe}
              color="bg-gradient-to-r from-purple-500 to-pink-600"
              delay={300}
            />
          </div>

          {/* Average metrics */}
          <div className="pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">Avg Altitude</div>
                <div className="text-lg font-semibold text-white">
                  {stats.avgAltitude.toLocaleString()} ft
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Avg Speed</div>
                <div className="text-lg font-semibold text-white">
                  {stats.avgSpeed} kt
                </div>
              </div>
            </div>
          </div>

          {/* Progress bars */}
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>In Flight</span>
                <span>{Math.round((stats.inFlight / stats.totalAircraft) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000"
                  style={{ width: `${(stats.inFlight / stats.totalAircraft) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>On Ground</span>
                <span>{Math.round((stats.onGround / stats.totalAircraft) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full transition-all duration-1000"
                  style={{ width: `${(stats.onGround / stats.totalAircraft) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 