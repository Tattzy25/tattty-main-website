interface DynamicHeadlineProps {
  title: string
  isContentFading: boolean
}

export function DynamicHeadline({ title, isContentFading }: DynamicHeadlineProps) {
  return (
    <div className="relative z-10 pt-8 pb-1 sm:pt-12 sm:pb-2 lg:pt-16 lg:pb-2">
      <div className="container mx-auto px-4 text-center">
        <h1 
          className={`text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight transition-opacity duration-300 relative ${
            isContentFading ? 'opacity-0' : 'opacity-100'
          }`} 
          style={{ 
            fontFamily: 'Audiowide, sans-serif'
          }}
        >
          {/* Black shadow layers behind */}
          <span 
            className="absolute inset-0" 
            style={{ 
              color: '#000000',
              transform: 'translate(3px, 3px)',
              zIndex: -5
            }}
          >
            {title}
          </span>
          <span 
            className="absolute inset-0" 
            style={{ 
              color: '#000000',
              transform: 'translate(6px, 6px)',
              zIndex: -4
            }}
          >
            {title}
          </span>
          <span 
            className="absolute inset-0" 
            style={{ 
              color: 'rgba(0,0,0,0.8)',
              transform: 'translate(9px, 9px)',
              zIndex: -3
            }}
          >
            {title}
          </span>
          <span 
            className="absolute inset-0" 
            style={{ 
              color: 'rgba(0,0,0,0.6)',
              transform: 'translate(12px, 12px)',
              zIndex: -2
            }}
          >
            {title}
          </span>
          <span 
            className="absolute inset-0" 
            style={{ 
              color: 'rgba(0,0,0,0.4)',
              transform: 'translate(15px, 15px)',
              zIndex: -1
            }}
          >
            {title}
          </span>
          {/* Gradient text on top */}
          <span className="bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent relative z-10">
            {title}
          </span>
        </h1>
      </div>
    </div>
  )
}
