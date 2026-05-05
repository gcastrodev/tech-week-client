"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Sparkles, TorusKnot } from "@react-three/drei"
import * as THREE from "three"

function Scene() {
  const group = useRef<THREE.Group>(null)
  const knot = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()

  useFrame((state) => {
    const g = group.current
    const k = knot.current
    if (!g || !k) return
    const t = state.clock.elapsedTime
    k.rotation.x = t * 0.31
    k.rotation.y = t * 0.42
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.x * 0.35, 0.06)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.y * 0.22, 0.06)
  })

  return (
    <group ref={group}>
      <ambientLight intensity={0.35} />
      <pointLight position={[8, 6, 10]} intensity={32} color="#22d3ee" />
      <pointLight position={[-10, -4, -6]} intensity={22} color="#00ff88" />

      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.6}>
        <TorusKnot ref={knot} args={[0.52, 0.16, 220, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#0c1a2e"
            emissive="#22d3ee"
            emissiveIntensity={0.85}
            metalness={0.92}
            roughness={0.18}
          />
        </TorusKnot>
      </Float>

      <Sparkles
        count={420}
        scale={[18, 14, 8]}
        size={2.8}
        speed={0.45}
        opacity={0.75}
        color="#22d3ee"
      />
      <Sparkles
        count={220}
        scale={[20, 16, 10]}
        size={1.9}
        speed={0.32}
        opacity={0.5}
        color="#00ff88"
      />
    </group>
  )
}

function Fallback() {
  return null
}

export function HeroWebGL() {
  const [mounted, setMounted] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  if (!mounted || reduceMotion) return <Fallback />

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.92]">
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 42 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
