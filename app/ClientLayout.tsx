"use client"

import type React from "react"
// import { Analytics } from "@vercel/analytics/react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "@/app/globals.css"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        Apply overflow-x-hidden to prevent any horizontal page shifting/scrolling
        and touch-action: pan-y to allow only vertical touch panning on mobile.
        This keeps the layout mobile-first and ensures the page grows downward
        without moving left/right.
      */}
      <body className="overflow-x-hidden min-h-screen no-horizontal-pan">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
          {/* <Analytics /> */}
        </ThemeProvider>
      </body>
    </html>
  )
}
