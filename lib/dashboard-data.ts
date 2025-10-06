import { getSqlClient } from "@/lib/neon"

export interface DashboardStats {
  totalUsers: number
  totalGenerations: number
  activeSessions: number
  totalCost: number
  avgGenerationTime: number
  completionRate: number
}

export interface RecentGeneration {
  id: string
  userId: string | null
  createdAt: Date
  status: string
  timeTaken: number | null
  modelUsed: string | null
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const sql = getSqlClient()
  if (!sql) {
    return {
      totalUsers: 0,
      totalGenerations: 0,
      activeSessions: 0,
      totalCost: 0,
      avgGenerationTime: 0,
      completionRate: 0
    }
  }

  try {
    const [users, generations, sessions, costs, avgTime, completion] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM user_profiles`,
      sql`SELECT COUNT(*) as count FROM generation_results`,
      sql`SELECT COUNT(*) as count FROM user_sessions WHERE is_complete = false AND expires_at > NOW()`,
      sql`SELECT COALESCE(SUM(cost_usd), 0) as total FROM session_costs`,
      sql`SELECT AVG(duration_seconds) as avg FROM generation_results WHERE duration_seconds IS NOT NULL`,
      sql`SELECT AVG(CASE WHEN is_complete THEN 1.0 ELSE 0.0 END) * 100 as rate FROM user_sessions`
    ])

    const usersArray = users as any[]
    const generationsArray = generations as any[]
    const sessionsArray = sessions as any[]
    const costsArray = costs as any[]
    const avgTimeArray = avgTime as any[]
    const completionArray = completion as any[]

    return {
      totalUsers: Number(usersArray[0]?.count || 0),
      totalGenerations: Number(generationsArray[0]?.count || 0),
      activeSessions: Number(sessionsArray[0]?.count || 0),
      totalCost: Number(costsArray[0]?.total || 0),
      avgGenerationTime: Number(avgTimeArray[0]?.avg || 0),
      completionRate: Number(completionArray[0]?.rate || 0)
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalUsers: 0,
      totalGenerations: 0,
      activeSessions: 0,
      totalCost: 0,
      avgGenerationTime: 0,
      completionRate: 0
    }
  }
}

export async function getRecentGenerations(limit: number = 10): Promise<RecentGeneration[]> {
  const sql = getSqlClient()
  if (!sql) {
    return []
  }

  try {
    const result = await sql`
      SELECT 
        id,
        user_id as "userId",
        created_at as "createdAt",
        generation_status as status,
        duration_seconds as "timeTaken",
        model_used as "modelUsed"
      FROM generation_results
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    const rows = result as any[]
    return rows.map((row: any) => ({
      id: row.id,
      userId: row.userId,
      createdAt: new Date(row.createdAt),
      status: row.status || 'unknown',
      timeTaken: row.timeTaken,
      modelUsed: row.modelUsed
    }))
  } catch (error) {
    console.error("Error fetching recent generations:", error)
    return []
  }
}

export async function getGenerationTrends(days: number = 30) {
  const sql = getSqlClient()
  if (!sql) {
    return []
  }

  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const result = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total,
        SUM(CASE WHEN generation_status = 'completed' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN generation_status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM generation_results
      WHERE created_at >= ${startDate.toISOString()}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    return result as any[]
  } catch (error) {
    console.error("Error fetching generation trends:", error)
    return []
  }
}
