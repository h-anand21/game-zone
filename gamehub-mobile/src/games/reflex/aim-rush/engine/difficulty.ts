// ============================================================
// AIM RUSH — Multi-Dimensional Difficulty Scaler
// Evaluates speed, radius, lifetime, and moving chance
// ============================================================

import { GameModeConfig } from '../types';

export interface DifficultyParams {
  radius: number;
  lifetimeMs: number;
  movingSpeed: number;
  movingChance: number;
  dangerChance: number;
}

export function computeDifficulty(
  mode: GameModeConfig,
  score: number,
  chain: number
): DifficultyParams {
  // Scaling level index derived from both score and current chain
  const level = Math.min(20, Math.floor(score / 50) + Math.floor(chain / 4));

  // 1. Radius shrinks gradually
  const minRadius = Math.max(18, mode.baseRadius * 0.55);
  const radius = Math.max(
    minRadius,
    mode.baseRadius - level * 1.05
  );

  // 2. Lifetime decreases (from 1800ms down to 750ms)
  const baseLifetime = mode.id === 'rush' ? 1400 : 1800;
  const minLifetime = mode.id === 'rush' ? 650 : 800;
  const lifetimeMs = Math.max(
    minLifetime,
    baseLifetime - level * 55
  );

  // 3. Movement velocity
  const baseSpeed = 40 * mode.speedMultiplier;
  const movingSpeed = baseSpeed + level * 5;

  // 4. Moving target spawn chance
  const movingChance = Math.min(
    0.65,
    mode.id === 'rush' ? 0.35 + level * 0.03 : 0.15 + level * 0.025
  );

  // 5. Danger target spawn chance
  const dangerChance = Math.min(
    0.22,
    mode.dangerChance + Math.min(0.08, level * 0.005)
  );

  return {
    radius: Math.round(radius),
    lifetimeMs: Math.round(lifetimeMs),
    movingSpeed,
    movingChance,
    dangerChance,
  };
}
