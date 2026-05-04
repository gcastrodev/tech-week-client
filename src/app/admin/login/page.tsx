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
    <main className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="bg-brand text-white text-xs font-bold px-2 py-1 rounded">TW</span>
          <span className="text-2xl font-bold">Admin — Tech Week</span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Acesso restrito</CardTitle>
            <CardDescription>Área exclusiva para a coordenação do evento.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="coordenacao@unicesumar.edu.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-white font-semibold" disabled={loading}>
                {loading ? <><Loader2 size={16} className="animate-spin mr-2" /> Entrando...</> : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}