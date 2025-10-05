import { Users } from "lucide-react"
import type { QuestionCard } from "../types"

export const question4: QuestionCard = {
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
}
