"use client"

import Image from "next/image"
import { Download, Mail, Heart } from "lucide-react"

interface ModernImageCardProps {
  imageUrl: string
  imageAlt: string
  title: string
  onDownload?: () => void
  onEmail?: () => void
  onSave?: () => void
}

export function ModernImageCard({
  imageUrl,
  imageAlt,
  title,
  onDownload,
  onEmail,
  onSave
}: ModernImageCardProps) {
  return (
    <div 
      className="bg-black/90 backdrop-blur-md rounded-[2rem] overflow-hidden border border-white/10 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-[1.02] transition-all duration-300 group"
    >
      {/* Image Section - Rounded at top */}
      <div className="relative aspect-square p-3">
        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            unoptimized
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      
      {/* Info Section - Bottom card */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors duration-300">
            {title}
          </h3>
          
          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {onDownload && (
              <button
                onClick={onDownload}
                className="text-white/60 hover:text-green-400 hover:scale-110 transition-all duration-200"
                title="Download"
                aria-label="Download image"
              >
                <Download className="w-6 h-6" />
              </button>
            )}
            {onEmail && (
              <button
                onClick={onEmail}
                className="text-white/60 hover:text-blue-400 hover:scale-110 transition-all duration-200"
                title="Email"
                aria-label="Email image"
              >
                <Mail className="w-6 h-6" />
              </button>
            )}
            {onSave && (
              <button
                onClick={onSave}
                className="text-white/60 hover:text-red-500 hover:scale-110 transition-all duration-200"
                title="Save to Community"
                aria-label="Save to community"
              >
                <Heart className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
