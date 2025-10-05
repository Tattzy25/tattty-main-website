interface TimelineBallProps {
  className?: string
}

export function TimelineBall({ className = "" }: TimelineBallProps) {
  return (
    <div 
      className={`absolute -left-[42px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 border-2 border-black shadow-lg z-10 ${className}`}
    />
  )
}
