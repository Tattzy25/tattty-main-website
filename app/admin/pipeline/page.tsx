"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Save, RefreshCw } from "lucide-react"

export default function PipelinePage() {
  const [box1Data, setBox1Data] = useState("")
  const [box2Data, setBox2Data] = useState("")
  const [box3Data, setBox3Data] = useState("")
  const [box4Data, setBox4Data] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPipelineData()
  }, [])

  const loadPipelineData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/pipeline")
      if (response.ok) {
        const data = await response.json()
        setBox1Data(data.box1 || "")
        setBox2Data(data.box2 || "")
        setBox3Data(data.box3 || "")
        setBox4Data(data.box4 || "")
      }
    } catch (error) {
      console.error("Failed to load pipeline data:", error)
    }
    setLoading(false)
  }

  const savePipelineData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          box1: box1Data,
          box2: box2Data,
          box3: box3Data,
          box4: box4Data,
        }),
      })
      
      if (response.ok) {
        alert("Pipeline configuration saved successfully")
      }
    } catch (error) {
      console.error("Failed to save pipeline data:", error)
      alert("Failed to save configuration")
    }
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline Configuration</h1>
          <p className="text-muted-foreground">Manage tattoo generation pipeline logic and flow</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadPipelineData} variant="outline" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={savePipelineData} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BOX 1: Questions 1-7 Logic */}
        <Card className="border-green-500/50">
          <CardHeader>
            <CardTitle className="text-green-600">Box 1: Questions 1-7 Flow</CardTitle>
            <CardDescription>
              Logic for questionnaire cards 1-7 (Life Stage, Identity, Emotions, Symbols, Themes, Avoid, Details)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="box1">Configuration</Label>
              <Textarea
                id="box1"
                value={box1Data}
                onChange={(e) => setBox1Data(e.target.value)}
                placeholder="Enter questions 1-7 logic configuration..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <p><strong>Source:</strong> app/inked/page.tsx - Questionnaire flow</p>
              <p><strong>Data:</strong> responses[0-6] array</p>
              <p><strong>Flow:</strong> Card progression with Skip/Next logic</p>
            </div>
          </CardContent>
        </Card>

        {/* BOX 2: Card 8 Follow-up Question Logic */}
        <Card className="border-blue-500/50">
          <CardHeader>
            <CardTitle className="text-blue-600">Box 2: Card 8 Follow-up Question</CardTitle>
            <CardDescription>
              Logic for generating AI follow-up question based on user responses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="box2">Configuration</Label>
              <Textarea
                id="box2"
                value={box2Data}
                onChange={(e) => setBox2Data(e.target.value)}
                placeholder="Enter Card 8 follow-up question logic..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <p><strong>Source:</strong> lib/ai-logic/tattoo-generation.ts - generateAIFollowUpQuestion()</p>
              <p><strong>API:</strong> app/actions/groq.ts - generateFollowUpQuestionAction()</p>
              <p><strong>Workflow:</strong> Groq API call with session summary</p>
            </div>
          </CardContent>
        </Card>

        {/* BOX 3: Groq Prompt Generation Logic */}
        <Card className="border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-purple-600">Box 3: Groq Prompt Generation</CardTitle>
            <CardDescription>
              Logic for gathering all data sources and generating optimized prompts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="box3">Configuration</Label>
              <Textarea
                id="box3"
                value={box3Data}
                onChange={(e) => setBox3Data(e.target.value)}
                placeholder="Enter Groq prompt generation logic..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <p><strong>Source 1:</strong> responses[0-6] - Questionnaire answers</p>
              <p><strong>Source 2:</strong> selectedImages - Style/Color/Placement/Size gallery selections</p>
              <p><strong>Processing:</strong> lib/ai-logic/groq-prompts.ts - generateFinalPrompt()</p>
              <p><strong>Output:</strong> Positive + Negative prompts for Stability AI</p>
            </div>
          </CardContent>
        </Card>

        {/* BOX 4: Stability API Pipeline Logic */}
        <Card className="border-orange-500/50">
          <CardHeader>
            <CardTitle className="text-orange-600">Box 4: Stability API Pipeline</CardTitle>
            <CardDescription>
              Complete API pipeline from Groq to Stability AI image generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="box4">Configuration</Label>
              <Textarea
                id="box4"
                value={box4Data}
                onChange={(e) => setBox4Data(e.target.value)}
                placeholder="Enter Stability API pipeline logic..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <p><strong>Input:</strong> Positive/Negative prompts from Groq</p>
              <p><strong>API Calls:</strong> app/actions/stability.ts - generateTattooImagePairAction()</p>
              <p><strong>Pipeline:</strong> Stencil generation → Color generation</p>
              <p><strong>Storage:</strong> Vercel Blob for image storage</p>
              <p><strong>Database:</strong> Neon for tattoo metadata</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Pipeline Flow Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>1. User starts questionnaire</strong> → Box 1 controls questions 1-7 flow</p>
            <p><strong>2. After card 7 completion</strong> → Box 2 generates AI follow-up question (card 8)</p>
            <p><strong>3. User clicks Build button</strong> → Box 3 gathers all data (questionnaire + image selections) and sends to Groq</p>
            <p><strong>4. Groq returns prompts</strong> → Box 4 sends to Stability API for image generation</p>
            <p><strong>5. Images generated</strong> → Stored in Vercel Blob, metadata in Neon database</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
