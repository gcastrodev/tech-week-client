import type { ReactNode } from "react"

/** Largura útil quase em toda a viewport (alinha à home `max-w-[96rem]`) */
const shellInnerClass =
  "mx-auto w-full max-w-[min(96rem,calc(100vw-2.5rem))] px-1 sm:px-2"

export function InnerPageShell({
  eyebrow = "Tech Week — UniCesumar",
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  children: ReactNode
}) {
  return (
    <main className="relative flex-1 bg-gradient-to-b from-[#070c1a] via-[#101b35] to-[#060910] px-5 pb-28 pt-16 md:px-10 md:pb-36 md:pt-20 lg:px-14">
      <div className={shellInnerClass}>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-neon/85 md:text-xs">
          {eyebrow}
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.35rem]">
          {title}
        </h1>
        {description ? (
          <div className="mt-4 max-w-4xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </div>
        ) : null}
        <div className="mt-10 w-full">{children}</div>
      </div>
    </main>
  )
}

export function InnerPageSuccess({
  title,
  description,
  children,
  actions,
}: {
  title: string
  description?: ReactNode
  children?: ReactNode
  actions?: ReactNode
}) {
  return (
    <main className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-[#070c1a] via-[#101b35] to-[#060910] px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <div className="mx-auto w-full max-w-[min(42rem,calc(100vw-2.5rem))] text-center">
        {children}
        <h1 className="mt-6 font-mono text-2xl font-bold text-foreground md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 text-muted-foreground md:text-lg">{description}</p>
        ) : null}
        {actions ? <div className="mt-8 flex justify-center">{actions}</div> : null}
      </div>
    </main>
  )
}
