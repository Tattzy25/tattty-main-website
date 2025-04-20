"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import Link from "next/link"

import MainLayout from "@/components/main-layout"

export default function TattooPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Simple authentication check - in a real app, this would check a session
  const isAuthenticated = true // Placeholder - always authenticated for now

  // Simulate authentication check
  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!isAuthenticated) {
        router.push("/")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="py-24 flex items-center justify-center min-h-screen">
          <Icons.spinner className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="py-24 relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
              Tattoo Experience
            </h1>
            <p className="text-zinc-300 max-w-2xl mx-auto">Transform your personal story into a unique tattoo design</p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <Icons.image className="h-16 w-16 text-amber-500/50 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
              <p className="text-zinc-300 max-w-lg mx-auto">
                Our AI-powered tattoo design experience is currently under development. Check back soon to create your
                personalized tattoo design.
              </p>

              <div className="flex justify-center mt-8">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white">
                    Go to Dashboard <Icons.arrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
