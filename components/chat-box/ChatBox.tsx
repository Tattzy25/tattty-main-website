"use client"

import Image from "next/image"
import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/ui/glass-card"
import { GlassTextarea } from "@/components/ui/glass-textarea"
import { Button } from "@/components/ui/button"
import { BadgeSelector } from "@/components/badge-selector"
import { ArrowLeft, ArrowRight, Mic, Send, SkipForward, ImageIcon, X, Sparkles } from "lucide-react"
import { type ImageObject } from "@/components/image-gallery"
import { useRef } from "react"

interface ChatBoxProps {
  // State
  currentStep: number
  currentCard: any
  isCard7: boolean
  isCard8: boolean
  isContentFading: boolean
  sentMessages: string[]
  showMessageAnimation: boolean
  selectedStyleImages: {[key: string]: ImageObject[]} | ImageObject[]  // Accept both old and new format
  responses: string[]
  selectedOptions: number[]
  isListening: boolean
  cardData: any[]
  card7Data: any
  uploadedImages: File[]
  
  // Handlers
  handleResponseChange: (value: string) => void
  handleSendMessage: () => void
  handleSpeechToText: () => void
  handleOptionClick: (option: string, index: number) => void
  handlePrevious: () => void
  handleSkip: () => void
  handleNext: () => void
  handleImageUpload: (file: File) => void
  handleRemoveUploadedImage: (index: number) => void
}

export function ChatBox({
  currentStep,
  currentCard,
  isCard7,
  isCard8,
  isContentFading,
  sentMessages,
  showMessageAnimation,
  selectedStyleImages,
  responses,
  selectedOptions,
  isListening,
  cardData,
  card7Data,
  uploadedImages,
  handleResponseChange,
  handleSendMessage,
  handleSpeechToText,
  handleOptionClick,
  handlePrevious,
  handleSkip,
  handleNext,
  handleImageUpload,
  handleRemoveUploadedImage
}: ChatBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    }
  }

  return (
    <div className="w-full lg:w-[55%] flex items-start justify-center p-4 pt-8 lg:pl-8 lg:pr-8 lg:pt-12 transition-all duration-500">
      <GlassCard size="xl" className="relative max-w-2xl w-full rounded-[2.5rem]" style={{
        boxShadow: '0 25px 50px rgba(139, 92, 246, 0.4), 0 15px 30px rgba(0, 0, 0, 0.6), 0 35px 70px rgba(138, 43, 226, 0.3)'
      }}>

        <GlassCardHeader className={`text-center space-y-4 pb-8 transition-opacity duration-300 ${
          isContentFading ? 'opacity-0' : 'opacity-100'
        }`}>
          
          <div className="space-y-3">
            {/* AI-style text bubble for the question - Responsive */}
            {!isCard7 ? (
              // Questions 1-6: Single question bubble
              <div className="relative w-fit max-w-[90%] sm:max-w-md ml-2 sm:ml-4 mt-4">
                {/* Outer gradient border container */}
                <div className="p-[2px] bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl">
                  <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-2 sm:px-3 py-1 sm:py-2 relative">
                    <p className="text-white font-medium text-sm sm:text-base lg:text-lg">
                      {currentCard?.subtitle}
                    </p>
                  </div>
                </div>
                {/* Chat bubble tail - positioned at bottom left edge */}
                <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-orange-500"></div>
              </div>
            ) : (
              // Card 7: Four question bubbles in a horizontal row
              <div className="flex flex-wrap gap-2 ml-2 sm:ml-4 mt-4">
                {/* Style question */}
                <div className="relative w-fit">
                  <div className="p-[2px] bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-3 py-2 relative">
                      <p className="text-white font-medium text-sm lg:text-base">
                        Style
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-orange-500"></div>
                </div>

                {/* Color question */}
                <div className="relative w-fit">
                  <div className="p-[2px] bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-3 py-2 relative">
                      <p className="text-white font-medium text-sm lg:text-base">
                        Color
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-orange-500"></div>
                </div>

                {/* Size question */}
                <div className="relative w-fit">
                  <div className="p-[2px] bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-3 py-2 relative">
                      <p className="text-white font-medium text-sm lg:text-base">
                        Size
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-orange-500"></div>
                </div>

                {/* Placement question */}
                <div className="relative w-fit">
                  <div className="p-[2px] bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-3 py-2 relative">
                      <p className="text-white font-medium text-sm lg:text-base">
                        Placement
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-orange-500"></div>
                </div>
              </div>
            )}

            {/* User's sent message bubble - Responsive with slide-in animation */}
            {sentMessages[currentStep] && (
              <div className={`relative w-fit max-w-[90%] sm:max-w-md ml-auto mr-2 sm:mr-4 mt-6 transition-all duration-500 ${
                showMessageAnimation ? 'animate-slide-in-up opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}>
                <div className="p-[2px] bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-2 sm:px-3 py-1 sm:py-2 relative">
                    <p className="text-white font-medium text-sm sm:text-base">
                      {sentMessages[currentStep]}
                    </p>
                  </div>
                </div>
                {/* User bubble tail - positioned at bottom right edge */}
                <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-green-500"></div>
              </div>
            )}

            {/* Show thumbnails for Card 7 selections - INSIDE CHAT CARD */}
            {isCard7 && typeof selectedStyleImages === 'object' && !Array.isArray(selectedStyleImages) && (
              <div className="mt-8 space-y-3">
                <p className="text-sm text-muted-foreground font-semibold ml-2">Your Selections:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-2">
                  {Object.entries(selectedStyleImages).map(([category, images]) => 
                    images.map((image: ImageObject, idx: number) => (
                      <div key={`${category}-${idx}`} className="relative aspect-square">
                        <Image 
                          src={image.url} 
                          alt={`${category} - ${image.label}`} 
                          fill
                          className="object-cover rounded-xl border-2 border-orange-500 shadow-md" 
                          unoptimized 
                        />
                        <span className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md capitalize">{category}</span>
                        <span className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">{image.label}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </GlassCardHeader>
        
        <GlassCardContent className={`space-y-4 pt-6 transition-opacity duration-300 ${
          isContentFading ? 'opacity-0' : 'opacity-100'
        }`}>
          {/* Preset Options - Hidden for Card 7 and Card 8, shown for Q1-6 */}
          {!isCard7 && !isCard8 && (
            <div className="space-y-2">
              <BadgeSelector
                options={currentCard?.options || []}
                selectedIndices={selectedOptions}
                onOptionClick={handleOptionClick}
                label="Select all that apply:"
              />
            </div>
          )}

          {/* Card 8 - Uploaded Images Preview */}
          {isCard8 && uploadedImages.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-semibold">Reference Images:</p>
              <div className="grid grid-cols-3 gap-2">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover rounded-lg border-2 border-purple-500"
                    />
                    <button
                      onClick={() => handleRemoveUploadedImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                      aria-label="Remove uploaded image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Field with Image Upload (Card 8), Microphone and Send Button */}
          <div className="relative">
            <GlassTextarea
              value={responses[currentStep]}
              onChange={(e) => handleResponseChange(e.target.value)}
              placeholder={isCard7 ? card7Data?.placeholder : currentCard?.placeholder}
              className={`min-h-20 sm:min-h-24 text-sm sm:text-base ${isCard8 ? 'pr-24 sm:pr-28' : 'pr-16 sm:pr-20'}`}
            />
            
            {/* Card 8 - Image Upload Button (left of microphone) */}
            {isCard8 && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  title="Upload reference image"
                  aria-label="Upload reference image"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute bottom-1 right-20 sm:right-28 bg-transparent hover:bg-white/10 text-purple-400 hover:text-purple-300 px-1.5 sm:px-2 py-1 h-7 sm:h-8 flex items-center gap-1 transition-all duration-200"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload reference image"
                >
                  <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </>
            )}
            
            {/* Microphone Button */}
            <Button
              size="sm"
              variant="ghost"
              className={`absolute bottom-1 right-14 sm:right-20 bg-transparent hover:bg-white/10 text-white px-1.5 sm:px-2 py-1 h-7 sm:h-8 flex items-center gap-1 transition-all duration-200 ${
                isListening ? 'bg-red-500/20 text-red-400' : ''
              }`}
              onClick={handleSpeechToText}
              disabled={isListening}
              aria-label="Voice input"
            >
              <Mic className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
            {/* Send Button */}
            <Button
              size="sm"
              variant="ghost"
              className="absolute bottom-1 right-1 bg-transparent hover:bg-white/10 text-white px-2 sm:px-3 py-1 h-7 sm:h-8 flex items-center gap-1"
              onClick={handleSendMessage}
              disabled={!responses[currentStep]?.trim()}
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Send</span>
            </Button>
          </div>
          
          {/* Progress Indicator - Shown for all cards including Card 7 and Card 8 */}
          <div className="flex justify-center space-x-2 py-2">
            {cardData.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-orange-500 w-6' 
                    : index < currentStep 
                      ? 'bg-orange-300' 
                      : 'bg-muted-foreground/30'
                }`}
              />
            ))}
            {/* Card 7 indicator */}
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentStep === cardData.length
                  ? 'bg-orange-500 w-6'
                  : currentStep > cardData.length
                    ? 'bg-orange-300'
                    : 'bg-muted-foreground/30'
              }`}
            />
            {/* Card 8 indicator */}
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentStep === cardData.length + 1
                  ? 'bg-orange-500 w-6'
                  : currentStep > cardData.length + 1
                    ? 'bg-orange-300'
                    : 'bg-muted-foreground/30'
              }`}
            />
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="ghost" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 hover:bg-muted/50 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button 
              variant="ghost"
              onClick={handleSkip}
              className="flex items-center gap-2 hover:bg-muted/50 text-white/70 hover:text-orange-400 transition-colors"
            >
              Skip
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button 
              onClick={handleNext}
              disabled={
                isCard7 
                  ? // For Card 7: require Style AND Color to be selected
                    !(typeof selectedStyleImages === 'object' && 
                      !Array.isArray(selectedStyleImages) && 
                      selectedStyleImages.style?.length > 0 && 
                      selectedStyleImages.color?.length > 0)
                  : isCard8
                    ? // For Card 8: always enabled (it's optional, "Build" button)
                      false
                    : // For Questions 1-6: require sent message
                      !sentMessages[currentStep]
              }
              className={`flex items-center gap-2 disabled:opacity-50 transition-all duration-200 ${
                (isCard7 
                  ? (typeof selectedStyleImages === 'object' && 
                     !Array.isArray(selectedStyleImages) && 
                     selectedStyleImages.style?.length > 0 && 
                     selectedStyleImages.color?.length > 0)
                  : isCard8 
                    ? true  // Card 8 is always ready
                    : sentMessages[currentStep]
                )
                  ? isCard8
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 transform scale-105 animate-pulse'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg transform scale-105'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {isCard8 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Build
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
