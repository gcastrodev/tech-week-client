"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useMotorcycleJoyride } from "@/components/motorcycle-joyride"

export function SiteHeader({
  trailing,
  className,
}: {
  trailing?: ReactNode
  className?: string
}) {
  const { onNavbarMotorcycleClick } = useMotorcycleJoyride()

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] border-b border-white/10 bg-black shadow-[0_16px_48px_rgba(0,0,0,0.65)] backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto grid h-[78px] w-full max-w-[100vw] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 lg:gap-5 lg:px-10">
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

        <div className="relative z-[110] flex min-h-[44px] items-center justify-end gap-1 justify-self-end">
          {trailing}
        </div>
      </div>
    </header>
  )
}
