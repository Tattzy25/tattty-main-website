"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PersonalQuestionsProps {
  onSubmit: (answers: string[]) => void
  isVoiceMode: boolean
  speak: (text: string) => void
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  initialFocusRef?: React.RefObject<HTMLElement>
  tabIndex?: number
}

const questions = [
  "What life experience has shaped you the most?",
  "What symbol or image represents your strength or resilience?",
  "What's a value or belief that guides your decisions?",
  "What's a dream or aspiration you're working towards?",
]

// Example responses for each question to help users
const exampleResponses = [
  [
    "Moving to a new country and starting over from scratch taught me adaptability.",
    "Surviving a serious illness changed my perspective on what matters in life.",
    "The birth of my child transformed how I see my purpose in the world.",
  ],
  [
    "A phoenix, because I've risen from difficult situations stronger than before.",
    "A mountain, representing the challenges I've overcome and heights I've reached.",
    "A tree with deep roots, showing my connection to family and growth over time.",
  ],
  [
    "Honesty guides all my interactions, even when it's difficult.",
    "Compassion for others drives my decisions and how I treat people.",
    "Personal freedom and autonomy are essential to how I live my life.",
  ],
  [
    "Building a sustainable business that helps solve environmental problems.",
    "Creating art that moves people and leaves a lasting impression.",
    "Traveling to every continent and experiencing diverse cultures.",
  ],
]

// Help prompts for each question
const helpPrompts = [
  "Think about moments that changed your direction in life, challenges you've overcome, or relationships that transformed you.",
  "Consider symbols from nature, mythology, or personal interests that represent qualities you admire or embody.",
  "Reflect on principles that help you make difficult decisions or the philosophy that guides how you interact with others.",
  "Think about what you're working toward, what success looks like to you, or what you hope your legacy might be.",
]

export function PersonalQuestions({
  onSubmit,
  isVoiceMode,
  speak,
  isListening,
  transcript,
  startListening,
  stopListening,
  initialFocusRef,
  tabIndex,
}: PersonalQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""))
  const [isTyping, setIsTyping] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [isReadyToMoveOn, setIsReadyToMoveOn] = useState(false)
  const [assistantMessage, setAssistantMessage] = useState("")
  const [userQuestion, setUserQuestion] = useState("")
  const [isAskingQuestion, setIsAskingQuestion] = useState(false)
  const [showTextInput, setShowTextInput] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastTranscriptRef = useRef("")
  const conversationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initial question prompt when component mounts or question changes
  useEffect(() => {
    if (isVoiceMode && currentQuestion < questions.length) {
      const initialPrompt = `${questions[currentQuestion]} Take your time to think about it. You can ask me for examples or help if you need inspiration.`
      speak(initialPrompt)

      // Focus the textarea when component mounts
      if (initialFocusRef && initialFocusRef.current) {
        initialFocusRef.current = textareaRef.current as unknown as HTMLButtonElement
        textareaRef.current?.focus()
      }
    }
  }, [currentQuestion, isVoiceMode, speak, initialFocusRef])

  // Handle typing animation when listening
  useEffect(() => {
    if (isListening && transcript) {
      setIsTyping(true)
      const timer = setTimeout(() => {
        setIsTyping(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [transcript, isListening])

  // Process transcript when user stops speaking
  useEffect(() => {
    if (!isListening && transcript && !isTyping && transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript

      // Check if user is asking for help or examples
      const lowerTranscript = transcript.toLowerCase()

      if (
        lowerTranscript.includes("example") ||
        lowerTranscript.includes("show me") ||
        lowerTranscript.includes("like what")
      ) {
        handleShowExamples()
        return
      }

      if (
        lowerTranscript.includes("help") ||
        lowerTranscript.includes("not sure") ||
        lowerTranscript.includes("don't know")
      ) {
        handleShowHelp()
        return
      }

      if (isAskingQuestion) {
        // Handle user's question with AI response
        setUserQuestion(transcript)
        handleUserQuestion(transcript)
        return
      }

      // Otherwise, treat as an answer to the current question
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = transcript
      setAnswers(newAnswers)

      // After receiving an answer, prompt if they want to move on
      if (conversationTimeoutRef.current) {
        clearTimeout(conversationTimeoutRef.current)
      }

      conversationTimeoutRef.current = setTimeout(() => {
        setIsReadyToMoveOn(true)
        if (isVoiceMode) {
          speak(
            "That's a great answer. Are you ready to move on to the next question, or would you like to revise your answer?",
          )
        }
      }, 1500)
    }
  }, [isListening, transcript, isTyping, currentQuestion, answers, isVoiceMode, speak, isAskingQuestion])

  // Handle user's question with AI response
  const handleUserQuestion = (question: string) => {
    setIsAskingQuestion(false)

    // In a real implementation, this would call GROQ or another AI service
    // For now, we'll simulate responses based on keywords

    let response = "I'm not sure about that. Could you try asking something related to the current question?"
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("example") || lowerQuestion.includes("like what")) {
      handleShowExamples()
      return
    } else if (lowerQuestion.includes("help") || lowerQuestion.includes("how")) {
      handleShowHelp()
      return
    } else if (lowerQuestion.includes("tattoo") || lowerQuestion.includes("design")) {
      response =
        "Your answers will help me create a tattoo design that truly represents your personal journey. The more detailed and meaningful your responses, the better the final design will be."
    } else if (lowerQuestion.includes("next") || lowerQuestion.includes("skip")) {
      response =
        "We can move to the next question whenever you're ready. Just make sure you're satisfied with your current answer first."
      setIsReadyToMoveOn(true)
    } else {
      // Generate a contextual response based on the current question
      const questionResponses = [
        "This question helps me understand pivotal moments in your life that could be symbolized in your tattoo. Think about experiences that changed you fundamentally.",
        "Symbols are powerful in tattoo art. This helps me understand what visual elements might resonate with your personal strength narrative.",
        "Your core values will influence the meaning behind your tattoo design, making it more personally significant.",
        "Your aspirations can be beautifully represented in tattoo art, creating a design that inspires you daily.",
      ]

      response = questionResponses[currentQuestion]
    }

    setAssistantMessage(response)
    if (isVoiceMode) {
      speak(response)
    }
  }

  const handleShowExamples = () => {
    setShowExamples(true)
    if (isVoiceMode) {
      const examplesText = `Here are some examples for this question: ${exampleResponses[currentQuestion].join(". ")}. Does any of these inspire you?`
      speak(examplesText)
    }
  }

  const handleShowHelp = () => {
    setShowHelp(true)
    if (isVoiceMode) {
      speak(helpPrompts[currentQuestion])
    }
  }

  const handleNext = () => {
    setIsReadyToMoveOn(false)
    setAssistantMessage("")

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      if (isVoiceMode) {
        speak("Thank you for sharing your story. Now let's customize your tattoo design.")
      }
      onSubmit(answers)
    }
  }

  const handlePrevious = () => {
    setIsReadyToMoveOn(false)
    setAssistantMessage("")

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = e.target.value
    setAnswers(newAnswers)
  }

  const handleAskQuestion = () => {
    setIsAskingQuestion(true)
    if (isVoiceMode) {
      speak("What would you like to know? I'm here to help.")
      startListening()
    }
  }

  // First, let's modify the handleShowExamples function to make examples clickable
  // and add a function to handle when an example is clicked

  const handleExampleClick = (example: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = example
    setAnswers(newAnswers)
    setShowExamples(false)

    if (isVoiceMode) {
      speak("I've added that example as your answer. You can edit it if you'd like.")
    }
  }

  return (
    <Card className="border-gold-500/20 bg-black/40 max-w-4xl mx-auto" tabIndex={tabIndex}>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gold-500">Tell Me Your Story</h2>
            <div className="text-sm text-zinc-400">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>

          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-500 to-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
            <h3 className="text-xl font-medium text-white mb-4">{questions[currentQuestion]}</h3>

            {isVoiceMode ? (
              <div className="space-y-4">
                <div className="min-h-[120px] bg-zinc-800/50 rounded-lg p-4 text-zinc-300 relative">
                  {isTyping ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  ) : transcript && isAskingQuestion ? (
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Your question:</div>
                      <div>{transcript}</div>
                    </div>
                  ) : transcript ? (
                    transcript
                  ) : answers[currentQuestion] ? (
                    answers[currentQuestion]
                  ) : (
                    <span className="text-zinc-500">
                      Your answer will appear here as you speak, or you can type below...
                    </span>
                  )}

                  {(transcript || answers[currentQuestion]) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2 border-gold-500/30 hover:bg-gold-500/10"
                      onClick={() => {
                        setShowTextInput(true)
                      }}
                    >
                      <Icons.edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                  )}
                </div>

                {showTextInput && (
                  <div className="animate-fadeIn">
                    <Textarea
                      value={answers[currentQuestion]}
                      onChange={handleInputChange}
                      placeholder="Edit your answer here..."
                      className="min-h-[120px] bg-black/20 border-gold-500/30 text-white"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        className="bg-gold-500 hover:bg-gold-600 text-black"
                        onClick={() => setShowTextInput(false)}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}

                {assistantMessage && (
                  <div className="bg-zinc-800/30 border border-gold-500/20 rounded-lg p-4 text-zinc-300 animate-fadeIn">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Icons.sparkles className="h-4 w-4 text-gold-500" />
                      </div>
                      <div>
                        <div className="text-xs text-gold-500 mb-1">Tattzy Assistant:</div>
                        <div>{assistantMessage}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    className={`flex-1 h-12 rounded-lg flex items-center justify-center ${
                      isListening
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600"
                    } text-white transition-all duration-300`}
                    onMouseDown={startListening}
                    onMouseUp={stopListening}
                    onTouchStart={startListening}
                    onTouchEnd={stopListening}
                  >
                    {isListening ? (
                      <>
                        <Icons.mic className="h-5 w-5 animate-pulse" />
                        <span className="ml-2">Listening...</span>
                      </>
                    ) : (
                      <>
                        <Icons.mic className="h-5 w-5" />
                        <span className="ml-2">Hold to Speak</span>
                      </>
                    )}
                  </button>

                  <Button
                    variant="outline"
                    className="border-gold-500/30 hover:bg-gold-500/10"
                    onClick={() => setShowTextInput(!showTextInput)}
                  >
                    <Icons.edit className="mr-2 h-4 w-4" />
                    {showTextInput ? "Hide Text Input" : "Type Answer"}
                  </Button>

                  <Button
                    variant="outline"
                    className="border-gold-500/30 hover:bg-gold-500/10"
                    onClick={handleAskQuestion}
                  >
                    <Icons.helpCircle className="mr-2 h-4 w-4" />
                    Ask a Question
                  </Button>

                  <Button
                    variant="outline"
                    className="border-gold-500/30 hover:bg-gold-500/10"
                    onClick={handleShowExamples}
                  >
                    <Icons.lightbulb className="mr-2 h-4 w-4" />
                    Examples
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={answers[currentQuestion]}
                  onChange={handleInputChange}
                  ref={textareaRef}
                  placeholder="Type your answer here..."
                  className="min-h-[120px] bg-black/20 border-gold-500/30 text-white focus:ring-2 focus:ring-gold-500/50"
                />
                <p className="text-xs text-zinc-400">Share your thoughts and experiences in the text area above.</p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="border-gold-500/30 hover:bg-gold-500/10"
                    onClick={handleShowExamples}
                  >
                    <Icons.lightbulb className="mr-2 h-4 w-4" />
                    Show Examples
                  </Button>

                  <Button
                    variant="outline"
                    className="border-gold-500/30 hover:bg-gold-500/10"
                    onClick={handleShowHelp}
                  >
                    <Icons.helpCircle className="mr-2 h-4 w-4" />
                    Help Me Answer
                  </Button>
                </div>
              </div>
            )}
          </div>

          {isReadyToMoveOn && (
            <div className="bg-zinc-900/70 border border-gold-500/30 rounded-lg p-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Icons.sparkles className="h-4 w-4 text-gold-500" />
                </div>
                <div>
                  <div className="text-xs text-gold-500 mb-1">Tattzy Assistant:</div>
                  <div className="text-zinc-300">
                    That's a great answer. Are you ready to move on to the next question, or would you like to revise
                    your answer?
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="border-gold-500/30 hover:bg-gold-500/10"
            >
              <Icons.arrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
              className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  Next <Icons.arrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Continue to Customization <Icons.arrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Examples Dialog */}
      <Dialog open={showExamples} onOpenChange={setShowExamples}>
        <DialogContent className="bg-zinc-900 border-gold-500/30 text-white">
          <DialogHeader>
            <DialogTitle>Examples</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Here are some examples to inspire your answer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {exampleResponses[currentQuestion].map((example, index) => (
              <div
                key={index}
                className="bg-zinc-800/50 p-3 rounded-lg cursor-pointer hover:bg-zinc-700/50 transition-colors"
                onClick={() => handleExampleClick(example)}
              >
                <div className="flex items-start gap-2">
                  <Icons.quote className="h-4 w-4 text-gold-500 mt-1 flex-shrink-0" />
                  <p>{example}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="bg-zinc-900 border-gold-500/30 text-white">
          <DialogHeader>
            <DialogTitle>Helpful Tips</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Icons.lightbulb className="h-5 w-5 text-gold-500 mt-1 flex-shrink-0" />
                <p>{helpPrompts[currentQuestion]}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
