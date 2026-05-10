"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { adminLogin } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Preencha e-mail e senha.")
      return
    }

    setLoading(true)
    try {
      const res = await adminLogin({ email, password })
      localStorage.setItem("admin_token", res.token)
      toast.success("Login realizado!")
      router.push("/admin/dashboard")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (msg === "invalid_credentials") {
        toast.error("E-mail ou senha incorretos.")
      } else {
        toast.error("Erro ao fazer login.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#070c1a] via-[#101b35] to-[#060910] px-5 py-16 md:px-12 lg:px-16">
      <div className="w-full max-w-[min(56rem,calc(100vw-2.5rem))]">
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-center">
          <span className="rounded bg-neon px-2.5 py-1 font-mono text-xs font-bold text-black">
            TW
          </span>
          <span className="font-mono text-2xl font-bold text-foreground md:text-3xl">
            Admin — Tech Week
          </span>
        </div>
        <Card className="border border-cyan-500/20 bg-card/95 shadow-[0_28px_90px_-48px_rgba(0,0,0,0.65)] backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="font-mono text-xl">Acesso restrito</CardTitle>
            <CardDescription>Área exclusiva para a coordenação do evento.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="coordenacao@unicesumar.edu.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 md:text-base"
                  required
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 md:text-base"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="h-11 w-full bg-neon font-mono font-semibold text-black hover:bg-neon/90 md:h-12 md:text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" /> Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
