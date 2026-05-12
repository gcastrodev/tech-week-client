import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { InnerPageSuccess } from "@/components/inner-page-shell"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <Navbar />
      <InnerPageSuccess
        title="Página não encontrada"
        description="O endereço não existe ou foi movido. Confira o link ou use o menu acima."
        actions={
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="bg-brand hover:bg-brand/90 text-white">
              <Link href="/">Voltar ao início</Link>
            </Button>
            <Button asChild variant="outline" className="border-cyan-500/30 text-foreground hover:bg-white/5">
              <Link href="/faq">Ver FAQ</Link>
            </Button>
          </div>
        }
      >
        <p
          className="font-mono text-6xl font-bold tabular-nums tracking-tight text-neon glow md:text-8xl"
          aria-hidden
        >
          404
        </p>
      </InnerPageSuccess>
      <Footer />
    </>
  )
}
