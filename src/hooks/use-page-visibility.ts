"use client"

import { useEffect, useRef, useState } from "react"

/** Ref sempre igual ao último valor de `usePageVisibility()` — evita reiniciar efeitos no `visibilitychange`. */
export function usePageVisibilityRef(visible: boolean) {
  const ref = useRef(visible)
  ref.current = visible
  return ref
}

/** `false` quando o separador está em segundo plano ou minimizado — útil para pausar rAF / intervalos. */
export function usePageVisibility() {
  const [visible, setVisible] = useState(
    () =>
      typeof document === "undefined" ? true : document.visibilityState === "visible"
  )

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible")
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  return visible
}
