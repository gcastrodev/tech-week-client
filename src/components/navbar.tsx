"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

const links = [
  { href: "/", label: "Início" },
  { href: "/registrations", label: "Inscreva-se" },
  { href: "/projects", label: "Projetos" },
  { href: "/checkin", label: "Check-in" },
  { href: "/faq", label: "FAQ" },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <SiteHeader
        trailing={
          <>
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
          </>
        }
      />

      {open && (
        <div className="sticky top-[78px] z-[99] flex flex-col gap-1 border-b border-white/15 bg-black px-4 py-3 md:hidden">
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
    </>
  )
}
