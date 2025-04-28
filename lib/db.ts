import { neon } from "@neondatabase/serverless"

// Create a SQL query function using the Neon serverless driver
const sql = neon(process.env.DATABASE_URL!)

export { sql }
