"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MatrixRain } from "@/components/matrix-rain"
import { CalendarDays, MapPin, Users, Cpu, Coffee, ChevronRight, Clock, Terminal } from "lucide-react"

const schedule = [
  { time: "08:00", title: "Abertura & Credenciamento", type: "geral" },
  { time: "09:00", title: "Palestra: Inteligência Artificial no Mercado", type: "palestra" },
  { time: "10:30", title: "Coffee Break", type: "coffee" },
  { time: "11:00", title: "Apresentação de Projetos — Bloco 1", type: "projeto" },
  { time: "13:00", title: "Almoço", type: "geral" },
  { time: "14:00", title: "Palestra: Segurança em Sistemas Modernos", type: "palestra" },
  { time: "15:30", title: "Apresentação de Projetos — Bloco 2", type: "projeto" },
  { time: "17:00", title: "Encerramento & Premiação", type: "geral" },
]

const sponsors = [
  { name: "Patrocinador A", tier: "ouro" },
  { name: "Patrocinador B", tier: "ouro" },
  { name: "Patrocinador C", tier: "prata" },
  { name: "Patrocinador D", tier: "prata" },
  { name: "Patrocinador E", tier: "bronze" },
]

const typeStyle: Record<string, string> = {
  geral: "bg-muted text-muted-foreground border-border",
  palestra: "bg-neon-muted text-neon border-neon/30",
  coffee: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  projeto: "bg-accent/10 text-accent border-accent/30",
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <MatrixRain />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />

          <div className="relative z-10 max-w-6xl mx-auto px-4 py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Terminal size={14} className="text-neon" />
                <span className="font-mono text-sm text-neon">UniCesumar Londrina</span>
                <span className="animate-blink font-mono text-neon">|</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold font-mono mb-4 leading-none">
                Tech<span className="text-neon glow">_</span>Week
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl mb-4 leading-relaxed">
                Uma semana de imersão em tecnologia com palestras, projetos de IA e networking com profissionais da área.
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-10 font-mono">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-neon" /> A definir
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-neon" /> UniCesumar — Londrina, PR
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-neon text-black hover:bg-neon/90 font-mono font-bold">
                  <Link href="/inscricao">inscreva-se <ChevronRight size={16} /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-neon/40 text-neon hover:bg-neon-muted font-mono">
                  <Link href="/projetos">submeter projeto</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <Section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "participantes", value: "500+" },
            { icon: Cpu, label: "projetos de IA", value: "20+" },
            { icon: Coffee, label: "coffee break", value: "incluso" },
            { icon: CalendarDays, label: "dia de evento", value: "1 dia" },
          ].map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, borderColor: "var(--neon)" }}
              className="border border-border rounded-lg p-6 bg-card text-center transition-colors"
            >
              <Icon className="text-neon mx-auto mb-3" size={24} />
              <p className="text-2xl font-bold font-mono text-neon">{value}</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">{label}</p>
            </motion.div>
          ))}
        </Section>

        {/* Programação */}
        <Section className="bg-card/40 py-16 border-y border-border">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={16} className="text-neon" />
              <h2 className="text-3xl font-bold font-mono">programação<span className="text-neon animate-blink">_</span></h2>
            </div>
            <p className="text-muted-foreground font-mono text-sm mb-8">// grade completa do evento</p>
            <div className="space-y-2">
              {schedule.map((item, i) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex items-center gap-4 bg-background border border-border rounded-lg px-5 py-4 hover:border-neon/40 transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono w-14 shrink-0">
                    <Clock size={12} /> {item.time}
                  </span>
                  <span className="flex-1 text-sm font-medium">{item.title}</span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded border ${typeStyle[item.type]}`}>
                    {item.type}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Patrocinadores */}
        <Section className="py-16 max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={16} className="text-neon" />
            <h2 className="text-3xl font-bold font-mono">patrocinadores<span className="text-neon animate-blink">_</span></h2>
          </div>
          <p className="text-muted-foreground font-mono text-sm mb-8">// obrigado a quem torna o evento possível</p>
          <div className="flex flex-wrap gap-4">
            {sponsors.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ borderColor: "var(--neon)", y: -2 }}
                className="border border-border rounded-lg px-6 py-4 flex flex-col items-center gap-2 min-w-[140px] bg-card transition-colors"
              >
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground font-mono">
                  logo
                </div>
                <span className="text-sm font-medium font-mono">{s.name}</span>
                <Badge
                  variant="outline"
                  className={
                    s.tier === "ouro"
                      ? "border-yellow-500/50 text-yellow-400 font-mono text-xs"
                      : s.tier === "prata"
                      ? "border-slate-400/50 text-slate-400 font-mono text-xs"
                      : "border-amber-700/50 text-amber-600 font-mono text-xs"
                  }
                >
                  {s.tier}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Localização */}
        <Section className="bg-card/40 py-16 border-y border-border">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={16} className="text-neon" />
              <h2 className="text-3xl font-bold font-mono">localização<span className="text-neon animate-blink">_</span></h2>
            </div>
            <p className="text-muted-foreground font-mono text-sm mb-6 flex items-center gap-1.5">
              <MapPin size={14} className="text-neon" /> Av. Guedner, 1610 — Jardim Aclimação, Londrina - PR
            </p>
            <div className="rounded-xl overflow-hidden border border-border h-72 md:h-96 w-full">
              <iframe
                title="UniCesumar Londrina"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3665.93!2d-51.1753!3d-23.3045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94eb435ddb33a8c1%3A0x1234!2sUnicesumar%20Londrina!5e0!3m2!1spt-BR!2sbr!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Section>

        {/* CTA */}
        <Section className="py-24 max-w-6xl mx-auto px-4 text-center">
          <p className="font-mono text-neon text-sm mb-4">// pronto para participar?</p>
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-4">
            garanta sua vaga<span className="text-neon animate-blink">_</span>
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
            Inscrição gratuita. Apenas para alunos da UniCesumar Londrina.
          </p>
          <Button asChild size="lg" className="bg-neon text-black hover:bg-neon/90 font-mono font-bold">
            <Link href="/inscricao">inscrever-se agora <ChevronRight size={16} /></Link>
          </Button>
        </Section>

      </main>
      <Footer />
    </>
  )
}