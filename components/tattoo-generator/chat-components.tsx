"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

export { ChatMessage, ChatInput }

interface ChatMessageProps {
  message: {
    role: "user" | "assistant" | "system"
    content: string
    id?: string
  }
  isLoading?: boolean
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
  const [showFullMessage, setShowFullMessage] = useState(false)
  const isLongMessage = message.content.length > 300

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg p-3",
        message.role === "user"
          ? "bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-red-500/30 ml-auto max-w-[85%]"
          : "bg-zinc-800/80 border border-zinc-700 mr-auto max-w-[85%]",
      )}
    >
      <div className="flex-shrink-0 mt-1">
        {message.role === "user" ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-amber-500">
            <User className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700">
            <Bot className="h-5 w-5 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="prose prose-invert max-w-none">
          {isLongMessage && !showFullMessage ? (
            <>
              <p>{message.content.substring(0, 300)}...</p>
              <button
                onClick={() => setShowFullMessage(true)}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium"
              >
                Read more
              </button>
            </>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
        {isLoading && (
          <div className="flex space-x-1 mt-2">
            <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>
    </div>
  )
}

interface ChatInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSend?: () => void
}

export function ChatInput({ className, onSend, ...props }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className={cn("relative flex-1", className)}>
      <input
        ref={inputRef}
        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        {...props}
      />
    </div>
  )
}
