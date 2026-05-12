"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { useInView } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  usePageVisibility,
  usePageVisibilityRef,
} from "@/hooks/use-page-visibility"
import { observeViewport } from "@/lib/observe-viewport"
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

/** Altura fixa da faixa do logo para todos os cards ficarem alinhados. */
const LOGO_SLOT_CLASS =
  "relative h-[220px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[248px] md:h-[268px]"

function SponsorLogoArea({ s, i, loopIndex }: { s: Sponsor; i: number; loopIndex: number }) {
  if (s.logoSrc) {
    const darkSlot = s.logoSrc.includes("vitorios")
    return (
      <div
        className={`${LOGO_SLOT_CLASS} shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] ring-2 ring-orange-400/55 ${
          darkSlot ? "bg-neutral-950" : "bg-white"
        }`}
      >
        <Image
          src={s.logoSrc}
          alt={s.logoAlt ?? s.name}
          fill
          className="object-contain p-4 sm:p-5 md:p-6"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 300px"
          priority={loopIndex === 0}
          loading={loopIndex === 0 ? undefined : "lazy"}
        />
      </div>
    )
  }
  return (
    <div
      className={`${LOGO_SLOT_CLASS} flex flex-col items-center justify-center gap-2 border border-border bg-muted/35 px-6 sm:px-8`}
    >
      <span className="line-clamp-3 text-center font-mono text-sm font-medium text-foreground">
        {s.name}
      </span>
      <span className="font-mono text-xs text-muted-foreground">logo em breve</span>
    </div>
  )
}

export function SponsorCarousel({ sponsors }: { sponsors: readonly Sponsor[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const cardWidthRef = useRef(280)
  const [cardWidth, setCardWidth] = useState(280)
  const draggingRef = useRef(false)
  const lastClientXRef = useRef(0)
  const hasSeededCacoRef = useRef(false)

  const sectionInView = useInView(rootRef, { amount: 0.12, once: true })
  const pageVisible = usePageVisibility()
  const pageVisibleRef = usePageVisibilityRef(pageVisible)
  const viewportOkRef = useRef(false)

  const loop = [...sponsors, ...sponsors]

  useEffect(() => {
    const el = viewportRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    let raf = 0
    const flush = () => {
      const w = el.offsetWidth
      const cw = Math.max(210, Math.floor((w - 3 * GAP_PX) / 4) + 22)
      cardWidthRef.current = cw
      setCardWidth((prev) => (Math.abs(prev - cw) > 2 ? cw : prev))
    }
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(flush)
    })
    ro.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
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

  /** Quando a largura do card muda, recalcula o módulo do loop para evitar salto visual. */
  useEffect(() => {
    normalizeX()
  }, [cardWidth, normalizeX])

  const stepBy = useCallback(
    (dir: -1 | 1) => {
      xRef.current += dir * slideStep() * 4
      normalizeX()
      const track = trackRef.current
      if (track) track.style.transform = `translate3d(${xRef.current}px,0,0)`
    },
    [normalizeX, slideStep]
  )

  /** Ao chegar à secção, alinha o card da CACO (2.ª cópia do loop) à borda direita. Não depender de `cardWidth` no estado: evita cancelar o rAF a cada ResizeObserver. */
  useEffect(() => {
    if (!sectionInView || hasSeededCacoRef.current || sponsors.length === 0) return
    let cancelled = false
    const run = () => {
      if (cancelled || hasSeededCacoRef.current) return
      const cacoIdx = sponsors.findIndex((s) => s.name.toLowerCase().includes("caco"))
      if (cacoIdx < 0) {
        hasSeededCacoRef.current = true
        return
      }
      const vp = viewportRef.current
      const track = trackRef.current
      if (!vp || !track) return
      const vw = vp.clientWidth
      if (vw < 48) return
      const step = cardWidthRef.current + GAP_PX
      const k = sponsors.length + cacoIdx
      xRef.current = vw - k * step
      normalizeX()
      track.style.transform = `translate3d(${xRef.current}px,0,0)`
      hasSeededCacoRef.current = true
    }
    const id0 = requestAnimationFrame(() => {
      requestAnimationFrame(run)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(id0)
    }
  }, [sectionInView, sponsors, normalizeX])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let raf = 0
    const AUTO = 1.5

    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const tickFrame = () => {
      raf = 0
      if (!viewportOkRef.current || !pageVisibleRef.current) return
      if (!draggingRef.current) {
        xRef.current -= AUTO
        normalizeX()
        const track = trackRef.current
        if (track)
          track.style.transform = `translate3d(${xRef.current}px,0,0)`
      }
      raf = requestAnimationFrame(tickFrame)
    }

    const start = () => {
      if (raf) return
      if (!viewportOkRef.current || !pageVisibleRef.current) return
      raf = requestAnimationFrame(tickFrame)
    }

    const unob = observeViewport(
      root,
      (v) => {
        viewportOkRef.current = v
        if (v) start()
        else stop()
      },
      "80px 0px 120px 0px"
    )

    const onVis = () => {
      pageVisibleRef.current = document.visibilityState === "visible"
      if (pageVisibleRef.current && viewportOkRef.current) start()
      else stop()
    }
    document.addEventListener("visibilitychange", onVis)

    start()

    return () => {
      stop()
      unob()
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [normalizeX])

  return (
    <div ref={rootRef} className="relative isolate mx-auto w-full max-w-[96rem]">
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
          className="flex w-max cursor-grab items-stretch gap-6 active:cursor-grabbing"
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
              className="flex shrink-0 self-stretch"
            >
              <div className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-cyan-500/20 bg-card/85 p-5 transition-shadow hover:shadow-[0_0_50px_-18px_rgba(34,211,238,0.35)] sm:p-6">
                <div className="flex min-h-0 flex-1 flex-col items-center gap-5">
                  <SponsorLogoArea s={s} i={i % sponsors.length} loopIndex={i} />
                  <div className="mt-auto flex w-full min-h-[5.25rem] flex-col justify-end text-center">
                    <span className="line-clamp-2 min-h-[2.75rem] font-mono text-base font-semibold leading-snug text-foreground">
                      {s.name}
                    </span>
                    <div className="mt-2 flex justify-center">
                      <Badge variant="outline" className={tierBadgeClass(s.tier)}>
                        {s.tier}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
