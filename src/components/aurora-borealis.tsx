"use client"

import { useRef, useEffect } from "react"

export function AuroraBorealis() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current?.getContext("2d")) return

    let raf = 0
    let t = 0

    const waves = [
      { color: ["#00f5d4", "#00b4ff"], speed: 0.52, amp: 130, yBase: 0.28, thick: 190 },
      { color: ["#c026d3", "#22d3ee"], speed: 0.38, amp: 100, yBase: 0.48, thick: 155 },
      { color: ["#22c55e", "#2563eb"], speed: 0.62, amp: 78, yBase: 0.64, thick: 135 },
      { color: ["#e879f9", "#38bdf8"], speed: 0.44, amp: 108, yBase: 0.38, thick: 175 },
    ]

    function resize() {
      const c = canvasRef.current
      const g = c?.getContext("2d")
      if (!c || !g) return
      const dpr = window.devicePixelRatio || 1
      const w = c.offsetWidth
      const h = c.offsetHeight
      c.width = Math.max(1, Math.floor(w * dpr))
      c.height = Math.max(1, Math.floor(h * dpr))
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    function draw() {
      const c = canvasRef.current
      const g = c?.getContext("2d")
      if (!c || !g) return
      const W = c.offsetWidth
      const H = c.offsetHeight
      g.clearRect(0, 0, W, H)

      waves.forEach((wave) => {
        const yBase = H * wave.yBase
        g.beginPath()
        for (let x = 0; x <= W; x += 4) {
          const y =
            yBase +
            Math.sin(x * 0.008 + t * wave.speed) * wave.amp +
            Math.sin(x * 0.014 + t * wave.speed * 1.3 + 1) * (wave.amp * 0.4)
          if (x === 0) g.moveTo(x, y)
          else g.lineTo(x, y)
        }
        g.lineTo(W, H)
        g.lineTo(0, H)
        g.closePath()

        const lg = g.createLinearGradient(0, yBase - wave.thick, 0, yBase + wave.thick)
        lg.addColorStop(0, "transparent")
        lg.addColorStop(0.38, wave.color[0] + "cc")
        lg.addColorStop(0.52, wave.color[1] + "bb")
        lg.addColorStop(0.68, wave.color[0] + "77")
        lg.addColorStop(1, "transparent")
        g.fillStyle = lg
        g.fill()
      })

      t += 0.016
      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.92]"
    />
  )
}
