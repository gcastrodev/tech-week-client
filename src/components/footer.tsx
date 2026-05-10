import Link from "next/link"
import { FaGithub } from "react-icons/fa"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-[85] mt-auto border-t border-white/10 bg-[#0d1629] py-11">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-base text-[#F3EFEA] md:flex-row md:gap-5 md:text-lg">
        <p className="font-medium leading-snug text-[#F3EFEA]">
          © {new Date().getFullYear()} Tech Week — UniCesumar Londrina
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <a
            href="https://github.com/gcastrodev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 font-medium text-[#F3EFEA] transition-colors hover:text-white"
          >
            <FaGithub className="size-[22px] shrink-0 text-[#F3EFEA]" aria-hidden />
            Gabriel Castro
          </a>
          <a
            href="https://github.com/guilhermegouve4"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 font-medium text-[#F3EFEA] transition-colors hover:text-white"
          >
            <FaGithub className="size-[22px] shrink-0 text-[#F3EFEA]" aria-hidden />
            Guilherme Gouvea
          </a>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-white/5 px-4 pt-6 text-center">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 font-mono text-sm text-[#F3EFEA]/55 transition-colors hover:text-[#F3EFEA]"
        >
          <Shield className="size-4 shrink-0 opacity-90" aria-hidden />
          Área administrativa
        </Link>
      </div>
    </footer>
  )
}