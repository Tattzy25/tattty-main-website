import { Sparkles } from "lucide-react"
import type { QuestionCard } from "../types"

export const question1: QuestionCard = {
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
}
