// ============================================================
// GameHub — Difficulty Manager
// ============================================================

import type { GameConfig } from '@/constants/types';

export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'expert';

export interface DifficultyParams {
  level: DifficultyLevel;
  [key: string]: unknown;
}

/**
 * Manages difficulty settings for a game.
 * Games define their own parameters per difficulty level.
 */
export class DifficultyManager {
  private currentLevel: DifficultyLevel = 'normal';
  private configs: Map<DifficultyLevel, Record<string, unknown>> = new Map();

  constructor(public readonly gameConfig: GameConfig) {}

  /** Register a difficulty level with its parameters. */
  register(level: DifficultyLevel, params: Record<string, unknown>): void {
    this.configs.set(level, params);
  }

  /** Set the current difficulty. */
  setDifficulty(level: DifficultyLevel): void {
    this.currentLevel = level;
  }

  /** Get current difficulty level. */
  getLevel(): DifficultyLevel {
    return this.currentLevel;
  }

  /** Get parameters for the current difficulty. */
  getParams(): Record<string, unknown> {
    return this.configs.get(this.currentLevel) ?? {};
  }

  /** Get a specific parameter value. */
  getParam<T>(key: string, defaultValue: T): T {
    const params = this.getParams();
    return (params[key] as T) ?? defaultValue;
  }
}
