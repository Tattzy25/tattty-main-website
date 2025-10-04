"use client"

import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import "./welcome-screen.css"

interface WelcomeScreenProps {
  showWelcomeOverlay: boolean
  isTransitioning: boolean
  onStartJourney: () => void
}

export function WelcomeScreen({
  showWelcomeOverlay,
  isTransitioning,
  onStartJourney
}: WelcomeScreenProps) {
  if (!showWelcomeOverlay) return null

  return (
    <div className={`welcome-overlay ${isTransitioning ? 'transitioning' : ''}`}>
      <GlassCard size="lg" className={`welcome-card ${isTransitioning ? 'transitioning' : ''}`}>
        <GlassCardHeader className="text-center space-y-4 pb-6">
          <div className="space-y-3">
            {/* Welcome Title */}
            <h1 className="welcome-title">
              Welcome to TaTTTy
            </h1>
            
            {/* Subtitle */}
            <p className="welcome-subtitle">
              This is where your story becomes ink. Every scar, every win, every truth—put on the pad.
            </p>
          </div>
        </GlassCardHeader>
        
        <GlassCardContent className="space-y-4">
          {/* What to Expect */}
          <div className="welcome-section">
            <h3 className="welcome-section-title">
              What to Expect
            </h3>
            <div className="welcome-section-content">
              <p className="text-white/90">Some questions will hit deep.</p>
              <p className="text-white/90">Others will feel light.</p>
              <p className="text-white/90 font-medium">The sharper your words, the sharper your design.</p>
            </div>
          </div>

          {/* Privacy */}
          <div className="welcome-section">
            <h3 className="welcome-section-title">
              Privacy
            </h3>
            <div className="welcome-section-content">
              <p className="text-white/90">What happens here stays here. We don't keep your words, your voice, or your story.</p>
              <p className="text-white/90">When the session's done, it's gone—like smoke in the air.</p>
              <p className="text-white/70 italic">If you choose to save it, that's on you.</p>
              <p className="text-xs text-white/60 mt-2">
                <a 
                  href="https://tattty.com/privacy-policy" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline hover:text-orange-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Guidance */}
          <div className="welcome-section">
            <h3 className="welcome-section-title">
              Guidance
            </h3>
            <div className="welcome-section-content">
              <p className="text-white/90">Need help? Tap the help tooltip anytime.</p>
              <p className="text-white/90">Want to answer out loud? Hit the mic beside the send button—or just type.</p>
            </div>
          </div>

          {/* Start Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={onStartJourney}
              className="welcome-start-button"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
