"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, MessageSquare, Zap, Feather, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-900"></div>
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
            How Tattty Works
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            From your life story to a unique tattoo design in just a few simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-amber-500 to-purple-600 hidden md:block transform -translate-x-1/2"></div>

          <div className="space-y-24 relative">
            {/* Step 1: Share Your Story */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Share Your Story</h3>
                </div>
                <p className="text-zinc-300 text-lg">
                  Answer 4 real questions about your life, your moments, and what matters most.
                </p>
              </div>

              <div className="md:w-1/2 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-purple-600/20 rounded-lg blur-xl"></div>
                <div className="relative rounded-lg overflow-hidden border border-zinc-800 shadow-2xl w-full max-w-[500px] h-[300px] sm:h-[400px] md:h-[500px] mx-auto">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tattty.com%20image%201-nUHs3ZRW5vE9d4dbcX6ValFHoJ0UWz.png"
                    alt="Share Your Story"
                    fill
                    priority={true}
                    className="object-cover transition-all duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  />
                </div>

                {/* Connection Point */}
                <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-amber-500 hidden md:block"></div>
              </div>
            </div>

            {/* Step 2: AI Creates Your Design */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">AI Creates Your Design</h3>
                </div>
                <p className="text-zinc-300 text-lg">
                  Our advanced AI analyzes your story, identifying meaningful symbols and elements to create a
                  personalized tattoo concept.
                </p>
              </div>

              <div className="md:w-1/2 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-purple-600/20 rounded-lg blur-xl"></div>
                <div className="relative rounded-lg overflow-hidden border border-zinc-800 shadow-2xl w-full max-w-[500px] h-[300px] sm:h-[400px] md:h-[500px] mx-auto">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tattty.com%20image%202-DhZDiut5rg1eKnq31WHQJP8gjLrQyv.png"
                    alt="AI Creates Your Design"
                    fill
                    priority={true}
                    className="object-cover transition-all duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  />
                </div>

                {/* Connection Point */}
                <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-amber-500 hidden md:block"></div>
              </div>
            </div>

            {/* Step 3: Refine Your Tattoo */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center">
                    <Feather className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Refine Your Tattoo</h3>
                </div>
                <p className="text-zinc-300 text-lg">
                  Review your custom design and request adjustments until it perfectly captures the essence of your
                  story.
                </p>
              </div>

              <div className="md:w-1/2 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-purple-600/20 rounded-lg blur-xl"></div>
                <div className="relative rounded-lg overflow-hidden border border-zinc-800 shadow-2xl w-full max-w-[500px] h-[300px] sm:h-[400px] md:h-[500px] mx-auto">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tattty.com%20image%203-n2rnMJEJ39bAkQO5JThQ6vtZJDcFYJ.png"
                    alt="Refine Your Tattoo"
                    fill
                    priority={true}
                    className="object-cover transition-all duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  />
                </div>

                {/* Connection Point */}
                <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-amber-500 hidden md:block"></div>
              </div>
            </div>

            {/* Step 4: Bring Your Tattoo to Life */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Bring Your Tattoo to Life</h3>
                </div>
                <p className="text-zinc-300 text-lg">
                  Download your design in high resolution, ready to share with your tattoo artist and bring to life on
                  your skin.
                </p>
              </div>

              <div className="md:w-1/2 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-purple-600/20 rounded-lg blur-xl"></div>
                <div className="relative rounded-lg overflow-hidden border border-zinc-800 shadow-2xl w-full max-w-[500px] h-[300px] sm:h-[400px] md:h-[500px] mx-auto">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tattty.com%20image%204%20welcome%20to%20tatttys%20number%204-XbpOD1acqB0kmDAuhUGgrwuQpYul86.png"
                    alt="Bring Your Tattoo to Life"
                    fill
                    priority={true}
                    className="object-cover transition-all duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  />
                </div>

                {/* Connection Point */}
                <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-amber-500 hidden md:block"></div>
              </div>
            </div>
          </div>
        </div>

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