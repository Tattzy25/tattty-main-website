"use client"

import { useState, useEffect } from "react"
import type { Message } from "ai"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Wand2, Edit, Check, RefreshCw } from "lucide-react"
import { engineerTattooPrompt } from "@/lib/prompt-engineering"

interface PromptEngineerProps {
  messages: Message[]
  onPromptGenerated: (prompt: string) => void
}

export function PromptEngineer({ messages, onPromptGenerated }: PromptEngineerProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [editedPrompt, setEditedPrompt] = useState("")
  const [showEditor, setShowEditor] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loadingStage, setLoadingStage] = useState<string | null>(null)

  // Generate a basic prompt immediately using the client-side function
  useEffect(() => {
    const basicPrompt = engineerTattooPrompt(messages)
    setGeneratedPrompt(basicPrompt)
    setEditedPrompt(basicPrompt)
  }, [messages])

  const generatePrompt = async () => {
    setIsGenerating(true)
    setLoadingStage("Analyzing conversation")

    try {
      // First show the basic prompt while we wait for the enhanced one
      setShowEditor(true)

      // After a short delay, start enhancing with AI
      setTimeout(() => {
        setLoadingStage("Enhancing with AI")
      }, 1500)

      const response = await fetch("/api/tattoo-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate prompt")
      }

      const data = await response.json()
      setGeneratedPrompt(data.prompt)
      setEditedPrompt(data.prompt)
      setLoadingStage(null)
    } catch (error) {
      console.error("Error generating prompt:", error)
      setLoadingStage(null)
      // We already have the basic prompt, so we can still show the editor
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = () => {
    onPromptGenerated(editedPrompt)
  }

  const toggleEditing = () => {
    setIsEditing(!isEditing)
  }

  if (!showEditor) {
    return (
      <div className="flex flex-col items-center my-6 gap-4">
        <Card className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 shadow-xl w-full">
          <CardHeader>
            <CardTitle className="text-amber-500">Design Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-300 mb-4">
              Based on our conversation, I'll now craft a detailed prompt to generate your personalized tattoo design.
            </p>
            <p className="text-zinc-400 text-sm">
              This prompt will capture the essence of your story, preferred style, and meaningful elements to create a
              unique design that represents you.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={generatePrompt}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white py-6"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {loadingStage || "Crafting Your Design Prompt..."}
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Craft My Tattoo Design Prompt
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <Card className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 shadow-xl my-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-amber-500">Your Tattoo Design Prompt</CardTitle>
        {loadingStage && (
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingStage}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className="min-h-[150px] bg-zinc-800 border-zinc-700 text-white"
            placeholder="Your tattoo design prompt..."
          />
        ) : (
          <div className="bg-zinc-800 border border-zinc-700 rounded-md p-4 min-h-[150px] text-white whitespace-pre-wrap">
            {editedPrompt}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleEditing} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            {isEditing ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Done Editing
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" /> Edit Prompt
              </>
            )}
          </Button>
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => setEditedPrompt(generatedPrompt)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
        >
          Use This Prompt
        </Button>
      </CardFooter>
    </Card>
  )
}
