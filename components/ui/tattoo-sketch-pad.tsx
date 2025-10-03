import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TattooSketchPadProps {
  isActive?: boolean
  currentStep?: number
  className?: string
}

export function TattooSketchPad({ isActive = false, currentStep = 0, className }: TattooSketchPadProps) {
  const [sketchLines, setSketchLines] = useState<string[]>([])
  const [isDrawing, setIsDrawing] = useState(false)

  // Simulate sketching when active
  useEffect(() => {
    if (isActive) {
      setIsDrawing(true)
      const timer = setTimeout(() => {
        setSketchLines(prev => [...prev, generateRandomSketchLine()])
        setIsDrawing(false)
      }, Math.random() * 2000 + 1000) // Random delay 1-3 seconds

      return () => clearTimeout(timer)
    }
  }, [isActive, currentStep])

  const generateRandomSketchLine = () => {
    // Generate random SVG path for sketch lines
    const startX = Math.random() * 200 + 50
    const startY = Math.random() * 200 + 50
    const endX = startX + (Math.random() * 100 - 50)
    const endY = startY + (Math.random() * 100 - 50)
    
    return `M ${startX} ${startY} Q ${(startX + endX) / 2 + Math.random() * 30 - 15} ${(startY + endY) / 2 + Math.random() * 30 - 15} ${endX} ${endY}`
  }

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center", className)}>
      {/* Sketch Pad Background */}
      <div className="relative w-80 h-96 bg-gray-100 rounded-lg shadow-2xl transform rotate-2 border-4 border-gray-200">
        {/* Paper texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-lg opacity-90"></div>
        
        {/* Sketch Pad Binding */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 rounded-t-lg flex items-center justify-center">
          <div className="flex space-x-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1 h-4 bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>

        {/* Sketch Area */}
        <div className="relative mt-8 p-6 h-full">
          {/* Grid lines (light) */}
          <svg className="absolute inset-6 w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ddd" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Sketch Content */}
          <svg className="absolute inset-6 w-full h-full">
            {sketchLines.map((line, index) => (
              <path
                key={index}
                d={line}
                stroke="#2d3748"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                className="animate-pulse"
              />
            ))}
            
            {/* Artist's pencil (when drawing) */}
            {isDrawing && (
              <g className="animate-bounce">
                <line x1="150" y1="100" x2="155" y2="95" stroke="#8B4513" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="152.5" cy="97.5" r="1" fill="#FFD700"/>
              </g>
            )}
          </svg>

          {/* Tattoo Shop Elements */}
          <div className="absolute -bottom-4 -right-4 flex items-center space-x-2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">Artist Listening...</span>
          </div>
        </div>
      </div>

      {/* Tattoo Shop Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Ink bottles */}
        <div className="absolute top-20 right-20 space-y-2">
          {['#000000', '#8B4513', '#FF0000'].map((color, i) => (
            <div key={i} className="w-6 h-8 rounded-b-full shadow-lg" style={{ backgroundColor: color }}></div>
          ))}
        </div>

        {/* Tattoo gun silhouette */}
        <div className="absolute bottom-20 left-20 opacity-30">
          <svg width="40" height="20" viewBox="0 0 40 20" fill="currentColor" className="text-gray-600">
            <path d="M2 10 L15 10 L20 5 L35 8 L38 6 L40 8 L35 12 L20 15 L15 10 L8 12 L2 10 Z"/>
          </svg>
        </div>

        {/* Ambient lighting effect */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}