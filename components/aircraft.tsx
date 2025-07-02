"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import type { AircraftState } from "@/lib/types/aircraft"
import * as THREE from "three"

interface AircraftProps {
  aircraft: AircraftState
  isSelected: boolean
  onClick: () => void
}

export function Aircraft({ aircraft, isSelected, onClick }: AircraftProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const position = latLonToVector3(aircraft.latitude, aircraft.longitude, 1.02)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0)
    }
  })

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh ref={meshRef} onClick={onClick} scale={isSelected ? [0.008, 0.008, 0.008] : [0.005, 0.005, 0.005]}>
        <coneGeometry args={[1, 3, 4]} />
        <meshStandardMaterial
          color={isSelected ? "#ff6b6b" : "#4ecdc4"}
          emissive={isSelected ? "#ff3333" : "#2a9d8f"}
          emissiveIntensity={0.3}
        />
      </mesh>

      {isSelected && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-white p-2 rounded text-xs whitespace-nowrap">
            <div className="font-bold">{aircraft.callsign || "Unknown"}</div>
            <div>Alt: {aircraft.baro_altitude || "N/A"}ft</div>
            <div>Speed: {aircraft.velocity || "N/A"}kt</div>
            <div>Heading: {aircraft.true_track || "N/A"}°</div>
          </div>
        </Html>
      )}
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
