import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"

export async function GET() {
  try {
    // Get all questions from BOTH sets
    const { data: allQuestionsData, error: questionsError } = await executeQuery<{
      question_id: string
      question_text: string
      display_order: number
      question_type: string
      skip_allowed: boolean
      page_headline: string | null
      question_subtitle: string | null
      set_id: string
      card_number: number
    }[]>(
      `SELECT question_id, question_text, display_order, question_type, skip_allowed, 
              page_headline, question_subtitle, set_id, card_number 
       FROM questions 
       WHERE is_active = true 
       ORDER BY set_id, card_number`
    )

    if (questionsError || !allQuestionsData) {
      console.error("Error fetching questions:", questionsError)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    // Define unique batch IDs with clear naming
    const BATCH_IDS = {
      'BATCH_A_SET1_FIRST_SET2_FIRST': 'batch-a-s1-first-s2-first',
      'BATCH_B_SET2_FIRST_SET1_FIRST': 'batch-b-s2-first-s1-first',
      'BATCH_C_SET1_SECOND_SET2_SECOND': 'batch-c-s1-second-s2-second',
      'BATCH_D_SET2_SECOND_SET1_SECOND': 'batch-d-s2-second-s1-second'
    }

    // Define each batch with specific question IDs from database
    const BATCHES = {
      [BATCH_IDS.BATCH_A_SET1_FIRST_SET2_FIRST]: [
        '550e8400-e29b-41d4-a716-446655440010', // Set 1, Card 1
        '550e8400-e29b-41d4-a716-446655440020', // Set 2, Card 1
        '550e8400-e29b-41d4-a716-446655440011', // Set 1, Card 2
        '550e8400-e29b-41d4-a716-446655440021', // Set 2, Card 2
        '550e8400-e29b-41d4-a716-446655440012', // Set 1, Card 3
        '550e8400-e29b-41d4-a716-446655440022', // Set 2, Card 3
      ],
      [BATCH_IDS.BATCH_B_SET2_FIRST_SET1_FIRST]: [
        '550e8400-e29b-41d4-a716-446655440020', // Set 2, Card 1
        '550e8400-e29b-41d4-a716-446655440010', // Set 1, Card 1
        '550e8400-e29b-41d4-a716-446655440021', // Set 2, Card 2
        '550e8400-e29b-41d4-a716-446655440011', // Set 1, Card 2
        '550e8400-e29b-41d4-a716-446655440022', // Set 2, Card 3
        '550e8400-e29b-41d4-a716-446655440012', // Set 1, Card 3
      ],
      [BATCH_IDS.BATCH_C_SET1_SECOND_SET2_SECOND]: [
        '550e8400-e29b-41d4-a716-446655440013', // Set 1, Card 4
        '550e8400-e29b-41d4-a716-446655440023', // Set 2, Card 4
        '550e8400-e29b-41d4-a716-446655440014', // Set 1, Card 5
        '550e8400-e29b-41d4-a716-446655440024', // Set 2, Card 5
        '550e8400-e29b-41d4-a716-446655440015', // Set 1, Card 6
        '550e8400-e29b-41d4-a716-446655440025', // Set 2, Card 6
      ],
      [BATCH_IDS.BATCH_D_SET2_SECOND_SET1_SECOND]: [
        '550e8400-e29b-41d4-a716-446655440023', // Set 2, Card 4
        '550e8400-e29b-41d4-a716-446655440013', // Set 1, Card 4
        '550e8400-e29b-41d4-a716-446655440024', // Set 2, Card 5
        '550e8400-e29b-41d4-a716-446655440014', // Set 1, Card 5
        '550e8400-e29b-41d4-a716-446655440025', // Set 2, Card 6
        '550e8400-e29b-41d4-a716-446655440015', // Set 1, Card 6
      ]
    }

    // Randomly select one batch
    const batchKeys = Object.keys(BATCH_IDS)
    const randomBatchKey = batchKeys[Math.floor(Math.random() * batchKeys.length)]
    const selectedBatchId = BATCH_IDS[randomBatchKey as keyof typeof BATCH_IDS]
    const selectedQuestionIds = BATCHES[selectedBatchId]

    console.log(`[QUESTIONS API] Selected Batch: ${selectedBatchId}`)
    console.log(`[QUESTIONS API] Question IDs: ${selectedQuestionIds.join(', ')}`)

    // Filter and order questions based on selected batch
    const selectedQuestions = selectedQuestionIds
      .map(questionId => allQuestionsData.find(q => q.question_id === questionId))
      .filter(q => q !== undefined) as typeof allQuestionsData

    console.log(`[QUESTIONS API] Found ${selectedQuestions.length} questions for batch ${selectedBatchId}`)

    // Get options for each question dynamically
    const questionsWithOptions = await Promise.all(
      selectedQuestions.map(async (question, index) => {
        const { data: optionsData, error: optionsError } = await executeQuery<{
          option_id: string
          option_text: string
          display_order: number
        }>(
          "SELECT option_id, option_text, display_order FROM options WHERE question_id = $1 AND is_active = true ORDER BY display_order ASC",
          [question.question_id]
        )

        if (optionsError) {
          console.error("Error fetching options for question:", question.question_id, optionsError)
        }

        const optionsArray = Array.isArray(optionsData) ? optionsData.map((option: any) => option.option_text) : []

        return {
          id: question.question_id,
          questionText: question.question_text,
          displayOrder: index + 1, // Re-number them 1-6 in braided order
          questionType: question.question_type,
          isRequired: !question.skip_allowed,
          pageHeadline: question.page_headline,
          questionSubtitle: question.question_subtitle,
          options: optionsArray,
          setId: question.set_id,
          originalCardNumber: question.card_number
        }
      })
    )

    console.log(`[QUESTIONS API] Returning ${questionsWithOptions.length} questions with options`)

    return NextResponse.json(questionsWithOptions)
  } catch (error) {
    console.error("Error in questions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}