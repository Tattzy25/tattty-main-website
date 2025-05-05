"use server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { supabase } from "@/lib/supabase"
import { sendTransactionalEmail } from "@/lib/mailerlite"

// Login validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// Register validation schema
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

// Reset password validation schema
const resetPasswordSchema = z.object({
  email: z.string().email(),
})

// Verify email validation schema
const verifyEmailSchema = z.object({
  token: z.string(),
})

export async function login(formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      fields: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  // Use Supabase for authentication
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  // Check if email is verified
  if (!data.user.email_confirmed_at) {
    return {
      error: "Please verify your email before logging in.",
      needsVerification: true,
      email,
    }
  }

  return { success: true }
}

export async function register(formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      fields: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  // Use Supabase for registration with email confirmation
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/email-confirmed`,
    },
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  // Create user profile
  if (data.user) {
    const { error: profileError } = await supabase.from("user_profiles").insert({
      id: data.user.id,
      display_name: name,
      email: email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("Error creating user profile:", profileError)
    }

    // Send welcome email via MailerLite
    try {
      await sendTransactionalEmail(email, "welcome_email", {
        name: name,
        verification_url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?email=${encodeURIComponent(email)}`,
      })
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError)
    }
  }

  // Redirect to email verification page
  return {
    success: true,
    message: "Please check your email to verify your account.",
  }
}

export async function resetPassword(formData: FormData) {
  const validatedFields = resetPasswordSchema.safeParse({
    email: formData.get("email"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid email",
      fields: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email } = validatedFields.data

  // Use Supabase for password reset
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/confirm`,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return { success: true }
}

export async function verifyEmail(token: string) {
  try {
    // Verify the token with Supabase
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "email",
    })

    if (error) {
      return {
        error: "Invalid or expired verification link. Please try again.",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error verifying email:", error)
    return {
      error: "An error occurred during verification. Please try again.",
    }
  }
}

export async function logout() {
  // Use Supabase for logout
  await supabase.auth.signOut()

  // Redirect to home page
  redirect("/")
}

export async function resendVerificationEmail(email: string) {
  try {
    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/email-confirmed`,
      },
    })

    if (error) {
      return {
        error: error.message,
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error resending verification email:", error)
    return {
      error: "An error occurred. Please try again.",
    }
  }
}
