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
import { postProject } from "@/lib/api"
import type { ProjectPayload } from "@/lib/types"
import { Loader2, CheckCircle } from "lucide-react"

export default function ProjetosPage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    submitter_name: "",
    submitter_registration: "",
    project_name: "",
    description: "",
  })

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const ra = Number(form.submitter_registration)
    if (
      !form.submitter_name ||
      !form.submitter_registration ||
      !form.project_name ||
      !form.description
    ) {
      toast.error("Preencha todos os campos.")
      return
    }
    if (isNaN(ra) || ra < 100000000 || ra > 999999999) {
      toast.error("RA deve ter exatamente 9 dígitos.")
      return
    }
    if (form.description.length > 500) {
      toast.error("Descrição deve ter no máximo 500 caracteres.")
      return
    }

    const payload: ProjectPayload = {
      submitter_name: form.submitter_name,
      submitter_registration: ra,
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
        <InnerPageSuccess
          title="Projeto submetido!"
          description="Seu projeto está aguardando aprovação da coordenação."
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
        title="Projetos de IA"
        description={
          <>
            <p className="mb-4">
              Tem um projeto de Inteligência Artificial? Submeta aqui para ser apresentado na Tech
              Week.
            </p>
            <p className="rounded-xl border border-border/80 bg-muted/40 px-4 py-3 text-sm md:text-base">
              Os projetos passam por aprovação da coordenação antes de serem confirmados no evento.
            </p>
          </>
        }
      >
        <Card className="border border-cyan-500/20 bg-card/95 shadow-[0_28px_90px_-48px_rgba(0,0,0,0.65)] backdrop-blur-md">
          <CardHeader>
            <CardTitle className="font-mono text-xl">Dados do projeto</CardTitle>
            <CardDescription>Todos os campos são obrigatórios.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="submitter_name">Seu nome completo</Label>
                <Input
                  id="submitter_name"
                  placeholder="Nome do aluno responsável"
                  value={form.submitter_name}
                  onChange={(e) => set("submitter_name", e.target.value)}
                  maxLength={255}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ra">RA</Label>
                <Input
                  id="ra"
                  placeholder="Ex: 123456789"
                  value={form.submitter_registration}
                  onChange={(e) =>
                    set("submitter_registration", e.target.value.replace(/\D/g, "").slice(0, 9))
                  }
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
                  <span className="font-normal text-muted-foreground">
                    ({form.description.length}/500)
                  </span>
                </Label>
                <textarea
                  id="description"
                  className="min-h-[120px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Descreva brevemente o que o projeto faz e qual problema resolve..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value.slice(0, 500))}
                  required
                />
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
                  "Submeter projeto"
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
