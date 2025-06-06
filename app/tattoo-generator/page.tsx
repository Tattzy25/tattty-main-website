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
import { ChatMessage } from "@/components/tattoo-generator/chat-components"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { engineerTattooPrompt } from "@/lib/prompt-engineering"

export default function TattooGenerator() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState("")
  const [imagePrompt, setImagePrompt] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [showStyleSelector, setShowStyleSelector] = useState(false)
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Initialize chat with default welcome message
  const initialMessages = [
    {
      id: "welcome",
      role: "assistant" as const,
      content:
        "Hi, I'm Tattty! I'll help you create a meaningful tattoo design based on your life story. Ready to start our journey together?",
    },
  ]

  const { messages, input, handleInputChange, handleSubmit, append, isLoading, reload, setMessages } = useChat({
    api: "/api/chat",
    initialMessages,
    body: {
      userId,
    },
    onFinish: async (message) => {
      // Check if the message contains a style selection request
      if (
        message.content.toLowerCase().includes("select a tattoo style") ||
        message.content.toLowerCase().includes("choose a style")
      ) {
        setShowStyleSelector(true)
      }

      // Check if the message contains an image prompt
      const promptMatch = message.content.match(/IMAGE PROMPT:(.*?)(?:\n|$)/s)
      if (promptMatch && promptMatch[1]) {
        const extractedPrompt = promptMatch[1].trim()
        setImagePrompt(extractedPrompt)
      }

      // Store the assistant's response in the database
      if (userId) {
        try {
          await supabase.from("chat_history").insert({
            user_id: userId,
            role: "assistant",
            content: message.content,
            created_at: new Date().toISOString(),
          })
        } catch (error) {
          console.error("Error saving assistant message:", error)
        }
      }
    },
    onError: (error) => {
      console.error("Chat error:", error)
      toast({
        title: "Chat Error",
        description: "There was a problem with the chat. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUserId(user?.id || null)

        if (user?.id) {
          fetchChatHistory(user.id)
        } else {
          setIsLoadingHistory(false)
        }
      } catch (error) {
        console.error("Error checking user:", error)
        setIsLoadingHistory(false)
      }
    }

    checkUser()
  }, [])

  // Fetch chat history from the database
  const fetchChatHistory = async (userId: string) => {
    try {
      setIsLoadingHistory(true)
      const response = await fetch(`/api/chat?userId=${userId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch chat history: ${response.status}`)
      }

      const data = await response.json()

      if (data.messages && Array.isArray(data.messages)) {
        setChatHistory(data.messages)

        // Convert to the format expected by useChat
        if (data.messages.length > 0) {
          const formattedMessages = data.messages.map((msg: any) => ({
            id: msg.id || Math.random().toString(36).substring(2, 15),
            role: msg.role as "user" | "assistant" | "system",
            content: msg.content,
          }))

          // Set messages from history
          setMessages(formattedMessages)
        }
      }
    } catch (error) {
      console.error("Error fetching chat history:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Handle style selection
  const handleStyleSelect = async (style: string) => {
    setSelectedStyle(style)
    setShowStyleSelector(false)

    // Send the style selection as a user message
    const styleMessage = `I'd like my tattoo in ${style} style.`

    // Add to UI immediately
    append({
      role: "user",
      content: styleMessage,
    })

    // Save to database
    if (userId) {
      try {
        await supabase.from("chat_history").insert({
          user_id: userId,
          role: "user",
          content: styleMessage,
          created_at: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Error saving style selection:", error)
      }
    }

    // Generate the prompt based on the conversation and selected style
    setIsGeneratingPrompt(true)
    try {
      const allMessages = [...messages, { role: "user" as const, content: styleMessage }]
      const prompt = await engineerTattooPrompt(allMessages)
      setImagePrompt(prompt)
    } catch (error) {
      console.error("Error generating prompt:", error)
      toast({
        title: "Error",
        description: "Failed to generate tattoo prompt",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  // Generate the image using Stability AI
  const handleGenerateImage = async () => {
    if (!imagePrompt) return

    setGenerating(true)
    try {
      const imageUrl = await generateImage(imagePrompt, selectedStyle)
      setGeneratedImage(imageUrl)

      // Save the generated design to the database if user is logged in
      if (userId) {
        const { error } = await supabase.from("tattoo_designs").insert({
          user_id: userId,
          title: `${selectedStyle} Tattoo Design`,
          description: "Generated with Tattty AI assistant",
          prompt: imagePrompt,
          style: selectedStyle,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
        })

        if (error) {
          console.error("Error saving design to database:", error)
        }
      }
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Generation failed",
        description: "Failed to generate your tattoo design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  // Reset the conversation
  const handleReset = () => {
    reload()
    setGeneratedImage(null)
    setImagePrompt("")
    setSelectedStyle("")
    setShowStyleSelector(false)
    setMessages(initialMessages)
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
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                  </div>
                ) : (
                  <>
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

                    {/* Show style selector when prompted */}
                    {showStyleSelector && (
                      <div className="my-4">
                        <TattooStyleSelector onSelect={handleStyleSelect} />
                      </div>
                    )}

                    {/* Show prompt generation indicator */}
                    {isGeneratingPrompt && (
                      <div className="flex justify-center my-4">
                        <div className="bg-zinc-800/80 border border-zinc-700 rounded-xl p-4 text-zinc-100 flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Creating your personalized tattoo prompt...</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-zinc-800">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Share your story with Tattty..."
                    className="flex-1 bg-zinc-800 border-zinc-700 focus:border-amber-500 text-white"
                    disabled={isLoading || isLoadingHistory || isGeneratingPrompt}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || isLoadingHistory || isGeneratingPrompt || input.trim().length === 0}
                    className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  </Button>
                </form>
              </div>
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
                  <TattooResult imageUrl={generatedImage} prompt={imagePrompt} style={selectedStyle} userId={userId} />
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
