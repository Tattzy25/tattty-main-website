import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"

export async function GET() {
  try {
    // Get all questions with their options
    const { data: questionsData, error: questionsError } = await executeQuery<{
      question_id: string
      question_text: string
      display_order: number
      question_type: string
      skip_allowed: boolean
      page_headline: string | null
      question_subtitle: string | null
    }[]>(
      "SELECT question_id, question_text, display_order, question_type, skip_allowed, page_headline, question_subtitle FROM questions WHERE is_active = true ORDER BY display_order ASC LIMIT 6"
    )

    if (questionsError || !questionsData) {
      console.error("Error fetching questions:", questionsError)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    // Get options for each question
    const questionsWithOptions = await Promise.all(
      questionsData.map(async (question) => {
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
          displayOrder: question.display_order,
          questionType: question.question_type,
          isRequired: !question.skip_allowed,
          pageHeadline: question.page_headline,
          questionSubtitle: question.question_subtitle,
          options: optionsArray
        }
      })
    )

    return NextResponse.json(questionsWithOptions)
  } catch (error) {
    console.error("Error in questions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}