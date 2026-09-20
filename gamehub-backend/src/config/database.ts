// ============================================================
// GameHub Backend — Drizzle + Neon Client Configuration
// ============================================================

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../db/schema.js';
import { env } from './env.js';

// Enable WebSocket for serverless Neon pool connections
neonConfig.fetchConnectionCache = true;

export const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(pool, { schema });
