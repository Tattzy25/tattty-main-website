"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TattooGenerator } from "@/components/tattoo-generator/tattoo-generator"
import MainLayout from "@/components/main-layout"
import { Icons } from "@/components/icons"

export default function TattooGeneratorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)

  // Simulate authentication check
  useEffect(() => {
    // In a real app, this would check the user's session
    const checkAuth = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll consider the user authenticated
      // In a real app, this would check the actual auth state
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleGeneratorToggle = (open: boolean) => {
    setIsGeneratorOpen(open)
    // Focus management is handled in the TattooGenerator component
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="py-24 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Icons.spinner className="h-12 w-12 animate-spin text-gold-500" />
            <p className="text-gold-300">Loading your experience...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="py-24 flex items-center justify-center min-h-screen">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 max-w-md mx-auto text-center">
            <Icons.lock className="h-12 w-12 text-gold-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-zinc-300 mb-6">You need to be logged in to access the Tattoo Generator.</p>
            <button
              onClick={() => router.push("/sign-in")}
              className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white px-6 py-2 rounded-md"
            >
              Sign In
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout open={isGeneratorOpen}>
      <TattooGenerator onOpenChange={handleGeneratorToggle} />
    </MainLayout>
  )
}
