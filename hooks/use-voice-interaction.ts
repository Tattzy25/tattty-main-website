"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { generateSpeech } from "@/lib/play-ai"

export function useVoiceInteraction() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioCache = useRef<Map<string, string>>(new Map())

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore - SpeechRecognition is not in the TypeScript types yet
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join("")

          console.log("Transcript received:", transcript)
          setTranscript(transcript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          console.log("Speech recognition ended")
          setIsListening(false)
        }
      } else {
        console.error("Speech Recognition API not supported in this browser")
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const startListening = useCallback(() => {
    setTranscript("")
    if (recognitionRef.current) {
      try {
        console.log("Starting speech recognition...")
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    } else {
      console.error("Speech recognition not initialized")
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        console.log("Stopping speech recognition...")
        recognitionRef.current.stop()
        // We'll let the onend event handler set isListening to false
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
        setIsListening(false)
      }
    }
  }, [])

  const speak = useCallback(async (text: string) => {
    // Stop any current audio playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setIsSpeaking(true)
    setIsLoading(true)

    try {
      // Check if we have this text cached
      let audioUrl = audioCache.current.get(text)

      if (!audioUrl) {
        console.log("Generating speech with Play.ai via GROQ:", text)
        // Generate speech using Play.ai with GROQ enhancement
        const result = await generateSpeech(text)

        if (!result.success || !result.audioUrl) {
          throw new Error(result.error || "Failed to generate speech")
        }

        audioUrl = result.audioUrl
        // Cache the result for future use
        audioCache.current.set(text, audioUrl)
      } else {
        console.log("Using cached audio for:", text)
      }

      // Create and play audio
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onloadeddata = () => {
        setIsLoading(false)
      }

      audio.onplay = () => {
        console.log("Audio started playing")
        setIsSpeaking(true)
      }

      audio.onended = () => {
        console.log("Audio finished playing")
        setIsSpeaking(false)
        audioRef.current = null
      }

      audio.onerror = (error) => {
        console.error("Audio playback error:", error)
        setIsSpeaking(false)
        setIsLoading(false)
        audioRef.current = null

        // Remove from cache if there was an error
        audioCache.current.delete(text)

        // Fall back to browser TTS
        fallbackToWebSpeech(text)
      }

      // Play the audio
      await audio.play()
    } catch (error) {
      console.error("Error with Play.ai speech synthesis:", error)
      setIsSpeaking(false)
      setIsLoading(false)

      // Fall back to browser's speech synthesis
      fallbackToWebSpeech(text)
    }
  }, [])

  const fallbackToWebSpeech = (text: string) => {
    console.log("Falling back to Web Speech API")
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text)

      // Try to use a female voice if available
      const voices = window.speechSynthesis.getVoices()
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes("female") ||
          voice.name.includes("Samantha") ||
          voice.name.includes("Google UK English Female"),
      )

      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }
  }

  return {
    isListening,
    transcript,
    isSpeaking,
    isLoading,
    startListening,
    stopListening,
    speak,
  }
}
