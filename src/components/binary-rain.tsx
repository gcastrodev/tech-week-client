"use client"

import { useEffect, useRef } from "react"

type Drop = {
  x: number
  y: number
  speed: number
  size: number
  alpha: number
  bit: string
  flicker: number
}

type Layer = {
  drops: Drop[]
  size: number
  baseAlpha: number
  hue: number
  blur: number
}

export function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    const dpr = window.devicePixelRatio || 1

    function resize() {
      if (!canvas || !ctx) return
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function buildLayer(
      size: number,
      baseAlpha: number,
      hue: number,
      blur: number,
      density: number,
      speedRange: [number, number],
    ): Layer {
      if (!canvas) return { drops: [], size, baseAlpha, hue, blur }
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const colWidth = size * 0.95
      const cols = Math.max(1, Math.floor(w / colWidth))
      const drops: Drop[] = []
      for (let i = 0; i < cols; i++) {
        if (Math.random() > density) continue
        drops.push({
          x: i * colWidth + (Math.random() - 0.5) * colWidth * 0.4,
          y: -Math.random() * h * 1.4,
          speed:
            speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]),
          size,
          alpha: baseAlpha * (0.55 + Math.random() * 0.5),
          bit: Math.random() > 0.5 ? "1" : "0",
          flicker: Math.random() * Math.PI * 2,
        })
      }
      return { drops, size, baseAlpha, hue, blur }
    }

    let layers: Layer[] = []

    function buildAll() {
      layers = [
        buildLayer(9, 0.32, 188, 1.2, 0.78, [0.35, 0.85]),
        buildLayer(15, 0.62, 178, 0.4, 0.55, [1.1, 2.2]),
        buildLayer(24, 0.95, 168, 0, 0.32, [2.4, 4.4]),
      ]
    }

    resize()
    buildAll()

    const onResize = () => {
      resize()
      buildAll()
    }
    window.addEventListener("resize", onResize)

    function draw() {
      if (!canvas || !ctx) {
        raf = requestAnimationFrame(draw)
        return
      }
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      // Fade overlay produces motion trails
      ctx.fillStyle = "rgba(20, 32, 60, 0.16)"
      ctx.fillRect(0, 0, w, h)

      for (const layer of layers) {
        ctx.font = `bold ${layer.size}px "JetBrains Mono", ui-monospace, "Menlo", monospace`
        ctx.shadowBlur = layer.blur > 0 ? 0 : 8
        ctx.shadowColor = `hsla(${layer.hue}, 95%, 60%, 0.55)`

        for (const d of layer.drops) {
          d.y += d.speed
          d.flicker += 0.08
          if (d.y > h + 40) {
            d.y = -Math.random() * 200 - 20
            d.bit = Math.random() > 0.5 ? "1" : "0"
            d.alpha = layer.baseAlpha * (0.55 + Math.random() * 0.5)
          }
          if (Math.random() > 0.965) d.bit = d.bit === "1" ? "0" : "1"

          const flick = 0.8 + Math.sin(d.flicker) * 0.2
          const a = d.alpha * flick

          // Bright leading character
          ctx.fillStyle = `hsla(${layer.hue}, 100%, 88%, ${Math.min(1, a + 0.25)})`
          ctx.fillText(d.bit, d.x, d.y)

          // Glow tint underneath
          ctx.fillStyle = `hsla(${layer.hue}, 95%, 62%, ${a * 0.65})`
          ctx.fillText(d.bit, d.x, d.y)
        }

        ctx.shadowBlur = 0
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  )
}
