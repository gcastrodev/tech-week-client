"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

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
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="bg-neon text-black text-xs font-bold px-2 py-1 rounded font-mono">TW</span>
          <span className="font-mono">Tech<span className="text-neon">_</span>Week</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors font-mono",
                  pathname === l.href
                    ? "text-neon border border-neon bg-neon-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {l.href === pathname ? "> " : ""}{l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-md text-muted-foreground hover:text-neon hover:bg-neon-muted transition-colors"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors font-mono",
                pathname === l.href
                  ? "text-neon border border-neon bg-neon-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {l.href === pathname ? "> " : ""}{l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}