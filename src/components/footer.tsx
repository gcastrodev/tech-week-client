import { FaGithub } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/40 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Tech Week — UniCesumar Londrina</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/gcastrodev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <FaGithub size={15} /> Gabriel Castro
          </a>
          <a href="https://github.com/guilhermegouve4" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <FaGithub size={15} /> Guilherme Gouvea
          </a>
        </div>
      </div>
    </footer>
  )
}