"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  MessageSquare,
  Download,
  Zap,
  Heart,
  Skull,
  Compass,
  Feather,
  Brain,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import MainLayout from "@/components/main-layout"

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
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
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
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
            <Link href="/tattoo-generator">
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

      {/* How It Works */}
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
                      unoptimized={true}
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
                      unoptimized={true}
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
                      unoptimized={true}
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
                      unoptimized={true}
                    />
                  </div>

                  {/* Connection Point */}
                  <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-amber-500 hidden md:block"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/sign-in">
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

      {/* Testimonials Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
              Ink That Speaks
            </h2>
            <p className="text-zinc-300 max-w-2xl mx-auto">
              Don't just take our word for it. Hear from those who've already transformed their stories.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
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
            ].map((testimonial, i) => (
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

      {/* Featured Artists Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-900"></div>
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
              Tattty's Featured Artists
            </h2>
            <p className="text-zinc-300 max-w-2xl mx-auto">
              Our AI is trained on the work of legendary tattoo artists who bring your designs to life
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                name: "Raven Ink",
                specialty: "Neo-Traditional",
                location: "Miami",
                image: "/images/artist-1.png",
              },
              {
                name: "Blade",
                specialty: "Blackwork",
                location: "Berlin",
                image: "/images/artist-2.png",
              },
              {
                name: "Luna Mori",
                specialty: "Japanese",
                location: "Tokyo",
                image: "/images/artist-3.png",
              },
              {
                name: "Vex",
                specialty: "Realism",
                location: "Los Angeles",
                image: "/images/artist-4.png",
              },
            ].map((artist, i) => (
              <div key={i} className="relative group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 via-amber-500/30 to-purple-600/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative overflow-hidden rounded-xl">
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      width={300}
                      height={300}
                      priority={i < 2}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-xl font-bold text-white">{artist.name}</h3>
                    <p className="text-amber-400">{artist.specialty}</p>
                    <p className="text-zinc-400 text-sm">{artist.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              View All Artists
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Styles Section */}
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
            {[
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
            ].map((style, i) => (
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

      {/* Social Proof Counter Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-900"></div>
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                count: "50k+",
                label: "Tattoos Generated",
                icon: <Zap className="h-8 w-8 text-amber-500" />,
              },
              {
                count: "12k+",
                label: "Inked Stories",
                icon: <Feather className="h-8 w-8 text-amber-500" />,
              },
              {
                count: "98%",
                label: "Satisfaction Rate",
                icon: <Heart className="h-8 w-8 text-amber-500" />,
              },
              {
                count: "24/7",
                label: "Creative Support",
                icon: <MessageSquare className="h-8 w-8 text-amber-500" />,
              },
            ].map((stat, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-purple-600/20 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-zinc-900/80 backdrop-blur-sm p-6 rounded-xl border border-zinc-800 h-full text-center transition-transform duration-300 hover:-translate-y-2">
                  <div className="flex justify-center mb-4">{stat.icon}</div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.count}</h3>
                  <p className="text-zinc-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-900"></div>
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
              The Tattty Difference
            </h2>
            <p className="text-zinc-300 max-w-2xl mx-auto">What makes our AI tattoo generation truly legendary</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Narrative Intelligence",
                desc: "Our AI doesn't just create images—it understands the emotional weight and symbolism in your life story.",
                icon: <Brain className="h-6 w-6 text-white" />,
                gradient: "from-red-500 to-amber-500",
              },
              {
                title: "Artistic Mastery",
                desc: "Trained on thousands of tattoo styles from traditional to avant-garde, creating designs that honor tattoo artistry.",
                icon: <Feather className="h-6 w-6 text-white" />,
                gradient: "from-amber-500 to-yellow-500",
              },
              {
                title: "Symbolic Precision",
                desc: "Identifies and incorporates meaningful symbols that represent the key elements of your personal journey.",
                icon: <Compass className="h-6 w-6 text-white" />,
                gradient: "from-yellow-500 to-green-500",
              },
              {
                title: "Emotional Resonance",
                desc: "Creates designs that evoke the specific emotions and feelings you want your tattoo to represent.",
                icon: <Heart className="h-6 w-6 text-white" />,
                gradient: "from-green-500 to-blue-500",
              },
              {
                title: "Cultural Awareness",
                desc: "Respects the rich history and cultural significance of tattoo traditions from around the world.",
                icon: <Skull className="h-6 w-6 text-white" />,
                gradient: "from-blue-500 to-purple-500",
              },
              {
                title: "Technical Precision",
                desc: "Designs optimized for actual tattooing, with clean lines and appropriate detail levels for your chosen placement.",
                icon: <Zap className="h-6 w-6 text-white" />,
                gradient: "from-purple-500 to-red-500",
              },
            ].map((feature, i) => (
              <div key={i} className="relative group">
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300`}
                ></div>
                <div className="relative bg-zinc-900/80 backdrop-blur-sm p-6 rounded-xl border border-zinc-800 h-full">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-zinc-300">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
    </MainLayout>
  )
}
