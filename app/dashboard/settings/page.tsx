import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard/layout"
import { AccountSettings } from "@/components/dashboard/account-settings"

export const metadata: Metadata = {
  title: "Settings | Tattty",
  description: "Manage your account settings",
}

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gold-500">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
        </div>

        <AccountSettings />
      </div>
    </DashboardLayout>
  )
}
