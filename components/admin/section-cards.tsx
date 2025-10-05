import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  data: Array<{
    title: string
    value: string | number
    change?: string
    trend?: "up" | "down" | "neutral"
  }>
}

export function SectionCards({ data }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      {data.map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader className="relative">
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {card.value}
            </CardTitle>
            {card.change && card.trend && (
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  {card.trend === "up" ? (
                    <TrendingUpIcon className="size-3" />
                  ) : card.trend === "down" ? (
                    <TrendingDownIcon className="size-3" />
                  ) : null}
                  {card.change}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.trend === "up" && (
                <>
                  Trending up <TrendingUpIcon className="size-4" />
                </>
              )}
              {card.trend === "down" && (
                <>
                  Trending down <TrendingDownIcon className="size-4" />
                </>
              )}
              {card.trend === "neutral" && "Stable"}
            </div>
            <div className="text-muted-foreground">Real-time data from Neon DB</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
