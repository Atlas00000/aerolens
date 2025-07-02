"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function Globe() {
  const meshRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const [material, setMaterial] = useState<THREE.Material | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    
    textureLoader.load(
      "/assets/3d/texture_earth.jpg",
      (texture) => {
        // Enhanced material with better visual properties
        const newMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.7,
          metalness: 0.1,
          envMapIntensity: 0.5,
        })
        setMaterial(newMaterial)
      },
      undefined,
      (error) => {
        console.warn("Failed to load Earth texture, using fallback:", error)
        // Enhanced fallback material
        const fallbackMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x4a90e2),
          roughness: 0.7,
          metalness: 0.1,
          envMapIntensity: 0.5,
        })
        setMaterial(fallbackMaterial)
      }
    )
  }, [])



  useFrame((state, delta) => {
    // Animate atmosphere glow only
    if (atmosphereRef.current) {
      const time = state.clock.getElapsedTime()
      const atmosphereMaterial = atmosphereRef.current.material as THREE.MeshBasicMaterial
      if (atmosphereMaterial) {
        atmosphereMaterial.opacity = 0.3 + Math.sin(time * 0.5) * 0.1
      }
    }
  })

  if (!material) {
    return (
      <group>
        <mesh ref={meshRef} scale={[1, 1, 1]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial 
            color={new THREE.Color(0x4a90e2)} 
            roughness={0.7} 
            metalness={0.1}
            envMapIntensity={0.5}
          />
        </mesh>
        {/* Atmospheric glow */}
        <mesh ref={atmosphereRef} scale={[1.05, 1.05, 1.05]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color={new THREE.Color(0x4a90e2)}
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    )
  }

  return (
    <group>
      {/* Main Earth mesh */}
      <mesh ref={meshRef} scale={[1, 1, 1]} material={material}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>

      {/* Atmospheric glow effect */}
      <mesh ref={atmosphereRef} scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={new THREE.Color(0x4a90e2)}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <ringGeometry args={[1, 1.1, 64]} />
        <meshBasicMaterial
          color={new THREE.Color(0x3b82f6)}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
