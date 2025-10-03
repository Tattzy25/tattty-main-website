"use client"

import Image from "next/image"

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
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
            Most Requested Styles
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            Explore the tattoo styles our users are obsessed with right now
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tattooStyles.map((style, i) => (
            <div key={i} className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-purple-600/20 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative h-full rounded-xl overflow-hidden">
                <div className="aspect-[3/4] overflow-hidden">
                  <Image
                    src={style.image || "/placeholder.svg"}
                    alt={style.style}
                    width={300}
                    height={400}
                    priority={i < 3}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6">
                  <div className="absolute top-4 right-4 bg-amber-500 text-black font-bold px-2 py-1 rounded-full text-sm flex items-center">
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
                  <h3 className="text-2xl font-bold text-white mb-2">{style.style}</h3>
                  <p className="text-zinc-300">{style.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}