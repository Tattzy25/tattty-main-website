"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import "./StateCard.css"

interface StateCardProps {
  className?: string
  hints?: string[]
  title?: string
  hintInterval?: number
  showSparkles?: boolean
  showLines?: boolean
  showTrails?: boolean
}

export function StateCard({ 
  className,
  hints: customHints,
  title = "TaTTTy",
  hintInterval = 3000,
  showSparkles = true,
  showLines = true,
  showTrails = true
}: StateCardProps) {
  const [hintIndex, setHintIndex] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const trailsRef = useRef<Array<{ element: HTMLDivElement; opacity: number; life: number }>>([])

  const hints = customHints || [
    'PREPARING YOUR CANVAS...',
    'MIXING THE COLORS...',
    'WARMING UP THE MACHINE...',
    'SETTING UP THE STATION...',
    'READY TO INK...'
  ]

  useEffect(() => {
    const hintIntervalTimer = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % hints.length)
    }, hintInterval)

    return () => clearInterval(hintIntervalTimer)
  }, [hints.length, hintInterval])

  useEffect(() => {
    if (!showTrails) return

    const createTrailStar = () => {
      if (!dotRef.current || !cardRef.current) return

      const dotRect = dotRef.current.getBoundingClientRect()
      const cardRect = cardRef.current.getBoundingClientRect()

      const star = document.createElement('div')
      star.className = 'trail-star'
      star.style.left = (dotRect.left - cardRect.left + dotRect.width / 2) + 'px'
      star.style.top = (dotRect.top - cardRect.top + dotRect.height / 2) + 'px'

      cardRef.current.appendChild(star)
      trailsRef.current.push({ element: star, opacity: 1, life: 0 })

      if (trailsRef.current.length > 8) {
        const old = trailsRef.current.shift()
        old?.element.remove()
      }
    }

    const updateTrails = () => {
      trailsRef.current.forEach((trail) => {
        trail.life += 0.02
        trail.opacity = Math.max(0, 1 - trail.life)
        const scale = Math.max(0.3, 1 - trail.life * 0.5)

        trail.element.style.opacity = String(trail.opacity)
        trail.element.style.transform = `translate(-50%, -50%) scale(${scale})`
        trail.element.style.filter = `blur(${trail.life * 2}px)`
        trail.element.style.boxShadow = `
          0 0 ${10 * trail.opacity}px #ff6b35,
          0 0 ${20 * trail.opacity}px #9333ea
        `
      })
    }

    const trailInterval = setInterval(createTrailStar, 100)
    const updateInterval = setInterval(updateTrails, 30)

    return () => {
      clearInterval(trailInterval)
      clearInterval(updateInterval)
      trailsRef.current.forEach(trail => trail.element.remove())
      trailsRef.current = []
    }
  }, [showTrails])

  return (
    <div className={cn("flex items-center justify-center w-full lg:w-[45%] p-4 pt-20 lg:pt-4 relative", className)}>
      <div className="animated-outer relative z-10">
        <div ref={dotRef} className="animated-dot"></div>
        <div ref={cardRef} className="animated-card">
          <div className="animated-ray"></div>

          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="animated-svg">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path 
              className="drawing-line drawing-line-1" 
              d="M 50 150 Q 100 50, 200 150 T 350 150" 
              fill="none" 
              stroke="#ff6b35" 
              strokeWidth="2" 
              filter="url(#glow)"
            />
            <path 
              className="drawing-line drawing-line-2" 
              d="M 80 200 Q 150 250, 250 200 T 320 200" 
              fill="none" 
              stroke="#9333ea" 
              strokeWidth="2" 
              filter="url(#glow)"
            />
          </svg>

          <div className="neon-container">
            <div className="neon-sign">{title}</div>
            {showSparkles && [...Array(12)].map((_, i) => (
              <div key={i} className={`sparkle sparkle-${i + 1}`}></div>
            ))}
          </div>

          {showLines && (
            <>
              <div className="line topl"></div>
              <div className="line leftl"></div>
              <div className="line bottoml"></div>
              <div className="line rightl"></div>
            </>
          )}
          <div className="hint-text">{hints[hintIndex]}</div>
        </div>
      </div>
    </div>
  )
}
