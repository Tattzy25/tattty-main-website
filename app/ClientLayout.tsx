"use client"

import type React from "react"
// import { Analytics } from "@vercel/analytics/react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
      <Toaster />
      {/* <Analytics /> */}
    </ThemeProvider>
  )
}
