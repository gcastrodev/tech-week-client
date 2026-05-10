"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useMotorcycleJoyride } from "@/components/motorcycle-joyride"

const links = [
  { href: "/", label: "Início" },
  { href: "/inscricao", label: "Inscreva-se" },
  { href: "/projetos", label: "Projetos" },
  { href: "/checkin", label: "Check-in" },
  { href: "/faq", label: "FAQ" },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { onNavbarMotorcycleClick } = useMotorcycleJoyride()

  return (
    <header className="sticky top-0 z-[100] border-b border-white/10 bg-black shadow-[0_16px_48px_rgba(0,0,0,0.65)] backdrop-blur-md">
      <nav className="mx-auto grid h-[78px] w-full max-w-[100vw] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 lg:gap-5 lg:px-10">
        {/* Esquerda — logo UniCesumar */}
        <Link
          href="/"
          className="relative z-[110] flex shrink-0 items-center justify-self-start"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fx/unicesumar.png"
            alt="UniCesumar"
            className="navbar-brand-logo h-10 w-auto max-w-[130px] object-contain opacity-[0.98] md:h-[46px] md:max-w-[170px]"
          />
        </Link>

        {/* Centro — ⮕ TECH [toggle] WEEK ⬅ */}
        <div className="flex min-w-0 items-center justify-center justify-self-center px-1">
          <div className="flex max-w-full items-center gap-0.5 sm:gap-2 md:gap-3">
            <span
              className="fire-arrow shrink-0 text-lg leading-none sm:text-2xl md:text-3xl lg:text-[2.35rem]"
              aria-hidden
            >
              ⮕
            </span>
            <span className="whitespace-nowrap bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text font-black tracking-tight text-transparent text-base sm:text-xl md:text-3xl lg:text-[2.35rem]">
              TECH
            </span>
            <button
              type="button"
              onClick={onNavbarMotorcycleClick}
              aria-label="Moto: iniciar passeio ou explodir"
              className={cn(
                "motorcycle-orbit relative z-10 flex shrink-0 items-center justify-center rounded-full",
                "h-11 w-11 sm:h-[52px] sm:w-[52px] md:h-[58px] md:w-[58px]",
                "transition-transform hover:scale-105 active:scale-95"
              )}
            >
              <span className="relative z-10 flex h-[calc(100%-8px)] w-[calc(100%-8px)] items-center justify-center rounded-full bg-black/88 ring-1 ring-white/15">
                <span className="text-[clamp(1.25rem,5vw,2rem)] leading-none" aria-hidden>
                  🏍️
                </span>
              </span>
            </button>
            <span className="whitespace-nowrap bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text font-black tracking-tight text-transparent text-base sm:text-xl md:text-3xl lg:text-[2.35rem]">
              WEEK
            </span>
            <span
              className="fire-arrow shrink-0 text-lg leading-none sm:text-2xl md:text-3xl lg:text-[2.35rem]"
              aria-hidden
            >
              ⬅
            </span>
          </div>
        </div>

        {/* Direita — links + menu mobile */}
        <div className="relative z-[110] flex items-center justify-end gap-1 justify-self-end">
          <ul className="hidden items-center gap-0.5 md:flex lg:gap-1.5">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "rounded-md px-3 py-2 font-mono text-base font-medium transition-colors lg:px-3.5 lg:text-lg",
                    pathname === l.href
                      ? "border border-neon bg-neon-muted text-neon"
                      : "text-zinc-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {l.href === pathname ? "> " : ""}
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            className="rounded-md p-2.5 text-zinc-300 hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t border-white/15 bg-black px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-md px-3 py-3 font-mono text-lg font-medium transition-colors",
                pathname === l.href
                  ? "border border-neon bg-neon-muted text-neon"
                  : "text-zinc-300 hover:bg-white/10 hover:text-white"
              )}
            >
              {l.href === pathname ? "> " : ""}
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
