"use client"

import { useState } from "react"
import { ANIMATION_TIMING } from "@/lib/constants"
import { type ImageObject } from "@/components/image-gallery"
import { canProceedToNext } from "@/lib/questionnaire-utils"

interface UseQuestionnaireFlowProps {
  totalQuestions: number // Number of question cards (1-6)
  totalCards: number // Total cards including Card 7, 8
}

export function useQuestionnaireFlow({ totalQuestions, totalCards }: UseQuestionnaireFlowProps) {
  const [currentStep, setCurrentStep] = useState(0) // Start at first question
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(true) // Welcome overlay on top
  const [isTransitioning, setIsTransitioning] = useState(false) // For fade animation
  const [isContentFading, setIsContentFading] = useState(false) // For content fade between questions
  const [responses, setResponses] = useState<string[]>(new Array(totalCards).fill("")) // +2 for Card 7, 8
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])
  const [sentMessages, setSentMessages] = useState<string[]>(new Array(totalCards).fill(""))
  const [isListening, setIsListening] = useState(false)
  const [showMessageAnimation, setShowMessageAnimation] = useState(false) // For sent message animation
  const [uploadedImages, setUploadedImages] = useState<File[]>([]) // Card 8 - Image uploads
  const [aiFollowUpQuestion, setAiFollowUpQuestion] = useState<string>("") // Card 8 - AI-generated question
  
  // Card 7 - Visual selections for all 4 categories (dynamic)
  const [selectedImages, setSelectedImages] = useState<{[key: string]: ImageObject[]}>({
    style: [],
    color: [],
    size: [],
    placement: []
  })

  const handleStartJourney = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setShowWelcomeOverlay(false)
      setIsTransitioning(false)
    }, ANIMATION_TIMING.WELCOME_TRANSITION)
  }

  const handleSkip = () => {
    console.log('Skip button clicked, currentStep:', currentStep)
    if (currentStep < totalCards - 1) {
      setIsContentFading(true)
      
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setSelectedOptions([])
        setTimeout(() => {
          setIsContentFading(false)
        }, ANIMATION_TIMING.FADE_IN_DELAY)
      }, ANIMATION_TIMING.FADE_OUT)
    }
  }

  const handleNext = (onBuildClick: () => void) => {
    // Card 8 - Build button clicked
    if (currentStep === totalCards - 1) {
      onBuildClick()
      return
    }
    
    if (currentStep < totalCards - 1) {
      // Use validation utility to check if user can proceed
      const canProceed = canProceedToNext({
        currentStep,
        totalQuestions,
        sentMessages,
        selectedImages
      })
      
      if (canProceed) {
        setIsContentFading(true)
        
        setTimeout(() => {
          setCurrentStep(currentStep + 1)
          setSelectedOptions([])
          setTimeout(() => {
            setIsContentFading(false)
          }, ANIMATION_TIMING.FADE_IN_DELAY)
        }, ANIMATION_TIMING.FADE_OUT)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsContentFading(true)
      
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setSelectedOptions([])
        setTimeout(() => {
          setIsContentFading(false)
        }, ANIMATION_TIMING.FADE_IN_DELAY)
      }, ANIMATION_TIMING.FADE_OUT)
    }
  }

  const handleResponseChange = (value: string) => {
    const newResponses = [...responses]
    newResponses[currentStep] = value
    setResponses(newResponses)
  }

  const handleSendMessage = () => {
    const currentResponse = responses[currentStep]
    if (currentResponse.trim()) {
      const newSentMessages = [...sentMessages]
      newSentMessages[currentStep] = currentResponse
      setSentMessages(newSentMessages)
      
      // Trigger the slide-in animation
      setShowMessageAnimation(true)
      setTimeout(() => {
        setShowMessageAnimation(false)
      }, 500) // Animation duration
      
      // Clear the input after sending
      const newResponses = [...responses]
      newResponses[currentStep] = ""
      setResponses(newResponses)
      
      // Clear selected options
      setSelectedOptions([])
    }
  }

  const handleSpeechToText = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onstart = () => {
        setIsListening(true)
      }
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        const currentResponse = responses[currentStep]
        const newResponse = currentResponse ? `${currentResponse} ${transcript}` : transcript
        handleResponseChange(newResponse)
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognition.start()
    } else {
      alert('Speech recognition is not supported in your browser')
    }
  }

  const handleOptionClick = (option: string, index: number) => {
    const currentResponse = responses[currentStep]
    const newResponse = currentResponse ? `${currentResponse}, ${option}` : option
    handleResponseChange(newResponse)
    
    // Toggle selected state
    setSelectedOptions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  // Card 7 - Dynamic image selection handler for any category
  const handleImageSelect = (category: string, image: ImageObject) => {
    setSelectedImages(prev => ({
      ...prev,
      [category]: prev[category].some(img => img.url === image.url) ? [] : [image]
    }))
  }

  // Card 8 - Image upload handler
  const handleImageUpload = (file: File) => {
    setUploadedImages(prev => [...prev, file])
    console.log('Image uploaded:', file.name)
  }

  // Card 8 - Remove uploaded image
  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  return {
    // State
    currentStep,
    showWelcomeOverlay,
    isTransitioning,
    isContentFading,
    responses,
    selectedOptions,
    sentMessages,
    isListening,
    showMessageAnimation,
    uploadedImages,
    aiFollowUpQuestion,
    selectedImages,
    
    // Setters (for external use like AI question generation)
    setAiFollowUpQuestion,
    
    // Handlers
    handleStartJourney,
    handleSkip,
    handleNext,
    handlePrevious,
    handleResponseChange,
    handleSendMessage,
    handleSpeechToText,
    handleOptionClick,
    handleImageSelect,
    handleImageUpload,
    handleRemoveUploadedImage,
  }
}
