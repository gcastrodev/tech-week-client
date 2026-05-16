"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { InnerPageShell, InnerPageSuccess } from "@/components/inner-page-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { submitRegistration } from "@/app/actions/public"
import { ALLOWED_COURSES } from "@/lib/validation"
import { digitsOnly, stripDigits } from "@/lib/form-input"
import { Loader2, CheckCircle } from "lucide-react"

export default function InscricaoPage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    name: "",
    student_registration: "",
    course_name: "",
    course_period: "",
    coffee_break: false,
  })

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const ra = form.student_registration.trim()
    if (!form.name || !ra || !form.course_name || !form.course_period) {
      toast.error("Preencha todos os campos obrigatórios.")
      return
    }
    if (!/^\d{9}$/.test(ra)) {
      toast.error("RA deve ter exatamente 9 dígitos.")
      return
    }
    const period = Number(form.course_period)
    if (period < 1 || period > 12) {
      toast.error("Período deve ser entre 1 e 12.")
      return
    }

    setLoading(true)
    const result = await submitRegistration({
      name: form.name,
      student_registration: ra,
      course_name: form.course_name,
      course_period: String(period),
      coffee_break: form.coffee_break,
    })
    setLoading(false)

    if (result.success) {
      setDone(true)
      toast.success("Inscrição realizada com sucesso!")
    } else {
      const msg = result.error
      if (msg === "ra_already_registered") {
        toast.error("Este RA já está inscrito.")
      } else if (msg === "invalid_student_registration") {
        toast.error("RA inválido.")
      } else if (msg === "invalid_name") {
        toast.error("Nome inválido.")
      } else if (msg === "invalid_course_name") {
        toast.error("Nome do curso inválido.")
      } else if (msg === "invalid_course_period") {
        toast.error("Período inválido.")
      } else {
        toast.error("Erro ao realizar inscrição. Tente novamente.")
      }
    }
  }

  if (done) {
    return (
      <>
        <Navbar />
        <InnerPageSuccess
          title="Inscrição confirmada!"
          description="Você está inscrito na Tech Week. Até lá!"
        >
          <CheckCircle className="mx-auto text-neon" size={72} strokeWidth={1.75} />
        </InnerPageSuccess>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <InnerPageShell
        title="Inscrição"
        description="Preencha os dados abaixo para garantir sua vaga na Tech Week."
      >
        <Card className="border border-cyan-500/20 bg-card/95 shadow-[0_28px_90px_-48px_rgba(0,0,0,0.65)] backdrop-blur-md">
          <CardHeader>
            <CardTitle className="font-mono text-xl">Dados do participante</CardTitle>
            <CardDescription>Campos marcados com * são obrigatórios.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={(e) => set("name", stripDigits(e.target.value))}
                  maxLength={255}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ra">RA *</Label>
                <Input
                  id="ra"
                  placeholder="Ex: 123456789"
                  value={form.student_registration}
                  onChange={(e) =>
                    set("student_registration", e.target.value.replace(/\D/g, "").slice(0, 9))
                  }
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="course">Curso *</Label>
                <select
                  id="course"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.course_name}
                  onChange={(e) => set("course_name", e.target.value)}
                  required
                >
                  <option value="">Selecione seu curso</option>
                  {ALLOWED_COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="period">Período *</Label>
                <Input
                  id="period"
                  placeholder="Ex: 4"
                  value={form.course_period}
                  onChange={(e) => set("course_period", digitsOnly(e.target.value, 2))}
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-950/35 p-4">
                <input
                  type="checkbox"
                  id="coffee"
                  className="mt-0.5 accent-neon"
                  checked={form.coffee_break}
                  onChange={(e) => set("coffee_break", e.target.checked)}
                />
                <label htmlFor="coffee" className="cursor-pointer text-sm">
                  <span className="font-semibold text-amber-200">Quero participar do Coffee Break</span>
                  <br />
                  <span className="text-amber-100/80">
                    O coffee break acontece durante o intervalo do evento.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-neon font-mono font-semibold text-black hover:bg-neon/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Enviando...
                  </>
                ) : (
                  "Confirmar inscrição"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </InnerPageShell>
      <Footer />
    </>
  )
}
