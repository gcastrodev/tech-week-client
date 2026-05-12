"use client"

import { useEffect, useRef } from "react"
import {
  usePageVisibility,
  usePageVisibilityRef,
} from "@/hooks/use-page-visibility"
import { observeViewport } from "@/lib/observe-viewport"

export function MatrixRain() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pageVisible = usePageVisibility()
  const pageVisibleRef = usePageVisibilityRef(pageVisible)
  const viewportOkRef = useRef(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let interval: ReturnType<typeof setInterval> | undefined

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const stop = () => {
      if (interval) {
        clearInterval(interval)
        interval = undefined
      }
    }

    const start = () => {
      stop()
      if (!pageVisibleRef.current || !viewportOkRef.current) return
      const step = window.matchMedia("(max-width: 768px)").matches ? 18 : 14
      const fade = window.matchMedia("(max-width: 768px)").matches ? 0.07 : 0.06
      const period = window.matchMedia("(max-width: 768px)").matches ? 145 : 125

      resize()
      let cols = Math.max(4, Math.floor(canvas.width / step))
      const drops: number[] = Array(cols).fill(0).map(() => Math.random() * -100)

      const draw = () => {
        ctx.fillStyle = `rgba(10, 16, 31, ${fade})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = "11px monospace"

        drops.forEach((y, i) => {
          const char = Math.random() > 0.5 ? "1" : "0"
          const opacity = Math.random() * 0.5 + 0.1
          ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`
          ctx.fillText(char, i * step, y)

          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0
          } else {
            drops[i] += step
          }
        })
      }

      interval = setInterval(draw, period)
    }

    const onResize = () => {
      resize()
      if (interval) start()
    }
    window.addEventListener("resize", onResize)

    const unobViewport = observeViewport(
      wrap,
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
      unobViewport()
      document.removeEventListener("visibilitychange", onVis)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-[0.22]"
      />
    </div>
  )
}
