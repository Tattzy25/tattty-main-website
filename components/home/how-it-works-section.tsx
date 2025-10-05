"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, MessageSquare, Zap, Feather, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionTitle } from "@/components/ui/section-title"

const steps = [
  {
    id: 1,
    icon: MessageSquare,
    title: "Share Your Story",
    description: "Answer 4 real questions about your life, your moments, and what matters most.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tattty.com%20image%201-nUHs3ZRW5vE9d4dbcX6ValFHoJ0UWz.png"
  },
  {
    id: 2,
    icon: Zap,
    title: "AI Creates Your Design",
    description: "Our advanced AI analyzes your story, identifying meaningful symbols and elements to create a personalized tattoo concept.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tattty.com%20image%202-DhZDiut5rg1eKnq31WHQJP8gjLrQyv.png"
  },
  {
    id: 3,
    icon: Feather,
    title: "Refine Your Tattoo",
    description: "Review your custom design and request adjustments until it perfectly captures the essence of your story.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tattty.com%20image%203-n2rnMJEJ39bAkQO5JThQ6vtZJDcFYJ.png"
  },
  {
    id: 4,
    icon: Download,
    title: "Bring Your Tattoo to Life",
    description: "Download your design in high resolution, ready to share with your tattoo artist and bring to life on your skin.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tattty.com%20image%204%20welcome%20to%20tatttys%20number%204-XbpOD1acqB0kmDAuhUGgrwuQpYul86.png"
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-900"></div>
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-16">
          <SectionTitle>How Tattty Works</SectionTitle>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            From your life story to a unique tattoo design in just a few simple steps
          </p>
        </div>

        {/* Modern Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.id}
                className="rounded-[2rem] overflow-hidden border border-white/10 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-[1.02] transition-all duration-300 group"
                style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }}
              >
                {/* Image Section */}
                <div className="relative aspect-square p-3">
                  <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                {/* Info Section - Bottom card */}
                <div className="px-6 pb-6 pt-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-300 mb-2" style={{ fontFamily: "'Rock Salt', cursive" }}>
                    {step.title}
                  </h3>
                  
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <Link href="/inked">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white shadow-lg shadow-red-500/20"
            >
              Start Your Journey <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}