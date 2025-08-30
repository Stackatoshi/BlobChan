import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  ...(process.env.DATABASE_URL && {
    dbCredentials: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
})
