"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CustomizationOptionsProps {
  onSubmit: (customizations: Record<string, string>) => void
  isVoiceMode: boolean
  speak: (text: string) => void
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
}

// Define the customization options
const customizationOptions = {
  style: [
    "Traditional",
    "Neo-Traditional",
    "Realism",
    "Watercolor",
    "Tribal",
    "Japanese",
    "Blackwork",
    "Minimalist",
    "Geometric",
    "Dotwork",
    "Old School",
    "New School",
    "Biomechanical",
    "Portrait",
    "Script",
    "Abstract",
  ],
  colorPalette: [
    "Black & Gray",
    "Full Color",
    "Black & Red",
    "Blue Tones",
    "Earth Tones",
    "Pastel",
    "Vibrant",
    "Monochromatic",
    "Neon",
    "Muted",
    "Grayscale",
    "Sepia",
    "Jewel Tones",
    "Metallic",
    "Watercolor Splash",
    "High Contrast",
  ],
  size: [
    "Tiny (1-2 inches)",
    "Small (2-3 inches)",
    "Medium (3-5 inches)",
    "Large (5-8 inches)",
    "Extra Large (8-10 inches)",
    "Half Sleeve",
    "Full Sleeve",
    "Back Piece",
    "Chest Piece",
    "Thigh Piece",
    "Calf Piece",
    "Finger Sized",
    "Palm Sized",
    "Wrist Band",
    "Ankle Band",
    "Full Leg",
  ],
  placement: [
    "Upper Arm",
    "Forearm",
    "Wrist",
    "Hand",
    "Fingers",
    "Chest",
    "Back",
    "Shoulder",
    "Neck",
    "Thigh",
    "Calf",
    "Ankle",
    "Foot",
    "Ribs",
    "Spine",
    "Hip",
  ],
}

export function CustomizationOptions({
  onSubmit,
  isVoiceMode,
  speak,
  isListening,
  transcript,
  startListening,
  stopListening,
}: CustomizationOptionsProps) {
  const [customizations, setCustomizations] = useState<Record<string, string>>({
    style: "",
    colorPalette: "",
    size: "",
    placement: "",
  })
  const [currentOption, setCurrentOption] = useState<string | null>(null)

  useEffect(() => {
    if (isVoiceMode && !currentOption) {
      speak(
        "Let's customize your tattoo. You can choose the style, color palette, size, and placement. Which would you like to select first?",
      )
    }
  }, [isVoiceMode, currentOption, speak])

  useEffect(() => {
    if (isListening && transcript) {
      // Process voice input for customization
      const lowerTranscript = transcript.toLowerCase()

      // Check if the user mentioned a specific option
      if (currentOption) {
        const options = customizationOptions[currentOption as keyof typeof customizationOptions]
        const matchedOption = options.find((option) => lowerTranscript.includes(option.toLowerCase()))

        if (matchedOption) {
          setCustomizations((prev) => ({
            ...prev,
            [currentOption]: matchedOption,
          }))
          setCurrentOption(null)
          speak(`Great! I've set the ${currentOption} to ${matchedOption}. What would you like to choose next?`)
        }
      } else {
        // Check if the user is selecting a category
        if (lowerTranscript.includes("style")) {
          setCurrentOption("style")
          speak(
            `Let's choose a style. Options include: ${customizationOptions.style.slice(0, 5).join(", ")}, and more. Which style would you prefer?`,
          )
        } else if (lowerTranscript.includes("color") || lowerTranscript.includes("palette")) {
          setCurrentOption("colorPalette")
          speak(
            `Let's choose a color palette. Options include: ${customizationOptions.colorPalette.slice(0, 5).join(", ")}, and more. Which color palette would you prefer?`,
          )
        } else if (lowerTranscript.includes("size")) {
          setCurrentOption("size")
          speak(
            `Let's choose a size. Options include: ${customizationOptions.size.slice(0, 5).join(", ")}, and more. Which size would you prefer?`,
          )
        } else if (lowerTranscript.includes("placement") || lowerTranscript.includes("location")) {
          setCurrentOption("placement")
          speak(
            `Let's choose a placement. Options include: ${customizationOptions.placement.slice(0, 5).join(", ")}, and more. Where would you like your tattoo?`,
          )
        }
      }
    }
  }, [isListening, transcript, currentOption, speak])

  const handleSelectChange = (value: string, option: string) => {
    setCustomizations((prev) => ({
      ...prev,
      [option]: value,
    }))
  }

  const isComplete = Object.values(customizations).every((value) => value !== "")

  return (
    <Card className="border-gold-500/20 bg-black/40 max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gold-500">Customize Your Tattoo</h2>
            {isVoiceMode && (
              <button
                className={`h-10 rounded-full flex items-center justify-center px-4 ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600"
                } text-white transition-all duration-300`}
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onTouchStart={startListening}
                onTouchEnd={stopListening}
              >
                {isListening ? (
                  <>
                    <Icons.mic className="h-4 w-4 animate-pulse" />
                    <span className="ml-2">Listening...</span>
                  </>
                ) : (
                  <>
                    <Icons.mic className="h-4 w-4" />
                    <span className="ml-2">Hold to Speak</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Style</h3>
              <Select value={customizations.style} onValueChange={(value) => handleSelectChange(value, "style")}>
                <SelectTrigger className="bg-black/20 border-gold-500/30 text-white">
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  {customizationOptions.style.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Color Palette</h3>
              <Select
                value={customizations.colorPalette}
                onValueChange={(value) => handleSelectChange(value, "colorPalette")}
              >
                <SelectTrigger className="bg-black/20 border-gold-500/30 text-white">
                  <SelectValue placeholder="Select a color palette" />
                </SelectTrigger>
                <SelectContent>
                  {customizationOptions.colorPalette.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Size</h3>
              <Select value={customizations.size} onValueChange={(value) => handleSelectChange(value, "size")}>
                <SelectTrigger className="bg-black/20 border-gold-500/30 text-white">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  {customizationOptions.size.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Placement</h3>
              <Select
                value={customizations.placement}
                onValueChange={(value) => handleSelectChange(value, "placement")}
              >
                <SelectTrigger className="bg-black/20 border-gold-500/30 text-white">
                  <SelectValue placeholder="Select a placement" />
                </SelectTrigger>
                <SelectContent>
                  {customizationOptions.placement.map((placement) => (
                    <SelectItem key={placement} value={placement}>
                      {placement}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => onSubmit(customizations)}
              disabled={!isComplete}
              className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
            >
              Generate My Tattoo <Icons.sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
