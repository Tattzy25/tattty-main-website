"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import MainLayout from "@/components/main-layout"
import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/ui/glass-card"
import { GlassTextarea } from "@/components/ui/glass-textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Sparkles, Heart, MapPin, Users, Calendar, Building, Palette, Music, Camera, Coffee, Car, Home, Send, Mic, Clock, SkipForward, ChevronDown, Check } from "lucide-react"
import { StateCard } from "@/components/states"
import { ChatBox } from "@/components/chat-box"
import { WelcomeScreen } from "@/components/welcome-screen"
import { ImageGallery, type ImageObject } from "@/components/image-gallery"
import { ANIMATION_TIMING } from "@/lib/constants"
import { getStyleImages } from "@/app/actions/get-style-images"
import "./inked.css"

const cardData = [
  {
    icon: Sparkles,
    title: "DYNAMIC_HEADLINE_1",
    subtitle: "What ACTUAL things, places, or people define you?",
    description: "This gives concrete, visual, personal elements",
    placeholder: "(OPTIONAL) In your own words",
    options: [
      "My '64 Impala / specific vehicle",
      "The block I grew up on", 
      "My grandmother's hands",
      "Basketball court on 42nd street",
      "My daughter's birthday (date)",
      "The restaurant I built",
      "My father's workshop",
      "The old oak tree in our yard",
      "My wedding ring",
      "The scar on my left knee",
      "My first apartment key",
      "The family photo on the mantle"
    ]
  },
  {
    icon: Heart,
    title: "DYNAMIC_HEADLINE_2",
    subtitle: "What moment or achievement are you most proud of?",
    description: "Your wins, your battles, your crowning moments",
    placeholder: "(OPTIONAL) In your own words",
    options: [
      "Starting my own business",
      "Graduating college",
      "Buying my first house",
      "Becoming a parent",
      "Overcoming addiction",
      "Survived a serious illness",
      "Military service",
      "Published my first book",
      "Won a championship",
      "Paid off all my debt",
      "Left a toxic relationship",
      "Forgave someone who hurt me"
    ]
  },
  {
    icon: MapPin,
    title: "DYNAMIC_HEADLINE_3",
    subtitle: "Where do you feel most yourself?",
    description: "Your sacred space, your comfort zone",
    placeholder: "(OPTIONAL) In your own words",
    options: [
      "On the basketball court",
      "In my kitchen",
      "At the beach",
      "In the mountains",
      "My home gym",
      "The recording studio",
      "My garage",
      "The family dinner table",
      "On stage",
      "In my garden",
      "On the road",
      "At my desk creating"
    ]
  },
  {
    icon: Users,
    title: "DYNAMIC_HEADLINE_4",
    subtitle: "Who shaped who you are today?",
    description: "The people who left their mark on your soul",
    placeholder: "(OPTIONAL) In your own words",
    options: [
      "My mother",
      "My father",
      "My grandparents",
      "My children",
      "My spouse/partner",
      "My best friend",
      "My mentor",
      "My coach",
      "My sibling",
      "A teacher who believed in me",
      "Someone I lost",
      "My younger self"
    ]
  },
  {
    icon: Calendar,
    title: "DYNAMIC_HEADLINE_5",
    subtitle: "What date or time period changed everything?",
    description: "Before and after moments",
    placeholder: "(OPTIONAL) In your own words",
    options: [
      "The year I was born",
      "When I got sober",
      "My wedding day",
      "The day my child was born",
      "When I lost someone",
      "The day I started over",
      "My graduation year",
      "When I moved to a new city",
      "The summer of '99",
      "My deployment year",
      "When I found my purpose",
      "The day everything clicked"
    ]
  },
  {
    icon: Building,
    title: "DYNAMIC_HEADLINE_6",
    subtitle: "What symbol or image represents your journey?",
    description: "Visual metaphors for your story",
    placeholder: "(OPTIONAL) In your own words",
    options: [
      "A phoenix rising",
      "A lion",
      "An anchor",
      "A compass",
      "A cross",
      "Mountains",
      "Ocean waves",
      "A tree with roots",
      "A broken chain",
      "A crown",
      "Wings",
      "A lighthouse"
    ]
  }
]

// Card 7 - Visual Selection (not in cardData array since it's special)
const card7Data = {
  title: "Pick Your Vibes",
  subtitle: "Pick your visual vibe",
  description: "Select styles that match your tattoo vision",
  placeholder: "(OPTIONAL) In your own words",
  options: [
    "Traditional",
    "Realism",
    "Watercolor",
    "Tribal",
    "Neo-Traditional",
    "Japanese",
    "Minimalist",
    "Geometric",
    "Blackwork",
    "Dotwork",
    "American Traditional",
    "Abstract"
  ]
}

// Card 7 Categories - Dynamic, no hard coding
const card7Categories = [
  { id: 'style', name: 'Style', label: 'Style' },
  { id: 'color', name: 'Color', label: 'Color' },
  { id: 'size', name: 'Size', label: 'Size' },
  { id: 'placement', name: 'Placement', label: 'Placement' }
]

// Card 8 - AI-Generated Follow-up Question (after analyzing answers from Q1-7)
const card8Data = {
  icon: Sparkles, // Use Sparkles as default, can be dynamic later
  title: "DYNAMIC_HEADLINE_8",
  subtitle: "[AI will generate a personalized question based on your previous answers]",
  description: "Based on what you've shared, we have a follow-up question",
  placeholder: "Share your thoughts...",
  options: [] // No preset options - written response only
}

export default function InkdPage() {
  const [currentStep, setCurrentStep] = useState(0) // Start at first question
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(true) // Welcome overlay on top
  const [isTransitioning, setIsTransitioning] = useState(false) // For fade animation
  const [isContentFading, setIsContentFading] = useState(false) // For content fade between questions
  const [responses, setResponses] = useState<string[]>(new Array(cardData.length + 3).fill("")) // +3 for Card 7, 8, 9
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])
  const [sentMessages, setSentMessages] = useState<string[]>(new Array(cardData.length + 3).fill(""))
  const [isListening, setIsListening] = useState(false)
  const [showMessageAnimation, setShowMessageAnimation] = useState(false) // For sent message animation
  
  // Card 7 - Visual selections for all 4 categories (dynamic)
  const [selectedImages, setSelectedImages] = useState<{[key: string]: ImageObject[]}>({
    style: [],
    color: [],
    size: [],
    placement: []
  })
  
  // Card 7 - Images for all 4 categories (dynamic)
  const [categoryImages, setCategoryImages] = useState<{[key: string]: ImageObject[]}>({
    style: [],
    color: [],
    size: [],
    placement: []
  })

  // Fetch images for all categories on mount
  useEffect(() => {
    async function loadImages() {
      const images = await getStyleImages()
      
      // Temporary: Create realistic placeholder labels for each category
      const styleLabels = ["Traditional", "Realism", "Tribal", "Japanese", "Watercolor", "Geometric", "Minimalist", "Neo-Traditional"]
      const colorLabels = ["Black & Grey", "Full Color", "Pastel", "Vibrant", "Monochrome", "Earth Tones", "Neon", "Muted"]
      const sizeLabels = ["Small", "Medium", "Large", "Sleeve", "Half Sleeve", "Full Back", "Tiny", "XL"]
      const placementLabels = ["Arm", "Leg", "Back", "Chest", "Shoulder", "Wrist", "Neck", "Ribs"]
      
      // Convert strings to ImageObjects with realistic labels
      const createImageObjects = (urls: string[], labels: string[]): ImageObject[] => {
        return urls.map((url, index) => ({
          url,
          label: labels[index % labels.length] // Cycle through labels
        }))
      }
      
      setCategoryImages({
        style: createImageObjects(images, styleLabels),
        color: createImageObjects(images, colorLabels),
        size: createImageObjects(images, sizeLabels),
        placement: createImageObjects(images, placementLabels)
      })
    }
    loadImages()
  }, [])

  const currentCard = cardData[currentStep]
  const IconComponent = currentCard?.icon
  const isCard7 = currentStep === cardData.length // Card 7 is right after question 6
  const isCard8 = currentStep === cardData.length + 1 // Card 8 is after Card 7

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('🔥 DEBUG:', { 
      currentStep, 
      isCard7,
      isCard8,
      cardDataLength: cardData.length, 
      selectedImages 
    })
  }

  const handleStartJourney = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setShowWelcomeOverlay(false)
      setIsTransitioning(false)
    }, ANIMATION_TIMING.WELCOME_TRANSITION)
  }

  const handleSkip = () => {
    console.log('Skip button clicked, currentStep:', currentStep)
    const totalSteps = cardData.length + 3 // Text cards + Card 7, 8, 9
    if (currentStep < totalSteps - 1) {
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

  const handleNext = () => {
    const totalSteps = cardData.length + 3
    if (currentStep < totalSteps - 1) {
      // Determine if user can proceed based on current card
      let canProceed = false
      
      if (currentStep < cardData.length) {
        // Questions 1-6: require sent message
        canProceed = !!sentMessages[currentStep]
      } else if (currentStep === cardData.length) {
        // Card 7: require Style AND Color to be selected
        canProceed = selectedImages.style.length > 0 && selectedImages.color.length > 0
      } else {
        // Card 8+: require sent message
        canProceed = !!sentMessages[currentStep]
      }
      
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

  return (
    <MainLayout>
      {/* MAIN QUESTIONNAIRE - Always rendered */}
      <>
        {/* Hero Headline - Dynamic based on current question */}
        <div className="relative z-10 pt-8 pb-1 sm:pt-12 sm:pb-2 lg:pt-16 lg:pb-2">
          <div className="container mx-auto px-4 text-center">
            {/* Show headline for Questions 1-6, Card 7, and Card 8 */}
            {((currentStep < cardData.length && cardData[currentStep].title) || isCard7 || isCard8) && (
              <h1 className={`text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight transition-opacity duration-300 relative ${
                isContentFading ? 'opacity-0' : 'opacity-100'
              }`} style={{ 
                fontFamily: 'Audiowide, sans-serif'
              }}>
                {/* Black shadow layers behind */}
                <span className="absolute inset-0" style={{ 
                  color: '#000000',
                  transform: 'translate(3px, 3px)',
                  zIndex: -5
                }}>
                  {isCard7 ? card7Data.title : isCard8 ? card8Data.title : cardData[currentStep].title}
                </span>
                <span className="absolute inset-0" style={{ 
                  color: '#000000',
                  transform: 'translate(6px, 6px)',
                  zIndex: -4
                }}>
                  {isCard7 ? card7Data.title : isCard8 ? card8Data.title : cardData[currentStep].title}
                </span>
                <span className="absolute inset-0" style={{ 
                  color: 'rgba(0,0,0,0.8)',
                  transform: 'translate(9px, 9px)',
                  zIndex: -3
                }}>
                  {isCard7 ? card7Data.title : isCard8 ? card8Data.title : cardData[currentStep].title}
                </span>
                <span className="absolute inset-0" style={{ 
                  color: 'rgba(0,0,0,0.6)',
                  transform: 'translate(12px, 12px)',
                  zIndex: -2
                }}>
                  {isCard7 ? card7Data.title : isCard8 ? card8Data.title : cardData[currentStep].title}
                </span>
                <span className="absolute inset-0" style={{ 
                  color: 'rgba(0,0,0,0.4)',
                  transform: 'translate(15px, 15px)',
                  zIndex: -1
                }}>
                  {isCard7 ? card7Data.title : isCard8 ? card8Data.title : cardData[currentStep].title}
                </span>
                {/* Gradient text on top */}
                <span className="bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent relative z-10">
                  {isCard7 ? card7Data.title : isCard8 ? card8Data.title : cardData[currentStep].title}
                </span>
              </h1>
            )}
          </div>
        </div>

        <div className="relative min-h-screen flex flex-col lg:flex-row pt-8 pb-32">
          {/* Chat Box - Always visible on the left */}
          <ChatBox
            currentStep={currentStep}
            currentCard={isCard8 ? card8Data : currentCard}
            isCard7={isCard7}
            isContentFading={isContentFading}
            sentMessages={sentMessages}
            showMessageAnimation={showMessageAnimation}
            selectedStyleImages={selectedImages}
            responses={responses}
            selectedOptions={selectedOptions}
            isListening={isListening}
            cardData={cardData}
            card7Data={card7Data}
            handleResponseChange={handleResponseChange}
            handleSendMessage={handleSendMessage}
            handleSpeechToText={handleSpeechToText}
            handleOptionClick={handleOptionClick}
            handlePrevious={handlePrevious}
            handleSkip={handleSkip}
            handleNext={handleNext}
          />
        
          {/* Right Side - Dynamic galleries for Card 7, StateCard for others */}
          {isCard7 ? (
            <div className="w-full lg:w-[45%] flex flex-col gap-6 p-4 pt-32 overflow-y-auto max-h-screen hide-scrollbar">
              {card7Categories.map((category) => (
                <ImageGallery
                  key={category.id}
                  images={categoryImages[category.id]}
                  selectedImages={selectedImages[category.id]}
                  onImageSelect={(image) => handleImageSelect(category.id, image)}
                  title={category.label}
                />
              ))}
            </div>
          ) : (
            <StateCard />
          )}
        </div>
      </>

      {/* WELCOME SCREEN OVERLAY - Shows on top with blur background */}
      <WelcomeScreen
        showWelcomeOverlay={showWelcomeOverlay}
        isTransitioning={isTransitioning}
        onStartJourney={handleStartJourney}
      />

    </MainLayout>
  )
}
