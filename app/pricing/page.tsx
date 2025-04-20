"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import MainLayout from "@/components/main-layout"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"payg" | "monthly" | "yearly">("payg")

  const pricingPlans = {
    payg: [
      {
        name: "Free Preview",
        price: "$0",
        description: "Just a taste of what Tattzy can do",
        features: [
          { name: "Low-resolution preview (<500px)", included: true },
          { name: "Basic design generation", included: true },
          { name: "Download capability", included: false },
          { name: "Regenerate designs", included: false },
          { name: "Save to account", included: false },
        ],
        cta: "Try for Free",
        ctaLink: "/sign-up",
        popular: false,
      },
      {
        name: "Standard",
        price: "$15",
        description: "Perfect for a one-time design",
        features: [
          { name: "High-resolution design (1080p)", included: true },
          { name: "Premium design generation", included: true },
          { name: "Download capability", included: true },
          { name: "Regenerate designs", included: true },
          { name: "Save to account", included: false },
        ],
        cta: "Get Started",
        ctaLink: "/sign-up",
        popular: true,
      },
      {
        name: "Premium",
        price: "$20",
        description: "The ultimate tattoo design experience",
        features: [
          { name: "Ultra HD design (4K)", included: true },
          { name: "Advanced design generation", included: true },
          { name: "Download capability", included: true },
          { name: "Regenerate designs", included: true },
          { name: "Save to account", included: false },
        ],
        cta: "Choose Premium",
        ctaLink: "/sign-up",
        popular: false,
      },
    ],
    monthly: [
      {
        name: "Tier 1",
        price: "TBD",
        description: "Basic monthly subscription",
        features: [
          { name: "High-resolution designs", included: true },
          { name: "Multiple designs per month", included: true },
          { name: "Download capability", included: true },
          { name: "Regenerate designs", included: true },
          { name: "Save to account", included: true },
        ],
        cta: "Coming Soon",
        ctaLink: "/sign-up",
        popular: false,
        disabled: true,
      },
      {
        name: "Tier 2",
        price: "TBD",
        description: "Enhanced monthly subscription",
        features: [
          { name: "Ultra HD designs (4K)", included: true },
          { name: "More designs per month", included: true },
          { name: "Download capability", included: true },
          { name: "Unlimited regenerations", included: true },
          { name: "Save to account", included: true },
        ],
        cta: "Coming Soon",
        ctaLink: "/sign-up",
        popular: true,
        disabled: true,
      },
      {
        name: "Tier 3",
        price: "TBD",
        description: "Premium monthly subscription",
        features: [
          { name: "Ultra HD designs (4K)", included: true },
          { name: "Unlimited designs", included: true },
          { name: "Download capability", included: true },
          { name: "Unlimited regenerations", included: true },
          { name: "Priority support", included: true },
        ],
        cta: "Coming Soon",
        ctaLink: "/sign-up",
        popular: false,
        disabled: true,
      },
    ],
    yearly: [
      {
        name: "Tier 1",
        price: "TBD",
        description: "Basic yearly subscription",
        features: [
          { name: "High-resolution designs", included: true },
          { name: "Multiple designs per month", included: true },
          { name: "Download capability", included: true },
          { name: "Regenerate designs", included: true },
          { name: "Save to account", included: true },
        ],
        cta: "Coming Soon",
        ctaLink: "/sign-up",
        popular: false,
        disabled: true,
      },
      {
        name: "Tier 2",
        price: "TBD",
        description: "Enhanced yearly subscription",
        features: [
          { name: "Ultra HD designs (4K)", included: true },
          { name: "More designs per month", included: true },
          { name: "Download capability", included: true },
          { name: "Unlimited regenerations", included: true },
          { name: "Save to account", included: true },
        ],
        cta: "Coming Soon",
        ctaLink: "/sign-up",
        popular: true,
        disabled: true,
      },
      {
        name: "Tier 3",
        price: "TBD",
        description: "Premium yearly subscription",
        features: [
          { name: "Ultra HD designs (4K)", included: true },
          { name: "Unlimited designs", included: true },
          { name: "Download capability", included: true },
          { name: "Unlimited regenerations", included: true },
          { name: "Priority support", included: true },
        ],
        cta: "Coming Soon",
        ctaLink: "/sign-up",
        popular: false,
        disabled: true,
      },
    ],
  }

  const currentPlans = pricingPlans[billingCycle]

  return (
    <MainLayout>
      <div className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 via-amber-400 to-purple-600 bg-clip-text text-transparent">
              Choose Your Tattzy Experience
            </h1>
            <p className="text-zinc-300 max-w-2xl mx-auto">Select the plan that best fits your tattoo design needs</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 rounded-lg bg-zinc-800/50 backdrop-blur-sm">
              <button
                onClick={() => setBillingCycle("payg")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  billingCycle === "payg"
                    ? "bg-gradient-to-r from-red-500 to-amber-500 text-white"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                Pay-as-you-go
              </button>
              <button
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-red-500 to-amber-500 text-white"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-red-500 to-amber-500 text-white"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {currentPlans.map((plan, index) => (
              <div key={index} className="relative">
                {plan.popular && (
                  <div className="absolute -top-5 inset-x-0 flex justify-center">
                    <div className="bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    "relative h-full rounded-xl overflow-hidden border",
                    plan.popular ? "border-amber-500/50 bg-zinc-900/80" : "border-zinc-800 bg-zinc-900/50",
                  )}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-zinc-400 text-sm mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {billingCycle !== "payg" && (
                        <span className="text-zinc-400 ml-2">/ {billingCycle.slice(0, -2)}</span>
                      )}
                    </div>
                    <Link href={plan.ctaLink}>
                      <Button
                        className={cn(
                          "w-full",
                          plan.popular
                            ? "bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
                            : "bg-zinc-800 hover:bg-zinc-700 text-white",
                        )}
                        disabled={plan.disabled}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="pt-6 border-t border-zinc-800">
                      <ul className="space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            {feature.included ? (
                              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                            )}
                            <span className={feature.included ? "text-zinc-300" : "text-zinc-500"}>{feature.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-zinc-400 mb-4">
              All plans include a secure payment process and instant access to your designs.
            </p>
            <p className="text-zinc-400">Subscription plans can be canceled anytime. No hidden fees or commitments.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
