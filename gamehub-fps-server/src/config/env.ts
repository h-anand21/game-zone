// ============================================================
// GameHub FPS Server — Environment Config
// ============================================================

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5001'),
  EXPRESS_BACKEND_URL: z.string().default('http://localhost:5000'),
  TICK_RATE: z.string().transform(Number).default('60'),
  SNAPSHOT_RATE: z.string().transform(Number).default('20'),
});

export const env = envSchema.parse(process.env);
