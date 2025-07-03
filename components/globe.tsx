"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function Globe() {
  const meshRef = useRef<THREE.Mesh>(null)

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
          color: new THREE.Color(0x2a2a2a),
          roughness: 0.7,
          metalness: 0.1,
          envMapIntensity: 0.5,
        })
        setMaterial(fallbackMaterial)
      }
    )
  }, [])





  if (!material) {
    return (
      <group>
        <mesh ref={meshRef} scale={[1, 1, 1]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial 
            color={new THREE.Color(0x2a2a2a)} 
            roughness={0.7} 
            metalness={0.1}
            envMapIntensity={0.5}
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


    </group>
  )
}
