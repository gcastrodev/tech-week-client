"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TiltCard } from "@/components/tilt-card"
import type { Sponsor } from "@/lib/event-data"

function tierBadgeClass(tier: string) {
  if (tier === "ouro")
    return "border-yellow-500/50 text-yellow-400 font-mono text-xs"
  if (tier === "prata")
    return "border-slate-400/50 text-slate-400 font-mono text-xs"
  if (tier === "bronze")
    return "border-amber-700/50 text-amber-600 font-mono text-xs"
  return "border-orange-500/40 text-orange-400 font-mono text-xs"
}

const GAP_PX = 24

function SponsorLogoArea({ s, i }: { s: Sponsor; i: number }) {
  if (s.logoSrc) {
    return (
      <div className="flex h-[384px] w-full items-center justify-center rounded-2xl bg-white px-8 py-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] ring-2 ring-orange-400/55">
        <Image
          src={s.logoSrc}
          alt={s.logoAlt ?? s.name}
          width={280}
          height={200}
          className="h-[328px] w-auto max-w-[314px] object-contain"
          sizes="280px"
          priority={i === 0}
        />
      </div>
    )
  }
  if (s.name.includes("Vitório")) {
    return (
      <div className="flex h-[384px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-amber-500/35 bg-gradient-to-br from-amber-950/50 via-black/60 to-zinc-950/90 px-8 py-10 shadow-inner ring-1 ring-amber-600/30">
        <span className="font-serif text-3xl font-semibold tracking-wide text-amber-400">
          Vitório&apos;s
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.35em] text-amber-200/70">
          Restaurante
        </span>
      </div>
    )
  }
  return (
    <div className="flex h-[384px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-muted/35 px-8 py-10">
      <span className="text-center font-mono text-sm font-medium text-foreground">
        {s.name}
      </span>
      <span className="font-mono text-xs text-muted-foreground">logo em breve</span>
    </div>
  )
}

export function SponsorCarousel({ sponsors }: { sponsors: readonly Sponsor[] }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const cardWidthRef = useRef(280)
  const [cardWidth, setCardWidth] = useState(280)
  const draggingRef = useRef(false)
  const lastClientXRef = useRef(0)

  const loop = [...sponsors, ...sponsors, ...sponsors]

  useEffect(() => {
    const el = viewportRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(() => {
      const w = el.offsetWidth
      const cw = Math.max(210, Math.floor((w - 3 * GAP_PX) / 4) + 22)
      cardWidthRef.current = cw
      setCardWidth(cw)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const slideStep = useCallback(() => cardWidthRef.current + GAP_PX, [])

  const normalizeX = useCallback(() => {
    const track = trackRef.current
    if (!track || sponsors.length === 0) return
    const oneSet = (cardWidthRef.current + GAP_PX) * sponsors.length
    if (oneSet <= 0) return
    while (-xRef.current >= oneSet) xRef.current += oneSet
    while (xRef.current > 0) xRef.current -= oneSet
    track.style.transform = `translate3d(${xRef.current}px,0,0)`
  }, [sponsors.length])

  const stepBy = useCallback(
    (dir: -1 | 1) => {
      xRef.current += dir * slideStep() * 4
      normalizeX()
      const track = trackRef.current
      if (track) track.style.transform = `translate3d(${xRef.current}px,0,0)`
    },
    [normalizeX, slideStep]
  )

  useEffect(() => {
    let raf = 0
    const AUTO = 0.68
    function tickFrame() {
      if (!draggingRef.current) {
        xRef.current -= AUTO
        normalizeX()
        const track = trackRef.current
        if (track)
          track.style.transform = `translate3d(${xRef.current}px,0,0)`
      }
      raf = requestAnimationFrame(tickFrame)
    }
    raf = requestAnimationFrame(tickFrame)
    return () => cancelAnimationFrame(raf)
  }, [normalizeX])

  return (
    <div className="relative mx-auto w-full max-w-[96rem]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-14 bg-gradient-to-r from-[#070c1a] to-transparent md:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-14 bg-gradient-to-l from-[#070c1a] to-transparent md:w-20" />

      <button
        type="button"
        aria-label="Patrocinadores anteriores"
        onClick={() => stepBy(1)}
        className="absolute left-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neon/35 bg-card/95 text-neon shadow-lg backdrop-blur-sm transition hover:border-neon/60 hover:bg-neon-muted md:left-2 md:h-12 md:w-12"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        type="button"
        aria-label="Próximos patrocinadores"
        onClick={() => stepBy(-1)}
        className="absolute right-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neon/35 bg-card/95 text-neon shadow-lg backdrop-blur-sm transition hover:border-neon/60 hover:bg-neon-muted md:right-2 md:h-12 md:w-12"
      >
        <ChevronRight className="size-6" />
      </button>

      <div ref={viewportRef} className="overflow-hidden px-2 md:px-14">
        <div
          ref={trackRef}
          className="flex w-max cursor-grab gap-6 active:cursor-grabbing"
          style={{ transform: "translate3d(0,0,0)" }}
          onPointerDown={(e) => {
            draggingRef.current = true
            lastClientXRef.current = e.clientX
            ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
          }}
          onPointerMove={(e) => {
            if (!draggingRef.current) return
            const dx = e.clientX - lastClientXRef.current
            lastClientXRef.current = e.clientX
            xRef.current += dx
            normalizeX()
            const track = trackRef.current
            if (track)
              track.style.transform = `translate3d(${xRef.current}px,0,0)`
          }}
          onPointerUp={(e) => {
            draggingRef.current = false
            ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
          }}
          onPointerLeave={(e) => {
            if (draggingRef.current) {
              draggingRef.current = false
              ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
            }
          }}
        >
          {loop.map((s, i) => (
            <div
              key={`${s.name}-${i}`}
              style={{ width: cardWidth, flex: "0 0 auto" }}
              className="shrink-0"
            >
              <TiltCard className="rounded-2xl border border-cyan-500/20 bg-card/85 p-6 transition-shadow hover:shadow-[0_0_50px_-18px_rgba(34,211,238,0.35)]">
                <div className="flex flex-col items-center gap-5">
                  <SponsorLogoArea s={s} i={i % sponsors.length} />
                  <div className="text-center">
                    <span className="font-mono text-base font-semibold text-foreground">
                      {s.name}
                    </span>
                    <div className="mt-2 flex justify-center">
                      <Badge variant="outline" className={tierBadgeClass(s.tier)}>
                        {s.tier}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
