"use client"

import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"

/** Altura visual do header fixo + folga para âncoras (#) com Lenis */
const ANCHOR_SCROLL_OFFSET = 120

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.8,
    })
    /** Lenis não usa sempre `scroll-padding-top` do CSS em links internos */
    function onAnchorClick(e: MouseEvent) {
      const el = e.target
      if (!(el instanceof Element)) return
      const anchor = el.closest("a[href^='#']") as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute("href")
      if (!href || href === "#") return
      const id = decodeURIComponent(href.slice(1))
      const target = document.getElementById(id)
      if (!target) return

      const base =
        anchor.baseURI.split("#")[0] ?? ""
      const current =
        typeof window !== "undefined"
          ? window.location.href.split("#")[0]
          : ""
      if (base && current && base !== current) return

      e.preventDefault()
      lenis.scrollTo(target, {
        offset: -ANCHOR_SCROLL_OFFSET,
        duration: 1.05,
      })
    }

    document.addEventListener("click", onAnchorClick, true)

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener("click", onAnchorClick, true)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
