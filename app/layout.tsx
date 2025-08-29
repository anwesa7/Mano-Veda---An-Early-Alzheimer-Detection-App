import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mano Veda AI - Cognitive Health Assessment",
  description:
    "AI-powered cognitive health assessment platform with real-time analysis and personalized recommendations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
