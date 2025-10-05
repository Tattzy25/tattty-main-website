"use client"

import Image from "next/image"
import { SectionTitle } from "@/components/ui/section-title"

const tattooStyles = [
  {
    style: "Neo-Traditional",
    votes: "4.2k",
    image: "/images/tattoo-style-1.png",
    description: "Bold lines with a modern twist on traditional imagery",
  },
  {
    style: "Blackwork",
    votes: "3.8k",
    image: "/images/tattoo-style-2.png",
    description: "Striking black ink designs with strong contrast and patterns",
  },
  {
    style: "Watercolor",
    votes: "3.5k",
    image: "/images/tattoo-style-3.png",
    description: "Vibrant, flowing designs that mimic watercolor paintings",
  },
  {
    style: "Minimalist",
    votes: "3.1k",
    image: "/images/tattoo-style-4.png",
    description: "Simple, clean designs with powerful meaning",
  },
  {
    style: "Japanese",
    votes: "2.9k",
    image: "/images/tattoo-style-5.png",
    description: "Traditional Irezumi with mythological themes and bold colors",
  },
  {
    style: "Geometric",
    votes: "2.7k",
    image: "/images/tattoo-style-6.png",
    description: "Precise patterns and shapes creating mesmerizing designs",
  },
]

export function TattooStylesSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-16">
          <SectionTitle>Most Requested Styles</SectionTitle>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            Explore the tattoo styles our users are obsessed with right now
          </p>
        </div>

        {/* Modern Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tattooStyles.map((style, i) => (
            <div
              key={i}
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
                    src={style.image || "/placeholder.svg"}
                    alt={style.style}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Votes badge */}
                  <div className="absolute top-3 right-3 bg-amber-500 text-black font-bold px-3 py-1 rounded-full text-sm flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    {style.votes}
                  </div>
                </div>
              </div>
              
              {/* Info Section - Bottom card with title only */}
              <div className="px-6 pb-6 pt-1">
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-300" style={{ fontFamily: "'Rock Salt', cursive" }}>
                  {style.style}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}