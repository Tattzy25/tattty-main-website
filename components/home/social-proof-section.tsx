"use client"

import { Zap, Feather, Heart, MessageSquare } from "lucide-react"

const stats = [
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
]

export function SocialProofSection() {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-900"></div>
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
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
  )
}