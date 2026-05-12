"use client"

import { useRef, useEffect } from "react"
import {
  usePageVisibility,
  usePageVisibilityRef,
} from "@/hooks/use-page-visibility"
import { observeViewport } from "@/lib/observe-viewport"

export function NeuralNetwork() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pageVisible = usePageVisibility()
  const pageVisibleRef = usePageVisibilityRef(pageVisible)
  const viewportOkRef = useRef(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const c = canvasRef.current
    if (!wrap || !c?.getContext("2d")) return

    let raf = 0
    let t = 0
    let frameSkip = 0

    const nodes = Array.from({ length: 18 }, (_, i) => {
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
      if (!pageVisibleRef.current || !viewportOkRef.current) return
      const a = Math.floor(rnd() * nodes.length)
      const b = Math.floor(rnd() * nodes.length)
      if (a !== b)
        pulses.push({
          from: a,
          to: b,
          t: 0,
          speed: 0.012 + rnd() * 0.015,
        })
      if (pulses.length > 18) pulses.shift()
    }, 360)

    function resize() {
      const canvas = canvasRef.current
      const g = canvas?.getContext("2d")
      if (!canvas || !g) return
      const dpr = window.devicePixelRatio || 1
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const start = () => {
      if (raf) return
      if (!pageVisibleRef.current || !viewportOkRef.current) return
      raf = requestAnimationFrame(draw)
    }

    const unobViewport = observeViewport(
      wrap,
      (v) => {
        viewportOkRef.current = v
        if (v) start()
        else stop()
      },
      "140px 0px 240px 0px"
    )

    const onVis = () => {
      pageVisibleRef.current = document.visibilityState === "visible"
      if (pageVisibleRef.current && viewportOkRef.current) start()
      else stop()
    }
    document.addEventListener("visibilitychange", onVis)

    function draw() {
      raf = 0
      if (!pageVisibleRef.current || !viewportOkRef.current) return
      const canvas = canvasRef.current
      const g = canvas?.getContext("2d")
      if (!canvas || !g) return

      frameSkip++
      if (frameSkip % 3 === 0) {
        raf = requestAnimationFrame(draw)
        return
      }

      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      g.clearRect(0, 0, W, H)

      const pts = nodes.map((n) => ({
        x: n.x * W,
        y: n.y * H,
        phase: n.phase,
        speed: n.speed,
        color: n.color,
      }))

      const linkDistSq = 200 * 200
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const distSq = dx * dx + dy * dy
          if (distSq < linkDistSq) {
            const dist = Math.sqrt(distSq)
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
        g.shadowBlur = 12
        g.fill()
        g.shadowBlur = 0
      })

      t += 0.032
      raf = requestAnimationFrame(draw)
    }

    start()

    return () => {
      stop()
      unobViewport()
      document.removeEventListener("visibilitychange", onVis)
      window.clearInterval(intervalId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-[0.72]"
      />
    </div>
  )
}
