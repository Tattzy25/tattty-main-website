"use client"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { ArrowRight, Loader2, RefreshCw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import MainLayout from "@/components/main-layout"
import { generateImage } from "@/lib/stability"
import { TattooStyleSelector } from "@/components/tattoo-generator/tattoo-style-selector"
import { TattooResult } from "@/components/tattoo-generator/tattoo-result"
import { PromptEngineer } from "@/components/tattoo-generator/prompt-engineer"
// Import ChatMessage directly from the file
import { ChatMessage } from "@/components/tattoo-generator/chat-components"

export default function TattooGenerator() {
  const [step, setStep] = useState(0)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState("")
  const [imagePrompt, setImagePrompt] = useState("")
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, append, isLoading, reload } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi, I'm Tattty! I'll help you create a meaningful tattoo design based on your life story. Ready to start our journey together?",
      },
    ],
    onFinish: async (message) => {
      if (step === 3) {
        // We'll now use the prompt engineer instead of extracting from AI response
        setStep(4)
      }
    },
  })

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Progress through the conversation steps
  useEffect(() => {
    const handleStepProgression = async () => {
      if (messages.length === 2 && step === 0) {
        // After user's first response, ask about significant life events
        setTimeout(() => {
          append({
            role: "assistant",
            content:
              "Thank you for sharing. Could you tell me about a significant life event or challenge that has shaped who you are today?",
          })
          setStep(1)
        }, 500)
      } else if (messages.length === 4 && step === 1) {
        // After user's second response, ask about what they want their tattoo to represent
        setTimeout(() => {
          append({
            role: "assistant",
            content: "That's powerful. What emotions, values, or qualities would you like your tattoo to represent?",
          })
          setStep(2)
        }, 500)
      } else if (messages.length === 6 && step === 2) {
        // After user's third response, show style selector
        setTimeout(() => {
          append({
            role: "assistant",
            content: "Great! Now, please select a tattoo style that resonates with you.",
          })
          setStep(3)
        }, 500)
      }
    }

    handleStepProgression()
  }, [messages.length, step, append])

  // Handle style selection and final prompt generation
  const handleStyleSelect = async (style: string) => {
    setSelectedStyle(style)

    append({
      role: "user",
      content: `I'd like my tattoo in ${style} style.`,
    })

    setTimeout(() => {
      append({
        role: "assistant",
        content:
          "Thank you for all your input. I'll now craft a detailed prompt based on your story and style preference to generate your personalized tattoo design.",
      })

      // We'll now use the prompt engineer component instead of sending another message
    }, 500)
  }

  // Handle the prompt from the prompt engineer
  const handlePromptGenerated = (prompt: string) => {
    setImagePrompt(prompt)
  }

  // Generate the image using Stability AI
  const handleGenerateImage = async () => {
    if (!imagePrompt) return

    setGenerating(true)
    try {
      const imageUrl = await generateImage(imagePrompt, selectedStyle)
      setGeneratedImage(imageUrl)
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setGenerating(false)
    }
  }

  // Reset the conversation
  const handleReset = () => {
    reload()
    setStep(0)
    setGeneratedImage(null)
    setImagePrompt("")
    setSelectedStyle("")
  }

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
                Your Story, Your Ink
              </h1>
              <p className="text-zinc-300 max-w-2xl mx-auto">
                Answer a few questions and let Tattty create a personalized tattoo design that tells your unique story.
              </p>
            </div>

            {/* Chat Container */}
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 shadow-2xl mb-6">
              <div
                ref={chatContainerRef}
                className="h-[500px] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
              >
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} isLoading={false} />
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800/80 border border-zinc-700 rounded-xl p-4 text-zinc-100 flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}

                {/* Show style selector after the appropriate message */}
                {step === 3 && messages.some((m) => m.content.includes("select a tattoo style")) && (
                  <div className="my-4">
                    <TattooStyleSelector onSelect={handleStyleSelect} />
                  </div>
                )}

                {/* Show prompt engineer after style selection */}
                {step === 4 && !imagePrompt && (
                  <PromptEngineer messages={messages} onPromptGenerated={handlePromptGenerated} />
                )}
              </div>

              {/* Input Area */}
              {step < 3 && (
                <div className="p-4 border-t border-zinc-800">
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Textarea
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Share your story with Tattty..."
                      className="flex-1 bg-zinc-800 border-zinc-700 focus:border-amber-500 text-white"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || input.trim().length === 0}
                      className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Image Generation Section */}
            {imagePrompt && (
              <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 shadow-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Your Personalized Tattoo Design</h2>

                {!generatedImage ? (
                  <div className="space-y-4">
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                      <h3 className="text-amber-500 font-semibold mb-2">Image Prompt:</h3>
                      <p className="text-zinc-300">{imagePrompt}</p>
                    </div>

                    <Button
                      onClick={handleGenerateImage}
                      disabled={generating}
                      className="w-full bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white py-6 text-lg"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Generating Your Tattoo Design...
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 mr-2" />
                          Generate My Tattoo Design
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <TattooResult imageUrl={generatedImage} prompt={imagePrompt} style={selectedStyle} />
                )}

                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Start Over
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
