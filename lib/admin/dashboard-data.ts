import { getSqlClient } from "@/lib/neon"

const sql = getSqlClient()!

if (!sql) {
  throw new Error("Database not configured. Please set DATABASE_URL environment variable.")
}

export interface DashboardCard {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface TableRow {
  id: string | number
  [key: string]: any
}

export interface DashboardData {
  cards: DashboardCard[]
  chartData: ChartDataPoint[]
  tableData: TableRow[]
}

/**
 * Fetch all admin dashboard data from Neon database
 * NO FALLBACKS - Will throw error if database connection fails
 */
export async function getAdminDashboardData(): Promise<DashboardData> {
  console.log("📊 [ADMIN] Fetching dashboard data from Neon...")

  try {
    // Fetch total users
    const totalUsersResult = await sql`
      SELECT COUNT(*) as count FROM users
    ` as Array<{ count: string }>
    const totalUsers = parseInt(totalUsersResult[0]?.count || "0")

    // Fetch total tattoo generations
    const totalGenerationsResult = await sql`
      SELECT COUNT(*) as count FROM tattoo_generation_results
    ` as Array<{ count: string }>
    const totalGenerations = parseInt(totalGenerationsResult[0]?.count || "0")

    // Fetch total credits consumed
    const totalCreditsResult = await sql`
      SELECT SUM(credits_used) as total FROM credit_transactions
    ` as Array<{ total: string }>
    const totalCredits = parseInt(totalCreditsResult[0]?.total || "0")

    // Fetch active users (last 7 days)
    const activeUsersResult = await sql`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM user_activity_logs 
      WHERE created_at > NOW() - INTERVAL '7 days'
    ` as Array<{ count: string }>
    const activeUsers = parseInt(activeUsersResult[0]?.count || "0")

    // Fetch generation chart data (last 30 days)
    const chartDataResult = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as value
      FROM tattoo_generation_results
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    ` as Array<{ date: string; value: number }>
    const chartData: ChartDataPoint[] = chartDataResult.map((row) => ({
      date: row.date,
      value: parseInt(String(row.value)),
      label: `${row.value} generations`,
    }))

    // Fetch recent generations for table
    const recentGenerationsResult = await sql`
      SELECT 
        tgr.id,
        u.email as user_email,
        tgr.prompt_text,
        tgr.status,
        tgr.credits_used,
        tgr.created_at
      FROM tattoo_generation_results tgr
      LEFT JOIN users u ON tgr.user_id = u.id
      ORDER BY tgr.created_at DESC
      LIMIT 50
    ` as Array<{
      id: string
      user_email: string | null
      prompt_text: string | null
      status: string
      credits_used: number
      created_at: string
    }>
    const tableData: TableRow[] = recentGenerationsResult.map((row) => ({
      id: row.id,
      user: row.user_email || "Anonymous",
      prompt: row.prompt_text?.substring(0, 50) + "..." || "N/A",
      status: row.status,
      credits: row.credits_used,
      date: new Date(row.created_at).toLocaleDateString(),
    }))

    console.log("✅ [ADMIN] Dashboard data fetched successfully")

    return {
      cards: [
        {
          title: "Total Users",
          value: totalUsers.toLocaleString(),
          trend: "up",
        },
        {
          title: "Total Generations",
          value: totalGenerations.toLocaleString(),
          trend: "up",
        },
        {
          title: "Credits Consumed",
          value: totalCredits.toLocaleString(),
          trend: "neutral",
        },
        {
          title: "Active Users (7d)",
          value: activeUsers.toLocaleString(),
          trend: "up",
        },
      ],
      chartData,
      tableData,
    }
  } catch (error) {
    console.error("❌ [ADMIN] Failed to fetch dashboard data:", error)
    throw new Error("Failed to load admin dashboard data. Please check database connection.")
  }
}
