"use client"

import MainLayout from "@/components/main-layout"
import { HeroSection } from "@/components/home/hero-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"

import { TattooStylesSection } from "@/components/home/tattoo-styles-section"
import { SocialProofSection } from "@/components/home/social-proof-section"
import { FeaturesSection } from "@/components/home/features-section"
import { CTASection } from "@/components/home/cta-section"

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <TattooStylesSection />
      <SocialProofSection />
      <FeaturesSection />
      <CTASection />
    </MainLayout>
  )
}