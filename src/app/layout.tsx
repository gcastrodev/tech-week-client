import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"
import { SmoothScroll } from "@/components/smooth-scroll"
import { MotorcycleJoyrideProvider } from "@/components/motorcycle-joyride"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Tech Week — UniCesumar",
  description: "Semana de tecnologia da UniCesumar. Palestras, projetos e muito networking.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body
        className="noise-overlay bg-tech-mesh min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <SmoothScroll>
            <MotorcycleJoyrideProvider>
              <div className="relative z-[2] flex min-h-full flex-1 flex-col">
                {children}
                <Toaster richColors position="top-right" />
              </div>
            </MotorcycleJoyrideProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}