// drizzle.config.ts
import { defineConfig } from "drizzle-kit"

if(!process.env.DATABASE_URL){
throw new Error('DATABASE_URL env is required.')
}
export default defineConfig({
  // Dialeto correto do PostgreSQL
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  out: './drizzle',
  schema: './src/database/schema.ts',
})
