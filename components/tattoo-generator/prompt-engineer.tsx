"use client"

import { useState, useEffect } from "react"
import type { Message } from "ai"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPromptFromConversation } from "@/lib/prompt-engineering"
import { enhancePrompt } from "@/lib/tattoo-prompt-generator"

interface PromptEngineerProps {
  messages: Message[]
  onPromptGenerated: (prompt: string) => void
}

export function PromptEngineer({ messages, onPromptGenerated }: PromptEngineerProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [basePrompt, setBasePrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [step, setStep] = useState(0)

  // Generate base prompt from conversation
  useEffect(() => {
    try {
      const prompt = getPromptFromConversation(messages)
      setBasePrompt(prompt)
    } catch (error) {
      console.error("Error generating base prompt:", error)
      setBasePrompt("A detailed tattoo design based on your conversation")
    }
  }, [messages])

  // Handle prompt enhancement
  const handleEnhancePrompt = async () => {
    setIsGenerating(true)
    try {
      const enhanced = await enhancePrompt(basePrompt)
      setEnhancedPrompt(enhanced)
      setStep(1)
    } catch (error) {
      console.error("Error enhancing prompt:", error)
      // If enhancement fails, just use the base prompt
      setEnhancedPrompt(basePrompt)
      setStep(1)
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle prompt confirmation
  const handleConfirmPrompt = () => {
    onPromptGenerated(enhancedPrompt || basePrompt)
  }

  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">Tattoo Prompt Engineer</h3>

      {step === 0 ? (
        <div className="space-y-4">
          <div>
            <p className="text-zinc-300 mb-2">Based on your conversation, I've crafted this prompt:</p>
            <div className="bg-zinc-900 border border-zinc-800 rounded p-3 text-zinc-200">{basePrompt}</div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleEnhancePrompt}
              disabled={isGenerating}
              className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enhance Prompt
                </>
              )}
            </Button>

            <Button
              onClick={() => {
                setEnhancedPrompt(basePrompt)
                setStep(1)
              }}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Use As Is
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-zinc-300 mb-2">Final prompt for your tattoo design:</p>
            <div className="bg-zinc-900 border border-zinc-800 rounded p-3 text-zinc-200">
              {enhancedPrompt || basePrompt}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleConfirmPrompt}
              className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600"
            >
              Confirm & Generate
            </Button>

            <Button
              onClick={() => setStep(0)}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Go Back
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
