"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email(),
  bio: z.string().max(160).optional(),
})

const notificationsFormSchema = z.object({
  marketingEmails: z.boolean().default(false),
  designUpdates: z.boolean().default(true),
  newFeatures: z.boolean().default(true),
})

const securityFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function AccountSettings() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Fetch user data on component mount
  useState(() => {
    async function fetchUserData() {
      try {
        setIsLoading(true)

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        // Get user profile
        const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

        if (error && error.code !== "PGRST116") {
          throw error
        }

        // Get notification preferences
        const { data: preferences, error: prefError } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single()

        setUserData({
          id: user.id,
          email: user.email,
          name: profile?.display_name || user.user_metadata?.name || "",
          bio: profile?.bio || "",
          avatar_url: profile?.avatar_url || "",
          preferences: preferences || {
            marketing_emails: false,
            design_updates: true,
            new_features: true,
          },
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  })

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      bio: userData?.bio || "",
    },
    values: {
      name: userData?.name || "",
      email: userData?.email || "",
      bio: userData?.bio || "",
    },
  })

  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      marketingEmails: userData?.preferences?.marketing_emails || false,
      designUpdates: userData?.preferences?.design_updates || true,
      newFeatures: userData?.preferences?.new_features || true,
    },
    values: {
      marketingEmails: userData?.preferences?.marketing_emails || false,
      designUpdates: userData?.preferences?.design_updates || true,
      newFeatures: userData?.preferences?.new_features || true,
    },
  })

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsUpdating(true)
    try {
      // Update user profile in Supabase
      const { error: profileError } = await supabase.from("user_profiles").upsert({
        id: userData.id,
        display_name: values.name,
        bio: values.bio,
        updated_at: new Date().toISOString(),
      })

      if (profileError) throw profileError

      // Update email if changed
      if (values.email !== userData.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: values.email,
        })

        if (emailError) throw emailError
      }

      // Update local state
      setUserData({
        ...userData,
        name: values.name,
        email: values.email,
        bio: values.bio,
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  async function onNotificationsSubmit(values: z.infer<typeof notificationsFormSchema>) {
    setIsUpdating(true)
    try {
      // Update notification preferences in Supabase
      const { error } = await supabase.from("user_preferences").upsert({
        user_id: userData.id,
        marketing_emails: values.marketingEmails,
        design_updates: values.designUpdates,
        new_features: values.newFeatures,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      // Update local state
      setUserData({
        ...userData,
        preferences: {
          marketing_emails: values.marketingEmails,
          design_updates: values.designUpdates,
          new_features: values.newFeatures,
        },
      })

      toast({
        title: "Notification preferences updated",
        description: "Your notification preferences have been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating notification preferences:", error)
      toast({
        title: "Error",
        description: "Failed to update your notification preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  async function onSecuritySubmit(values: z.infer<typeof securityFormSchema>) {
    setIsUpdating(true)
    try {
      // First verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: values.currentPassword,
      })

      if (signInError) {
        toast({
          title: "Error",
          description: "Current password is incorrect.",
          variant: "destructive",
        })
        return
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      })

      if (updateError) throw updateError

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: "Failed to update your password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleAvatarUpload(file: File) {
    try {
      setIsUpdating(true)

      // Upload avatar to storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${userData.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("user-content").upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: publicUrl } = supabase.storage.from("user-content").getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ avatar_url: publicUrl.publicUrl })
        .eq("id", userData.id)

      if (updateError) throw updateError

      // Update local state
      setUserData({
        ...userData,
        avatar_url: publicUrl.publicUrl,
      })

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Error",
        description: "Failed to upload your profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Icons.spinner className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    )
  }

  return (
    <Tabs defaultValue="profile" className="space-y-8">
      <TabsList className="grid w-full grid-cols-3 max-w-md">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-8">
        <Card className="border-gold-500/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-gold-500">Profile</CardTitle>
            <CardDescription>Manage your public profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-8">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={userData?.avatar_url || "/placeholder.svg?height=80&width=80"}
                  alt={userData?.name || "User"}
                />
                <AvatarFallback className="bg-gold-500/20 text-gold-500 text-xl">
                  {userData?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleAvatarUpload(file)
                  }}
                />
                <Button
                  variant="outline"
                  className="border-gold-500/30 hover:bg-gold-500/10"
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Icons.upload className="mr-2 h-4 w-4" />
                      Change Avatar
                    </>
                  )}
                </Button>
              </div>
            </div>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black/20 border-gold-500/30 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Email</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black/20 border-gold-500/30 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="bg-black/20 border-gold-500/30 text-white"
                          placeholder="Tell us a bit about yourself"
                        />
                      </FormControl>
                      <FormDescription>Your bio will be visible on your public profile.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-black" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-8">
        <Card className="border-gold-500/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-gold-500">Notifications</CardTitle>
            <CardDescription>Manage how you receive notifications and updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...notificationsForm}>
              <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                <FormField
                  control={notificationsForm.control}
                  name="marketingEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gold-500/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gold-300">Marketing Emails</FormLabel>
                        <FormDescription>Receive emails about new features, promotions, and updates.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationsForm.control}
                  name="designUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gold-500/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gold-300">Design Updates</FormLabel>
                        <FormDescription>
                          Receive notifications when your designs are processed or updated.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationsForm.control}
                  name="newFeatures"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gold-500/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gold-300">New Features</FormLabel>
                        <FormDescription>Receive notifications about new features and improvements.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-gold-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-black" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-8">
        <Card className="border-gold-500/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-gold-500">Security</CardTitle>
            <CardDescription>Manage your account security settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                <FormField
                  control={securityForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="bg-black/20 border-gold-500/30 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="my-4 bg-gold-500/20" />
                <FormField
                  control={securityForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="bg-black/20 border-gold-500/30 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={securityForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="bg-black/20 border-gold-500/30 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-black" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
