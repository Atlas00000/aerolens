"use client"

import { Plane } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin mb-4">
          <Plane className="w-12 h-12 text-blue-400 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">AeroLens</h2>
        <p className="text-gray-400">Loading flight data...</p>
      </div>
    </div>
  )
}
