"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

type Phase = "idle" | "riding" | "exploding"

const MotorcycleJoyrideContext = createContext<{
  onNavbarMotorcycleClick: () => void
}>({
  onNavbarMotorcycleClick: () => {},
})

export function useMotorcycleJoyride() {
  return useContext(MotorcycleJoyrideContext)
}

const RIDE_MS = 16500

/** Área clicável da moto (px) — maior = mais fácil acertar */
const BIKE_HIT = 128
const BIKE_EMOJI_REM = "3.75rem"

export function MotorcycleJoyrideProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle")
  const ridingActiveRef = useRef(false)
  const rafRef = useRef(0)
  const bikeRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef<Phase>("idle")
  phaseRef.current = phase

  const stopRide = useCallback(() => {
    ridingActiveRef.current = false
    cancelAnimationFrame(rafRef.current)
  }, [])

  const explode = useCallback(() => {
    if (phaseRef.current === "exploding") return
    stopRide()
    ridingActiveRef.current = false

    const h = `${document.documentElement.scrollHeight}px`
    document.documentElement.style.setProperty("--motorcycle-doc-h", h)
    setPhase("exploding")
    window.setTimeout(() => {
      setPhase("idle")
      const bike = bikeRef.current
      if (bike) bike.style.transform = `translate(-${BIKE_HIT + 40}px, 38vh)`
    }, 2800)
  }, [stopRide])

  const launch = useCallback(() => {
    if (ridingActiveRef.current || phaseRef.current !== "idle") return
    ridingActiveRef.current = true
    setPhase("riding")

    const start = performance.now()

    function frame(now: number) {
      if (!ridingActiveRef.current) return
      const elapsed = now - start
      const t = Math.min(1, elapsed / RIDE_MS)
      const ease = t * t * (3 - 2 * t)

      const vw = window.innerWidth
      const vh = window.innerHeight
      const x = -BIKE_HIT - 40 + ease * (vw + BIKE_HIT * 2 + 80)
      const y =
        vh * (0.2 + 0.22 * Math.sin(ease * Math.PI * 6)) +
        Math.sin(ease * 16) * 18
      const rot = Math.sin(ease * 14) * 11

      const bike = bikeRef.current
      if (bike) {
        bike.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`
      }

      if (t < 1 && ridingActiveRef.current) {
        rafRef.current = requestAnimationFrame(frame)
      } else if (t >= 1 && ridingActiveRef.current) {
        ridingActiveRef.current = false
        setPhase("idle")
        if (bike) bike.style.transform = `translate(-${BIKE_HIT + 40}px, 38vh)`
      }
    }

    rafRef.current = requestAnimationFrame(frame)
  }, [])

  /** 1º clique (ocioso): passeio sem rolar a página. 2º clique (em passeio): explosão. */
  const onNavbarMotorcycleClick = useCallback(() => {
    if (phaseRef.current === "exploding") return
    if (phaseRef.current === "riding") {
      explode()
      return
    }
    launch()
  }, [explode, launch])

  useEffect(() => {
    return () => stopRide()
  }, [stopRide])

  return (
    <MotorcycleJoyrideContext.Provider value={{ onNavbarMotorcycleClick }}>
      {children}

      <div
        ref={bikeRef}
        role="presentation"
        className={`fixed left-0 top-0 z-[220] flex items-center justify-center transition-opacity duration-300 ${
          phase === "riding"
            ? "pointer-events-auto cursor-pointer opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{
          transform: `translate(-${BIKE_HIT + 40}px, 38vh)`,
          width: BIKE_HIT,
          height: BIKE_HIT,
        }}
        onPointerDown={(e) => {
          if (phaseRef.current !== "riding") return
          e.preventDefault()
          e.stopPropagation()
          explode()
        }}
      >
        <span
          className="flex min-h-[calc(100%-4px)] min-w-[calc(100%-4px)] select-none items-center justify-center rounded-full bg-black/80 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.6)] ring-[3px] ring-orange-400/70"
          style={{ fontSize: BIKE_EMOJI_REM }}
          aria-hidden
        >
          🏍️
        </span>
      </div>

      {phase === "exploding" ? (
        <div
          className="fixed inset-0 z-[250] overflow-hidden"
          role="presentation"
          aria-hidden
        >
          <div
            className="pointer-events-none absolute w-full min-h-[100vh]"
            style={{
              height: "max(100vh, var(--motorcycle-doc-h, 100vh))",
              animation: "motorcycle-fire-flash 2.8s ease-out forwards",
              background:
                "radial-gradient(ellipse 85% 65% at 50% 55%, rgba(255,220,80,0.95) 0%, rgba(255,120,20,0.85) 28%, rgba(180,30,10,0.92) 52%, rgba(40,8,4,0.96) 78%, rgba(5,2,2,1) 100%)",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              animation: "motorcycle-fire-flicker 0.12s ease-in-out infinite",
              background:
                "radial-gradient(circle at 40% 45%, rgba(255,255,200,0.75) 0%, transparent 42%), radial-gradient(circle at 62% 58%, rgba(255,80,0,0.65) 0%, transparent 38%)",
              mixBlendMode: "overlay",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(255,60,0,0.35) 35%, rgba(80,0,0,0.55) 70%, rgba(0,0,0,0.88) 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')] opacity-40 mix-blend-overlay" />
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="pointer-events-none absolute rounded-full bg-gradient-to-t from-yellow-200 via-orange-500 to-red-700 opacity-90"
              style={{
                width: 8 + (i % 6) * 5,
                height: 14 + (i % 5) * 8,
                left: `${(i * 37) % 100}%`,
                bottom: `${-10 + (i % 8) * 8}%`,
                animation: `motorcycle-spark ${0.85 + (i % 7) * 0.08}s ease-out forwards`,
                animationDelay: `${i * 0.02}s`,
              }}
            />
          ))}
        </div>
      ) : null}
    </MotorcycleJoyrideContext.Provider>
  )
}
