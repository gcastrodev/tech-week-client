"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
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
  User,
  Cpu,
  Coffee,
  ChevronRight,
  Clock,
  Terminal,
  Mic2,
  Megaphone,
  Hourglass,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TiltCard } from "@/components/tilt-card"
import {
  ASSETS,
  EVENT,
  scheduleByDay,
  sponsors,
  speakerPreview,
  type ScheduleType,
} from "@/lib/event-data"

const HeroWebGL = dynamic(
  () => import("@/components/hero-webgl").then((m) => m.HeroWebGL),
  { ssr: false, loading: () => null }
)

const MatrixRain = dynamic(
  () => import("@/components/matrix-rain").then((m) => m.MatrixRain),
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

function tierBadgeClass(tier: string) {
  if (tier === "ouro")
    return "border-yellow-500/50 text-yellow-400 font-mono text-xs"
  if (tier === "prata")
    return "border-slate-400/50 text-slate-400 font-mono text-xs"
  if (tier === "bronze")
    return "border-amber-700/50 text-amber-600 font-mono text-xs"
  return "border-orange-500/40 text-orange-400 font-mono text-xs"
}

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLElement>(null)
  const [heroFxReady, setHeroFxReady] = useState(false)

  useEffect(() => {
    setHeroFxReady(true)
  }, [])
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroParallax = useTransform(heroProgress, [0, 1], [0, 120])
  const heroFade = useTransform(heroProgress, [0, 0.45], [1, 0.15])

  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  })
  const storySlide = useTransform(storyProgress, [0, 0.4], [40, 0])
  const storyOpacity = useTransform(storyProgress, [0, 0.25], [0, 1])

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section
          ref={heroRef}
          className="relative flex min-h-[92vh] items-center overflow-hidden"
        >
          {heroFxReady ? <HeroWebGL /> : null}
          <div className="absolute inset-0 z-[2] opacity-[0.06]">
            <MatrixRain />
          </div>
          <motion.div
            className="pointer-events-none absolute -left-32 top-1/4 z-[3] h-[min(70vw,420px)] w-[min(70vw,420px)] rounded-full bg-cyan-300/30 blur-[110px]"
            animate={{ opacity: [0.35, 0.58, 0.35] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-24 top-16 z-[3] h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full bg-sky-400/25 blur-[100px]"
            animate={{ opacity: [0.4, 0.62, 0.4] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 z-[3] bg-gradient-to-b from-slate-900/25 via-[#152a52]/55 to-background" />
          <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_85%_65%_at_50%_-5%,rgba(34,211,238,0.22),transparent_58%)]" />
          <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-tr from-cyan-400/10 via-transparent to-emerald-400/15" />

          <motion.div
            style={{ y: heroParallax, opacity: heroFade }}
            className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 lg:py-28"
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(280px,440px)] lg:gap-14"
            >
              <div>
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <Terminal size={14} className="text-neon" />
                  <span className="font-mono text-sm text-neon">
                    {EVENT.fullTitle}
                  </span>
                  <span className="animate-blink font-mono text-neon">|</span>
                  <Badge
                    variant="outline"
                    className="border-cyan-500/40 font-mono text-xs text-cyan-300"
                  >
                    {EVENT.hashtag}
                  </Badge>
                </div>

              <h1 className="text-5xl font-bold leading-[0.95] tracking-tight font-mono md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
                Tech<span className="glow text-neon">_</span>Week
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="mb-8 mt-5 max-w-2xl bg-gradient-to-r from-white via-cyan-100 to-emerald-200/95 bg-clip-text font-sans text-lg font-medium leading-snug text-transparent md:text-2xl md:leading-relaxed"
              >
                {EVENT.theme}
              </motion.p>

                <div className="mb-10 flex flex-col gap-2 font-mono text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-neon" />{" "}
                    {EVENT.dates.labelShort}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-neon" /> {EVENT.time.label}{" "}
                    · palestras de {EVENT.lectureMinutes} min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-neon" />{" "}
                    {EVENT.location.venue}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="bg-neon font-mono font-bold text-black hover:bg-neon/90"
                    >
                      <Link href="/inscricao">
                        inscreva-se <ChevronRight size={16} />
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
                      variant="outline"
                      className="border-neon/40 font-mono text-neon hover:bg-neon-muted"
                    >
                      <Link href="/projetos">submeter projeto</Link>
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
                      variant="outline"
                      className="border-cyan-500/35 font-mono text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <a
                        href={EVENT.cfp.formUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        call for speakers
                      </a>
                    </Button>
                  </motion.div>
                </div>

                <p className="mt-8 max-w-xl text-sm italic text-muted-foreground">
                  {EVENT.ctaFlyer}
                </p>

                {sponsors[0]?.logoSrc ? (
                  <div className="mt-10 rounded-2xl border border-cyan-500/25 bg-white/[0.06] p-5 backdrop-blur-md section-glow">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/90">
                      Patrocínio
                    </p>
                    <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                      <div className="rounded-2xl bg-white px-8 py-5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] ring-2 ring-orange-400/60">
                        <Image
                          src={sponsors[0].logoSrc}
                          alt={sponsors[0].logoAlt ?? sponsors[0].name}
                          width={220}
                          height={179}
                          className="h-auto w-[min(100%,220px)] object-contain"
                          priority
                        />
                      </div>
                      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {sponsors[0].name}
                        </span>{" "}
                        — primeiro patrocinador confirmado. Novos apoios serão
                        divulgados aqui.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
              >
                <div className="img-reveal-ring relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-400/25 via-transparent to-neon-muted/30 p-[2px]">
                  <div className="overflow-hidden rounded-[22px] bg-[#0c1426] shadow-2xl">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                      className="origin-center"
                    >
                      <Image
                        src={ASSETS.heroFlyer}
                        alt="Arte oficial II TECH WEEK — Inteligência Artificial"
                        width={576}
                        height={1024}
                        className="h-auto w-full object-cover object-top"
                        sizes="(max-width: 1024px) 90vw, 440px"
                        priority
                      />
                    </motion.div>
                  </div>
                </div>
                <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground lg:text-left">
                  Arte do evento · identidade visual II TECH WEEK
                </p>
                <div className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-neon/15 blur-3xl" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <div className="light-rail relative shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75)]">
        {/* Bento — visão geral */}
        <Section className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-8 flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            <h2 className="font-mono text-2xl font-bold md:text-3xl">
              visão geral<span className="animate-blink text-neon">_</span>
            </h2>
          </div>

          <div className="grid auto-rows-[minmax(120px,auto)] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              whileHover={{
                scale: 1.02,
                borderColor: "rgba(0, 255, 136, 0.35)",
              }}
              className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)] md:col-span-2 md:row-span-2"
            >
              <div className="absolute right-4 top-4 opacity-20 transition-opacity group-hover:opacity-40">
                <Cpu className="size-24 text-cyan-400" />
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {EVENT.edition} edição
              </p>
              <p className="mt-2 font-mono text-xl font-bold leading-snug text-foreground md:text-2xl">
                {EVENT.theme}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-card/90 p-5 backdrop-blur-sm transition-colors hover:border-neon/30"
            >
              <CalendarDays className="mb-3 size-5 text-neon" />
              <p className="font-mono text-xs text-muted-foreground">datas</p>
              <p className="mt-1 font-mono text-sm font-semibold leading-tight">
                {EVENT.dates.labelShort}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-card/90 p-5 backdrop-blur-sm transition-colors hover:border-neon/30"
            >
              <Clock className="mb-3 size-5 text-neon" />
              <p className="font-mono text-xs text-muted-foreground">horário</p>
              <p className="mt-1 font-mono text-sm font-semibold">
                {EVENT.time.label}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              whileHover={{ y: -4 }}
              className="col-span-2 rounded-2xl border border-border bg-card/90 p-5 backdrop-blur-sm transition-colors hover:border-cyan-500/35 md:col-span-2"
            >
              <MapPin className="mb-3 size-5 text-cyan-400" />
              <p className="font-mono text-xs text-muted-foreground">local</p>
              <p className="mt-1 font-mono text-sm font-semibold leading-snug">
                {EVENT.location.venue}
                <br />
                <span className="font-normal text-muted-foreground">
                  {EVENT.location.addressLine} · {EVENT.location.city}
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-gradient-to-br from-neon-muted/40 to-card p-5 transition-colors hover:border-neon/40"
            >
              <Megaphone className="mb-3 size-5 text-neon" />
              <p className="font-mono text-xs text-muted-foreground">
                palestrantes
              </p>
              <p className="mt-1 font-mono text-sm font-semibold">
                Prazo: {EVENT.cfp.deadlineLabel}
              </p>
              <a
                href={EVENT.cfp.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-neon underline-offset-4 hover:underline"
              >
                formulário
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-card/90 p-5 backdrop-blur-sm transition-colors hover:border-neon/30"
            >
              <Hourglass className="mb-3 size-5 text-neon" />
              <p className="font-mono text-xs text-muted-foreground">formato</p>
              <p className="mt-1 font-mono text-sm font-semibold">
                {EVENT.lectureMinutes} min por palestra
              </p>
            </motion.div>
          </div>
        </Section>

        {/* Stats */}
        <Section className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-6 md:grid-cols-4 md:gap-4">
          {[
            { icon: Users, label: "público esperado", value: "500+" },
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
          className="border-y border-slate-200/60 py-20"
        >
          <motion.div
            style={{ y: storySlide, opacity: storyOpacity }}
            className="mx-auto max-w-3xl px-4 text-center"
          >
            <p className="mb-3 font-mono text-sm text-emerald-600">
              // experiência em três noites
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

        {/* Programação */}
        <Section className="border-y border-slate-200/60 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-2 flex items-center gap-2">
              <Terminal size={16} className="text-neon" />
              <h2 className="font-mono text-3xl font-bold">
                programação<span className="animate-blink text-neon">_</span>
              </h2>
            </div>
            <p className="mb-10 font-mono text-sm text-muted-foreground">
              // três noites · {EVENT.time.label} · detalhes das palestras em
              divulgação
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {scheduleByDay.map((day, di) => (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: di * 0.1, duration: 0.45 }}
                  className="flex flex-col rounded-2xl border border-border bg-card p-1 shadow-lg shadow-slate-900/5"
                >
                  <div className="rounded-xl bg-muted px-4 py-3">
                    <p className="font-mono text-lg font-bold text-neon">
                      {day.dateLabel}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {day.weekday}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-3">
                    {day.blocks.map((item, i) => (
                      <motion.div
                        key={`${day.id}-${item.time}`}
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
                        className="flex flex-col gap-1 rounded-lg border border-border bg-muted/40 px-3 py-3 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                          <Clock size={12} /> {item.time}
                        </span>
                        <span className="text-sm font-medium leading-snug">
                          {item.title}
                        </span>
                        <span
                          className={`w-fit rounded border px-2 py-0.5 font-mono text-xs ${typeStyle[item.type]}`}
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

        {/* Palestrantes — prévia */}
        <Section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-2 flex items-center gap-2">
            <Mic2 size={16} className="text-neon" />
            <h2 className="font-mono text-3xl font-bold">
              palestrantes<span className="animate-blink text-neon">_</span>
            </h2>
          </div>
          <p className="mb-8 max-w-2xl font-mono text-sm text-muted-foreground">
            Prévia no site da Tech Week; o hub completo (perfis, bios e links)
            será publicado em página dedicada. Submeta sua palestra até{" "}
            {EVENT.cfp.deadlineLabel}.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {speakerPreview.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full overflow-hidden border-border/80 transition-colors hover:border-cyan-500/35">
                  <div className="relative h-20 bg-gradient-to-br from-cyan-500/35 via-[#15284a] to-neon-muted/25">
                    <div className="absolute bottom-0 left-4 translate-y-1/2">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-background bg-card shadow-lg">
                        <User className="text-neon" size={22} />
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pt-9">
                    <CardTitle className="font-mono">{s.name}</CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {s.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {s.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Patrocinadores */}
        <Section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-2 flex items-center gap-2">
            <Terminal size={16} className="text-neon" />
            <h2 className="font-mono text-3xl font-bold">
              patrocinadores<span className="animate-blink text-neon">_</span>
            </h2>
          </div>
          <p className="mb-8 font-mono text-sm text-muted-foreground">
            // parcerias que viabilizam o evento — novos logos em breve
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="min-w-0"
              >
                <TiltCard className="rounded-2xl border border-cyan-500/20 bg-card/80 p-6 transition-shadow hover:shadow-[0_0_50px_-18px_rgba(34,211,238,0.35)]">
                  <div className="flex flex-col items-center gap-5">
                    {s.logoSrc ? (
                      <div className="flex min-h-[160px] w-full max-w-[300px] items-center justify-center rounded-2xl bg-white px-10 py-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] ring-2 ring-orange-400/55">
                        <Image
                          src={s.logoSrc}
                          alt={s.logoAlt ?? s.name}
                          width={260}
                          height={212}
                          className="h-auto w-full max-w-[260px] object-contain"
                          sizes="260px"
                          priority={i === 0}
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-muted font-mono text-xs text-muted-foreground">
                        logo
                      </div>
                    )}
                    <div className="text-center">
                      <span className="font-mono text-base font-semibold text-foreground">
                        {s.name}
                      </span>
                      <div className="mt-2 flex justify-center">
                        <Badge
                          variant="outline"
                          className={tierBadgeClass(s.tier)}
                        >
                          {s.tier}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Localização */}
        <Section className="border-y border-slate-200/60 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-2 flex items-center gap-2">
              <Terminal size={16} className="text-neon" />
              <h2 className="font-mono text-3xl font-bold">
                localização<span className="animate-blink text-neon">_</span>
              </h2>
            </div>
            <p className="mb-6 flex flex-wrap items-center gap-1.5 font-mono text-sm text-muted-foreground">
              <MapPin size={14} className="text-neon" />
              {EVENT.location.venue} — {EVENT.location.addressLine},{" "}
              {EVENT.location.city}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="h-72 w-full overflow-hidden rounded-xl border border-border md:h-96"
            >
              <iframe
                title={EVENT.location.venue}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(EVENT.location.mapQuery)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </Section>
        </div>

        {/* CTA */}
        <Section className="cta-finale relative overflow-hidden border-y border-cyan-500/20 bg-gradient-to-b from-[#0b1224] via-[#141f3d] to-[#080c18] py-24 text-center shadow-[0_-40px_80px_-48px_rgba(34,211,238,0.35)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(34,211,238,0.12),transparent_60%)]" />
          <div className="relative mx-auto max-w-6xl px-4">
          <p className="mb-4 font-mono text-sm text-neon">
            // pronto para participar?
          </p>
          <h2 className="mb-4 font-mono text-4xl font-bold md:text-5xl">
            garanta sua vaga<span className="animate-blink text-neon">_</span>
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-muted-foreground">
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
              className="bg-neon font-mono font-bold text-black hover:bg-neon/90"
            >
              <Link href="/inscricao">
                inscrever-se agora <ChevronRight size={16} />
              </Link>
            </Button>
          </motion.div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
