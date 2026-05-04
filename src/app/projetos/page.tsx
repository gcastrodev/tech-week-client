"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { postProject } from "@/lib/api"
import type { ProjectPayload } from "@/lib/types"
import { Loader2, CheckCircle } from "lucide-react"

export default function ProjetosPage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    name: "",
    student_registration: "",
    project_name: "",
    description: "",
  })

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const ra = Number(form.student_registration)
    if (!form.name || !form.student_registration || !form.project_name || !form.description) {
      toast.error("Preencha todos os campos.")
      return
    }
    if (isNaN(ra) || form.student_registration.length > 9) {
      toast.error("RA inválido.")
      return
    }
    if (form.description.length > 500) {
      toast.error("Descrição deve ter no máximo 500 caracteres.")
      return
    }

    const payload: ProjectPayload = {
      name: form.name,
      student_registration: ra,
      project_name: form.project_name,
      description: form.description,
    }

    setLoading(true)
    try {
      await postProject(payload)
      setDone(true)
      toast.success("Projeto submetido! Aguarde a aprovação.")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (msg === "invalid_ra") {
        toast.error("RA inválido.")
      } else {
        toast.error("Erro ao submeter projeto. Tente novamente.")
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
            <h1 className="text-3xl font-bold">Projeto submetido!</h1>
            <p className="text-muted-foreground max-w-sm">
              Seu projeto está aguardando aprovação da coordenação.
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
          <h1 className="text-4xl font-bold mb-2">Projetos de IA</h1>
          <p className="text-muted-foreground mb-2">
            Tem um projeto de Inteligência Artificial? Submeta aqui para ser apresentado na Tech Week.
          </p>
          <p className="text-sm text-muted-foreground bg-muted/60 border border-border rounded-lg px-4 py-3 mb-8">
            Os projetos passam por aprovação da coordenação antes de serem confirmados no evento.
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Dados do projeto</CardTitle>
              <CardDescription>Todos os campos são obrigatórios.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Seu nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Nome do aluno responsável"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    maxLength={255}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ra">RA</Label>
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
                  <Label htmlFor="project_name">Nome do projeto</Label>
                  <Input
                    id="project_name"
                    placeholder="Ex: AgroIA — Detecção de pragas"
                    value={form.project_name}
                    onChange={(e) => set("project_name", e.target.value)}
                    maxLength={255}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">
                    Descrição{" "}
                    <span className="text-muted-foreground font-normal">
                      ({form.description.length}/500)
                    </span>
                  </Label>
                  <textarea
                    id="description"
                    className="w-full border border-input rounded-md bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px] resize-y"
                    placeholder="Descreva brevemente o que o projeto faz e qual problema resolve..."
                    value={form.description}
                    onChange={(e) => set("description", e.target.value.slice(0, 500))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-white font-semibold" disabled={loading}>
                  {loading ? <><Loader2 size={16} className="animate-spin mr-2" /> Enviando...</> : "Submeter projeto"}
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