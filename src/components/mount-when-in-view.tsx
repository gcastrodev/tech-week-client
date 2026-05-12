"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useInView, useReducedMotion } from "motion/react"

type MountWhenInViewProps = {
  children: ReactNode
  /** Margem extra (px) antes de montar — antecipa o scroll. */
  margin?: string
  className?: string
}

/**
 * Lazy-mount: só monta o filho quando a área entra na viewport (com margem).
 * Depois de montado **mantém** o filho montado ao sair da vista — evita flash cinza
 * e custo de remontar canvas ao fazer scroll para cima.
 */
export function MountWhenInView({
  children,
  margin = "180px 0px 240px 0px",
  className = "absolute inset-0 h-full min-h-0 w-full",
}: MountWhenInViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, {
    amount: 0.02,
    margin: margin as never,
    once: false,
  })

  useEffect(() => {
    if (inView) setMounted(true)
  }, [inView])

  if (reduceMotion) {
    return <div ref={ref} className={className} aria-hidden />
  }

  return (
    <div ref={ref} className={className}>
      {mounted ? children : null}
    </div>
  )
}
