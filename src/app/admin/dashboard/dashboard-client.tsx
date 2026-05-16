"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { logoutAdmin } from "@/app/actions/admin"
import type { Registration, Project } from "@/lib/types"
import { LogOut, Users, Cpu, Coffee, CheckCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

type Props = {
  registrations: Registration[]
  projects: Project[]
}

export function AdminDashboardClient({ registrations, projects }: Props) {
  const router = useRouter()

  async function logout() {
    await logoutAdmin()
    router.replace("/admin/login")
    router.refresh()
  }

  const checkedIn = registrations.filter((r) => r.checked_in).length
  const coffeeBreak = registrations.filter((r) => r.coffee_break).length

  return (
    <>
      <SiteHeader
        trailing={
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="gap-1.5 font-mono text-base text-zinc-300 hover:bg-white/10 hover:text-white lg:text-lg"
          >
            <LogOut size={18} /> Sair
          </Button>
        }
      />

      <main className="flex-1 px-5 py-10 md:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[min(96rem,calc(100vw-2.5rem))]">
          <h1 className="mb-8 font-mono text-3xl font-bold tracking-tight md:text-4xl">
            Painel de controle
          </h1>

          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[
              { icon: Users, label: "Inscritos", value: registrations.length },
              { icon: CheckCircle, label: "Check-ins", value: checkedIn },
              { icon: Coffee, label: "Coffee break", value: coffeeBreak },
              { icon: Cpu, label: "Projetos", value: projects.length },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-5 md:p-6">
                <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
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
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[640px] text-sm md:text-base">
                  <thead className="bg-muted/60 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Nome</th>
                      <th className="px-4 py-3 text-left font-medium">RA</th>
                      <th className="hidden px-4 py-3 text-left font-medium md:table-cell">Curso</th>
                      <th className="hidden px-4 py-3 text-center font-medium md:table-cell">Período</th>
                      <th className="px-4 py-3 text-center font-medium">Coffee</th>
                      <th className="px-4 py-3 text-center font-medium">Check-in</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {registrations.map((r) => (
                      <tr
                        key={r.student_registration}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-3 font-medium">{r.name}</td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">
                          {r.student_registration}
                        </td>
                        <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                          {r.course_name}
                        </td>
                        <td className="hidden px-4 py-3 text-center md:table-cell">
                          {r.course_period}º
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.coffee_break ? (
                            <Badge className="border-amber-300 bg-amber-100 text-amber-800">
                              Sim
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.checked_in ? (
                            <Badge className="border-brand/30 bg-brand/10 text-brand">Sim</Badge>
                          ) : (
                            <span className="text-muted-foreground">Não</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {registrations.length === 0 && (
                  <p className="py-12 text-center text-muted-foreground">
                    Nenhum participante inscrito ainda.
                  </p>
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
                          <h3 className="mb-1 font-semibold">{p.project_name}</h3>
                          <p className="mb-2 text-sm text-muted-foreground">
                            {p.submitter_name} — RA {p.submitter_registration}
                          </p>
                          <p className="text-sm leading-relaxed">{p.description}</p>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2">
                          <Button
                            size="sm"
                            className="bg-brand text-white hover:bg-brand/90"
                            onClick={() => toast.success("Projeto aprovado!")}
                          >
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-destructive/30 text-destructive hover:bg-destructive/10"
                            onClick={() => toast.error("Projeto rejeitado.")}
                          >
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {projects.length === 0 && (
                  <p className="py-12 text-center text-muted-foreground">
                    Nenhum projeto submetido ainda.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}