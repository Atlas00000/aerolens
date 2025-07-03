"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { useFlightStore } from "@/lib/stores/flight-store"
import type { InstancedMesh } from "three"
import * as THREE from "three"

export function AircraftLayer() {
  const { aircraft, selectedAircraft, setSelectedAircraft } = useFlightStore()
  const instancedMeshRef = useRef<InstancedMesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const aircraftArray = useMemo(() => Object.values(aircraft), [aircraft])

  // Pre-calculate positions to avoid doing it every frame
  const positions = useMemo(() => {
    return aircraftArray.map(plane => latLonToVector3(plane.latitude, plane.longitude, 1.02))
  }, [aircraftArray])

  useFrame((state) => {
    if (instancedMeshRef.current && aircraftArray.length > 0) {
      const matrix = new THREE.Matrix4()
      const time = state.clock.getElapsedTime()

      aircraftArray.forEach((plane, index) => {
        const position = positions[index]
        
        // Reset matrix
        matrix.identity()
        
        // Set position with very subtle floating animation
        const floatOffset = Math.sin(time * 1.5 + index * 0.05) * 0.0005
        matrix.setPosition(position.x, position.y + floatOffset, position.z)
        
        // Scale based on selection with minimal pulsing for professional look
        const baseScale = selectedAircraft?.icao24 === plane.icao24 ? 0.015 : 0.012
        const pulseScale = 1 + Math.sin(time * 2 + index * 0.1) * 0.05
        const finalScale = baseScale * pulseScale
        matrix.scale(new THREE.Vector3(finalScale, finalScale, finalScale))
        
        // Add subtle rotation for selected aircraft
        if (selectedAircraft?.icao24 === plane.icao24) {
          matrix.multiply(new THREE.Matrix4().makeRotationY(time * 1.5))
        }
        
        // Apply matrix to instance
        instancedMeshRef.current!.setMatrixAt(index, matrix)
      })

      instancedMeshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  const handleClick = (event: any) => {
    console.log("Click event:", event)
    if (event.object === instancedMeshRef.current) {
      const index = event.instanceId
      console.log("Clicked aircraft index:", index)
      if (index !== undefined && aircraftArray[index]) {
        console.log("Setting selected aircraft:", aircraftArray[index])
        setSelectedAircraft(aircraftArray[index])
      }
    }
  }

  const handlePointerOver = (event: any) => {
    if (event.object === instancedMeshRef.current) {
      const index = event.instanceId
      if (index !== undefined && aircraftArray[index]) {
        // Dispatch custom event for tooltip
        window.dispatchEvent(new CustomEvent('aircraft-hover', {
          detail: aircraftArray[index]
        }))
      }
    }
  }

  const handlePointerOut = () => {
    // Clear tooltip
    window.dispatchEvent(new CustomEvent('aircraft-hover', {
      detail: null
    }))
  }



  if (aircraftArray.length === 0) {
    return (
      <group>
        {/* Show a helpful message when no aircraft are available */}
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-black/80 text-white p-4 rounded-lg text-center max-w-xs">
            <div className="text-lg mb-2">No Aircraft Found</div>
            <div className="text-sm text-slate-300">
              This could be due to:
            </div>
            <ul className="text-xs text-slate-400 mt-2 space-y-1">
              <li>• No flights in this area</li>
              <li>• Data service temporarily unavailable</li>
              <li>• Network connection issues</li>
            </ul>
            <div className="text-xs text-blue-400 mt-3">
              Try refreshing or check back later
            </div>
          </div>
        </Html>
      </group>
    )
  }



  // Use individual meshes for better interaction when aircraft count is low
  if (aircraftArray.length < 20) {
    return (
      <group ref={groupRef}>
        {aircraftArray.map((plane, index) => {
          const position = positions[index]
          const isSelected = selectedAircraft?.icao24 === plane.icao24
          
          return (
            <group key={plane.icao24} position={[position.x, position.y, position.z]}>
              {/* Main aircraft mesh */}
              <mesh
                scale={[0.02, 0.02, 0.02]}
                onClick={(event) => {
                  event.stopPropagation()
                  setSelectedAircraft(plane)
                }}
                onPointerOver={(event) => {
                  event.stopPropagation()
                  window.dispatchEvent(new CustomEvent('aircraft-hover', {
                    detail: plane
                  }))
                }}
                onPointerOut={(event) => {
                  event.stopPropagation()
                  window.dispatchEvent(new CustomEvent('aircraft-hover', {
                    detail: null
                  }))
                }}
              >
                <coneGeometry args={[1, 3, 6]} />
                <meshStandardMaterial
                  color={isSelected ? new THREE.Color(0xff6b6b) : new THREE.Color(0x10b981)}
                  emissive={isSelected ? new THREE.Color(0xff3333) : new THREE.Color(0x059669)}
                  emissiveIntensity={isSelected ? 0.5 : 0.3}
                  metalness={0.6}
                  roughness={0.4}
                  transparent
                  opacity={0.9}
                />
              </mesh>






            </group>
          )
        })}
      </group>
    )
  }

  // Main instanced mesh approach with enhanced materials
  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, aircraftArray.length]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <coneGeometry args={[1, 3, 6]} />
        <meshStandardMaterial
          color={new THREE.Color(0x10b981)}
          emissive={new THREE.Color(0x059669)}
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.4}
          transparent
          opacity={0.9}
        />
      </instancedMesh>
    </group>
  )
}

function latLonToVector3(lat: number, lon: number, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}
