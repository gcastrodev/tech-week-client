"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "motion/react"

type LazyMapEmbedProps = {
  mapQuery: string
  title: string
  className?: string
}

/**
 * Só define o `src` do iframe quando a área entra na vista — evita carregar o embed
 * do Google Maps durante todo o scroll da home (pesado no fim da página).
 */
export function LazyMapEmbed({ mapQuery, title, className }: LazyMapEmbedProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapRef, {
    amount: 0.12,
    margin: "80px 0px" as never,
    once: true,
  })
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (inView) {
      setSrc(
        `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
      )
    }
  }, [inView, mapQuery])

  return (
    <div ref={wrapRef} className={className}>
      {src ? (
        <iframe
          title={title}
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/15 bg-black/25 text-center font-mono text-sm text-[#F3EFEA]/65">
          Carregando mapa…
        </div>
      )}
    </div>
  )
}
