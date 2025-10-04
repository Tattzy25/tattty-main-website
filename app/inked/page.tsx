"use client"

import { useState } from "react"
import Image from "next/image"
import MainLayout from "@/components/main-layout"
import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/ui/glass-card"
import { GlassTextarea } from "@/components/ui/glass-textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Sparkles, Heart, MapPin, Users, Calendar, Building, Palette, Music, Camera, Coffee, Car, Home, Send, Mic, Clock, SkipForward } from "lucide-react"
import { Sketchpad } from "@/components/sketchpad"
import "./inked.css"

// Animation timing constants (in milliseconds)
const ANIMATION_TIMING = {
  FADE_OUT: 300,           // Content fade out duration
  FADE_IN_DELAY: 50,       // Delay before fade in starts
  WELCOME_TRANSITION: 1000, // Welcome screen dismiss duration
  MESSAGE_SLIDE: 500,      // Sent message slide-in animation
  CAROUSEL_DELAY: 300      // Carousel appear/disappear delay
} as const

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
  title: "DYNAMIC_HEADLINE_7",
  subtitle: "Pick your visual vibe"
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
  const [showCarousel, setShowCarousel] = useState(false) // Show/hide carousel rows
  
  // Card 7 - Visual carousel selections (4 rows)
  const [selectedStyleImages, setSelectedStyleImages] = useState<string[]>([])
  const [selectedColorImages, setSelectedColorImages] = useState<string[]>([])
  const [selectedSizeImages, setSelectedSizeImages] = useState<string[]>([])
  const [selectedPlacementImages, setSelectedPlacementImages] = useState<string[]>([])
  const [carouselQuestions, setCarouselQuestions] = useState<number>(0) // Track which carousel questions are shown

  const currentCard = cardData[currentStep]
  const IconComponent = currentCard?.icon
  const isCard7 = currentStep === cardData.length // Card 7 is right after question 6

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
      // Fade out content
      setIsContentFading(true)
      
      // Carousel visibility logic
      if (currentStep === cardData.length) {
        // Leaving Card 7
        setShowCarousel(false)
      }
      if (currentStep + 1 === cardData.length) {
        // Going to Card 7
        setTimeout(() => {
          setShowCarousel(true)
        }, ANIMATION_TIMING.CAROUSEL_DELAY)
      }
      
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
      const canProceed = currentStep < cardData.length 
        ? sentMessages[currentStep] 
        : (currentStep === cardData.length && 
           selectedStyleImages.length > 0 && 
           selectedColorImages.length > 0 && 
           selectedSizeImages.length > 0 && 
           selectedPlacementImages.length > 0)
      
      if (canProceed) {
        setIsContentFading(true)
        
        // Carousel visibility logic
        if (currentStep === cardData.length) {
          // Leaving Card 7
          setShowCarousel(false)
        }
        if (currentStep + 1 === cardData.length) {
          // Going to Card 7
          setTimeout(() => {
            setShowCarousel(true)
          }, ANIMATION_TIMING.CAROUSEL_DELAY)
        }
        
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
      
      // Carousel visibility logic
      if (currentStep === cardData.length) {
        // Leaving Card 7
        setShowCarousel(false)
      }
      if (currentStep - 1 === cardData.length) {
        // Going BACK to Card 7
        setTimeout(() => {
          setShowCarousel(true)
        }, ANIMATION_TIMING.CAROUSEL_DELAY)
      }
      
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

  // Card 7 Carousel Image Selection Handlers
  const handleStyleSelect = (imageUrl: string) => {
    // Single selection with toggle - if clicking same image, deselect it
    setSelectedStyleImages(prev => 
      prev.includes(imageUrl) ? [] : [imageUrl]
    )
  }

  const handleColorSelect = (imageUrl: string) => {
    // Single selection with toggle - if clicking same image, deselect it
    setSelectedColorImages(prev => 
      prev.includes(imageUrl) ? [] : [imageUrl]
    )
  }

  const handleSizeSelect = (imageUrl: string) => {
    // Multi-select for size
    setSelectedSizeImages(prev =>
      prev.includes(imageUrl)
        ? prev.filter(url => url !== imageUrl)
        : [...prev, imageUrl]
    )
  }

  const handlePlacementSelect = (imageUrl: string) => {
    // Multi-select for placement
    setSelectedPlacementImages(prev =>
      prev.includes(imageUrl)
        ? prev.filter(url => url !== imageUrl)
        : [...prev, imageUrl]
    )
  }

  return (
    <MainLayout>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full blur-3xl opacity-15 animate-pulse delay-2000"></div>
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-25 animate-pulse delay-500"></div>
      </div>

      {/* MAIN QUESTIONNAIRE - Always rendered */}
      <>
        {/* Hero Headline - Dynamic based on current question */}
        <div className="relative z-10 pt-16 pb-2 sm:pt-20 sm:pb-3 lg:pt-24 lg:pb-4">
          <div className="container mx-auto px-4 text-center">
            {/* Show headline for Questions 1-6 and Card 7 */}
            {((currentStep < cardData.length && cardData[currentStep].title) || isCard7) && (
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
                  {isCard7 ? card7Data.title : cardData[currentStep].title}
                </span>
                <span className="absolute inset-0" style={{ 
                  color: '#000000',
                  transform: 'translate(6px, 6px)',
                  zIndex: -4
                }}>
                  {isCard7 ? card7Data.title : cardData[currentStep].title}
                </span>
                <span className="absolute inset-0" style={{ 
                  color: 'rgba(0,0,0,0.8)',
                  transform: 'translate(9px, 9px)',
                  zIndex: -3
                }}>
                  {isCard7 ? card7Data.title : cardData[currentStep].title}
                </span>
                <span className="absolute inset-0" style={{ 
                  color: 'rgba(0,0,0,0.6)',
                  transform: 'translate(12px, 12px)',
                  zIndex: -2
                }}>
                  {isCard7 ? card7Data.title : cardData[currentStep].title}
                </span>
                <span className="absolute inset-0" style={{ 
                  color: 'rgba(0,0,0,0.4)',
                  transform: 'translate(15px, 15px)',
                  zIndex: -1
                }}>
                  {isCard7 ? card7Data.title : cardData[currentStep].title}
                </span>
                {/* Gradient text on top */}
                <span className="bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent relative z-10">
                  {isCard7 ? card7Data.title : cardData[currentStep].title}
                </span>
              </h1>
            )}
          </div>
        </div>

        <div className="relative min-h-screen flex flex-col lg:flex-row pt-8 pb-32">
          {/* Left Side - Card Area - MOBILE: Full Width, DESKTOP: 50% */}
          <div className="w-full lg:w-[55%] flex items-center justify-center p-4 lg:justify-end lg:pr-8">
            <GlassCard size="xl" className="relative max-w-2xl w-full mx-auto lg:mx-0 rounded-[2.5rem]" style={{
              boxShadow: '0 25px 50px rgba(139, 92, 246, 0.4), 0 15px 30px rgba(0, 0, 0, 0.6), 0 35px 70px rgba(138, 43, 226, 0.3)'
            }}>

              <GlassCardHeader className={`text-center space-y-4 pb-8 transition-opacity duration-300 ${
                isContentFading ? 'opacity-0' : 'opacity-100'
              }`}>
                <div className="space-y-3">
                  {/* AI-style text bubble for the question - Responsive */}
                  <div className="relative w-fit max-w-[90%] sm:max-w-md ml-2 sm:ml-4 mt-4">
                    {/* Outer gradient border container */}
                    <div className="p-[2px] bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl">
                      <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-2 sm:px-3 py-1 sm:py-2 relative">
                        <p className="text-white font-medium text-sm sm:text-base lg:text-lg">
                          {isCard7 ? card7Data.subtitle : currentCard?.subtitle}
                        </p>
                      </div>
                    </div>
                    {/* Chat bubble tail - positioned at bottom left edge */}
                    <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-orange-500"></div>
                  </div>

                  {/* User's sent message bubble - Responsive with slide-in animation */}
                  {sentMessages[currentStep] && (
                    <div className={`relative w-fit max-w-[90%] sm:max-w-md ml-auto mr-2 sm:mr-4 mt-6 transition-all duration-500 ${
                      showMessageAnimation ? 'animate-slide-in-up opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                    }`}>
                      <div className="p-[2px] bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
                        <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-2 sm:px-3 py-1 sm:py-2 relative">
                          <p className="text-white font-medium text-sm sm:text-base">
                            {sentMessages[currentStep]}
                          </p>
                        </div>
                      </div>
                      {/* User bubble tail - positioned at bottom right edge */}
                      <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-green-500"></div>
                    </div>
                  )}

                  {/* Show thumbnails for Card 7 selections */}
                  {isCard7 && (selectedStyleImages.length > 0 || selectedColorImages.length > 0 || 
                    selectedSizeImages.length > 0 || selectedPlacementImages.length > 0) && (
                    <div className="mt-6 space-y-2">
                      <p className="text-xs sm:text-sm text-muted-foreground">Your Selections:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {selectedStyleImages.map((url, idx) => (
                          <div key={`style-${idx}`} className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 border-orange-500">
                            <Image src={url} alt="Style" fill className="object-cover" unoptimized />
                          </div>
                        ))}
                        {selectedColorImages.map((url, idx) => (
                          <div key={`color-${idx}`} className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 border-orange-500">
                            <Image src={url} alt="Color" fill className="object-cover" unoptimized />
                          </div>
                        ))}
                        {selectedSizeImages.map((url, idx) => (
                          <div key={`size-${idx}`} className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 border-orange-500">
                            <Image src={url} alt="Size" fill className="object-cover" unoptimized />
                          </div>
                        ))}
                        {selectedPlacementImages.map((url, idx) => (
                          <div key={`placement-${idx}`} className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 border-orange-500">
                            <Image src={url} alt="Placement" fill className="object-cover" unoptimized />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </GlassCardHeader>
              
              <GlassCardContent className={`space-y-4 pt-6 transition-opacity duration-300 ${
                isContentFading ? 'opacity-0' : 'opacity-100'
              }`}>
                {/* Preset Options - Show for Q1-6, hide for Card 7 */}
                <div className="space-y-2">
                  {!isCard7 && currentCard && (
                    <>
                      <p className="text-xs sm:text-sm text-muted-foreground">Select all that apply:</p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">{currentCard.options.map((option, index) => (
                          <Badge 
                            key={index}
                            variant="secondary" 
                            onClick={() => handleOptionClick(option, index)}
                            className={`cursor-pointer text-xs sm:text-sm py-1 px-2 sm:px-3 transition-all duration-200 transform hover:scale-105 rounded-2xl ${
                              selectedOptions.includes(index)
                                ? 'bg-orange-500/30 text-orange-300 border-orange-500/50'
                            : 'hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30'
                        }`}
                      >
                        {option}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Input Field with Microphone and Send Button - ALWAYS VISIBLE */}
            <div className="relative">
              <GlassTextarea
                value={responses[currentStep]}
                onChange={(e) => handleResponseChange(e.target.value)}
                placeholder={isCard7 ? "Add any additional notes or preferences..." : currentCard?.placeholder}
                className="min-h-20 sm:min-h-24 pr-16 sm:pr-20 text-sm sm:text-base"
              />
              {/* Microphone Button - Responsive positioning */}
              <Button
                size="sm"
                variant="ghost"
                className={`absolute bottom-1 right-14 sm:right-20 bg-transparent hover:bg-white/10 text-white px-1.5 sm:px-2 py-1 h-7 sm:h-8 flex items-center gap-1 transition-all duration-200 ${
                  isListening ? 'bg-red-500/20 text-red-400' : ''
                }`}
                onClick={handleSpeechToText}
                disabled={isListening}
                aria-label="Voice input"
              >
                <Mic className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isListening ? 'animate-pulse' : ''}`} />
              </Button>
              {/* Send Button - Responsive */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute bottom-1 right-1 bg-transparent hover:bg-white/10 text-white px-2 sm:px-3 py-1 h-7 sm:h-8 flex items-center gap-1"
                onClick={handleSendMessage}
                disabled={!responses[currentStep]?.trim()}
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Send</span>
              </Button>
            </div>
            
            {/* Progress Indicator - Always visible */}
            <div className="flex justify-center space-x-2 py-2">
              {cardData.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-orange-500 w-6' 
                      : index < currentStep 
                        ? 'bg-orange-300' 
                        : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="ghost" 
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 hover:bg-muted/50 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button 
                variant="ghost"
                onClick={handleSkip}
                className="flex items-center gap-2 hover:bg-muted/50 text-white/70 hover:text-orange-400 transition-colors"
              >
                Skip
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!sentMessages[currentStep]}
                className={`flex items-center gap-2 disabled:opacity-50 transition-all duration-200 ${
                  sentMessages[currentStep] 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg transform scale-105' 
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </GlassCardContent>
        </GlassCard>
        </div>
        
        {/* Right Side - Sketchpad Component */}
        <Sketchpad />
        </div>
      </>

      {/* WELCOME SCREEN OVERLAY - Shows on top with blur background */}
      {showWelcomeOverlay && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl overflow-y-auto transition-all duration-1000 ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}>
          <GlassCard size="lg" className={`max-w-2xl my-4 transition-all duration-1000 ${
            isTransitioning ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
          }`}>
            <GlassCardHeader className="text-center space-y-4 pb-6">
              <div className="space-y-3">
                {/* Welcome Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent px-4 py-3 leading-tight">
                  Welcome to TaTTTy
                </h1>
                
                {/* Subtitle */}
                <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto px-4">
                  This is where your story becomes ink. Every scar, every win, every truth—put on the pad.
                </p>
              </div>
            </GlassCardHeader>
            
            <GlassCardContent className="space-y-4">
              {/* What to Expect */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-center bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                  What to Expect
                </h3>
                <div className="space-y-2 max-w-xl mx-auto px-4 text-sm">
                  <p className="text-white/90">Some questions will hit deep.</p>
                  <p className="text-white/90">Others will feel light.</p>
                  <p className="text-white/90 font-medium">The sharper your words, the sharper your design.</p>
                </div>
              </div>

              {/* Privacy */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-center bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                  Privacy
                </h3>
                <div className="space-y-2 max-w-xl mx-auto px-4 text-sm">
                  <p className="text-white/90">What happens here stays here. We don't keep your words, your voice, or your story.</p>
                  <p className="text-white/90">When the session's done, it's gone—like smoke in the air.</p>
                  <p className="text-white/70 italic">If you choose to save it, that's on you.</p>
                  <p className="text-xs text-white/60 mt-2">
                    <a href="https://tattty.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-400 transition-colors">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>

              {/* Guidance */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-center bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                  Guidance
                </h3>
                <div className="space-y-2 max-w-xl mx-auto px-4 text-sm">
                  <p className="text-white/90">Need help? Tap the help tooltip anytime.</p>
                  <p className="text-white/90">Want to answer out loud? Hit the mic beside the send button—or just type.</p>
                </div>
              </div>

              {/* Start Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleStartJourney}
                  className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold text-base px-6 py-5 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      )}

    </MainLayout>
  )
}
