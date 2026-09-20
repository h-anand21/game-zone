// ============================================================
// GameHub Backend — Environment Configuration & Validation
// ============================================================

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().default('postgresql://user:password@localhost:5432/gamehub'),
  JWT_SECRET: z.string().default('default-jwt-secret-key-gamehub'),
  JWT_REFRESH_SECRET: z.string().default('default-jwt-refresh-secret-key-gamehub'),
  CORS_ORIGIN: z.string().default('*'),
});

export const env = envSchema.parse(process.env);
