"use client"

import { useRef, type ReactNode } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import { cn } from "@/lib/utils"

type TiltCardProps = {
  children: ReactNode
  className?: string
  intensity?: number
}

/** Leve efeito 3D no hover — sem Three.js, bom para cards e logos. */
export function TiltCard({
  children,
  className,
  intensity = 8,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 280, damping: 28 })
  const springY = useSpring(my, { stiffness: 280, damping: 28 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-intensity, intensity])

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      className="perspective-[1000px] h-full w-full min-h-0"
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={cn("h-full min-h-0 w-full will-change-transform", className)}
      >
        {children}
      </motion.div>
    </div>
  )
}
