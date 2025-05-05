"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { QuickReply } from "./quick-reply"
import { TattooStyleSelector } from "./tattoo-style-selector"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm your tattoo design assistant. Tell me what kind of tattoo you're looking for, and I'll help you create the perfect design.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: "openai",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.text()

      // Add assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: data }])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = (reply: string) => {
    setInput(reply)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col max-w-[80%] rounded-lg p-4",
              message.role === "user" ? "ml-auto bg-amber-500 text-black" : "bg-zinc-800 text-white",
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col max-w-[80%] rounded-lg p-4 bg-zinc-800 text-white">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse delay-300"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-zinc-700">
        <TattooStyleSelector onSelect={setSelectedStyle} selected={selectedStyle} />

        <QuickReply onSelect={handleQuickReply} />

        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your tattoo idea..."
            className="flex-1 bg-zinc-800 border-zinc-700 text-white resize-none"
            rows={3}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            <Icons.send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
