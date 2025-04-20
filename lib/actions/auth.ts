"use server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { supabase } from "@/lib/supabase"

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
  code: z.string().length(6),
})

export async function login(email: string, password: string) {
  const validatedFields = loginSchema.safeParse({
    email: email,
    password: password,
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      fields: validatedFields.error.flatten().fieldErrors,
    }
  }

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

  // Use Supabase for registration
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  // Redirect to email verification page
  redirect("/auth/verify-email")
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

export async function verifyEmail(formData: FormData) {
  const validatedFields = verifyEmailSchema.safeParse({
    code: formData.get("code"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid verification code",
      fields: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { code } = validatedFields.data

  // In a real implementation, you would verify the code with Supabase
  // This is a simplified version since Supabase handles email verification differently

  // Redirect to dashboard
  redirect("/dashboard")
}

export async function logout() {
  // Use Supabase for logout
  await supabase.auth.signOut()

  // Redirect to home page
  redirect("/")
}
