"use client"

import { useEffect, useState } from "react"
import MainLayout from "@/components/main-layout"
import { StateCard } from "@/components/states"
import { ChatBox } from "@/components/chat-box"
import { WelcomeScreen } from "@/components/welcome-screen"
import { GenerationResults } from "@/components/generation-results"
import { DynamicHeadline } from "@/components/dynamic-headline"
import { RightSidePanel } from "@/components/right-side-panel"
import { ErrorPopup } from "@/components/error-popup"
import { PurpleLoading } from "@/components/purple-loading"
import { generateAIFollowUpQuestion } from "@/lib/ai-logic"
import { createFinalQuestion } from "@/data/tattty-final-q"
import { MessageCircle } from "lucide-react"
import { useQuestionnaireFlow } from "@/hooks/use-questionnaire-flow"
import { useImageLoading } from "@/hooks/use-image-loading"
import { useGenerationFlow } from "@/hooks/use-generation-flow"
import "./inked.css"

export default function InkdPage() {
  // State for dynamic data loading
  const [cardData, setCardData] = useState<any[]>([])
  const [card7Data, setCard7Data] = useState<any>({})
  const [card7Categories, setCard7Categories] = useState<any[]>([])
  const [finalQuestion, setFinalQuestion] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Hook 1: Questionnaire Flow (all state + navigation + handlers) - MUST be called before any conditional returns
  const {
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
    setAiFollowUpQuestion,
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
  } = useQuestionnaireFlow({
    totalQuestions: cardData.length,
    totalCards: cardData.length + 2 // +2 for card7 and final card
  })

  // Hook 2: Image Loading (Card 7 images)
  const { categoryImages, loading: imagesLoading } = useImageLoading()

  // Hook 3: Generation Flow (loading + results + errors)
  const {
    isGenerating,
    generatedImages,
    showResults,
    errorMessage,
    retryCount,
    handleBuildClick,
    handleRetry,
    handleCloseError,
    handleDownload,
    handleEmail,
    handleSave,
    handleBackHome,
    handleStartNew,
  } = useGenerationFlow()

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        
        // Fetch questions from database
        const questionsResponse = await fetch('/api/questions')
        if (!questionsResponse.ok) {
          throw new Error(`Failed to fetch questions: ${questionsResponse.status} ${questionsResponse.statusText}`)
        }
        const questionsData = await questionsResponse.json()
        
        if (!questionsData || questionsData.length === 0) {
          throw new Error('No questions found in database. Please check database connection.')
        }
        
        setCardData(questionsData)

        // Fetch styles for card 7
        const stylesResponse = await fetch('/api/styles')
        if (!stylesResponse.ok) {
          throw new Error(`Failed to fetch styles: ${stylesResponse.status} ${stylesResponse.statusText}`)
        }
        const stylesData = await stylesResponse.json()
        
        if (!stylesData || stylesData.length === 0) {
          throw new Error('No tattoo styles found in database. Please check database connection.')
        }

        // Fetch color options
        const colorResponse = await fetch('/api/color')
        if (!colorResponse.ok) {
          throw new Error(`Failed to fetch color options: ${colorResponse.status} ${colorResponse.statusText}`)
        }
        const colorData = await colorResponse.json()

        // Fetch size options
        const sizeResponse = await fetch('/api/size')
        if (!sizeResponse.ok) {
          throw new Error(`Failed to fetch size options: ${sizeResponse.status} ${sizeResponse.statusText}`)
        }
        const sizeData = await sizeResponse.json()

        // Fetch placement options
        const placementResponse = await fetch('/api/placement')
        if (!placementResponse.ok) {
          throw new Error(`Failed to fetch placement options: ${placementResponse.status} ${placementResponse.statusText}`)
        }
        const placementData = await placementResponse.json()
        
        // Transform styles data for card 7
        const transformedCard7Data = {
          style: stylesData,
          color: colorData,
          size: sizeData,
          placement: placementData
        }
        setCard7Data(transformedCard7Data)
        setCard7Categories(['style', 'color', 'size', 'placement'])

        // Card 8: Use proper module instead of hard-coding
        const card8 = createFinalQuestion()
        setFinalQuestion(card8)

      } catch (err) {
        console.error('Error loading data:', err)
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while loading questionnaire data.'
        setLoadError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate derived values that hooks depend on (MUST be before conditional returns)
  const currentCard = cardData[currentStep] || null
  const IconComponent = currentCard?.icon || null
  const isCard7 = cardData.length > 0 && currentStep === cardData.length // Card 7 is right after question 6
  const isCard8 = cardData.length > 0 && currentStep === cardData.length + 1 // Card 8 is after Card 7

  // Generate AI follow-up question when user reaches Card 8 (MUST be before conditional returns)
  useEffect(() => {
    if (isCard8 && !aiFollowUpQuestion) {
      // Call async function
      const loadFollowUpQuestion = async () => {
        // Create a summary string of user responses for AI context
        const userContext = `User responses: ${sentMessages.join(', ')}. Selected images: ${Object.keys(selectedImages).length} categories selected.`
        const question = await generateAIFollowUpQuestion(userContext)
        setAiFollowUpQuestion(question)
      }
      loadFollowUpQuestion()
    }
  }, [isCard8, aiFollowUpQuestion, sentMessages, selectedImages, cardData.length])

  // Card 7 data (Style Selection) - using imported data
  const card7DataFormatted = card7Data && Object.keys(card7Data).length > 0 ? {
    id: "style-selection",
    cardType: "style" as const,
    title: card7Data.title,
    subtitle: card7Data.subtitle,
    description: card7Data.description,
    placeholder: card7Data.placeholder,
    options: card7Data.options || [],
    icon: null,
  } : null

  // Dynamic Card 8 data with AI-generated question
  const card8Data = finalQuestion ? {
    id: 'final',
    title: finalQuestion.title,
    questionText: aiFollowUpQuestion,
    subtitle: aiFollowUpQuestion,
    description: finalQuestion.description,
    placeholder: finalQuestion.placeholder,
    icon: finalQuestion.icon,
    options: finalQuestion.options || [],
    questionType: 'final',
    isRequired: false
  } : null

  // Format card7 categories for the components
  const card7CategoriesFormatted = card7Categories.map(categoryId => ({
    id: categoryId,
    name: categoryId,
    label: categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
  }))

  // Wrapper for handleNext to pass the build handler
  const wrappedHandleNext = () => {
    handleNext(() => handleBuildClick(sentMessages, cardData.length, selectedImages, uploadedImages))
  }

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <PurpleLoading size={150} speed={2.5} />
        </div>
      </MainLayout>
    )
  }

  // Show error state with retry
  if (loadError) {
    throw new Error(loadError)
  }

  // Don't render until we have the data
  if (!cardData.length || !finalQuestion) {
    return null
  }

  return (
    <MainLayout>
      {/* GENERATION RESULTS - Full Screen */}
      {showResults && (
        <GenerationResults
          images={generatedImages}
          onDownload={handleDownload}
          onEmail={handleEmail}
          onSave={handleSave}
          onBackHome={handleBackHome}
          onStartNew={handleStartNew}
        />
      )}

      {/* LOADING STATE - Full Screen */}
      {isGenerating && (
        <div className="fixed inset-0 z-40 bg-black flex items-center justify-center">
          <StateCard />
        </div>
      )}

      {/* MAIN QUESTIONNAIRE - Hidden during generation/results */}
      {!isGenerating && !showResults && (
        <>
          {/* Hero Headline - Dynamic based on current question */}
          {((currentStep < cardData.length && cardData[currentStep].pageHeadline) || isCard7 || isCard8) && (
            <DynamicHeadline 
              title={isCard7 ? card7DataFormatted?.title : isCard8 ? card8Data?.title : cardData[currentStep].pageHeadline}
              isContentFading={isContentFading}
            />
          )}

        <div className="relative min-h-screen flex flex-col lg:flex-row pt-8 pb-32">
          {/* Chat Box - Always visible on the left */}
          <ChatBox
            currentStep={currentStep}
            currentCard={isCard8 ? card8Data : currentCard}
            isCard7={isCard7}
            isCard8={isCard8}
            isContentFading={isContentFading}
            isLoadingAIQuestion={isCard8 && !aiFollowUpQuestion}
            sentMessages={sentMessages}
            showMessageAnimation={showMessageAnimation}
            selectedStyleImages={selectedImages}
            responses={responses}
            selectedOptions={selectedOptions}
            isListening={isListening}
            cardData={cardData}
            card7Data={card7DataFormatted}
            uploadedImages={uploadedImages}
            handleResponseChange={handleResponseChange}
            handleSendMessage={handleSendMessage}
            handleSpeechToText={handleSpeechToText}
            handleOptionClick={handleOptionClick}
            handlePrevious={handlePrevious}
            handleSkip={handleSkip}
            handleNext={wrappedHandleNext}
            handleImageUpload={handleImageUpload}
            handleRemoveUploadedImage={handleRemoveUploadedImage}
          />
        
          {/* Right Side - Dynamic panel based on current card */}
          <RightSidePanel
            isCard7={isCard7}
            isCard8={isCard8}
            card7Categories={card7CategoriesFormatted}
            categoryImages={categoryImages}
            selectedImages={selectedImages}
            onImageSelect={handleImageSelect}
            sentMessages={sentMessages}
            cardData={cardData}
          />
        </div>
        </>
      )}

      {/* WELCOME SCREEN OVERLAY - Shows on top with blur background */}
      <WelcomeScreen
        showWelcomeOverlay={showWelcomeOverlay}
        isTransitioning={isTransitioning}
        onStartJourney={handleStartJourney}
      />

      {/* ERROR POPUP - User-friendly error with retry */}
      {errorMessage && (
        <ErrorPopup
          message={errorMessage}
          onRetry={handleRetry}
          onClose={handleCloseError}
          retryCount={retryCount}
        />
      )}

    </MainLayout>
  )
}
