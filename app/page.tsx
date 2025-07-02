"use client"

import { Suspense } from "react"
import FlightRadar from "@/components/flight-radar"
import { LoadingScreen } from "@/components/loading-screen"

export default function Home() {
  return (
    <div className="w-full h-screen bg-black">
      <Suspense fallback={<LoadingScreen />}>
        <FlightRadar />
      </Suspense>
    </div>
  )
}
