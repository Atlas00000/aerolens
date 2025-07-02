"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
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
        const baseScale = selectedAircraft?.icao24 === plane.icao24 ? 0.012 : 0.008
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
    if (event.object === instancedMeshRef.current) {
      const index = event.instanceId
      if (index !== undefined && aircraftArray[index]) {
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

  // Debug logging
  console.log("Aircraft count:", aircraftArray.length)
  console.log("Sample aircraft:", aircraftArray[0])

  if (aircraftArray.length === 0) {
    console.log("No aircraft to render")
    return null
  }

  // Enhanced materials with better visual effects
  const createAircraftMaterial = (isSelected: boolean) => {
    if (isSelected) {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x3b82f6), // Blue
        emissive: new THREE.Color(0x1d4ed8),
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
      })
    }
    
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x10b981), // Green
      emissive: new THREE.Color(0x059669),
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.4,
      transparent: true,
      opacity: 0.8,
    })
  }

  // Temporary fallback: render individual meshes for debugging with enhanced visuals
  if (aircraftArray.length < 10) {
    console.log("Using individual meshes for debugging")
    return (
      <group ref={groupRef}>
        {aircraftArray.map((plane, index) => {
          const position = positions[index]
          const isSelected = selectedAircraft?.icao24 === plane.icao24
          const material = createAircraftMaterial(isSelected)
          
          return (
            <group key={plane.icao24} position={[position.x, position.y, position.z]}>
              {/* Main aircraft mesh */}
              <mesh
                onClick={() => setSelectedAircraft(plane)}
                onPointerOver={() => {
                  window.dispatchEvent(new CustomEvent('aircraft-hover', {
                    detail: plane
                  }))
                }}
                onPointerOut={() => {
                  window.dispatchEvent(new CustomEvent('aircraft-hover', {
                    detail: null
                  }))
                }}
              >
                <coneGeometry args={[1, 3, 6]} />
                <primitive object={material} />
              </mesh>

              {/* Glow effect for selected aircraft */}
              {isSelected && (
                <mesh>
                  <sphereGeometry args={[2, 16, 16]} />
                  <meshBasicMaterial
                    color={new THREE.Color(0x3b82f6)}
                    transparent
                    opacity={0.1}
                  />
                </mesh>
              )}

              {/* Trail effect for moving aircraft */}
              {plane.velocity && plane.velocity > 50 && (
                <mesh position={[-1.5, 0, 0]}>
                  <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
                  <meshBasicMaterial
                    color={new THREE.Color(0x3b82f6)}
                    transparent
                    opacity={0.3}
                  />
                </mesh>
              )}
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
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.4}
          transparent
          opacity={0.8}
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
