/**
 * IntersectionObserver com sync inicial — para pausar canvas/rAF fora da viewport
 * sem re-renders. Retorna cleanup.
 */
export function observeViewport(
  el: HTMLElement,
  onIntersecting: (visible: boolean) => void,
  rootMargin = "100px 0px 200px 0px"
): () => void {
  if (typeof IntersectionObserver === "undefined") {
    onIntersecting(true)
    return () => {}
  }

  const syncRect = () => {
    const r = el.getBoundingClientRect()
    const vh = typeof window !== "undefined" ? window.innerHeight || 0 : 0
    onIntersecting(r.bottom > 0 && r.top < vh)
  }
  syncRect()

  const io = new IntersectionObserver(
    (entries) => {
      onIntersecting(entries.some((e) => e.isIntersecting))
    },
    { root: null, rootMargin, threshold: 0 }
  )
  io.observe(el)
  return () => io.disconnect()
}
