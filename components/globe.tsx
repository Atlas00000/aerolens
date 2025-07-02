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
        const newMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.1,
        })
        setMaterial(newMaterial)
      },
      undefined,
      (error) => {
        console.warn("Failed to load Earth texture, using fallback:", error)
        // Fallback to a blue Earth-like color
        const fallbackMaterial = new THREE.MeshStandardMaterial({
          color: "#4a90e2",
          roughness: 0.8,
          metalness: 0.1,
        })
        setMaterial(fallbackMaterial)
      }
    )
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current && isVisible) {
      // Reduce rotation speed for better performance
      meshRef.current.rotation.y += delta * 0.05
    }
  })

  if (!material) {
    return (
      <mesh ref={meshRef} scale={[1, 1, 1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#4a90e2" roughness={0.8} metalness={0.1} />
      </mesh>
    )
  }

  return (
    <mesh ref={meshRef} scale={[1, 1, 1]} material={material}>
      <sphereGeometry args={[1, 32, 32]} />
    </mesh>
  )
}
