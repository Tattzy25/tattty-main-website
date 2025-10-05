"use client"

import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/ui/glass-card"
import Image from "next/image"
import type { ImageObject } from "@/components/image-gallery"
import { TimelineBall } from "./TimelineBall"

interface SummaryDisplayProps {
  sentMessages: string[]
  selectedImages: { [key: string]: ImageObject[] }
  cardData: Array<{
    icon: any
    title: string
    subtitle: string
    options: string[]
  }>
}

export function SummaryDisplay({ 
  sentMessages,
  selectedImages, 
  cardData 
}: SummaryDisplayProps) {
  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar p-6 relative">
      {/* Top Fade Overlay */}
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-20"></div>
      
      {/* Header */}
      <div className="text-center mb-8 relative z-10" style={{ paddingTop: '75px' }}>
        <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Rock Salt', cursive" }}>
          Your skin. Your ink.{' '}
          <span className="whitespace-nowrap">Your rules.</span>
        </h2>
      </div>

      <div className="space-y-8 relative ml-8">
        {/* Questions 1-6 Summary Cards */}
        {cardData.map((card, index) => {
          const message = sentMessages[index]
          
          if (!message) return null

          const IconComponent = card.icon

          return (
            <div key={index} className="relative">
              <TimelineBall />
              
              <GlassCard className="rounded-2xl">
                <GlassCardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-medium text-white">{card.subtitle}</p>
                  </div>
                </GlassCardHeader>
                <GlassCardContent className="pt-2">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {message}
                  </p>
                </GlassCardContent>
              </GlassCard>
            </div>
          )
        })}

        {/* Card 7a - Style + Color */}
        {(selectedImages.style?.length > 0 || selectedImages.color?.length > 0) && (
          <div className="relative">
            <TimelineBall />
            
            <GlassCard className="rounded-2xl">
              <GlassCardHeader className="pb-2">
                <p className="text-sm font-medium text-white" style={{ fontFamily: "'Rock Salt', cursive" }}>Visual Style</p>
              </GlassCardHeader>
              <GlassCardContent className="pt-2 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Style Image */}
                  {selectedImages.style?.[0] && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-2">Style</p>
                      <div className="relative aspect-square rounded-2xl overflow-hidden border border-orange-500/30">
                        <Image
                          src={selectedImages.style[0].url}
                          alt={selectedImages.style[0].label}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-2">
                          <p className="text-xs text-white font-medium">{selectedImages.style[0].label}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Color Image */}
                  {selectedImages.color?.[0] && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-2">Color</p>
                      <div className="relative aspect-square rounded-2xl overflow-hidden border border-purple-600/30">
                        <Image
                          src={selectedImages.color[0].url}
                          alt={selectedImages.color[0].label}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-2">
                          <p className="text-xs text-white font-medium">{selectedImages.color[0].label}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card 7 Text Response (if any) - FIX: Now showing properly */}
                {sentMessages[cardData.length] && (
                  <div className="pt-3 border-t border-gray-800">
                    <p className="text-xs font-medium text-gray-400 mb-2">Additional Notes</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {sentMessages[cardData.length]}
                    </p>
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>
          </div>
        )}

        {/* Card 7b - Size + Placement */}
        {(selectedImages.size?.length > 0 || selectedImages.placement?.length > 0) && (
          <div className="relative">
            <TimelineBall />
            
            <GlassCard className="rounded-2xl">
              <GlassCardHeader className="pb-2">
                <p className="text-sm font-medium text-white" style={{ fontFamily: "'Rock Salt', cursive" }}>Size & Placement</p>
              </GlassCardHeader>
              <GlassCardContent className="pt-2">
                <div className="grid grid-cols-2 gap-3">
                  {/* Size Images */}
                  {selectedImages.size?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-2">Size</p>
                      <div className="space-y-2">
                        {selectedImages.size.slice(0, 2).map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-orange-500/30">
                            <Image
                              src={img.url}
                              alt={img.label}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-1.5">
                              <p className="text-xs text-white font-medium">{img.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Placement Images */}
                  {selectedImages.placement?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-2">Placement</p>
                      <div className="space-y-2">
                        {selectedImages.placement.slice(0, 2).map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-purple-600/30">
                            <Image
                              src={img.url}
                              alt={img.label}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-1.5">
                              <p className="text-xs text-white font-medium">{img.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>
        )}

        {/* Card 8 - Final Question (shows after user answers) */}
        {sentMessages[cardData.length + 1] && (
          <div className="relative">
            <TimelineBall />
            
            <GlassCard className="rounded-2xl">
              <GlassCardHeader className="pb-2">
                <p className="text-sm font-medium text-white" style={{ fontFamily: "'Rock Salt', cursive" }}>Final Thoughts</p>
              </GlassCardHeader>
              <GlassCardContent className="pt-2">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {sentMessages[cardData.length + 1]}
                </p>
              </GlassCardContent>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Bottom Padding */}
      <div style={{ paddingBottom: '75px' }}></div>
    </div>
  )
}
