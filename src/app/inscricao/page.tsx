"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { postRegistration } from "@/lib/api"
import type { RegistrationPayload } from "@/lib/types"
import { Loader2, CheckCircle } from "lucide-react"

const courses = [
  "Engenharia de Software",
  "Sistemas de Informação",
  "Ciência da Computação",
  "Análise e Desenvolvimento de Sistemas",
  "Engenharia de Computação",
  "Outro",
]

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

    const ra = Number(form.student_registration)
    if (!form.name || !form.student_registration || !form.course_name || !form.course_period) {
      toast.error("Preencha todos os campos obrigatórios.")
      return
    }
    if (isNaN(ra) || form.student_registration.length > 9) {
      toast.error("RA inválido. Deve conter até 9 dígitos numéricos.")
      return
    }
    const period = Number(form.course_period)
    if (period < 1 || period > 12) {
      toast.error("Período deve ser entre 1 e 12.")
      return
    }

    const payload: RegistrationPayload = {
      name: form.name,
      student_registration: ra,
      course_name: form.course_name,
      course_period: period,
      coffee_break: form.coffee_break,
    }

    setLoading(true)
    try {
      await postRegistration(payload)
      setDone(true)
      toast.success("Inscrição realizada com sucesso!")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (msg === "ra_already_registered") {
        toast.error("Este RA já está inscrito.")
      } else if (msg === "invalid_ra") {
        toast.error("RA inválido.")
      } else {
        toast.error("Erro ao realizar inscrição. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="text-center flex flex-col items-center gap-4">
            <CheckCircle className="text-brand" size={64} />
            <h1 className="text-3xl font-bold">Inscrição confirmada!</h1>
            <p className="text-muted-foreground max-w-sm">
              Você está inscrito na Tech Week. Até lá!
            </p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl font-bold mb-2">Inscrição</h1>
          <p className="text-muted-foreground mb-8">
            Preencha os dados abaixo para garantir sua vaga na Tech Week.
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Dados do participante</CardTitle>
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
                    onChange={(e) => set("name", e.target.value)}
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
                    onChange={(e) => set("student_registration", e.target.value.replace(/\D/g, "").slice(0, 9))}
                    inputMode="numeric"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="course">Curso *</Label>
                  <select
                    id="course"
                    className="w-full border border-input rounded-md bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={form.course_name}
                    onChange={(e) => set("course_name", e.target.value)}
                    required
                  >
                    <option value="">Selecione seu curso</option>
                    {courses.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="period">Período *</Label>
                  <Input
                    id="period"
                    type="number"
                    min={1}
                    max={12}
                    placeholder="Ex: 4"
                    value={form.course_period}
                    onChange={(e) => set("course_period", e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <input
                    type="checkbox"
                    id="coffee"
                    className="mt-0.5 accent-brand"
                    checked={form.coffee_break}
                    onChange={(e) => set("coffee_break", e.target.checked)}
                  />
                  <label htmlFor="coffee" className="text-sm cursor-pointer">
                    <span className="font-semibold text-amber-800">Quero participar do Coffee Break</span>
                    <br />
                    <span className="text-amber-700">
                      O coffee break acontece durante o intervalo do evento.
                    </span>
                  </label>
                </div>

                <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-white font-semibold" disabled={loading}>
                  {loading ? <><Loader2 size={16} className="animate-spin mr-2" /> Enviando...</> : "Confirmar inscrição"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}