import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LATE - OWN YOUR TIME",
  description: "Because success isn't about being on time. It's about making an impact when you arrive.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <ThemeProvider defaultTheme="dark" attribute="class">
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
