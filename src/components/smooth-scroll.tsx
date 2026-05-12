"use client"

import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"

/** Altura visual do header fixo + folga para âncoras (#) com Lenis */
const ANCHOR_SCROLL_OFFSET = 120

function attachAnchorHandler(
  handler: (e: MouseEvent, lenis: Lenis | null) => void,
  lenis: Lenis | null
) {
  const fn = (e: MouseEvent) => handler(e, lenis)
  document.addEventListener("click", fn, true)
  return () => document.removeEventListener("click", fn, true)
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches

    function scrollToAnchor(
      e: MouseEvent,
      lenis: Lenis | null,
      smooth: boolean
    ) {
      const el = e.target
      if (!(el instanceof Element)) return
      const anchor = el.closest("a[href^='#']") as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute("href")
      if (!href || href === "#") return
      const id = decodeURIComponent(href.slice(1))
      const target = document.getElementById(id)
      if (!target) return

      const base = anchor.baseURI.split("#")[0] ?? ""
      const current = window.location.href.split("#")[0]
      if (base && current && base !== current) return

      e.preventDefault()
      if (lenis) {
        lenis.scrollTo(target, {
          offset: -ANCHOR_SCROLL_OFFSET,
          duration: 1.05,
        })
      } else {
        target.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "start",
        })
      }
    }

    /** Touch / reduced motion: scroll nativo — Lenis + rAF global compete com canvas e custa caro no mobile. */
    if (prefersReduced || coarsePointer) {
      return attachAnchorHandler((e, _lenis) => {
        scrollToAnchor(e, null, !prefersReduced)
      }, null)
    }

    const lenis = new Lenis({
      duration: 0.82,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1,
      wheelMultiplier: 0.9,
      lerp: 0.16,
      overscroll: false,
    })

    const offAnchor = attachAnchorHandler((e, l) => {
      scrollToAnchor(e, l, true)
    }, lenis)

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      offAnchor()
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
