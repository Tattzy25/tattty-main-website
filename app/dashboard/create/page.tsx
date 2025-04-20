"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { DashboardLayout } from "@/components/dashboard/layout"

export default function TattooDesignPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateDesign = () => {
    setIsGenerating(true)

    // Simulate design generation
    setTimeout(() => {
      toast({
        title: "Coming Soon",
        description: "The tattoo design generator is currently under development.",
      })
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gold-500">Create Your Tattoo</h1>
          <Button
            variant="outline"
            className="border-gold-500/30 hover:bg-gold-500/10"
            onClick={() => router.push("/dashboard")}
          >
            <Icons.arrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        <Card className="border-gold-500/20 bg-black/40">
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              <Icons.image className="h-16 w-16 text-gold-500/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gold-500">Design Your Unique Tattoo</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Share your story and let our AI create a personalized tattoo design that represents your journey.
              </p>

              <div className="grid gap-4 max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                    1
                  </div>
                  <p className="text-sm text-muted-foreground text-left">Tell us about your life experiences</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                    2
                  </div>
                  <p className="text-sm text-muted-foreground text-left">Share meaningful symbols and elements</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                    3
                  </div>
                  <p className="text-sm text-muted-foreground text-left">Choose your preferred style and placement</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                    4
                  </div>
                  <p className="text-sm text-muted-foreground text-left">Receive your personalized tattoo design</p>
                </div>
              </div>

              <Button
                onClick={handleGenerateDesign}
                className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white mt-4"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Icons.image className="mr-2 h-4 w-4" /> Start Creating
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground">Coming soon! This feature is currently under development.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
