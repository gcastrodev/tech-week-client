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
import { postCheckin } from "@/lib/api"
import { Loader2, CheckCircle } from "lucide-react"

export default function CheckinPage() {
  const [ra, setRa] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const raNum = Number(ra)
    if (isNaN(raNum) || raNum < 100000000 || raNum > 999999999) {
      toast.error("RA deve ter exatamente 9 dígitos.")
      return
    }

    setLoading(true)
    try {
      await postCheckin({ student_registration: raNum })
      setDone(true)
      toast.success("Check-in confirmado!")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (msg === "ra_not_found") {
        toast.error("RA não encontrado. Você está inscrito?")
      } else if (msg === "invalid_ra") {
        toast.error("RA inválido.")
      } else {
        toast.error("Erro ao realizar check-in.")
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
          title="Presença confirmada!"
          description="Aproveite a Tech Week!"
          actions={
            <Button
              variant="outline"
              className="border-neon/40 font-mono text-neon hover:bg-neon/10"
              onClick={() => {
                setDone(false)
                setRa("")
              }}
            >
              Fazer outro check-in
            </Button>
          }
        >
          <CheckCircle className="mx-auto text-neon" size={80} strokeWidth={1.75} />
        </InnerPageSuccess>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <InnerPageShell
        title="Check-in"
        description="Confirme sua presença informando seu RA ao final de cada palestra."
      >
        <Card className="border border-cyan-500/20 bg-card/95 shadow-[0_28px_90px_-48px_rgba(0,0,0,0.65)] backdrop-blur-md">
          <CardHeader>
            <CardTitle className="font-mono text-xl">Confirmar presença</CardTitle>
            <CardDescription>Digite seu RA para registrar sua participação.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ra">RA</Label>
                <Input
                  id="ra"
                  placeholder="Ex: 123456789"
                  value={ra}
                  onChange={(e) => setRa(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  inputMode="numeric"
                  autoFocus
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
                    <Loader2 size={16} className="mr-2 animate-spin" /> Confirmando...
                  </>
                ) : (
                  "Confirmar presença"
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
