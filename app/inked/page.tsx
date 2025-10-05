"use client"

import { useEffect } from "react"
import MainLayout from "@/components/main-layout"
import { StateCard } from "@/components/states"
import { ChatBox } from "@/components/chat-box"
import { WelcomeScreen } from "@/components/welcome-screen"
import { GenerationResults } from "@/components/generation-results"
import { DynamicHeadline } from "@/components/dynamic-headline"
import { RightSidePanel } from "@/components/right-side-panel"
import { generateAIFollowUpQuestion } from "@/lib/ai-logic"
import { allQuestions } from "@/data/tattty-qs"
import { card7Data, card7Categories } from "@/data/tattty-card-7"
import { createFinalQuestion, finalQuestionConfig } from "@/data/tattty-final-q"
import { useQuestionnaireFlow } from "@/hooks/use-questionnaire-flow"
import { useImageLoading } from "@/hooks/use-image-loading"
import { useGenerationFlow } from "@/hooks/use-generation-flow"
import "./inked.css"

// Import all questions from separate files
const cardData = allQuestions

export default function InkdPage() {
  // Hook 1: Questionnaire Flow (all state + navigation + handlers)
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
    totalCards: cardData.length + 2
  })

  // Hook 2: Image Loading (Card 7 images)
  const { categoryImages } = useImageLoading()

  // Hook 3: Generation Flow (loading + results)
  const {
    isGenerating,
    generatedImages,
    showResults,
    handleBuildClick,
    handleDownload,
    handleEmail,
    handleSave,
    handleBackHome,
    handleStartNew,
  } = useGenerationFlow()

  const currentCard = cardData[currentStep]
  const IconComponent = currentCard?.icon
  const isCard7 = currentStep === cardData.length // Card 7 is right after question 6
  const isCard8 = currentStep === cardData.length + 1 // Card 8 is after Card 7

  // Generate AI follow-up question when user reaches Card 8
  useEffect(() => {
    if (isCard8 && !aiFollowUpQuestion && finalQuestionConfig.enableAIQuestion) {
      const question = generateAIFollowUpQuestion(
        sentMessages,
        selectedImages,
        cardData.length
      )
      setAiFollowUpQuestion(question)
    }
  }, [isCard8, aiFollowUpQuestion, sentMessages, selectedImages])

  // Dynamic Card 8 data with AI-generated question
  const card8Data = createFinalQuestion(aiFollowUpQuestion)

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

  // Wrapper for handleNext to pass the build handler
  const wrappedHandleNext = () => {
    handleNext(() => handleBuildClick(sentMessages, cardData.length, selectedImages, uploadedImages))
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
          {((currentStep < cardData.length && cardData[currentStep].title) || isCard7 || isCard8) && (
            <DynamicHeadline 
              title={isCard7 ? card7Data.title : isCard8 ? card8Data.title : cardData[currentStep].title}
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
            sentMessages={sentMessages}
            showMessageAnimation={showMessageAnimation}
            selectedStyleImages={selectedImages}
            responses={responses}
            selectedOptions={selectedOptions}
            isListening={isListening}
            cardData={cardData}
            card7Data={card7Data}
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
            card7Categories={card7Categories}
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

    </MainLayout>
  )
}
