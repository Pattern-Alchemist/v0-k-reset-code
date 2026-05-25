import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/navigation"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "K-RESET - Resilience & Leadership Curriculum",
  description: "Hybrid, gamified education platform for resilience, leadership, and peer learning",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "K-RESET",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-6">{children}</main>
            <PWAInstallPrompt />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
