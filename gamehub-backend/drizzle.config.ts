import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

// Direct connection (non-pooler) for DDL migrations
let connectionString = process.env.DATABASE_URL || '';
if (connectionString.includes('-pooler.')) {
  connectionString = connectionString.replace('-pooler.', '.');
}

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString,
  },
} satisfies Config;
