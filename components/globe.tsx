"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function Globe() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [material, setMaterial] = useState<THREE.Material | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [wasAutoSpinning, setWasAutoSpinning] = useState(true) // Start with auto-spin active

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

  // Listen for user interactions
  useEffect(() => {
    // Listen for OrbitControls events
    const handleOrbitStart = () => {
      setIsUserInteracting(true)
    }

    const handleOrbitChange = () => {
      setIsUserInteracting(true)
    }

    const handleOrbitEnd = () => {
      // Keep interaction state true for a short time to prevent immediate auto-spin
      setTimeout(() => {
        setIsUserInteracting(false)
      }, 1000) // 1 second delay before resuming auto-spin
    }

    // Listen for mouse and touch events
    const handleUserInteraction = () => {
      setIsUserInteracting(true)
      // Reset interaction state after a short delay
      setTimeout(() => {
        setIsUserInteracting(false)
      }, 1000)
    }

    const events = ['mousedown', 'mousemove', 'wheel', 'touchstart', 'touchmove']
    
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction, { passive: true })
    })

    // Listen for OrbitControls events
    window.addEventListener('user-interaction-start', handleOrbitStart)
    window.addEventListener('user-interaction-change', handleOrbitChange)
    window.addEventListener('user-interaction-end', handleOrbitEnd)

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction)
      })
      window.removeEventListener('user-interaction-start', handleOrbitStart)
      window.removeEventListener('user-interaction-change', handleOrbitChange)
      window.removeEventListener('user-interaction-end', handleOrbitEnd)
    }
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current && isVisible) {
      // Auto-spin when user is not interacting
      if (!isUserInteracting) {
        // Smooth auto-rotation
        meshRef.current.rotation.y += delta * 0.3
        
        // Notify UI that auto-spin is active
        if (!wasAutoSpinning) {
          setWasAutoSpinning(true)
          window.dispatchEvent(new CustomEvent('auto-spin-start'))
        }
      } else {
        // Notify UI that auto-spin stopped
        if (wasAutoSpinning) {
          setWasAutoSpinning(false)
          window.dispatchEvent(new CustomEvent('auto-spin-stop'))
        }
      }
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
