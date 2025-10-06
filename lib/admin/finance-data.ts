import { getSqlClient } from "@/lib/neon"

export interface Finance {
  id: string
  sessionId: string
  service: string
  operation: string
  tokensUsed: number | null
  cost: number
  modelUsed: string | null
  createdAt: Date
}

export async function getUserFinances(limit: number = 20): Promise<Finance[]> {
  const sql = getSqlClient()
  if (!sql) {
    return []
  }

  try {
    const result = await sql`
      SELECT 
        id,
        session_id as "sessionId",
        service,
        operation,
        tokens_used as "tokensUsed",
        cost_usd as cost,
        model_used as "modelUsed",
        charged_at as "createdAt"
      FROM session_costs
      ORDER BY charged_at DESC
      LIMIT ${limit}
    `

    const rows = result as any[]
    return rows.map((row: any) => ({
      id: row.id,
      sessionId: row.sessionId,
      service: row.service,
      operation: row.operation,
      tokensUsed: row.tokensUsed,
      cost: Number(row.cost),
      modelUsed: row.modelUsed,
      createdAt: new Date(row.createdAt)
    }))
  } catch (error) {
    console.error("Error fetching finances:", error)
    return []
  }
}

export async function getTotalRevenue(months: number = 12) {
  const sql = getSqlClient()
  if (!sql) {
    return { total: 0, monthly: [] }
  }

  try {
    const [totalResult, monthlyResult] = await Promise.all([
      sql`SELECT COALESCE(SUM(cost_usd), 0) as total FROM session_costs`,
      sql`
        SELECT
          DATE_TRUNC('month', charged_at) as month,
          SUM(cost_usd) as revenue
        FROM session_costs
        WHERE charged_at >= NOW() - INTERVAL '${months} months'
        GROUP BY month
        ORDER BY month ASC
      `
    ])

    const totalArray = totalResult as any[]
    const monthlyArray = monthlyResult as any[]

    return {
      total: Number(totalArray[0]?.total || 0),
      monthly: monthlyArray
    }
  } catch (error) {
    console.error("Error fetching revenue:", error)
    return { total: 0, monthly: [] }
  }
}

export async function getCostsByService(days: number = 30) {
  const sql = getSqlClient()
  if (!sql) {
    return []
  }

  try {
    const result = await sql`
      SELECT
        service,
        SUM(cost_usd) as total_cost,
        COUNT(*) as api_calls,
        AVG(cost_usd) as avg_cost
      FROM session_costs
      WHERE charged_at >= NOW() - INTERVAL '${days} days'
      GROUP BY service
      ORDER BY total_cost DESC
    `

    return result as any[]
  } catch (error) {
    console.error("Error fetching costs by service:", error)
    return []
  }
}