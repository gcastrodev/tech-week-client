import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

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
      <main className="flex-1 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Perguntas frequentes</h1>
          <p className="text-muted-foreground mb-12">Ficou com dúvida? Veja as respostas abaixo.</p>
          <div className="space-y-6">
            {faq.map((item, i) => (
              <div key={i} className="border-b border-border pb-6 last:border-0">
                <h2 className="font-semibold text-lg mb-2">{item.q}</h2>
                <p className="text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-muted/60 rounded-xl border border-border p-6 text-center">
            <p className="text-muted-foreground mb-1">Não encontrou o que procurava?</p>
            <p className="font-medium">Entre em contato com a organização pelo e-mail da universidade.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}