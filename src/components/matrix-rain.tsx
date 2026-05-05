"use client"

import { useEffect, useRef } from "react"

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const cols = Math.floor(canvas.width / 14)
    const drops: number[] = Array(cols).fill(0).map(() => Math.random() * -100)

    const draw = () => {
      ctx.fillStyle = "rgba(10, 16, 31, 0.06)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = "11px monospace"

      drops.forEach((y, i) => {
        const char = Math.random() > 0.5 ? "1" : "0"
        const opacity = Math.random() * 0.5 + 0.1
        ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`
        ctx.fillText(char, i * 14, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        } else {
          drops[i] += 14
        }
      })
    }

    const interval = setInterval(draw, 80)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-[0.22]"
      />
    </div>
  )
}