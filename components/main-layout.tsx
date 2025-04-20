"use client"

import type React from "react"
import { useRef } from "react"
import Nav from "@/components/nav"
import Footer from "@/components/footer"
import "wicg-inert"

export default function MainLayout({ children, open = false }: { children: React.ReactNode; open?: boolean }) {
  const mainRef = useRef<HTMLElement>(null)

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main ref={mainRef} className="flex-grow pt-16" inert={open ? "" : undefined}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
