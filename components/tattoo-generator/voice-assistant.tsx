"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "@/components/icons"

interface VoiceAssistantProps {
  isListening: boolean
  isSpeaking: boolean
  isLoading?: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
}

export function VoiceAssistant({
  isListening,
  isSpeaking,
  isLoading = false,
  transcript,
  startListening,
  stopListening,
}: VoiceAssistantProps) {
  const [showTranscript, setShowTranscript] = useState(false)
  const [assistantState, setAssistantState] = useState<"idle" | "listening" | "speaking" | "thinking" | "loading">(
    "idle",
  )

  useEffect(() => {
    if (transcript) {
      console.log("Transcript updated:", transcript)
      setShowTranscript(true)
      const timer = setTimeout(() => {
        setShowTranscript(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [transcript])

  useEffect(() => {
    if (isListening) {
      console.log("Voice assistant is now listening")
      setAssistantState("listening")
    } else if (isLoading) {
      console.log("Voice assistant is now loading")
      setAssistantState("loading")
    } else if (isSpeaking) {
      console.log("Voice assistant is now speaking")
      setAssistantState("speaking")
    } else {
      // Brief "thinking" state after listening ends before going back to idle
      if (assistantState === "listening") {
        console.log("Voice assistant is now thinking")
        setAssistantState("thinking")
        const timer = setTimeout(() => {
          setAssistantState("idle")
        }, 1500)
        return () => clearTimeout(timer)
      } else if (assistantState !== "thinking" && assistantState !== "loading") {
        setAssistantState("idle")
      }
    }
  }, [isListening, isSpeaking, isLoading, assistantState])

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="mb-4 max-w-md bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-lg p-4 text-white shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="bg-zinc-800 rounded-full p-2">
                <Icons.user className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <div className="text-xs text-zinc-400 mb-1">You said:</div>
                <div className="text-sm">{transcript}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <button
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            assistantState === "idle"
              ? "bg-zinc-900 border border-zinc-800"
              : assistantState === "listening"
                ? "bg-red-500"
                : assistantState === "speaking"
                  ? "bg-gradient-to-r from-red-500 to-amber-500"
                  : assistantState === "loading"
                    ? "bg-purple-500"
                    : "bg-amber-500" // thinking state
          }`}
          onMouseDown={() => {
            console.log("Voice button pressed")
            startListening()
          }}
          onMouseUp={() => {
            console.log("Voice button released")
            stopListening()
          }}
          onTouchStart={() => {
            console.log("Voice button touched")
            startListening()
          }}
          onTouchEnd={() => {
            console.log("Voice button touch ended")
            stopListening()
          }}
        >
          {assistantState === "listening" ? (
            <Icons.mic className="h-6 w-6 text-white animate-pulse" />
          ) : assistantState === "speaking" ? (
            <div className="flex items-center justify-center space-x-1">
              <motion.div
                className="w-1 h-3 bg-white rounded-full"
                animate={{ height: ["3px", "10px", "5px", "8px", "3px"] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut" }}
              />
              <motion.div
                className="w-1 h-5 bg-white rounded-full"
                animate={{ height: ["5px", "12px", "8px", "10px", "5px"] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut", delay: 0.1 }}
              />
              <motion.div
                className="w-1 h-7 bg-white rounded-full"
                animate={{ height: ["7px", "15px", "10px", "12px", "7px"] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.div
                className="w-1 h-4 bg-white rounded-full"
                animate={{ height: ["4px", "9px", "6px", "8px", "4px"] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut", delay: 0.3 }}
              />
              <motion.div
                className="w-1 h-2 bg-white rounded-full"
                animate={{ height: ["2px", "7px", "4px", "6px", "2px"] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut", delay: 0.4 }}
              />
            </div>
          ) : assistantState === "loading" ? (
            <div className="flex items-center justify-center">
              <motion.div
                className="w-6 h-6 border-2 border-white rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
              />
            </div>
          ) : assistantState === "thinking" ? (
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          ) : (
            <Icons.mic className="h-6 w-6 text-zinc-400" />
          )}
        </button>

        {assistantState !== "idle" && (
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-red-500/20 via-amber-500/20 to-purple-600/20 animate-pulse blur-md"></div>
        )}

        <AnimatePresence>
          {assistantState === "speaking" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-amber-500 rounded-full p-2"
            >
              <div className="flex items-center justify-center space-x-1">
                <motion.div
                  className="w-1 h-3 bg-white rounded-full"
                  animate={{ height: ["3px", "10px", "5px", "8px", "3px"] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut" }}
                />
                <motion.div
                  className="w-1 h-5 bg-white rounded-full"
                  animate={{ height: ["5px", "12px", "8px", "10px", "5px"] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut", delay: 0.1 }}
                />
                <motion.div
                  className="w-1 h-7 bg-white rounded-full"
                  animate={{ height: ["7px", "15px", "10px", "12px", "7px"] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut", delay: 0.2 }}
                />
                <motion.div
                  className="w-1 h-4 bg-white rounded-full"
                  animate={{ height: ["4px", "9px", "6px", "8px", "4px"] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut", delay: 0.3 }}
                />
                <motion.div
                  className="w-1 h-2 bg-white rounded-full"
                  animate={{ height: ["2px", "7px", "4px", "6px", "2px"] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut", delay: 0.4 }}
                />
              </div>
            </motion.div>
          )}
          {assistantState === "listening" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-2 -right-2 bg-red-500 text-xs text-white font-medium px-2 py-1 rounded-full"
            >
              Listening
            </motion.div>
          )}
          {assistantState === "loading" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-2 -right-2 bg-purple-500 text-xs text-white font-medium px-2 py-1 rounded-full"
            >
              Loading
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
