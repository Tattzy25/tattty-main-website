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

const formSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Verification code must be 6 characters.",
    })
    .max(6, {
      message: "Verification code must be 6 characters.",
    }),
})

export function VerifyEmailForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Here we would normally call a server action to verify the email
      // For now, we'll simulate a successful verification
      console.log(values)

      setTimeout(() => {
        toast({
          title: "Email verified!",
          description: "Your email has been successfully verified.",
        })
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gold-300">Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123456"
                    {...field}
                    className="bg-black/20 border-gold-500/30 text-white text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-gold-500 hover:bg-gold-600 text-black" disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Verifying
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center">
        <Button
          variant="link"
          className="text-gold-500 hover:text-gold-400"
          onClick={() => {
            toast({
              title: "Code resent",
              description: "A new verification code has been sent to your email.",
            })
          }}
        >
          Didn't receive a code? Resend
        </Button>
      </div>
    </div>
  )
}
