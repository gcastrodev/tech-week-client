"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "motion/react"
import {
  CalendarDays,
  MapPin,
  Users,
  Cpu,
  Coffee,
  ChevronRight,
  Clock,
  Terminal,
  Mic2,
  Megaphone,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MountWhenInView } from "@/components/mount-when-in-view"
import { LazyMapEmbed } from "@/components/lazy-map-embed"
import { SpeakerCarousel } from "@/components/speaker-carousel"
import { SponsorCarousel } from "@/components/sponsor-carousel"
import {
  EVENT,
  scheduleByDay,
  sponsors,
  speakerPreview,
  type ScheduleType,
} from "@/lib/event-data"
import {
  usePageVisibility,
  usePageVisibilityRef,
} from "@/hooks/use-page-visibility"
import { observeViewport } from "@/lib/observe-viewport"

const MatrixRain = dynamic(
  () => import("@/components/matrix-rain").then((m) => m.MatrixRain),
  { ssr: false, loading: () => null }
)

const BinaryRain = dynamic(
  () => import("@/components/binary-rain").then((m) => m.BinaryRain),
  { ssr: false, loading: () => null }
)
const NeuralNetwork = dynamic(
  () => import("@/components/neural-network").then((m) => m.NeuralNetwork),
  { ssr: false, loading: () => null }
)
const AuroraBorealis = dynamic(
  () => import("@/components/aurora-borealis").then((m) => m.AuroraBorealis),
  { ssr: false, loading: () => null }
)
const RasenganChidori = dynamic(
  () => import("@/components/rasengan-chidori").then((m) => m.RasenganChidori),
  { ssr: false, loading: () => null }
)

const RutherfordAtom = dynamic(
  () => import("@/components/rutherford-atom").then((m) => m.RutherfordAtom),
  { ssr: false, loading: () => null }
)

const typeStyle: Record<ScheduleType, string> = {
  geral: "bg-muted text-muted-foreground border-border",
  palestra: "bg-neon-muted text-neon border-neon/30",
  coffee: "bg-amber-500/10 text-amber-400 border-amber-500/30",
}

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

const CAROUSEL_ROW_1 = [
  { icon: "🤖", label: "Machine Learning" },
  { icon: "⚡", label: "Edge Computing" },
  { icon: "🧬", label: "Bioinformática" },
  { icon: "🔐", label: "Cybersecurity" },
  { icon: "🌐", label: "Web3" },
  { icon: "📡", label: "IoT" },
  { icon: "🎯", label: "Computer Vision" },
  { icon: "🧠", label: "Deep Learning" },
  { icon: "☁️", label: "Cloud Native" },
  { icon: "🤝", label: "Open Source" },
]

const CAROUSEL_ROW_2 = [
  { icon: "🚀", label: "DevOps" },
  { icon: "📊", label: "Data Science" },
  { icon: "🏗️", label: "Arquitetura de Software" },
  { icon: "🔬", label: "LLMs & Agentes" },
  { icon: "🎮", label: "Game Dev" },
  { icon: "📱", label: "Mobile Dev" },
  { icon: "🧩", label: "API Design" },
  { icon: "🔄", label: "MLOps" },
  { icon: "🛡️", label: "Privacidade de Dados" },
  { icon: "✨", label: "Generative AI" },
]

function InfiniteCarousel() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pageVisible = usePageVisibility()
  const pageVisibleRef = usePageVisibilityRef(pageVisible)
  const viewportOkRef = useRef(false)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const speed1 = 0.4
    const speed2 = 0.7
    let x1 = 0
    let x2 = 0
    let raf = 0

    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const tick = () => {
      raf = 0
      if (!pageVisibleRef.current || !viewportOkRef.current) return

      x1 -= speed1
      x2 += speed2

      const r1 = row1Ref.current
      const r2 = row2Ref.current
      if (r1 && r2) {
        const half1 = r1.scrollWidth / 2
        const half2 = r2.scrollWidth / 2

        if (Math.abs(x1) >= half1) x1 = 0
        if (x2 >= half2) x2 = 0

        r1.style.transform = `translateX(${x1}px)`
        r2.style.transform = `translateX(${x2}px)`
      }

      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (raf) return
      if (!pageVisibleRef.current || !viewportOkRef.current) return
      raf = requestAnimationFrame(tick)
    }

    const unob = observeViewport(
      wrap,
      (v) => {
        viewportOkRef.current = v
        if (v) start()
        else stop()
      },
      "80px 0px 100px 0px"
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
  }, [])

  const items1 = [...CAROUSEL_ROW_1, ...CAROUSEL_ROW_1, ...CAROUSEL_ROW_1]
  const items2 = [...CAROUSEL_ROW_2, ...CAROUSEL_ROW_2, ...CAROUSEL_ROW_2]

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden py-6 pb-8 select-none"
    >
      {/* Fade nas bordas */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />

      {/* Fileira 1 — vai para esquerda */}
      <div className="mb-3 overflow-hidden">
        <div ref={row1Ref} className="flex gap-3 will-change-transform">
          {items1.map((item, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card/80 px-5 py-2.5 backdrop-blur-sm"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="whitespace-nowrap font-mono text-sm font-medium text-foreground/80">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fileira 2 — vai para direita (mais rápida) */}
      <div className="overflow-hidden">
        <div ref={row2Ref} className="flex gap-3 will-change-transform">
          {items2.map((item, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2 rounded-full border border-neon/20 bg-neon-muted/30 px-5 py-2.5 backdrop-blur-sm"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="whitespace-nowrap font-mono text-sm font-medium text-neon/80">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLElement>(null)
  const visaoGeralRef = useRef<HTMLElement>(null)
  const programacaoRef = useRef<HTMLElement>(null)
  const palestranthesRef = useRef<HTMLElement>(null)
  const patrocinoresRef = useRef<HTMLElement>(null)
  const [heroFxReady, setHeroFxReady] = useState(false)
  /** Hero em coluna única (átomo abaixo do texto) — breakpoint igual ao `lg:grid-cols` do hero. */
  const [heroStackedLayout, setHeroStackedLayout] = useState(false)

  useEffect(() => {
    setHeroFxReady(true)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)")
    const sync = () => setHeroStackedLayout(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroParallaxLo = useTransform(heroProgress, [0, 1], [0, 52])
  const heroParallaxHi = useTransform(heroProgress, [0, 1], [0, 120])
  const heroTextFade = useTransform(heroProgress, [0, 0.42], [1, 0.12])
  /** No layout empilhado o átomo fica no fim do hero — o fade só entra no fim do scroll da seção. */
  const heroAtomFadeStacked = useTransform(
    heroProgress,
    [0, 0.82, 0.98],
    [1, 1, 0.12]
  )

  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  })
  const storySlide = useTransform(storyProgress, [0, 0.4], [40, 0])
  const storyOpacity = useTransform(storyProgress, [0, 0.25], [0, 1])

  return (
    <>
      <Navbar />
      <main className="relative isolate flex-1">
        {/* Hero — fluxo normal: o conteúdo sobe com o scroll (sticky empilhado bloqueava isso) */}
        <section
          ref={heroRef}
          className="relative z-10 flex min-h-screen items-center overflow-hidden bg-[#F3EFEA] shadow-[0_28px_80px_rgba(0,0,0,0.28)]"
        >
          {/* Pantone Cloud Dancer (aprox. TCX 11-4201) + véus suaves */}
          <div className="absolute inset-0 z-[2] opacity-[0.045] mix-blend-multiply">
            {heroFxReady ? <MatrixRain /> : null}
          </div>
          <div
            className="pointer-events-none absolute -left-32 top-1/4 z-[3] h-[min(70vw,420px)] w-[min(70vw,420px)] rounded-full bg-cyan-400/25 blur-[110px] animate-[hero-orb-soft_8s_ease-in-out_infinite] motion-reduce:animate-none"
          />
          <div
            className="pointer-events-none absolute -right-24 top-16 z-[3] h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full bg-violet-400/20 blur-[100px] animate-[hero-orb-soft_7s_ease-in-out_infinite] motion-reduce:animate-none"
          />
          <div className="absolute inset-0 z-[3] bg-gradient-to-b from-white/50 via-[#F3EFEA]/92 to-[#ebe6df]" />
          <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(56,189,248,0.18),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-tr from-cyan-300/15 via-transparent to-violet-300/12" />

          <div className="pointer-events-none absolute inset-0 z-[3] opacity-[0.35] bg-[linear-gradient(rgba(100,116,139,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.1)_1px,transparent_1px)] bg-[size:48px_48px]" />

          <motion.div
            style={{
              y: heroStackedLayout ? heroParallaxLo : heroParallaxHi,
            }}
            className="relative z-10 mx-auto w-full max-w-[96rem] px-6 lg:px-10 py-16 lg:py-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(360px,1.22fr)] xl:gap-14 2xl:grid-cols-[1fr_minmax(400px,1.28fr)]"
            >
              <motion.div
                className="max-w-3xl"
                style={{ opacity: heroTextFade }}
              >
                <Badge
                  variant="outline"
                  className="mb-6 border-slate-400/70 bg-white/55 px-4 py-2 font-mono text-sm text-slate-800 shadow-sm backdrop-blur-sm md:text-base md:px-5 md:py-2.5"
                >
                  UNICESUMAR · {EVENT.dates.labelShort.toUpperCase()}
                </Badge>

                <h1 className="font-sans text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem]">
                  <span className="text-slate-900">Tech Week</span>
                  <br />
                  <span className="bg-gradient-to-b from-violet-200 via-violet-400 to-blue-700 bg-clip-text text-transparent">
                    Inteligência
                  </span>
                  <br />
                  <span className="bg-gradient-to-b from-cyan-200 via-cyan-400 to-blue-700 bg-clip-text text-transparent">
                    Artificial
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-pretty font-sans text-base leading-relaxed text-slate-700 sm:text-lg md:text-xl md:leading-relaxed">
                  {EVENT.theme}
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="h-auto bg-black px-10 py-6 text-lg font-semibold text-white shadow-lg hover:bg-neutral-900 md:px-12 md:py-7 md:text-xl"
                    >
                      <Link href="/projects">
                        Submeter meu projeto <ChevronRight className="size-5 md:size-6" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      variant="default"
                      className="h-auto border-0 !bg-[#004a8f] px-10 py-6 text-lg font-semibold !text-white shadow-lg hover:!bg-[#003d73] md:px-12 md:py-7 md:text-xl dark:!bg-[#004a8f] dark:hover:!bg-[#003d73]"
                    >
                      <Link href="#programacao">Ver agenda</Link>
                    </Button>
                  </motion.div>
                </div>

                <div className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-slate-300/80 pt-10 md:gap-10">
                  <div>
                    <p className="font-mono text-3xl font-bold text-slate-900 md:text-4xl">
                      5
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-600 md:text-xs">
                      palestrantes
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-3xl font-bold text-slate-900 md:text-4xl">
                      3
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-600 md:text-xs">
                      dias de evento
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-3xl font-bold text-slate-900 md:text-4xl">
                      ∞
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-600 md:text-xs">
                      networking
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="relative flex w-full items-center justify-center py-4 sm:py-6 lg:min-h-[min(90vh,820px)] lg:justify-self-end lg:py-0"
                style={{
                  opacity: heroStackedLayout ? heroAtomFadeStacked : heroTextFade,
                }}
              >
                <div className="aspect-square w-full max-w-[min(100%,420px)] overflow-hidden rounded-3xl border border-slate-900/20 bg-[#030408] shadow-[0_28px_56px_-24px_rgba(0,0,0,0.45)] sm:max-w-[min(100%,480px)] md:max-w-[min(100%,520px)] lg:max-w-[min(100%,min(92vw,600px))] xl:max-w-[min(100%,min(90vw,680px))] 2xl:max-w-[min(100%,760px)]">
                  {heroFxReady ? (
                    <RutherfordAtom embedded className="h-full min-h-0 w-full" />
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center bg-[#030408]">
                      <span className="font-mono text-sm text-slate-500">
                        …
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section
          ref={visaoGeralRef}
          className="relative z-20 min-h-screen overflow-hidden rounded-t-3xl bg-[#1a2545] pb-0 shadow-[0_28px_90px_rgba(0,0,0,0.5)]"
        >
          <div className="pointer-events-none absolute inset-0 min-h-[520px] opacity-95">
            <MountWhenInView
              margin="140px 0px 220px 0px"
              className="pointer-events-none absolute inset-0 min-h-[520px] w-full"
            >
              <BinaryRain />
            </MountWhenInView>
          </div>
          <div className="relative z-10">
            {/* Bento — visão geral */}
            <Section className="relative mx-auto max-w-[96rem] px-6 lg:px-10 py-14">
          <div className="mb-8 flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            <h2 className="font-mono text-4xl font-bold md:text-5xl lg:text-6xl">
              visão geral<span className="animate-blink text-neon">_</span>
            </h2>
          </div>
          <p className="mb-10 max-w-3xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
            O maior evento de tecnologia e inovação da UniCesumar. Três dias de
            palestras, networking e apresentações de projetos com foco em
            Inteligência Artificial.
          </p>

          <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              whileHover={{
                scale: 1.02,
                borderColor: "rgba(0, 255, 136, 0.35)",
              }}
              className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl border border-border bg-card/85 p-6 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)] backdrop-blur-md md:col-span-2 md:row-span-2"
            >
              <div className="absolute right-4 top-4 opacity-20 transition-opacity group-hover:opacity-40">
                <Sparkles className="size-24 text-cyan-400" />
              </div>
              <p className="font-mono text-base text-muted-foreground">
                o que esperar
              </p>
              <p className="mt-3 font-mono text-2xl font-bold leading-snug text-foreground md:text-3xl">
                Uma experiência completa de imersão tecnológica
              </p>
              <p className="mt-3 max-w-md font-sans text-lg leading-relaxed text-muted-foreground">
                Atividades pensadas para conectar e inspirar — palestras,
                projetos, coffee breaks e networking, tudo no mesmo evento.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-card/85 p-5 backdrop-blur-md transition-colors hover:border-neon/30"
            >
              <Cpu className="mb-3 size-5 text-cyan-400" />
              <p className="font-mono text-base text-muted-foreground">tema</p>
              <p className="mt-1 font-mono text-lg font-semibold leading-tight">
                Inteligência Artificial
              </p>
              <p className="mt-1 text-base leading-relaxed text-muted-foreground">
                Projetos inovadores com foco em IA.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-card/85 p-5 backdrop-blur-md transition-colors hover:border-neon/30"
            >
              <CalendarDays className="mb-3 size-5 text-neon" />
              <p className="font-mono text-base text-muted-foreground">quando</p>
              <p className="mt-1 font-mono text-lg font-semibold leading-tight">
                1, 2 e 3 de junho de 2026
              </p>
              <p className="mt-1 text-base leading-relaxed text-muted-foreground">
                Três dias intensos de tecnologia.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-card/85 p-5 backdrop-blur-md transition-colors hover:border-amber-500/40"
            >
              <Coffee className="mb-3 size-5 text-amber-400" />
              <p className="font-mono text-base text-muted-foreground">
                coffee break
              </p>
              <p className="mt-1 text-lg leading-relaxed text-foreground/90">
                Pausas estratégicas para recarregar as energias e fazer
                conexões valiosas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-card/85 p-5 backdrop-blur-md transition-colors hover:border-cyan-500/35"
            >
              <Users className="mb-3 size-5 text-cyan-400" />
              <p className="font-mono text-base text-muted-foreground">
                networking
              </p>
              <p className="mt-1 text-lg leading-relaxed text-foreground/90">
                Conecte-se com profissionais, empresas e colegas que
                compartilham sua paixão por tecnologia.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18 }}
              whileHover={{ y: -4 }}
              className="col-span-2 rounded-2xl border border-border bg-gradient-to-br from-neon-muted/30 to-card/85 p-5 backdrop-blur-md transition-colors hover:border-neon/40 md:col-span-2"
            >
              <Mic2 className="mb-3 size-5 text-neon" />
              <p className="font-mono text-base text-muted-foreground">
                palestras
              </p>
              <p className="mt-1 text-lg leading-relaxed text-foreground/90">
                Nos dias 2 e 3, especialistas e empresários do setor compartilham
                insights sobre tecnologia e IA.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="col-span-2 rounded-2xl border border-border bg-card/85 p-5 backdrop-blur-md transition-colors hover:border-cyan-500/35 md:col-span-2"
            >
              <Megaphone className="mb-3 size-5 text-cyan-400" />
              <p className="font-mono text-base text-muted-foreground">
                submissão de projetos
              </p>
              <p className="mt-1 text-lg leading-relaxed text-foreground/90">
                Apresente seu projeto de IA para uma banca de especialistas e
                exponha para o público.
              </p>
            </motion.div>
          </div>
        </Section>

        {/* Stats */}
        <Section className="mx-auto grid max-w-[96rem] grid-cols-2 gap-3 px-6 py-6 lg:px-10 md:grid-cols-4 md:gap-4">
          {[
            { icon: Users, label: "público esperado", value: "230+" },
            { icon: Mic2, label: "noites de palestras", value: "3" },
            { icon: Coffee, label: "networking", value: "incluso" },
            { icon: CalendarDays, label: "janela diária", value: "3 h" },
          ].map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              whileHover={{
                y: -6,
                borderColor: "rgba(0, 255, 136, 0.45)",
                boxShadow: "0 0 0 1px rgba(0, 255, 136, 0.12)",
              }}
              className="rounded-xl border border-border bg-card p-6 text-center transition-colors"
            >
              <Icon className="mx-auto mb-3 size-6 text-neon" />
              <p className="font-mono text-2xl font-bold text-neon">{value}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {label}
              </p>
            </motion.div>
          ))}
        </Section>

        {/* Scrollytelling leve */}
        <section
          ref={storyRef}
          className="py-20"
        >
          <motion.div
            style={{ y: storySlide, opacity: storyOpacity }}
            className="mx-auto max-w-3xl px-4 text-center"
          >
            <p className="mb-3 font-mono text-sm text-emerald-600">
              // 3 noites de imersão
            </p>
            <h2 className="mb-4 font-mono text-3xl font-bold text-foreground md:text-4xl">
              dados, inovação e{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                transformação digital
              </span>
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Cada edição combina palestras com tempo fixo para você planejar a
              semana: chegue às 19h, acompanhe conteúdos de alto nível e use os
              intervalos para conectar com quem também está construindo o futuro
              com IA.
            </p>
          </motion.div>
        </section>
            <InfiniteCarousel />
          </div>
        </section>

        {/* Programação */}
        <section
          id="programacao"
          ref={programacaoRef}
          className="relative z-30 scroll-mt-[120px] min-h-screen overflow-hidden rounded-t-3xl bg-[#07080f] pt-6 shadow-[0_28px_90px_rgba(0,0,0,0.5)] md:pt-10"
        >
          <div className="pointer-events-none absolute inset-0 min-h-[420px] opacity-40">
            <MountWhenInView
              margin="120px 0px 200px 0px"
              className="pointer-events-none absolute inset-0 min-h-[420px] w-full"
            >
              <RasenganChidori />
            </MountWhenInView>
          </div>
          <Section className="relative z-10 py-14 md:py-20">
            <div className="mx-auto max-w-[96rem] px-6 lg:px-10">
              <div className="mb-2 flex items-center gap-2">
                <Terminal size={16} className="text-neon" />
                <h2 className="font-mono text-4xl font-bold md:text-5xl lg:text-6xl">
                  programação<span className="animate-blink text-neon">_</span>
                </h2>
              </div>
              <p className="mb-12 max-w-3xl font-mono text-sm leading-relaxed text-muted-foreground md:text-base">
                {EVENT.dates.labelLong} · palestras das{" "}
                <span className="text-foreground/90">{EVENT.time.start}</span> às{" "}
                <span className="text-foreground/90">{EVENT.time.end}</span>
                {", com credenciamento às 18:30 no primeiro dia."}
              </p>

              <div className="grid gap-8 md:grid-cols-3 md:gap-10">
                {scheduleByDay.map((day, di) => (
                  <motion.div
                    key={day.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: di * 0.1, duration: 0.45 }}
                    className="flex min-h-[420px] flex-col rounded-3xl border border-border bg-card/95 p-2 shadow-xl shadow-black/20 backdrop-blur-sm md:min-h-[480px]"
                  >
                    <div className="rounded-2xl bg-muted px-5 py-5 md:px-6 md:py-6">
                      <p className="font-mono text-xl font-bold text-neon md:text-2xl">
                        {day.dateLabel}
                      </p>
                      <p className="mt-1 font-mono text-sm text-muted-foreground">
                        {day.weekday}
                      </p>
                      <p className="mt-4 flex items-center gap-2 border-t border-border/80 pt-4 font-mono text-sm font-semibold text-cyan-300">
                        <Clock size={16} className="shrink-0 opacity-80" />
                        {day.dayRange}
                      </p>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-4 md:gap-4 md:p-5">
                      {day.blocks.map((item, i) => (
                        <motion.div
                          key={`${day.id}-${item.title}-${i}`}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: i * 0.05 + di * 0.05,
                            duration: 0.35,
                          }}
                          whileHover={{
                            borderColor: "rgba(0, 255, 136, 0.35)",
                          }}
                          className="flex flex-col gap-2 rounded-xl border border-border bg-muted/45 px-4 py-4 transition-colors md:px-5 md:py-5"
                        >
                          <div className="flex gap-3">
                            <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-cyan-300 md:text-base">
                              {item.time}
                            </span>
                            <div className="min-w-0 flex-1 space-y-1">
                              <span className="block text-base font-medium leading-snug md:text-lg">
                                {item.title}
                              </span>
                              {item.speaker ? (
                                <span className="block text-sm text-muted-foreground">
                                  {item.speaker}
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <span
                            className={`w-fit rounded-md border px-2.5 py-1 font-mono text-xs ${typeStyle[item.type]}`}
                          >
                            {item.type}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>
        </section>

        {/* Palestrantes — prévia */}
        <section
          ref={palestranthesRef}
          className="relative z-40 flex min-h-screen flex-col overflow-hidden rounded-t-3xl bg-[#060b18] shadow-[0_28px_90px_rgba(0,0,0,0.5)]"
        >
          <div className="pointer-events-none absolute inset-0 min-h-screen opacity-35">
            <MountWhenInView
              margin="160px 0px 240px 0px"
              className="pointer-events-none absolute inset-0 min-h-screen w-full"
            >
              <NeuralNetwork />
            </MountWhenInView>
          </div>
          <Section className="relative z-10 mx-auto flex w-full max-w-[96rem] flex-1 flex-col justify-center px-6 py-14 lg:px-10 md:py-16">
            <div className="mb-2 flex items-center gap-2">
              <Mic2 size={16} className="text-neon" />
              <h2 className="font-mono text-4xl font-bold md:text-5xl lg:text-6xl">
                palestrantes<span className="animate-blink text-neon">_</span>
              </h2>
            </div>
            <p className="mb-12 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground md:text-base">
              Quem sobe ao palco traz visão de mercado, pesquisa e prática em torno
              de inteligência artificial e tecnologia — uma vitrine das vozes que
              moldam o debate na II Tech Week.
            </p>
            <SpeakerCarousel speakers={speakerPreview} />
          </Section>
        </section>

        {/* Patrocinadores */}
        <section
          ref={patrocinoresRef}
          className="relative z-50 flex min-h-screen flex-col overflow-hidden rounded-t-3xl bg-[#070c1a] shadow-[0_28px_90px_rgba(0,0,0,0.5)]"
        >
          <div className="pointer-events-none absolute inset-0 min-h-screen opacity-30">
            <MountWhenInView
              margin="160px 0px 240px 0px"
              className="pointer-events-none absolute inset-0 min-h-screen w-full"
            >
              <AuroraBorealis />
            </MountWhenInView>
          </div>
          <Section className="relative z-10 mx-auto flex w-full max-w-[96rem] flex-1 flex-col justify-start px-6 pb-12 pt-14 lg:px-10 md:pb-14 md:pt-16">
            <div className="mb-1 flex items-center gap-2">
              <Terminal size={16} className="text-neon" />
              <h2 className="font-mono text-4xl font-bold md:text-5xl lg:text-6xl">
                patrocinadores<span className="animate-blink text-neon">_</span>
              </h2>
            </div>
            <p className="mb-8 font-mono text-sm text-muted-foreground md:mb-10 md:text-base">
              // parcerias que viabilizam o evento
            </p>
            <div className="mt-2 md:mt-4">
              <SponsorCarousel sponsors={sponsors} />
            </div>
          </Section>
        </section>

        {/* Localização + CTA — bloco único (fundo #243056) */}
        <Section className="cta-finale relative z-[60] scroll-mt-[120px] overflow-hidden rounded-t-3xl border-t border-white/10 bg-[#243056] py-16 shadow-[0_28px_100px_rgba(0,0,0,0.45)] md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(56,189,248,0.08),transparent_55%)]" />
          <div className="relative mx-auto max-w-[96rem] px-6 lg:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Terminal size={16} className="text-cyan-300" />
                <h2 className="font-mono text-4xl font-bold text-[#F3EFEA] md:text-5xl">
                  localização<span className="animate-blink text-cyan-300">_</span>
                </h2>
              </div>
              <p className="mb-6 flex flex-wrap items-center justify-center gap-1.5 font-mono text-sm text-[#F3EFEA]/85">
                <MapPin size={14} className="shrink-0 text-cyan-300" />
                {EVENT.location.venue} — {EVENT.location.addressLine},{" "}
                {EVENT.location.city}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-2 h-72 w-full overflow-hidden rounded-xl border border-white/15 bg-black/20 md:mt-3 md:h-[26rem] lg:h-[28rem]"
            >
              <LazyMapEmbed
                mapQuery={EVENT.location.mapQuery}
                title={EVENT.location.venue}
                className="h-full w-full"
              />
            </motion.div>

            <div className="mx-auto mt-14 max-w-3xl border-t border-white/10 pt-14 text-center md:mt-16 md:pt-16">
              <p className="mb-4 font-mono text-sm text-[#F3EFEA]/85">
                // pronto para participar?
              </p>
              <h2 className="mb-4 font-mono text-4xl font-bold text-[#F3EFEA] md:text-5xl">
                garanta sua vaga<span className="animate-blink text-[#F3EFEA]">_</span>
              </h2>
              <p className="mx-auto mb-10 max-w-lg text-[#F3EFEA]/90">
                Inscrição gratuita. Prioridade para alunos da UniCesumar Londrina.
              </p>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="h-auto border-0 bg-black px-12 py-7 font-mono text-lg font-bold text-[#F3EFEA] shadow-xl hover:bg-neutral-950 md:px-16 md:py-9 md:text-xl"
                >
                  <Link href="/registrations">
                    inscrever-se agora <ChevronRight className="size-5 md:size-6" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
