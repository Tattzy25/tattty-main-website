"use client"

import Image from "next/image"
import { SectionTitle } from "@/components/ui/section-title"

const testimonials = [
  {
    quote:
      "My tattoo isn't just ink—it's my life story captured in art. Tattty understood what I couldn't even put into words.",
    author: "Alex K.",
    location: "New York",
    image: "/images/testimonial-1.png",
  },
  {
    quote:
      "I've been trying to design my perfect tattoo for years. Tattty did it in minutes. My artist was blown away by the design.",
    author: "Mia J.",
    location: "Los Angeles",
    image: "/images/testimonial-2.png",
  },
  {
    quote:
      "The AI somehow captured exactly what was in my head. It's like it read my mind and translated it into the perfect design.",
    author: "Jamal T.",
    location: "Chicago",
    image: "/images/testimonial-3.png",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-16">
          <SectionTitle>Ink That Speaks</SectionTitle>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from those who've already transformed their stories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-purple-600/20 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-zinc-900/80 backdrop-blur-sm p-8 rounded-xl border border-zinc-800 h-full transition-transform duration-300 hover:-translate-y-2">
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <svg className="h-8 w-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-zinc-300 mb-6 flex-grow">{testimonial.quote}</p>
                  <div className="flex items-center mt-auto">
                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full border-2 border-amber-500">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-white">{testimonial.author}</p>
                      <p className="text-zinc-400 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}