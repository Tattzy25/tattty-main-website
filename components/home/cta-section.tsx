"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-black to-purple-900/30"></div>
      <div className="container relative z-10 text-center px-4 sm:px-6 lg:px-8 mx-auto">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
          Ready to Transform Your Story Into Art?
        </h2>
        <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-8">
          Create a tattoo that's as unique as your journey. Start with just 4 questions.
        </p>
        <Link href="/sign-in">
          <Button
            size="lg"
            className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white shadow-lg shadow-red-500/20"
          >
            Let's Ink Your Journey <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-purple-600/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative rounded-lg overflow-hidden border border-zinc-800">
                <Image
                  key={i}
                  src={`/placeholder-example.png?height=150&width=150&text=Example${i + 1}`}
                  alt={`Example tattoo ${i + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}