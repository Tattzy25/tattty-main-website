"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface TattooStyleSelectorProps {
  onSelect: (style: string) => void
}

export function TattooStyleSelector({ onSelect }: TattooStyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)

  const styles = [
    { name: "Traditional", image: "/images/tattoo-style-1.png" },
    { name: "Neo-Traditional", image: "/images/tattoo-style-2.png" },
    { name: "Blackwork", image: "/images/tattoo-style-3.png" },
    { name: "Minimalist", image: "/images/tattoo-style-4.png" },
    { name: "Japanese", image: "/images/tattoo-style-5.png" },
    { name: "Geometric", image: "/images/tattoo-style-6.png" },
  ]

  const handleSelect = (style: string) => {
    setSelectedStyle(style)
    onSelect(style)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {styles.map((style) => (
          <div
            key={style.name}
            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
              selectedStyle === style.name
                ? "border-amber-500 ring-2 ring-amber-500/50"
                : "border-zinc-700 hover:border-zinc-500"
            }`}
            onClick={() => handleSelect(style.name)}
          >
            <div className="aspect-square relative">
              <Image src={style.image || "/placeholder.svg"} alt={style.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-2">
                <span className="text-white font-medium">{style.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedStyle && (
        <div className="flex justify-center">
          <Button
            className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
            onClick={() => onSelect(selectedStyle)}
          >
            Confirm {selectedStyle} Style
          </Button>
        </div>
      )}
    </div>
  )
}
