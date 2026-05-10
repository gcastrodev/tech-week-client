"use client"

import { useRef, useEffect } from "react"
import { motion } from "motion/react"

function hash01(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453
  return x - Math.floor(x)
}

export function RasenganChidori() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current?.getContext("2d")) return

    let raf = 0
    let t = 0

    function resize() {
      const c = canvasRef.current
      const g = c?.getContext("2d")
      if (!c || !g) return
      const dpr = window.devicePixelRatio || 1
      c.width = Math.max(1, Math.floor(c.offsetWidth * dpr))
      c.height = Math.max(1, Math.floor(c.offsetHeight * dpr))
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    function drawRasengan(g: CanvasRenderingContext2D, x: number, yPos: number, r: number, time: number) {
      // Glow externo grande
      const og = g.createRadialGradient(x, yPos, 0, x, yPos, r * 2.5)
      og.addColorStop(0, "rgba(140,210,255,0.72)")
      og.addColorStop(0.5, "rgba(40,170,255,0.35)")
      og.addColorStop(1, "transparent")
      g.beginPath(); g.arc(x, yPos, r * 2.5, 0, Math.PI * 2)
      g.fillStyle = og; g.fill()

      // Núcleo
      const rg = g.createRadialGradient(x, yPos, 0, x, yPos, r)
      rg.addColorStop(0, "#ffffff")
      rg.addColorStop(0.25, "#aaddff")
      rg.addColorStop(0.6, "#0077ff")
      rg.addColorStop(1, "#002299")
      g.beginPath(); g.arc(x, yPos, r, 0, Math.PI * 2)
      g.fillStyle = rg
      g.shadowColor = "#66ccff"; g.shadowBlur = 95
      g.fill(); g.shadowBlur = 0

      // Espirais (3 camadas)
      for (let i = 0; i < 4; i++) {
        g.beginPath()
        const startAngle = time * 5.8 + (i * Math.PI * 2) / 4
        for (let a = 0; a < Math.PI * 2; a += 0.06) {
          const sr = r * 0.15 + r * 0.8 * (a / (Math.PI * 2))
          const sx = x + sr * Math.cos(a + startAngle)
          const sy = yPos + sr * Math.sin(a + startAngle)
          if (a === 0) g.moveTo(sx, sy); else g.lineTo(sx, sy)
        }
        g.strokeStyle = `rgba(180,235,255,${0.62 + i * 0.1})`
        g.lineWidth = 3; g.stroke()
      }

      // Anel externo giratório
      g.beginPath()
      g.arc(x, yPos, r * 1.1, 0, Math.PI * 2)
      g.strokeStyle = "rgba(0,200,255,0.4)"
      g.lineWidth = 3; g.stroke()
    }

    function drawChidori(g: CanvasRenderingContext2D, x: number, yPos: number, r: number, time: number) {
      // Glow externo
      const og = g.createRadialGradient(x, yPos, 0, x, yPos, r * 2.5)
      og.addColorStop(0, "rgba(235,140,255,0.78)")
      og.addColorStop(0.5, "rgba(180,60,255,0.38)")
      og.addColorStop(1, "transparent")
      g.beginPath(); g.arc(x, yPos, r * 2.5, 0, Math.PI * 2)
      g.fillStyle = og; g.fill()

      // Núcleo
      const rg = g.createRadialGradient(x, yPos, 0, x, yPos, r)
      rg.addColorStop(0, "#ffffff")
      rg.addColorStop(0.25, "#ee99ff")
      rg.addColorStop(0.6, "#9900ff")
      rg.addColorStop(1, "#550088")
      g.beginPath(); g.arc(x, yPos, r, 0, Math.PI * 2)
      g.fillStyle = rg
      g.shadowColor = "#ee88ff"; g.shadowBlur = 95
      g.fill(); g.shadowBlur = 0

      // Raios elétricos longos saindo do núcleo
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 9.2
        g.beginPath(); g.moveTo(x, yPos)
        let lx = x; let ly = yPos
        const steps = 5
        for (let s = 0; s < steps; s++) {
          const jitter = (hash01(i * 19 + s * 7 + Math.floor(time * 20)) - 0.5) * 2.2
          const len = r * (0.25 + hash01(i * 31 + s * 11 + Math.floor(time * 15)) * 0.5)
          lx += Math.cos(angle + jitter) * len
          ly += Math.sin(angle + jitter) * len
          g.lineTo(lx, ly)
        }
        g.strokeStyle = `rgba(245,210,255,${0.72 + 0.25 * hash01(i + Math.floor(time * 8))})`
        g.lineWidth = 2.2; g.stroke()
      }

      // Anel pulsante
      const pr = r * (1.05 + 0.08 * Math.sin(time * 8))
      g.beginPath(); g.arc(x, yPos, pr, 0, Math.PI * 2)
      g.strokeStyle = "rgba(200,100,255,0.5)"
      g.lineWidth = 3; g.stroke()
    }

    function draw() {
      const c = canvasRef.current
      const g = c?.getContext("2d")
      if (!c || !g) return
      const W = c.offsetWidth; const H = c.offsetHeight
      g.clearRect(0, 0, W, H)
      const cy = H / 2

      // raio grande — ~13% da largura da tela, mínimo 120px
      const BASE_R = Math.max(120, W * 0.13)

      // Ciclo: 0–3.5s aproximação vindo de FORA da tela, 3.5–4.5s colisão, 4.5–5.5s explosão, 5.5–6s pausa
      const CYCLE = 4.2
      const cycle = t % CYCLE

      let rasenX: number, chidoriX: number, baseR: number

      if (cycle < 2.45) {
        // Aproximação: começa em -BASE_R*2.5 (fora da borda esquerda) e vai até W*0.38
        const p = cycle / 2.45
        const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p // ease in-out
        rasenX = -BASE_R * 2.5 + (W * 0.38 + BASE_R * 2.5) * eased
        chidoriX = W + BASE_R * 2.5 - (W + BASE_R * 2.5 - W * 0.62) * eased
        baseR = BASE_R * (0.85 + 0.15 * Math.sin(t * 2))
        drawRasengan(g, rasenX, cy, baseR, t)
        drawChidori(g, chidoriX, cy, baseR, t)
      } else if (cycle < 3.15) {
        // Colisão: convergem para o centro
        const p = (cycle - 2.45) / 0.7
        const eased = p * p * (3 - 2 * p)
        rasenX = W * 0.38 + (W * 0.5 - W * 0.38) * eased
        chidoriX = W * 0.62 - (W * 0.62 - W * 0.5) * eased
        baseR = BASE_R * (1 + 0.25 * p)
        drawRasengan(g, rasenX, cy, baseR, t)
        drawChidori(g, chidoriX, cy, baseR, t)

        // Flash crescente
        const flashR = BASE_R * 0.5 * p
        const flash = g.createRadialGradient(W / 2, cy, 0, W / 2, cy, flashR)
        flash.addColorStop(0, `rgba(255,255,255,${0.8 * p})`)
        flash.addColorStop(0.4, `rgba(150,200,255,${0.5 * p})`)
        flash.addColorStop(0.7, `rgba(180,100,255,${0.3 * p})`)
        flash.addColorStop(1, "transparent")
        g.beginPath(); g.arc(W / 2, cy, flashR, 0, Math.PI * 2)
        g.fillStyle = flash; g.fill()
      } else if (cycle < 3.85) {
        // Explosão: onda expansiva saindo do centro
        const p = (cycle - 3.15) / 0.7
        const exR = BASE_R * (0.5 + 2.5 * p)
        const exG = g.createRadialGradient(W / 2, cy, 0, W / 2, cy, exR)
        exG.addColorStop(0, `rgba(255,255,255,${0.95 * (1 - p)})`)
        exG.addColorStop(0.2, `rgba(150,220,255,${0.7 * (1 - p)})`)
        exG.addColorStop(0.5, `rgba(180,100,255,${0.5 * (1 - p)})`)
        exG.addColorStop(0.8, `rgba(100,50,200,${0.2 * (1 - p)})`)
        exG.addColorStop(1, "transparent")
        g.beginPath(); g.arc(W / 2, cy, exR, 0, Math.PI * 2)
        g.fillStyle = exG; g.fill()

        // Fragmentos voando
        for (let i = 0; i < 16; i++) {
          const angle = (i / 16) * Math.PI * 2
          const fDist = exR * 0.7
          const fx = W / 2 + Math.cos(angle) * fDist
          const fy = cy + Math.sin(angle) * fDist
          const fr = 8 * (1 - p)
          const fg = g.createRadialGradient(fx, fy, 0, fx, fy, fr * 3)
          fg.addColorStop(0, i % 2 === 0 ? "#00aaff" : "#cc00ff")
          fg.addColorStop(1, "transparent")
          g.beginPath(); g.arc(fx, fy, fr * 3, 0, Math.PI * 2)
          g.fillStyle = fg; g.fill()
        }
      }
      // pausa curta antes de reiniciar

      t += 0.046
      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <motion.div className="pointer-events-none absolute inset-0 z-0">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-90" />
    </motion.div>
  )
}
