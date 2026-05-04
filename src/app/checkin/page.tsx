"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
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
    if (!ra || isNaN(raNum) || ra.length > 9) {
      toast.error("RA inválido.")
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
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="text-center flex flex-col items-center gap-4">
            <CheckCircle className="text-brand" size={72} />
            <h1 className="text-3xl font-bold">Presença confirmada!</h1>
            <p className="text-muted-foreground">Aproveite a Tech Week!</p>
            <Button variant="outline" className="mt-4" onClick={() => { setDone(false); setRa("") }}>
              Fazer outro check-in
            </Button>
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
        <div className="max-w-sm mx-auto">
          <h1 className="text-4xl font-bold mb-2">Check-in</h1>
          <p className="text-muted-foreground mb-8">
            Confirme sua presença informando seu RA ao final de cada palestra.
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Confirmar presença</CardTitle>
              <CardDescription>
                Digite seu RA para registrar sua participação.
              </CardDescription>
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
                <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-white font-semibold" disabled={loading}>
                  {loading ? <><Loader2 size={16} className="animate-spin mr-2" /> Confirmando...</> : "Confirmar presença"}
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