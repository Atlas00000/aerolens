"use client"

import React from "react"
import { Canvas } from "@react-three/fiber"
import { Stats, OrbitControls } from "@react-three/drei"
import { Globe } from "./globe"
import { AircraftLayer } from "./aircraft-layer"
import { UI } from "./ui"
import { useFlightStore } from "@/lib/stores/flight-store"
import { useEffect, useState, Suspense } from "react"

// Error boundary component for 3D content
function ErrorFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-900 text-white">
      <div className="text-center">
        <div className="text-2xl mb-2">🌍</div>
        <div className="text-lg mb-2">3D Globe Loading...</div>
        <div className="text-sm text-gray-400">Please wait while we initialize the 3D environment</div>
      </div>
    </div>
  )
}

// Loading component for 3D content
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-900 text-white">
      <div className="text-center">
        <div className="animate-spin text-2xl mb-2">🌍</div>
        <div className="text-lg mb-2">Loading 3D Globe...</div>
        <div className="text-sm text-gray-400">Initializing Three.js components</div>
      </div>
    </div>
  )
}

export default function FlightRadar() {
  const { startDataFetching, stopDataFetching } = useFlightStore()
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    startDataFetching()
    return () => stopDataFetching()
  }, [startDataFetching, stopDataFetching])

  if (hasError) {
    return <ErrorFallback />
  }

  return (
    <div className="relative w-full h-screen">
      <ErrorBoundary onError={() => setHasError(true)}>
        <Canvas
          camera={{
            position: [0, 0, 3],
            fov: 60,
            near: 0.1,
            far: 1000,
          }}
          gl={{ 
            antialias: false, // Disable antialiasing for better performance
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          frameloop="demand" // Only render when needed
          performance={{ min: 0.5 }} // Reduce quality when performance is low
          onError={(error) => {
            console.error("Canvas error:", error)
            setHasError(true)
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            <Globe />
            <AircraftLayer />

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              zoomSpeed={0.6}
              panSpeed={0.5}
              rotateSpeed={0.4}
              minDistance={1.5}
              maxDistance={10}
              enableDamping={false} // Disable damping for better performance
            />

            <Stats />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      <UI />
    </div>
  )
}

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Component Error:", error, errorInfo)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }

    return this.props.children
  }
}
