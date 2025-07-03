"use client"

import React from "react"
import { Canvas } from "@react-three/fiber"
import { Stats, OrbitControls } from "@react-three/drei"
import { Globe } from "./globe"
import { AircraftLayer } from "./aircraft-layer"
import { UI } from "./ui"
import { AnimatedBackground } from "./animated-background"
import { NotificationSystem } from "./notification-system"
import { useFlightStore } from "@/lib/stores/flight-store"
import { useEffect, useState, Suspense } from "react"
import * as THREE from "three"

// Error boundary component for 3D content
function ErrorFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="text-center animate-fade-in">
        <div className="text-4xl mb-4 animate-float">🌍</div>
        <div className="text-xl mb-2 font-semibold">3D Environment Error</div>
        <div className="text-sm text-slate-400 mb-4">Unable to load the 3D globe</div>
        <div className="text-xs text-slate-500 max-w-md">
          This could be due to:
          <ul className="mt-2 text-left space-y-1">
            <li>• WebGL not supported in your browser</li>
            <li>• Graphics driver issues</li>
            <li>• Insufficient system resources</li>
          </ul>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}

// Loading component for 3D content
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="text-center animate-fade-in">
        <div className="text-4xl mb-4 animate-spin">🌍</div>
        <div className="text-xl mb-2 font-semibold">Loading 3D Globe...</div>
        <div className="text-sm text-slate-400 mb-2">Initializing Three.js components</div>
        <div className="text-xs text-slate-500">
          This may take a moment on slower devices
        </div>
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
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      <ErrorBoundary onError={() => setHasError(true)}>
        <Canvas
          camera={{
            position: [0, 0, 3],
            fov: 60,
            near: 0.1,
            far: 1000,
          }}
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
            preserveDrawingBuffer: false,
            logarithmicDepthBuffer: true,
          }}
          frameloop="always"
          performance={{ min: 0.8 }}
          onError={(error) => {
            console.error("Canvas error:", error)
            setHasError(true)
          }}
        >
          <Suspense fallback={null}>
            {/* Enhanced lighting setup */}
            <ambientLight intensity={0.4} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1.2}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />


            <Globe />
            <AircraftLayer />

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              zoomSpeed={0.6}
              panSpeed={0.6}
              rotateSpeed={0.4}
              minDistance={1.2}
              maxDistance={8}
              enableDamping={true}
              dampingFactor={0.12}
              enableAutoRotate={false}
              autoRotateSpeed={0.12}
              onStart={() => {
                window.dispatchEvent(new CustomEvent('user-interaction-start'))
              }}
              onChange={() => {
                window.dispatchEvent(new CustomEvent('user-interaction-change'))
              }}
              onEnd={() => {
                window.dispatchEvent(new CustomEvent('user-interaction-end'))
              }}
            />

            {/* Performance stats in development */}
            {process.env.NODE_ENV === 'development' && <Stats />}
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      <UI />
      <NotificationSystem />
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
