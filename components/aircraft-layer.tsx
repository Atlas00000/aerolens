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

  useFrame(() => {
    if (instancedMeshRef.current && aircraftArray.length > 0) {
      const matrix = new THREE.Matrix4()

      aircraftArray.forEach((plane, index) => {
        const position = positions[index]
        
        // Reset matrix
        matrix.identity()
        
        // Set position
        matrix.setPosition(position.x, position.y, position.z)
        
        // Scale based on selection
        const scale = selectedAircraft?.icao24 === plane.icao24 ? 0.008 : 0.005
        matrix.scale(new THREE.Vector3(scale, scale, scale))
        
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

  // Temporary fallback: render individual meshes for debugging
  if (aircraftArray.length < 10) {
    console.log("Using individual meshes for debugging")
    return (
      <group ref={groupRef}>
        {aircraftArray.map((plane, index) => {
          const position = positions[index]
          const scale = selectedAircraft?.icao24 === plane.icao24 ? 0.008 : 0.005
          
          return (
            <mesh
              key={plane.icao24}
              position={[position.x, position.y, position.z]}
              scale={[scale, scale, scale]}
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
              <coneGeometry args={[1, 3, 4]} />
              <meshStandardMaterial
                color="#4ecdc4"
                emissive="#2a9d8f"
                emissiveIntensity={0.3}
              />
            </mesh>
          )
        })}
      </group>
    )
  }

  // Main instanced mesh approach
  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, aircraftArray.length]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <coneGeometry args={[1, 3, 4]} />
        <meshStandardMaterial
          color="#4ecdc4"
          emissive="#2a9d8f"
          emissiveIntensity={0.3}
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
