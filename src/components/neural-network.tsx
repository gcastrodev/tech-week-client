"use client"

import { useRef, useEffect } from "react"

export function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current?.getContext("2d")) return

    let raf = 0
    let t = 0

    const nodes = Array.from({ length: 45 }, (_, i) => {
      const seed = i * 137.508
      return {
        x: (Math.sin(seed) * 0.5 + 0.5) * 0.85 + 0.075,
        y: (Math.cos(seed * 1.3) * 0.5 + 0.5) * 0.85 + 0.075,
        phase: i * 0.7,
        speed: 0.8 + (i % 5) * 0.15,
        color: i % 3 === 0 ? "#00ffd0" : i % 3 === 1 ? "#38bdf8" : "#a78bfa",
      }
    })

    const pulses: { from: number; to: number; t: number; speed: number }[] = []

    let pulseSeed = 0
    function rnd() {
      pulseSeed += 1
      const x = Math.sin(pulseSeed * 12.9898 + t * 3) * 43758.5453
      return x - Math.floor(x)
    }

    const intervalId = window.setInterval(() => {
      const a = Math.floor(rnd() * nodes.length)
      const b = Math.floor(rnd() * nodes.length)
      if (a !== b)
        pulses.push({
          from: a,
          to: b,
          t: 0,
          speed: 0.012 + rnd() * 0.015,
        })
      if (pulses.length > 25) pulses.shift()
    }, 300)

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

      const pts = nodes.map((n) => ({
        x: n.x * W,
        y: n.y * H,
        phase: n.phase,
        speed: n.speed,
        color: n.color,
      }))

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.62
            g.beginPath()
            g.moveTo(pts[i].x, pts[i].y)
            g.lineTo(pts[j].x, pts[j].y)
            g.strokeStyle = `rgba(34,211,238,${alpha})`
            g.lineWidth = 1.85
            g.stroke()
          }
        }
      }

      pulses.forEach((p) => {
        p.t += p.speed
        if (p.t > 1) return
        const a = pts[p.from]
        const b = pts[p.to]
        const px = a.x + (b.x - a.x) * p.t
        const py = a.y + (b.y - a.y) * p.t
        const rg = g.createRadialGradient(px, py, 0, px, py, 12)
        rg.addColorStop(0, "rgba(52,211,253,0.98)")
        rg.addColorStop(1, "transparent")
        g.beginPath()
        g.arc(px, py, 12, 0, Math.PI * 2)
        g.fillStyle = rg
        g.fill()
      })

      pts.forEach((n) => {
        const pulse = 1 + 0.35 * Math.sin(t * n.speed + n.phase)
        const r = 6 * pulse
        const rg = g.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3)
        rg.addColorStop(0, n.color)
        rg.addColorStop(1, "transparent")
        g.beginPath()
        g.arc(n.x, n.y, r * 3, 0, Math.PI * 2)
        g.fillStyle = rg
        g.fill()
        g.beginPath()
        g.arc(n.x, n.y, r, 0, Math.PI * 2)
        g.fillStyle = n.color
        g.shadowColor = n.color
        g.shadowBlur = 22
        g.fill()
        g.shadowBlur = 0
      })

      t += 0.016
      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(intervalId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.72]"
    />
  )
}
