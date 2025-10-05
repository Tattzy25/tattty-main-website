import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: "Tattty - AI-Powered Tattoo Design",
    template: "%s | Tattty",
  },
  description: "Transform your personal story into a unique tattoo design with AI.",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden min-h-screen no-horizontal-pan">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
