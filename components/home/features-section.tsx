"use client"

import { Brain, Feather, Compass, Heart, Skull, Zap } from "lucide-react"
import { SectionTitle } from "@/components/ui/section-title"

const features = [
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
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-900"></div>
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-16">
          <SectionTitle>The Tattty Difference</SectionTitle>
          <p className="text-zinc-300 max-w-2xl mx-auto">What makes our AI tattoo generation truly legendary</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
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
  )
}