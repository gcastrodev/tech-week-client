import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CalendarDays, MapPin, Users, Cpu, Coffee, ChevronRight, Clock } from "lucide-react"

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
  geral: "bg-muted text-muted-foreground",
  palestra: "bg-brand text-white",
  coffee: "bg-amber-100 text-amber-800",
  projeto: "bg-secondary text-secondary-foreground",
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">

        <section className="relative overflow-hidden bg-brand py-24 md:py-36">
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_70%_50%,white_0%,transparent_60%)]" />
          <div className="relative max-w-6xl mx-auto px-4 text-white">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              UniCesumar Londrina
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
              Tech Week
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mb-8">
              A semana de tecnologia da UniCesumar. Palestras, projetos inovadores e muito networking.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-10">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={16} /> A definir
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={16} /> UniCesumar — Londrina, PR
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-brand hover:bg-white/90 font-semibold">
                <Link href="/inscricao">Inscreva-se agora <ChevronRight size={16} /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                <Link href="/projetos">Submeter projeto</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Participantes", value: "500+" },
            { icon: Cpu, label: "Projetos de IA", value: "20+" },
            { icon: Coffee, label: "Coffee break incluído", value: "✓" },
            { icon: CalendarDays, label: "Dia de evento", value: "1 dia" },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label} className="text-center p-6">
              <CardContent className="p-0 flex flex-col items-center gap-2">
                <Icon className="text-brand" size={28} />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="bg-muted/40 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2">Programação</h2>
            <p className="text-muted-foreground mb-8">Confira a grade completa do evento.</p>
            <div className="space-y-3">
              {schedule.map((item) => (
                <div
                  key={item.time}
                  className="flex items-center gap-4 bg-card border border-border rounded-lg px-5 py-4"
                >
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground w-16 shrink-0">
                    <Clock size={14} /> {item.time}
                  </span>
                  <span className="flex-1 font-medium">{item.title}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeStyle[item.type]}`}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Patrocinadores</h2>
          <p className="text-muted-foreground mb-8">Obrigado a quem torna o evento possível.</p>
          <div className="flex flex-wrap gap-4">
            {sponsors.map((s) => (
              <div key={s.name} className="border border-border rounded-lg px-6 py-4 flex flex-col items-center gap-2 min-w-[140px]">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  logo
                </div>
                <span className="text-sm font-medium">{s.name}</span>
                <Badge
                  variant="outline"
                  className={
                    s.tier === "ouro"
                      ? "border-yellow-400 text-yellow-600"
                      : s.tier === "prata"
                      ? "border-slate-400 text-slate-500"
                      : "border-amber-700 text-amber-800"
                  }
                >
                  {s.tier}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-muted/40 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2">Localização</h2>
            <p className="text-muted-foreground mb-6 flex items-center gap-1.5">
              <MapPin size={16} className="text-brand" /> Av. Guedner, 1610 — Jardim Aclimação, Londrina - PR
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
        </section>

        <section className="py-20 max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para participar?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Faça sua inscrição gratuita e garanta seu lugar na maior semana de tecnologia da UniCesumar.
          </p>
          <Button asChild size="lg" className="bg-brand hover:bg-brand/90 text-white font-semibold">
            <Link href="/inscricao">Garantir minha vaga <ChevronRight size={16} /></Link>
          </Button>
        </section>

      </main>
      <Footer />
    </>
  )
}