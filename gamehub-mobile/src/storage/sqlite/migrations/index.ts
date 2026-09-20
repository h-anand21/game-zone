// ============================================================
// GameHub — Migration Registry
// ============================================================

import * as m001 from './001_initial';
import * as m002 from './002_progress';
import * as m003 from './003_challenges';
import * as m004 from './004_favorites';
import * as m005 from './005_remote_config';
import type { SQLiteDatabase } from 'expo-sqlite';

export interface Migration {
  version: number;
  name: string;
  up: (db: SQLiteDatabase) => Promise<void>;
}

/**
 * Ordered list of all migrations.
 * New migrations MUST be appended — never insert or reorder.
 * Never destructively modify existing migrations.
 */
export const ALL_MIGRATIONS: Migration[] = [
  { version: m001.VERSION, name: m001.NAME, up: m001.up },
  { version: m002.VERSION, name: m002.NAME, up: m002.up },
  { version: m003.VERSION, name: m003.NAME, up: m003.up },
  { version: m004.VERSION, name: m004.NAME, up: m004.up },
  { version: m005.VERSION, name: m005.NAME, up: m005.up },
];
