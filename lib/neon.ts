import { neon } from "@neondatabase/serverless";
import type { Database } from "@/types/neon";

let sqlClient: ReturnType<typeof neon> | null = null;

export function getSqlClient() {
  if (!sqlClient) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.warn("DATABASE_URL not found, database operations will fail");
      return null;
    }
    sqlClient = neon(databaseUrl);
  }
  return sqlClient;
}

export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<{ data: T | null; error: any }> {
  try {
    const client = getSqlClient();
    if (!client) {
      return { data: null, error: new Error("Database not configured") };
    }
    const data = await client(query, params);
    return { data: data as T, error: null };
  } catch (error) {
    console.error("Database query error:", error);
    return { data: null, error };
  }
}

export async function upsert<T = any>(
  table: string,
  values: Record<string, any>,
  conflictTarget = "id"
): Promise<{ data: T | null; error: any }> {
  try {
    const client = getSqlClient();
    if (!client) {
      return { data: null, error: new Error("Database not configured") };
    }
    const keys = Object.keys(values);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const updateClause = keys.map(key => `${key} = EXCLUDED.${key}`).join(", ");
    const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders}) ON CONFLICT (${conflictTarget}) DO UPDATE SET ${updateClause} RETURNING *`;
    
    const data = await client(query, Object.values(values));
    return { data: data as T, error: null };
  } catch (error) {
    console.error("Database upsert error:", error);
    return { data: null, error };
  }
}

export async function select<T = any>(
  table: string,
  columns = "*",
  whereClause = "",
  params: any[] = []
): Promise<{ data: T[] | null; error: any }> {
  try {
    const client = getSqlClient();
    if (!client) {
      return { data: null, error: new Error("Database not configured") };
    }
    const query = `SELECT ${columns} FROM ${table}${whereClause ? ` WHERE ${whereClause}` : ""}`;
    const data = await client(query, params);
    return { data: data as T[], error: null };
  } catch (error) {
    console.error("Database select error:", error);
    return { data: null, error };
  }
}

export async function insert<T = any>(
  table: string,
  values: Record<string, any>
): Promise<{ data: T | null; error: any }> {
  try {
    const client = getSqlClient();
    if (!client) {
      return { data: null, error: new Error("Database not configured") };
    }
    const keys = Object.keys(values);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;
    
    const data = await client(query, Object.values(values));
    return { data: data as T, error: null };
  } catch (error) {
    console.error("Database insert error:", error);
    return { data: null, error };
  }
}

export async function update<T = any>(
  table: string,
  values: Record<string, any>,
  whereClause: string,
  whereParams: any[] = []
): Promise<{ data: T | null; error: any }> {
  try {
    const client = getSqlClient();
    if (!client) {
      return { data: null, error: new Error("Database not configured") };
    }
    const keys = Object.keys(values);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    
    const params = [...Object.values(values), ...whereParams];
    const data = await client(query, params);
    return { data: data as T, error: null };
  } catch (error) {
    console.error("Database update error:", error);
    return { data: null, error };
  }
}

export async function deleteRecord<T = any>(
  table: string,
  whereClause: string,
  params: any[] = []
): Promise<{ data: T | null; error: any }> {
  try {
    const client = getSqlClient();
    if (!client) {
      return { data: null, error: new Error("Database not configured") };
    }
    const query = `DELETE FROM ${table} WHERE ${whereClause} RETURNING *`;
    const data = await client(query, params);
    return { data: data as T, error: null };
  } catch (error) {
    console.error("Database delete error:", error);
    return { data: null, error };
  }
}

// Create a Neon client wrapper with Supabase-like API
export const neonClient = {
  from: (table: string) => ({
    select: (columns = "*") => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          const { data, error } = await select(table, columns, `${column} = $1`, [value]);
          return { data: data?.[0] || null, error };
        },
        order: (orderColumn: string, options?: { ascending?: boolean }) => ({
          single: async () => {
            const order = options?.ascending ? "ASC" : "DESC";
            const { data, error } = await executeQuery(
              `SELECT ${columns} FROM ${table} WHERE ${column} = $1 ORDER BY ${orderColumn} ${order} LIMIT 1`,
              [value]
            );
            return { data: Array.isArray(data) ? data[0] || null : null, error };
          }
        })
      }),
      single: async () => {
        const { data, error } = await select(table, columns);
        return { data: data?.[0] || null, error };
      }
    }),
    insert: async (values: any) => {
      return await insert(table, values);
    },
    upsert: async (values: any) => {
      return await upsert(table, values);
    },
    update: (values: any) => ({
      eq: async (column: string, value: any) => {
        const { error } = await update(table, values, `${column} = $1`, [value]);
        return { error };
      }
    }),
    delete: () => ({
      eq: async (column: string, value: any) => {
        const { error } = await deleteRecord(table, `${column} = $1`, [value]);
        return { error };
      }
    })
  }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: new Error("Auth not configured") }),
    signUp: async () => ({ data: null, error: new Error("Auth not configured") }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ data: null, error: new Error("Auth not configured") }),
    verifyOtp: async () => ({ error: new Error("Auth not configured") }),
    resend: async () => ({ data: null, error: new Error("Auth not configured") }),
    updateUser: async () => ({ data: null, error: new Error("Auth not configured") })
  },
  storage: {
    from: () => ({
      upload: async () => ({ error: new Error("Storage not configured") }),
      getPublicUrl: () => ({ data: { publicUrl: "" } })
    })
  }
};

// Helper function for server components
import type { NextRequest } from "next/server";

export const createClient = (cookieStore: NextRequest['cookies']) => {
  return neonClient;
};

export async function getUserDesigns(userId: string) {
  try {
    const { data, error } = await select("tattoo_designs", "*", "user_id = $1 ORDER BY created_at DESC", [userId]);
    if (error) {
      console.error("Error getting user designs:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error getting user designs:", error);
    return [];
  }
}

export { neon };
export type { Database };