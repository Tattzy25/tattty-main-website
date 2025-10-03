"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

const otpSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof otpSchema>) {
    setIsLoading(true)

    try {
      // TODO: Send OTP to email
      toast({
        title: "Check your email",
        description: "We've sent you a one-time password to create your account.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function signUpWithGoogle() {
    setIsLoading(true)
    try {
      // TODO: Implement Google OAuth
      toast({
        title: "Coming soon",
        description: "Google sign-up will be available shortly.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function signUpWithGitHub() {
    setIsLoading(true)
    try {
      // TODO: Implement GitHub OAuth
      toast({
        title: "Coming soon",
        description: "GitHub sign-up will be available shortly.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gold-300">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    {...field}
                    className="bg-black/20 border-gold-500/30 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-gold-500 hover:bg-gold-600 text-black" disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Send One-Time Password"
            )}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gold-500/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={signUpWithGoogle}
          className="border-gold-500/30 hover:bg-gold-500/10"
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={signUpWithGitHub}
          className="border-gold-500/30 hover:bg-gold-500/10"
        >
          <Icons.gitHub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  )
}
