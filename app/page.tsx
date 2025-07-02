"use client"

import React, { Suspense } from "react"
import FlightRadar from "@/components/flight-radar"
import { LoadingScreen } from "@/components/loading-screen"

export default function Home() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Suspense fallback={<LoadingScreen />}>
        <FlightRadar />
      </Suspense>
    </div>
  )
}
