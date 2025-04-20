import type { Metadata } from "next"
import Link from "next/link"
import { VerifyEmailForm } from "@/components/auth/verify-email-form"

export const metadata: Metadata = {
  title: "Verify Email | Tattty",
  description: "Verify your email address for your Tattty account",
}

export default function VerifyEmailPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black/80" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/tattoo-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              mixBlendMode: "overlay",
              opacity: 0.4,
            }}
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gold-500">Tattty</span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg text-gold-300">
              "Just one more step to unlock the full potential of Tattty's AI tattoo generator!"
            </p>
            <footer className="text-sm text-gold-500">The Tattty Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-gold-500">Verify your email</h1>
            <p className="text-sm text-muted-foreground">We've sent a verification code to your email address</p>
          </div>
          <VerifyEmailForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="hover:text-brand underline underline-offset-4 text-gold-500">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
