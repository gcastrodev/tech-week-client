"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronLeft, ChevronRight, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type SpeakerCard = {
  name: string
  role: string
  bio: string
}

export function SpeakerCarousel({
  speakers,
}: {
  speakers: readonly SpeakerCard[]
}) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const count = speakers.length
  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + count) % count)
    },
    [count]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1)
      if (e.key === "ArrowRight") go(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go])

  return (
    <div className="relative mx-auto w-full max-w-[96rem]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[#060b18] to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-[#060b18] to-transparent md:w-24" />

      <button
        type="button"
        aria-label="Palestrante anterior"
        onClick={() => go(-1)}
        className="absolute left-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-neon/30 bg-card/90 text-neon shadow-lg backdrop-blur-sm transition hover:border-neon/60 hover:bg-neon-muted md:left-2 md:h-14 md:w-14"
      >
        <ChevronLeft className="size-7" />
      </button>
      <button
        type="button"
        aria-label="Próximo palestrante"
        onClick={() => go(1)}
        className="absolute right-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-neon/30 bg-card/90 text-neon shadow-lg backdrop-blur-sm transition hover:border-neon/60 hover:bg-neon-muted md:right-2 md:h-14 md:w-14"
      >
        <ChevronRight className="size-7" />
      </button>

      <div
        className="overflow-hidden px-2 md:px-16"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current == null) return
          const end = e.changedTouches[0]?.clientX ?? touchStartX.current
          const dx = end - touchStartX.current
          touchStartX.current = null
          if (Math.abs(dx) > 48) go(dx > 0 ? -1 : 1)
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[min(92vw,72rem)]"
          >
            <Card className="overflow-hidden border-neon/25 bg-card/70 shadow-[0_0_60px_-20px_rgba(0,255,136,0.25)] backdrop-blur-md">
              <div className="relative min-h-[200px] bg-gradient-to-br from-cyan-500/25 via-[#0d1f3c] to-neon-muted/25 md:min-h-[240px]">
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                    className="h-28 w-28 rounded-full border-2 border-neon/25 border-dashed md:h-36 md:w-36"
                  />
                </div>
                <div className="absolute bottom-0 left-8 translate-y-1/2 md:left-12">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
                    className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-neon/45 bg-gradient-to-br from-cyan-900 to-[#0c1426] shadow-[0_0_28px_rgba(0,255,136,0.22)] md:h-24 md:w-24"
                  >
                    <User className="text-neon" size={36} />
                  </motion.div>
                </div>
                <div className="absolute right-6 top-6">
                  <Badge variant="outline" className="border-neon/35 font-mono text-xs text-neon/80">
                    em breve
                  </Badge>
                </div>
              </div>
              <CardHeader className="space-y-2 pt-14 md:pt-16">
                <CardTitle className="font-mono text-2xl md:text-3xl">
                  {speakers[index]!.name}
                </CardTitle>
                <CardDescription className="font-mono text-sm text-neon/70 md:text-base">
                  {speakers[index]!.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-10">
                <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  {speakers[index]!.bio}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {speakers.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para palestrante ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-10 bg-neon" : "w-2.5 bg-muted-foreground/35 hover:bg-muted-foreground/55"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
