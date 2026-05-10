"use client"

import type { PointerEvent } from "react"
import { useRef, useEffect, useMemo, useCallback } from "react"
import { motion } from "motion/react"

const PROTONS = 6
const NEUTRONS = 6
const ELECTRONS = 6

type ShellDef = {
  rx: number
  ry: number
  angle: number
  color: string
  speed: number
  phase: number
  eSize: number
  electronAngles: number[]
}

type TrailPt = { x: number; y: number; z: number }

type ElectronDraw = { z: number; o: ShellDef; theta: number }

function rotateYawPitch(x: number, y: number, z: number, yaw: number, pitch: number) {
  const cosY = Math.cos(yaw)
  const sinY = Math.sin(yaw)
  const x1 = x * cosY + z * sinY
  const z1 = -x * sinY + z * cosY
  const cosP = Math.cos(pitch)
  const sinP = Math.sin(pitch)
  const y2 = y * cosP - z1 * sinP
  const z2 = y * sinP + z1 * cosP
  return { x: x1, y: y2, z: z2 }
}

function drawEllipseArc(
  g: CanvasRenderingContext2D,
  mx: number,
  my: number,
  rx: number,
  ry: number,
  rot: number,
  t0: number,
  t1: number,
  stroke: string,
  lw: number
) {
  g.save()
  g.translate(mx, my)
  g.rotate(rot)
  g.scale(1, ry / rx)
  g.beginPath()
  g.arc(0, 0, rx, t0, t1)
  g.strokeStyle = stroke
  g.lineWidth = lw
  g.stroke()
  g.restore()
}

function electronPos(
  o: ShellDef,
  theta: number,
  mx: number,
  my: number,
  opts: { embedded: boolean; yaw: number; pitch: number }
): TrailPt {
  const ex0 = o.rx * Math.cos(theta)
  const ey0 = o.ry * Math.sin(theta)
  const lz =
    Math.sin(theta) * o.ry * 0.92 + Math.cos(theta * 2) * o.rx * 0.28
  let lx = ex0 * Math.cos(o.angle) - ey0 * Math.sin(o.angle)
  let ly = ex0 * Math.sin(o.angle) + ey0 * Math.cos(o.angle)
  let lz3 = lz
  if (opts.embedded) {
    const r = rotateYawPitch(lx, ly, lz3, opts.yaw, opts.pitch)
    lx = r.x
    ly = r.y
    lz3 = r.z
  }
  return { x: mx + lx, y: my + ly, z: lz3 }
}

export function RutherfordAtom({
  className = "",
  embedded = false,
}: {
  className?: string
  embedded?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trailsRef = useRef<TrailPt[][]>(Array.from({ length: ELECTRONS }, () => []))
  const camRef = useRef(0)
  const userYawRef = useRef(0)
  const userPitchRef = useRef(0)
  const draggingRef = useRef(false)
  const lastPtrRef = useRef({ x: 0, y: 0 })

  const shells: ShellDef[] = useMemo(
    () =>
      embedded
        ? [
            {
              rx: 188,
              ry: 126,
              angle: -0.52,
              color: "#22d3ee",
              speed: 0.032,
              phase: 0,
              eSize: 14,
              electronAngles: [0, Math.PI],
            },
            {
              rx: 268,
              ry: 182,
              angle: 0.64,
              color: "#e879f9",
              speed: 0.027,
              phase: 1.08,
              eSize: 13,
              electronAngles: [0, Math.PI],
            },
            {
              rx: 318,
              ry: 112,
              angle: 1.42,
              color: "#34d399",
              speed: 0.023,
              phase: 2.15,
              eSize: 12,
              electronAngles: [Math.PI / 2, -Math.PI / 2],
            },
          ]
        : [
            {
              rx: 135,
              ry: 92,
              angle: -0.44,
              color: "#06b6d4",
              speed: 0.024,
              phase: 0,
              eSize: 9,
              electronAngles: [0, Math.PI],
            },
            {
              rx: 205,
              ry: 138,
              angle: 0.58,
              color: "#e879f9",
              speed: 0.019,
              phase: 1.1,
              eSize: 8,
              electronAngles: [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2],
            },
          ],
    [embedded]
  )

  const decorRings = useMemo(
    () =>
      embedded
        ? [
            { rx: 236, ry: 154, angle: 2.22, w: 1.35 },
            { rx: 258, ry: 168, angle: -0.88, w: 1.15 },
            { rx: 204, ry: 132, angle: 1.08, w: 1 },
            { rx: 288, ry: 96, angle: 0.35, w: 0.75 },
          ]
        : [
            { rx: 185, ry: 120, angle: 2.18, w: 1 },
            { rx: 200, ry: 128, angle: -0.92, w: 0.9 },
          ],
    [embedded]
  )

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!embedded) return
      draggingRef.current = true
      lastPtrRef.current = { x: e.clientX, y: e.clientY }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [embedded]
  )

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!embedded || !draggingRef.current) return
      const dx = e.clientX - lastPtrRef.current.x
      const dy = e.clientY - lastPtrRef.current.y
      lastPtrRef.current = { x: e.clientX, y: e.clientY }
      userYawRef.current += dx * 0.0048
      userPitchRef.current += dy * 0.0048
      userPitchRef.current = Math.max(-1.42, Math.min(1.42, userPitchRef.current))
    },
    [embedded]
  )

  const endDrag = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!embedded) return
      draggingRef.current = false
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    },
    [embedded]
  )

  useEffect(() => {
    if (!canvasRef.current?.getContext("2d")) return

    let raf = 0
    let t = 0
    const maxTrail = 64

    function resize() {
      const c = canvasRef.current
      const cx = c?.getContext("2d")
      if (!c || !cx) return
      const dpr = window.devicePixelRatio || 1
      c.width = Math.max(1, Math.floor(c.offsetWidth * dpr))
      c.height = Math.max(1, Math.floor(c.offsetHeight * dpr))
      cx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    function draw() {
      const c = canvasRef.current
      const g = c?.getContext("2d")
      if (!c || !g) return
      const W = c.offsetWidth
      const H = c.offsetHeight

      camRef.current += 0.0082
      const cam = camRef.current
      const mx =
        W / 2 +
        Math.cos(cam * 0.41) * 42 +
        Math.sin(cam * 0.27) * 18
      const my =
        H / 2 +
        Math.sin(cam * 0.35) * 36 +
        Math.cos(cam * 0.19) * 22

      g.save()
      g.translate(mx, my)
      g.rotate(Math.sin(cam * 0.26) * 0.11 + Math.cos(cam * 0.19) * 0.07)
      g.translate(-mx, -my)

      g.clearRect(0, 0, W, H)
      if (embedded) {
        g.fillStyle = "#030408"
        g.fillRect(0, 0, W, H)
      }

      const rotOpts = {
        embedded,
        yaw: userYawRef.current,
        pitch: userPitchRef.current,
      }

      const radioPulse = 0.55 + 0.45 * Math.sin(t * 4.5)
      const hazardPulse = 0.5 + 0.5 * Math.sin(t * 9.5)

      const toxic = g.createRadialGradient(mx, my, 0, mx, my, embedded ? 270 : 290)
      toxic.addColorStop(
        0,
        embedded
          ? `rgba(56,189,248,${0.22 * radioPulse})`
          : `rgba(34,211,238,${0.12 * radioPulse})`
      )
      toxic.addColorStop(
        0.35,
        embedded
          ? `rgba(217,70,239,${0.14 * radioPulse})`
          : `rgba(217,70,239,${0.08 * radioPulse})`
      )
      toxic.addColorStop(
        0.55,
        embedded
          ? `rgba(250,204,21,${0.11 * hazardPulse})`
          : `rgba(250,204,21,${0.07 * hazardPulse})`
      )
      toxic.addColorStop(
        0.78,
        embedded ? `rgba(34,197,94,${0.09 * radioPulse})` : `rgba(52,211,153,${0.06 * radioPulse})`
      )
      toxic.addColorStop(1, "transparent")
      g.beginPath()
      g.arc(mx, my, embedded ? 270 : 290, 0, Math.PI * 2)
      g.fillStyle = toxic
      g.fill()

      decorRings.forEach((ring) => {
        drawEllipseArc(
          g,
          mx,
          my,
          ring.rx,
          ring.ry,
          ring.angle,
          Math.PI - 0.01,
          Math.PI * 2 + 0.02,
          embedded ? `rgba(148,163,184,${0.22})` : `rgba(148,163,184,${0.14})`,
          ring.w
        )
        drawEllipseArc(
          g,
          mx,
          my,
          ring.rx,
          ring.ry,
          ring.angle,
          -0.02,
          Math.PI + 0.01,
          embedded ? `rgba(34,211,238,${0.48})` : `rgba(56,189,248,${0.32})`,
          ring.w + (embedded ? 0.55 : 0.35)
        )
      })

      shells.forEach((o, si) => {
        const ba = 0.11 + si * 0.04
        const fa = 0.42 + si * 0.09
        drawEllipseArc(
          g,
          mx,
          my,
          o.rx,
          o.ry,
          o.angle,
          Math.PI,
          Math.PI * 2 + 0.02,
          o.color + Math.floor(ba * 255)
            .toString(16)
            .padStart(2, "0"),
          embedded ? 2.2 : 1.7
        )
        drawEllipseArc(
          g,
          mx,
          my,
          o.rx,
          o.ry,
          o.angle,
          -0.02,
          Math.PI,
          o.color + Math.floor(fa * 255)
            .toString(16)
            .padStart(2, "0"),
          embedded ? 3 : 2.4
        )
      })

      let ei = 0
      shells.forEach((o) => {
        o.electronAngles.forEach((baseAngle) => {
          if (ei >= ELECTRONS) return
          const theta = t * o.speed * 60 + o.phase + baseAngle
          const pos = electronPos(o, theta, mx, my, rotOpts)
          const tr = trailsRef.current[ei]
          if (tr) {
            tr.unshift(pos)
            while (tr.length > maxTrail) tr.pop()
          }
          ei++
        })
      })

      const strips: { z: number; ei: number; i: number }[] = []
      trailsRef.current.forEach((tr, tei) => {
        if (!tr) return
        tr.forEach((p, i) => {
          strips.push({ z: p.z, ei: tei, i })
        })
      })
      strips.sort((a, b) => {
        const za = trailsRef.current[a.ei]?.[a.i]?.z ?? 0
        const zb = trailsRef.current[b.ei]?.[b.i]?.z ?? 0
        return za - zb
      })

      strips.forEach(({ ei: tei, i }) => {
        const tr = trailsRef.current[tei]
        if (!tr || i >= tr.length - 1) return
        const p0 = tr[i]!
        const p1 = tr[i + 1]!
        const age = i / Math.max(tr.length - 1, 1)
        const shellIdx = embedded
          ? Math.min(2, Math.floor(tei / 2))
          : tei < 2
            ? 0
            : 1
        const col = shells[shellIdx]?.color ?? "#22d3ee"
        const alpha = (1 - age) * (embedded ? 0.88 : 0.62)
        g.beginPath()
        g.moveTo(p0.x, p0.y)
        g.lineTo(p1.x, p1.y)
        g.strokeStyle =
          col +
          Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, "0")
        g.lineWidth =
          (embedded ? 3.2 : 2.4) * (1 - age * 0.88) + (embedded ? 0.5 : 0.35)
        g.shadowColor = col
        g.shadowBlur = (embedded ? 22 : 10) * (1 - age * 0.88)
        g.stroke()
        g.shadowBlur = 0
      })

      const pulse = 1 + 0.13 * Math.sin(t * 3)
      const nucleusR = 48 * pulse

      const protonColor = "#ef4444"
      const neutronColor = "#94a3b8"
      const positions: { dx: number; dy: number; kind: "p" | "n" }[] = []
      for (let i = 0; i < PROTONS; i++) {
        const a = (i / PROTONS) * Math.PI * 2 + 0.15
        const rr = nucleusR * 0.42
        positions.push({
          dx: Math.cos(a) * rr,
          dy: Math.sin(a) * rr,
          kind: "p",
        })
      }
      for (let i = 0; i < NEUTRONS; i++) {
        const a = (i / NEUTRONS) * Math.PI * 2 + Math.PI / NEUTRONS + 0.15
        const rr = nucleusR * 0.38
        positions.push({
          dx: Math.cos(a) * rr * 0.85,
          dy: Math.sin(a) * rr * 0.85,
          kind: "n",
        })
      }

      g.beginPath()
      g.arc(mx, my, nucleusR + 15, 0, Math.PI * 2)
      g.strokeStyle = `rgba(253,224,71,${0.5 + 0.28 * hazardPulse})`
      g.lineWidth = 2.8
      g.stroke()

      positions.forEach((p) => {
        const px = mx + p.dx
        const py = my + p.dy
        const pr = embedded ? 10 : 8
        const grad = g.createRadialGradient(px, py, 0, px, py, pr)
        if (p.kind === "p") {
          grad.addColorStop(0, "#fff7ed")
          grad.addColorStop(0.45, protonColor)
          grad.addColorStop(1, "#7f1d1d")
        } else {
          grad.addColorStop(0, "#f8fafc")
          grad.addColorStop(0.45, neutronColor)
          grad.addColorStop(1, "#334155")
        }
        g.beginPath()
        g.arc(px, py, pr, 0, Math.PI * 2)
        g.fillStyle = grad
        g.shadowColor = p.kind === "p" ? "#fb923c" : neutronColor
        g.shadowBlur = 18 + 12 * hazardPulse
        g.fill()
        g.shadowBlur = 0
      })

      g.beginPath()
      g.arc(mx, my, nucleusR + 12, 0, Math.PI * 2)
      g.strokeStyle = `rgba(52,211,153,${0.28 * radioPulse})`
      g.lineWidth = 2
      g.stroke()

      const ordered: ElectronDraw[] = []
      ei = 0
      shells.forEach((o) => {
        o.electronAngles.forEach((baseAngle) => {
          if (ei >= ELECTRONS) return
          const theta = t * o.speed * 60 + o.phase + baseAngle
          const pos = electronPos(o, theta, mx, my, rotOpts)
          ordered.push({ z: pos.z, o, theta })
          ei++
        })
      })
      ordered.sort((a, b) => a.z - b.z)

      ordered.forEach(({ o, theta }) => {
        const pos = electronPos(o, theta, mx, my, rotOpts)
        const ex = pos.x
        const ey = pos.y

        const eg = g.createRadialGradient(ex, ey, 0, ex, ey, o.eSize * 6)
        eg.addColorStop(0, o.color + "ff")
        eg.addColorStop(0.35, o.color + "99")
        eg.addColorStop(1, "transparent")
        g.beginPath()
        g.arc(ex, ey, o.eSize * 6, 0, Math.PI * 2)
        g.fillStyle = eg
        g.fill()

        g.beginPath()
        g.arc(ex, ey, o.eSize + 1.5, 0, Math.PI * 2)
        g.fillStyle = "rgba(255,255,255,0.95)"
        g.fill()

        g.beginPath()
        g.arc(ex, ey, o.eSize, 0, Math.PI * 2)
        g.fillStyle = o.color
        g.shadowColor = o.color
        g.shadowBlur = embedded ? 42 : 28
        g.fill()
        g.shadowBlur = 0
      })

      g.restore()

      t += 0.016
      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [embedded, shells, decorRings])

  const size = embedded
    ? "min(800px, min(98vw, 92vh))"
    : "min(820px, 95vmin)"

  const innerMotion = (
    <motion.div
      className="relative flex items-center justify-center will-change-transform"
      animate={{
        scale: embedded ? [1, 1.08, 0.96, 1.06, 1] : [1, 1.06, 0.98, 1.03, 1],
      }}
      transition={{
        duration: embedded ? 5.8 : 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ transform: "translateZ(36px)" }}
    >
      {!embedded ? (
        <div
          className="pointer-events-none absolute -inset-[20%] rounded-full opacity-90 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 38% 42%, rgba(56,189,248,0.22) 0%, rgba(217,70,239,0.16) 38%, rgba(250,204,21,0.1) 62%, transparent 78%)",
            animation: "radio-nucleus-pulse 2.5s ease-in-out infinite",
          }}
        />
      ) : (
        <div
          className="pointer-events-none absolute -inset-[12%] rounded-full opacity-[0.35] blur-[100px]"
          style={{
            background:
              "radial-gradient(circle at 42% 45%, rgba(56,189,248,0.18) 0%, transparent 65%)",
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        className="relative z-[1]"
        style={{
          width: size,
          height: size,
        }}
        aria-hidden
      />
    </motion.div>
  )

  if (embedded) {
    return (
      <div
        className={`relative flex w-full cursor-grab touch-none items-center justify-center active:cursor-grabbing ${className}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="relative [perspective:1400px] [transform-style:preserve-3d]">
          {innerMotion}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 flex items-center justify-center ${className}`}
    >
      <motion.div
        className="relative [perspective:1400px] [transform-style:preserve-3d]"
        animate={{
          rotateX: [-12, -7, -13, -9],
          rotateY: [18, 28, 20, 24],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {innerMotion}
      </motion.div>
    </div>
  )
}
