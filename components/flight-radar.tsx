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
        <div className="text-sm text-slate-400">Please refresh the page to try again</div>
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
        <div className="text-sm text-slate-400">Initializing Three.js components</div>
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
            <pointLight 
              position={[-10, -10, -5]} 
              intensity={0.5}
              color={new THREE.Color(0x3b82f6)}
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
