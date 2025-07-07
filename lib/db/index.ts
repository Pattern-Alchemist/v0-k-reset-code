import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

/**
 * Database connection and Drizzle ORM setup
 *
 * This file establishes the database connection using postgres-js
 * and creates the Drizzle ORM instance with our schema
 */

// Connection string from environment variables
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required")
}

// Create postgres client
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
})

// Create Drizzle instance
export const db = drizzle(client, { schema })

// Export schema for use in other files
export * from "./schema"

// Helper function to close database connection (useful for testing)
export const closeDb = async () => {
  await client.end()
}
