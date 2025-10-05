import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"

export async function GET() {
  try {
    // Define available batch IDs
    const BATCH_IDS = [
      'batch-a-s1-first-s2-first',
      'batch-b-s2-first-s1-first',
      'batch-c-s1-second-s2-second',
      'batch-d-s2-second-s1-second'
    ]

    // Randomly select one batch
    const selectedBatchId = BATCH_IDS[Math.floor(Math.random() * BATCH_IDS.length)]
    
    console.log(`\n🎲 ========================================`)
    console.log(`[QUESTIONS API] Selected Batch: ${selectedBatchId}`)
    console.log(`🎲 ========================================\n`)

    // Query questions for the selected batch from database with proper ordering
    const { data: questionsData, error: questionsError } = await executeQuery<{
      question_id: string
      question_text: string
      display_order: number
      question_type: string
      skip_allowed: boolean
      page_headline: string | null
      question_subtitle: string | null
      set_id: string
      card_number: number
      position: number
    }[]>(
      `SELECT 
        q.question_id, 
        q.question_text, 
        q.display_order, 
        q.question_type, 
        q.skip_allowed, 
        q.page_headline, 
        q.question_subtitle, 
        q.set_id, 
        q.card_number,
        ba.position
       FROM questions q
       INNER JOIN batch_assignments ba ON q.question_id = ba.question_id
       WHERE ba.batch_id = $1 AND q.is_active = true
       ORDER BY ba.position ASC`,
      [selectedBatchId]
    )

    if (questionsError || !questionsData) {
      console.error("Error fetching questions for batch:", questionsError)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    console.log(`[QUESTIONS API] Found ${questionsData.length} questions for batch ${selectedBatchId}`)
    console.log(`[QUESTIONS API] Question order: ${questionsData.map(q => `Set${q.set_id.endsWith('0000') ? '1' : '2'}-Card${q.card_number}`).join(', ')}`)
    console.log(`\n📊 Batch Details:`)
    questionsData.forEach((q, idx) => {
      console.log(`  Position ${idx + 1}: ${q.page_headline} (Set ${q.set_id.endsWith('0000') ? '1' : '2'}, Card ${q.card_number})`)
    })
    console.log(`\n`)

    // Get options for each question dynamically
    const questionsWithOptions = await Promise.all(
      questionsData.map(async (question, index) => {
        const { data: optionsData, error: optionsError } = await executeQuery<{
          option_id: string
          option_text: string
          display_order: number
        }>(
          "SELECT option_id, option_text, display_order FROM options WHERE question_id = $1 AND is_active = true ORDER BY display_order ASC LIMIT 12",
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