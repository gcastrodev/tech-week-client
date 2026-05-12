"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import {
  AtSign,
  ChevronLeft,
  ChevronRight,
  Link2,
  Phone,
  User,
} from "lucide-react"
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
  /** Tema da palestra */
  talkTopic?: string
  /** Caminho sob `/public` */
  photoSrc?: string
  photoAlt?: string
  /** Rótulo do selo no cartão (ex.: confirmado) */
  statusBadge?: string
  socials?: ReadonlyArray<{
    network: "instagram" | "linkedin" | "phone"
    href: string
    label: string
    /** Ex.: aviso de contato pessoal no telefone */
    hint?: string
  }>
}

const socialIcon = {
  instagram: AtSign,
  linkedin: Link2,
  phone: Phone,
} as const

const AUTO_MS = 5000

function SpeakerSlideCard({
  speaker,
  pulseDelay,
}: {
  speaker: SpeakerCard
  pulseDelay: number
}) {
  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden border-neon/25 bg-card/70 shadow-[0_0_40px_-16px_rgba(0,255,136,0.22)] backdrop-blur-md">
      <div className="relative min-h-[300px] bg-gradient-to-br from-cyan-500/25 via-[#0d1f3c] to-neon-muted/25 md:min-h-[380px]">
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="h-64 w-64 rounded-full border-2 border-neon/25 border-dashed md:h-80 md:w-80"
          />
        </div>
        <div className="absolute bottom-0 left-5 translate-y-1/2 sm:left-6 md:left-8">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pulseDelay,
            }}
            className="relative flex h-[14.5rem] w-[14.5rem] items-center justify-center overflow-hidden rounded-3xl border-2 border-neon/45 bg-gradient-to-br from-cyan-900 to-[#0c1426] shadow-[0_0_36px_rgba(0,255,136,0.28)] md:h-[17rem] md:w-[17rem] md:rounded-[1.75rem] md:shadow-[0_0_44px_rgba(0,255,136,0.3)]"
          >
            {speaker.photoSrc ? (
              <Image
                src={speaker.photoSrc}
                alt={speaker.photoAlt ?? speaker.name}
                fill
                sizes="(min-width: 768px) 280px, 240px"
                className="object-cover"
              />
            ) : (
              <User className="text-neon" size={104} aria-hidden />
            )}
          </motion.div>
        </div>
        <div className="absolute right-4 top-4 md:right-5 md:top-5">
          <Badge variant="outline" className="border-neon/35 font-mono text-xs text-neon/80">
            {speaker.statusBadge ?? "em breve"}
          </Badge>
        </div>
      </div>
      <CardHeader className="min-w-0 space-y-2 pt-[7.75rem] md:pt-[9.25rem]">
        <CardTitle className="break-words font-mono text-xl leading-tight md:text-2xl">
          {speaker.name}
        </CardTitle>
        <CardDescription className="font-mono text-xs text-neon/70 md:text-sm">
          {speaker.role}
        </CardDescription>
        {speaker.talkTopic ? (
          <p className="border-l-2 border-neon/40 pl-2.5 pt-0.5 font-mono text-xs leading-snug text-foreground/90 md:text-sm">
            <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-neon/65 md:text-xs">
              tema
            </span>
            {speaker.talkTopic}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4 pb-6 md:pb-8">
        <p className="min-w-0 text-sm leading-relaxed text-muted-foreground md:text-base">
          {speaker.bio}
        </p>
        {speaker.socials && speaker.socials.length > 0 ? (
          <div className="mt-auto">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-neon/65 md:text-xs">
              redes e contato
            </p>
            <ul className="flex flex-wrap gap-1.5 md:gap-2">
              {speaker.socials.map((s) => {
                const Icon = socialIcon[s.network]
                const external = s.network !== "phone"
                return (
                  <li key={`${s.network}-${s.href}`}>
                    <a
                      href={s.href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      title={s.hint ? `${s.label} — ${s.hint}` : undefined}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-neon/25 bg-background/40 px-2 py-1.5 font-mono text-xs text-foreground/90 transition-colors hover:border-neon/50 hover:bg-neon-muted/15 hover:text-neon md:gap-2 md:px-2.5 md:text-sm"
                    >
                      <Icon className="size-3.5 shrink-0 text-neon/80 md:size-4" aria-hidden />
                      <span className="min-w-0 truncate">
                        {s.label}
                        {s.hint ? (
                          <span className="text-muted-foreground">
                            {" "}
                            ({s.hint})
                          </span>
                        ) : null}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function SpeakerCarousel({
  speakers,
}: {
  speakers: readonly SpeakerCard[]
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const count = speakers.length
  const speakerA = speakers[index]!
  const speakerB = count > 1 ? speakers[(index + 1) % count]! : null

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

  useEffect(() => {
    if (paused || count < 2) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [paused, count])

  return (
    <div
      className="relative mx-auto w-full max-w-[96rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-[#060b18] to-transparent md:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-[#060b18] to-transparent md:w-16" />

      <button
        type="button"
        aria-label="Palestrante anterior"
        onClick={() => go(-1)}
        className="absolute left-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-neon/30 bg-card/90 text-neon shadow-lg backdrop-blur-sm transition hover:border-neon/60 hover:bg-neon-muted md:left-1 md:h-14 md:w-14"
      >
        <ChevronLeft className="size-7" />
      </button>
      <button
        type="button"
        aria-label="Próximo palestrante"
        onClick={() => go(1)}
        className="absolute right-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-neon/30 bg-card/90 text-neon shadow-lg backdrop-blur-sm transition hover:border-neon/60 hover:bg-neon-muted md:right-1 md:h-14 md:w-14"
      >
        <ChevronRight className="size-7" />
      </button>

      <div
        className="overflow-hidden px-2 md:px-14"
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
            className="mx-auto w-full max-w-[min(94vw,72rem)]"
          >
            {count === 1 ? (
              <div className="mx-auto max-w-md">
                <SpeakerSlideCard speaker={speakerA} pulseDelay={0} />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                <SpeakerSlideCard speaker={speakerA} pulseDelay={0} />
                <div className="hidden min-w-0 md:block">
                  <SpeakerSlideCard speaker={speakerB!} pulseDelay={0.15} />
                </div>
              </div>
            )}
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
