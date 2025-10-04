import React from 'react'
import './sketchpad.css'

interface SketchpadProps {
  showCarousels?: boolean  // Kept for backwards compatibility but not used
  selectedStyleImages?: string[]  // Kept for backwards compatibility but not used
  onStyleSelect?: (url: string) => void  // Kept for backwards compatibility but not used
}

export function Sketchpad({
  showCarousels = false,
  selectedStyleImages = [],
  onStyleSelect = () => {}
}: SketchpadProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-4 transition-all duration-500" style={{ perspective: '2000px' }}>
      {/* Sketchpad with Robot Hand */}
      <div className="relative w-[480px] h-[480px] rounded-3xl sketchpad-fade" style={{ 
        transform: 'rotateX(55deg) rotateY(-12deg) rotateZ(-15deg)', 
        transformStyle: 'preserve-3d',
        boxShadow: '0 25px 50px rgba(0, 255, 170, 0.5), 0 15px 30px rgba(139, 92, 246, 0.4), 0 35px 70px rgba(0, 255, 170, 0.3), 0 45px 90px rgba(138, 43, 226, 0.3)'
      }}>
        <div className="flex items-center justify-center h-full p-4">
          <div className="matrix-container w-full h-full rounded-2xl overflow-hidden relative">
            <div className="matrix-grid w-full h-full" />
            {/* Drawing Canvas/Paper */}
            <div className="drawing-canvas">
              <div className="ink-lines">
                <div className="ink-line"></div>
                <div className="ink-line"></div>
                <div className="ink-line"></div>
              </div>
            </div>
            {/* Robot Hand SVG */}
            <div className="robot-hand-container">
              <img src="/sketchpad/hand.svg" alt="AI Robot Hand" className="robot-hand" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
