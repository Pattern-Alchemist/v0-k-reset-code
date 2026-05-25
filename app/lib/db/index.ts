import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const requiredEnvVars = ["DATABASE_URL"] as const
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

const connectionString = process.env.DATABASE_URL!

const connectionConfig = {
  max: Number.parseInt(process.env.DB_POOL_SIZE || "10"),
  idle_timeout: Number.parseInt(process.env.DB_IDLE_TIMEOUT || "20"),
  connect_timeout: Number.parseInt(process.env.DB_CONNECT_TIMEOUT || "10"),
  prepare: process.env.NODE_ENV === "production",
  onnotice: process.env.NODE_ENV === "development" ? console.log : undefined,
}

export const client = postgres(connectionString, connectionConfig)

export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === "development",
})

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await client`SELECT 1`
    return true
  } catch (error) {
    console.error("Database health check failed:", error)
    return false
  }
}

export function getConnectionInfo() {
  return {
    maxConnections: connectionConfig.max,
    idleTimeout: connectionConfig.idle_timeout,
    connectTimeout: connectionConfig.connect_timeout,
    prepared: connectionConfig.prepare,
  }
}

export async function closeDatabase(): Promise<void> {
  try {
    await client.end()
    console.log("Database connection closed gracefully")
  } catch (error) {
    console.error("Error closing database connection:", error)
  }
}

export * from "./schema"

export type {
  User,
  NewUser,
  Module,
  NewModule,
  Pod,
  NewPod,
  Mission,
  NewMission,
  Organization,
  NewOrganization,
} from "./schema"
