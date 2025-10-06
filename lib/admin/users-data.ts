import { getSqlClient } from "@/lib/neon"

export interface User {
  id: string
  email: string
  username: string | null
  displayName: string | null
  avatarUrl: string | null
  location: string | null
  createdAt: Date
}

export interface TierStats {
  tier: string
  count: number
}

export async function getUsersList(limit: number = 50): Promise<User[]> {
  const sql = getSqlClient()
  if (!sql) {
    return []
  }

  try {
    const result = await sql`
      SELECT 
        id,
        email,
        username,
        display_name as "displayName",
        avatar_url as "avatarUrl",
        location,
        created_at as "createdAt"
      FROM user_profiles
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    const rows = result as any[]
    return rows.map((row: any) => ({
      id: row.id,
      email: row.email,
      username: row.username,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl,
      location: row.location,
      createdAt: new Date(row.createdAt)
    }))
  } catch (error) {
    console.error("Error fetching users list:", error)
    return []
  }
}

export async function getUsersBySubscriptionTier(): Promise<TierStats[]> {
  const sql = getSqlClient()
  if (!sql) {
    return [
      { tier: "Free", count: 0 },
      { tier: "Premium", count: 0 },
      { tier: "Enterprise", count: 0 }
    ]
  }

  try {
    const [totalUsers, activeSessions, completedGenerations] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM user_profiles`,
      sql`SELECT COUNT(DISTINCT user_id) as count FROM user_sessions WHERE user_id IS NOT NULL`,
      sql`SELECT COUNT(DISTINCT user_id) as count FROM generation_results WHERE user_id IS NOT NULL`
    ])

    const totalArray = totalUsers as any[]
    const activeArray = activeSessions as any[]
    const completedArray = completedGenerations as any[]

    return [
      { tier: "Total Users", count: Number(totalArray[0]?.count || 0) },
      { tier: "Active Users", count: Number(activeArray[0]?.count || 0) },
      { tier: "Generated Designs", count: Number(completedArray[0]?.count || 0) }
    ]
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return [
      { tier: "Total Users", count: 0 },
      { tier: "Active Users", count: 0 },
      { tier: "Generated Designs", count: 0 }
    ]
  }
}

export async function getUserActivity(days: number = 30) {
  const sql = getSqlClient()
  if (!sql) {
    return []
  }

  try {
    const result = await sql`
      SELECT 
        DATE(last_active_at) as date,
        COUNT(DISTINCT user_id) as active_users
      FROM user_sessions
      WHERE last_active_at >= NOW() - INTERVAL '${days} days'
      AND user_id IS NOT NULL
      GROUP BY DATE(last_active_at)
      ORDER BY date ASC
    `

    return result as any[]
  } catch (error) {
    console.error("Error fetching user activity:", error)
    return []
  }
}

export async function getUserGrowth(days: number = 90) {
  const sql = getSqlClient()
  if (!sql) {
    return []
  }

  try {
    const result = await sql`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as new_users
      FROM user_profiles
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    return result as any[]
  } catch (error) {
    console.error("Error fetching user growth:", error)
    return []
  }
}