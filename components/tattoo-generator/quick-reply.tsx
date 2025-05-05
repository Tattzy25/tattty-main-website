"use client"

import { Button } from "@/components/ui/button"

interface QuickReplyProps {
  replies: string[]
  onSelect: (reply: string) => void
}

export function QuickReply({ replies, onSelect }: QuickReplyProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-zinc-400">Quick replies:</p>
      <div className="flex flex-wrap gap-2">
        {replies.map((reply, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs"
            onClick={() => onSelect(reply)}
          >
            {reply}
          </Button>
        ))}
      </div>
    </div>
  )
}
