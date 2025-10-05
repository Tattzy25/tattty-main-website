interface SectionTitleProps {
  children: React.ReactNode
  className?: string
}

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <h2 
      className={`text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent leading-relaxed py-2 ${className}`}
      style={{ fontFamily: "'Rock Salt', cursive" }}
    >
      {children}
    </h2>
  )
}
