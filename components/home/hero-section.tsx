"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <Image
            src="/placeholder.svg?height=1080&width=1920&text=TattooBackground"
            alt="Tattoo background"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ fontFamily: 'Audiowide, sans-serif' }}>
          <span className="block mb-2">This Isn't Just a Tattoo.</span>
          <span className="bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
            It's a Fucking Statement.
          </span>
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl text-zinc-300 max-w-2xl mx-auto mb-12">
          We're not here to decorate your skin.
          <br />
          We're here to translate your story.
        </p>

        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative w-full max-w-3xl mx-auto">
            {/* Timeline */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-amber-500 to-purple-600 transform -translate-y-1/2"></div>

            {/* Timeline Points */}
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black border-2 border-red-500 z-10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
                <span className="text-sm mt-2 text-zinc-400">your story</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black border-2 border-amber-400 z-10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                </div>
                <span className="text-sm mt-2 text-zinc-400">your pain</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black border-2 border-amber-500 z-10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                </div>
                <span className="text-sm mt-2 text-zinc-400">your power</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black border-2 border-purple-600 z-10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                </div>
                <span className="text-sm mt-2 text-zinc-400">into ink</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500 mr-2">
              <span className="text-white text-xs">✕</span>
            </div>
            <span className="text-zinc-300">No filters.</span>
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500 mr-2">
              <span className="text-white text-xs">✕</span>
            </div>
            <span className="text-zinc-300">No judgment.</span>
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-500 mr-2">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-zinc-300">Just truth.</span>
          </div>
        </div>

        <p className="text-zinc-400 text-xl mb-8">
          Answer four questions and Tattty will handle the rest for you ...
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/inked">
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-0 shadow-lg shadow-red-500/20 px-8 py-6 text-xl overflow-hidden group w-full sm:w-auto"
            >
              <span className="relative z-10">Start My Ink Journey</span>
              <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white px-8 py-6 text-xl w-full sm:w-auto"
            onClick={() => {
              const howItWorksSection = document.getElementById("how-it-works")
              if (howItWorksSection) {
                howItWorksSection.scrollIntoView({ behavior: "smooth" })
              }
            }}
          >
            <span>Learn More</span>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronRight className="h-8 w-8 text-zinc-500 rotate-90" />
      </div>
    </section>
  )
}