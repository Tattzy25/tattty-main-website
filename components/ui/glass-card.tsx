import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  enableHover?: boolean
}

const sizeClasses = {
  sm: "max-w-full sm:max-w-sm",
  md: "max-w-full sm:max-w-md", 
  lg: "max-w-full sm:max-w-lg",
  xl: "max-w-full sm:max-w-xl lg:max-w-2xl"
}

export function GlassCard({ 
  children, 
  className, 
  size = "xl",
  enableHover = true,
  ...props 
}: GlassCardProps) {
  return (
    <Card 
      className={cn(
        "w-full relative overflow-hidden transition-all duration-300 ease-out",
        "bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg",
        enableHover && "transform hover:scale-[1.02]",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* Deep Shadow Behind Card */}
      <div className="absolute inset-0 bg-black/40 rounded-lg blur-2xl transform translate-y-8 translate-x-4 -z-20"></div>
      <div className="absolute inset-0 bg-black/20 rounded-lg blur-xl transform translate-y-4 translate-x-2 -z-10"></div>
      
      {/* Subtle Card Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/5 rounded-lg blur-sm -z-5"></div>
      
      {children}
    </Card>
  )
}

export function GlassCardHeader({ 
  children, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <CardHeader 
      className={cn("relative z-10", className)} 
      {...props}
    >
      {children}
    </CardHeader>
  )
}

export function GlassCardContent({ 
  children, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <CardContent 
      className={cn("relative z-10", className)} 
      {...props}
    >
      {children}
    </CardContent>
  )
}