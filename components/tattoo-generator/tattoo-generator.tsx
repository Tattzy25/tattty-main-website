"use client"

import { useState, useRef, useEffect } from "react"
import FocusTrap from "focus-trap-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { PersonalQuestions } from "@/components/tattoo-generator/personal-questions"
import { CustomizationOptions } from "@/components/tattoo-generator/customization-options"
import { TattooResult } from "@/components/tattoo-generator/tattoo-result"
import { VoiceAssistant } from "@/components/tattoo-generator/voice-assistant"
import { useVoiceInteraction } from "@/hooks/use-voice-interaction"

type GeneratorStep = "intro" | "questions" | "customization" | "generating" | "result"

export function TattooGenerator({
  onOpenChange = (open: boolean) => {},
}: {
  onOpenChange?: (open: boolean) => void
}) {
  const [step, setStep] = useState<GeneratorStep>("intro")
  const [answers, setAnswers] = useState<string[]>([])
  const [customizations, setCustomizations] = useState<Record<string, string>>({
    style: "",
    colorPalette: "",
    size: "",
    placement: "",
  })
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const initialFocusRef = useRef<HTMLButtonElement | null>(null)
  const { isListening, transcript, startListening, stopListening, speak, isSpeaking } = useVoiceInteraction()
  const [generatedImageData, setGeneratedImageData] = useState<string | null>(null)

  const handleAnswerSubmit = (answers: string[]) => {
    setAnswers(answers)
    setStep("customization")

    if (isVoiceMode) {
      speak(
        "Great! Now let's customize your tattoo design. You can choose the style, color palette, size, and placement.",
      )
    }
  }

  const handleCustomizationSubmit = (customizations: Record<string, string>) => {
    setCustomizations(customizations)
    setStep("generating")
    generateTattoo(answers, customizations)
  }

  const generateTattoo = async (answers: string[], customizations: Record<string, string>) => {
    try {
      // Show generating state
      setStep("generating")

      if (isVoiceMode) {
        speak("I'm creating your unique tattoo design based on your story. This will take just a moment.")
      }

      // Call your API endpoint
      const response = await fetch("/api/generate-tattoo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          style: customizations.style,
          colorPalette: customizations.colorPalette,
          size: customizations.size,
          placement: customizations.placement,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate tattoo")
      }

      const data = await response.json()

      // Update state with the generated image data and prompt
      setGeneratedPrompt(data.prompt)

      if (data.imageData) {
        // If we received base64 data
        setGeneratedImage(null) // Clear URL if any
        setGeneratedImageData(data.imageData) // New state for base64 data
      } else if (data.imageUrl) {
        // If we received a URL
        setGeneratedImage(data.imageUrl)
        setGeneratedImageData(null) // Clear base64 data if any
      }

      setStep("result")

      if (isVoiceMode) {
        speak("Your tattoo design is ready! I've created something unique based on your story. What do you think?")
      }
    } catch (error) {
      console.error("Error generating tattoo:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate tattoo design. Please try again.",
        variant: "destructive",
      })
      setStep("customization")
    }
  }

  const handleRegenerate = () => {
    setStep("generating")
    generateTattoo(answers, customizations)
  }

  const handleStartOver = () => {
    setAnswers([])
    setCustomizations({
      style: "",
      colorPalette: "",
      size: "",
      placement: "",
    })
    setGeneratedImage(null)
    setGeneratedPrompt(null)
    setStep("intro")
  }

  useEffect(() => {
    const isOpen = step !== "intro"
    onOpenChange(isOpen)

    if (isOpen) {
      setTimeout(() => initialFocusRef.current?.focus(), 100)
    }
  }, [step, onOpenChange])

  const toggleVoiceMode = () => {
    const newMode = !isVoiceMode
    setIsVoiceMode(newMode)

    if (newMode) {
      speak(
        "Voice mode activated. I'm Tattzy, your personal tattoo design assistant. I'll guide you through creating a unique tattoo design based on your life story. Are you ready to begin?",
      )
    }
  }

  return (
    <div className="py-24 relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
            AI Tattoo Generator
          </h1>
          <p className="text-zinc-300 max-w-2xl mx-auto">Transform your personal story into a unique tattoo design</p>
        </div>

        <div className="flex justify-center mb-8">
          <Button
            ref={step === "intro" ? initialFocusRef : undefined}
            onClick={toggleVoiceMode}
            variant="outline"
            className={`border-gold-500/30 ${isVoiceMode ? "bg-gold-500/20 text-gold-500" : "hover:bg-gold-500/10"}`}
          >
            {isVoiceMode ? (
              <>
                <Icons.mic className="mr-2 h-4 w-4" /> Voice Mode Active
              </>
            ) : (
              <>
                <Icons.micOff className="mr-2 h-4 w-4" /> Enable Voice Mode
              </>
            )}
          </Button>
        </div>

        {isVoiceMode && (
          <VoiceAssistant
            isListening={isListening}
            isSpeaking={isSpeaking}
            transcript={transcript}
            startListening={startListening}
            stopListening={stopListening}
          />
        )}

        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 max-w-4xl mx-auto"
              tabIndex={-1}
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center mx-auto">
                  <Icons.sparkles className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Create Your Unique Tattoo</h2>
                <p className="text-zinc-300 max-w-lg mx-auto">
                  I'll guide you through a series of questions about your life journey, then use AI to create a
                  personalized tattoo design that tells your story.
                </p>
                <Button
                  onClick={() => {
                    setStep("questions")
                    if (isVoiceMode) {
                      speak(
                        "Let's start by learning about your life journey. I'll ask you four questions to understand what matters most to you.",
                      )
                    }
                  }}
                  className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
                >
                  Begin Your Journey
                </Button>
              </div>
            </motion.div>
          )}

          {step !== "intro" && (
            <FocusTrap>
              <>
                {step === "questions" && (
                  <motion.div
                    key="questions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    tabIndex={-1}
                  >
                    <PersonalQuestions
                      onSubmit={handleAnswerSubmit}
                      isVoiceMode={isVoiceMode}
                      speak={speak}
                      initialFocusRef={initialFocusRef}
                      tabIndex={-1}
                      isListening={isListening}
                      transcript={transcript}
                      startListening={startListening}
                      stopListening={stopListening}
                    />
                  </motion.div>
                )}

                {step === "customization" && (
                  <motion.div
                    key="customization"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    tabIndex={-1}
                  >
                    <CustomizationOptions
                      onSubmit={handleCustomizationSubmit}
                      isVoiceMode={isVoiceMode}
                      speak={speak}
                      isListening={isListening}
                      transcript={transcript}
                      startListening={startListening}
                      stopListening={stopListening}
                    />
                  </motion.div>
                )}

                {step === "generating" && (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 max-w-4xl mx-auto text-center"
                    tabIndex={-1}
                  >
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-purple-600 animate-pulse"></div>
                        <div className="absolute inset-2 rounded-full bg-zinc-900 flex items-center justify-center">
                          <Icons.spinner className="h-12 w-12 text-gold-500 animate-spin" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-white">Creating Your Tattoo Design</h2>
                      <p className="text-zinc-300 max-w-lg mx-auto">
                        Our AI is analyzing your story and crafting a unique tattoo design just for you. This will take
                        a moment...
                      </p>
                      <div className="w-full max-w-md bg-zinc-800 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-red-500 via-amber-500 to-purple-600 h-2.5 rounded-full animate-progress"></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === "result" && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    tabIndex={-1}
                  >
                    <TattooResult
                      imageUrl={generatedImage}
                      imageData={generatedImageData}
                      prompt={generatedPrompt || ""}
                      onRegenerate={handleRegenerate}
                      onStartOver={handleStartOver}
                    />
                  </motion.div>
                )}
              </>
            </FocusTrap>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
