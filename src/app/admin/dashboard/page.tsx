"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { getRegistrations, getProjects, MOCK_REGISTRATIONS, MOCK_PROJECTS } from "@/lib/api"
import type { Registration, Project } from "@/lib/types"
import { Loader2, LogOut, Users, Cpu, Coffee, CheckCircle } from "lucide-react"

const USE_MOCK = true

export default function AdminDashboardPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token && !USE_MOCK) {
      router.replace("/admin/login")
      return
    }
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600))
        setRegistrations(MOCK_REGISTRATIONS)
        setProjects(MOCK_PROJECTS)
      } else {
        const [regs, projs] = await Promise.all([getRegistrations(), getProjects()])
        setRegistrations(regs)
        setProjects(projs)
      }
    } catch {
      toast.error("Erro ao carregar dados. Faça login novamente.")
      router.replace("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem("admin_token")
    router.replace("/admin/login")
  }

  const checkedIn = registrations.filter((r) => r.checked_in).length
  const coffeeBreak = registrations.filter((r) => r.coffee_break).length

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="bg-brand text-white text-xs font-bold px-2 py-1 rounded">TW</span>
            <span>Admin — Tech Week</span>
            {USE_MOCK && (
              <Badge variant="outline" className="text-amber-600 border-amber-400 ml-2 text-xs">
                dados mock
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-muted-foreground">
            <LogOut size={14} /> Sair
          </Button>
        </div>
      </header>

      <main className="flex-1 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Painel de controle</h1>

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="animate-spin text-brand" size={36} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { icon: Users, label: "Inscritos", value: registrations.length },
                  { icon: CheckCircle, label: "Check-ins", value: checkedIn },
                  { icon: Coffee, label: "Coffee break", value: coffeeBreak },
                  { icon: Cpu, label: "Projetos", value: projects.length },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="border border-border rounded-lg p-5 bg-card">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                      <Icon size={14} /> {label}
                    </div>
                    <p className="text-3xl font-bold">{value}</p>
                  </div>
                ))}
              </div>

              <Tabs defaultValue="inscritos">
                <TabsList className="mb-6">
                  <TabsTrigger value="inscritos">Participantes inscritos</TabsTrigger>
                  <TabsTrigger value="projetos">Projetos submetidos</TabsTrigger>
                </TabsList>

                <TabsContent value="inscritos">
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/60 text-muted-foreground">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Nome</th>
                          <th className="text-left px-4 py-3 font-medium">RA</th>
                          <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Curso</th>
                          <th className="text-center px-4 py-3 font-medium hidden md:table-cell">Período</th>
                          <th className="text-center px-4 py-3 font-medium">Coffee</th>
                          <th className="text-center px-4 py-3 font-medium">Check-in</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {registrations.map((r, i) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-medium">{r.name}</td>
                            <td className="px-4 py-3 text-muted-foreground font-mono">{r.student_registration}</td>
                            <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{r.course_name}</td>
                            <td className="px-4 py-3 text-center hidden md:table-cell">{r.course_period}º</td>
                            <td className="px-4 py-3 text-center">
                              {r.coffee_break
                                ? <Badge className="bg-amber-100 text-amber-800 border-amber-300">Sim</Badge>
                                : <span className="text-muted-foreground">—</span>
                              }
                            </td>
                            <td className="px-4 py-3 text-center">
                              {r.checked_in
                                ? <Badge className="bg-brand/10 text-brand border-brand/30">Sim</Badge>
                                : <span className="text-muted-foreground">Não</span>
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {registrations.length === 0 && (
                      <p className="text-center text-muted-foreground py-12">Nenhum participante inscrito ainda.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="projetos">
                  <div className="space-y-4">
                    {projects.map((p) => (
                      <Card key={p.id}>
                        <CardContent className="pt-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{p.project_name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {p.name} — RA {p.student_registration}
                              </p>
                              <p className="text-sm leading-relaxed">{p.description}</p>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Button size="sm" className="bg-brand hover:bg-brand/90 text-white" onClick={() => toast.success(`Projeto aprovado!`)}>
                                Aprovar
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => toast.error(`Projeto rejeitado.`)}>
                                Rejeitar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {projects.length === 0 && (
                      <p className="text-center text-muted-foreground py-12">Nenhum projeto submetido ainda.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
    </>
  )
}