import React from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export function GlassTextarea({ className, ...props }: GlassTextareaProps) {
  return (
    <Textarea
      className={cn(
        "resize-none bg-black/40 backdrop-blur-sm border border-white/20",
        "focus:border-white/40 focus:ring-white/10 transition-all duration-200",
        "text-white placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  )
}