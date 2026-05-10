import { Fragment } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { InnerPageShell } from "@/components/inner-page-shell"

const faq = [
  {
    q: "Como faço para me inscrever?",
    a: "Acesse a página 'Inscreva-se' no menu, preencha seus dados e confirme. A inscrição é gratuita!",
  },
  {
    q: "O evento tem custo?",
    a: "Não. A Tech Week é totalmente gratuita para alunos da UniCesumar.",
  },
  {
    q: "O que é o coffee break e como confirmar participação?",
    a: "O coffee break é um intervalo com lanches durante o evento. Basta marcar a opção ao se inscrever. O número de vagas é limitado.",
  },
  {
    q: "Como submeto um projeto de IA?",
    a: "Acesse a página 'Projetos', preencha o formulário com os dados do seu projeto e aguarde a aprovação da coordenação.",
  },
  {
    q: "Como faço o check-in no dia do evento?",
    a: "Acesse a página 'Check-in', digite seu RA e confirme sua presença ao final de cada palestra que assistir.",
  },
  {
    q: "Não sou aluno da UniCesumar, posso participar?",
    a: "O evento é prioritariamente voltado para alunos da universidade. Entre em contato com a organização para verificar disponibilidade.",
  },
  {
    q: "Onde acontece o evento?",
    a: "Na UniCesumar Londrina — Av. Santa Mônica, 450, Londrina - PR.",
  },
  {
    q: "Vou receber certificado?",
    a: "Sim! A presença confirmada via check-in serve como base para emissão do certificado de participação.",
  },
]

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <InnerPageShell
        title="Perguntas frequentes"
        description="Ficou com dúvida? Veja as respostas abaixo."
      >
        <Fragment>
          <div className="space-y-8">
            {faq.map((item, i) => (
              <div
                key={i}
                className="border-b border-border/60 pb-8 last:border-0 last:pb-0"
              >
                <h2 className="font-mono text-lg font-semibold text-foreground md:text-xl">
                  {item.q}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground md:text-base">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 rounded-2xl border border-cyan-500/20 bg-card/60 px-6 py-8 text-center backdrop-blur-sm md:px-10">
            <p className="text-muted-foreground">Não encontrou o que procurava?</p>
            <p className="mt-2 font-medium text-foreground">
              Entre em contato com a organização pelo e-mail da universidade.
            </p>
          </div>
        </Fragment>
      </InnerPageShell>
      <Footer />
    </>
  )
}
