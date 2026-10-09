// ============================================================
// DON'T TAP WRONG — Core Game Logic
// Deterministic seed generation, grid shuffling, and telemetry
// ============================================================

import type { TileItem, TileType, GameModeConfig, GridTileItem, GameModeId } from './types';
import { DtwColors } from './theme/colors';

let globalTileCounter = 0;

/**
 * Generates an active 3x3 (9 tiles) board configuration based on mode and current progression
 */
export function generateBoardTiles(
  mode: GameModeConfig,
  currentScore = 0,
  gridSize = 9
): TileItem[] {
  globalTileCounter += 1;

  // Compute number of safe & danger tiles
  const [minSafe, maxSafe] = mode.safeTileRange;
  let [minDanger, maxDanger] = mode.dangerTileRange;

  // In survival mode, scale danger count up with score
  if (mode.id === 'survival') {
    if (currentScore > 20) {
      minDanger = Math.min(3, maxDanger);
      maxDanger = Math.min(4, maxDanger);
    } else if (currentScore > 10) {
      minDanger = Math.min(2, maxDanger);
    }
  }

  const safeCount = Math.floor(Math.random() * (maxSafe - minSafe + 1)) + minSafe;
  const dangerCount = Math.floor(Math.random() * (maxDanger - minDanger + 1)) + minDanger;

  // Initialize all tiles as empty
  const tiles: TileItem[] = Array.from({ length: gridSize }).map((_, idx) => ({
    id: idx,
    type: 'empty' as TileType,
    key: `t-${idx}-${globalTileCounter}`,
  }));

  // Shuffle available grid positions
  const availableIndices = Array.from({ length: gridSize })
    .map((_, i) => i)
    .sort(() => Math.random() - 0.5);

  // Assign safe tiles (Green)
  for (let i = 0; i < safeCount && availableIndices.length > 0; i++) {
    const pos = availableIndices.pop()!;
    tiles[pos] = {
      id: pos,
      type: 'safe',
      key: `safe-${pos}-${globalTileCounter}`,
    };
  }

  // Assign danger tiles (Red)
  for (let i = 0; i < dangerCount && availableIndices.length > 0; i++) {
    const pos = availableIndices.pop()!;
    tiles[pos] = {
      id: pos,
      type: 'danger',
      key: `danger-${pos}-${globalTileCounter}`,
    };
  }

  return tiles;
}

/**
 * Backward compatibility helper for legacy registry/engine calls
 */
export function generateTileGrid(gridSize = 9): GridTileItem[] {
  const correctCount = Math.floor(Math.random() * 2) + 2; // 2-3 green
  const wrongCount = Math.floor(Math.random() * 2) + 1;   // 1-2 red

  const tiles: GridTileItem[] = Array.from({ length: gridSize }).map((_, idx) => ({
    id: idx,
    type: 'empty',
  }));

  const availableIndices = Array.from({ length: gridSize })
    .map((_, i) => i)
    .sort(() => Math.random() - 0.5);

  for (let i = 0; i < correctCount && availableIndices.length > 0; i++) {
    tiles[availableIndices.pop()!] = { id: i, type: 'correct' };
  }

  for (let i = 0; i < wrongCount && availableIndices.length > 0; i++) {
    tiles[availableIndices.pop()!] = { id: i, type: 'wrong' };
  }

  return tiles;
}

/**
 * Calculates accuracy percentage
 */
export function calculateAccuracy(safeTaps: number, dangerTaps: number): number {
  const total = safeTaps + dangerTaps;
  if (total === 0) return 100;
  return Math.round((safeTaps / total) * 100);
}

/**
 * Streak multiplier label
 */
export function getStreakMilestone(streak: number): string | null {
  if (streak === 5) return '5 STREAK! 🔥';
  if (streak === 10) return '10 STREAK! ⚡';
  if (streak === 15) return 'UNSTOPPABLE! 💎';
  if (streak === 20) return 'GODLIKE SPEED! 👑';
  if (streak > 20 && streak % 5 === 0) return `${streak} ULTRA STREAK! 🚀`;
  return null;
}

/**
 * Result performance grade
 */
export function getGradeForScore(score: number, modeId: GameModeId): {
  grade: string;
  label: string;
  color: string;
} {
  if (modeId === 'classic') {
    if (score >= 25) return { grade: 'S+', label: 'CYBER LEGEND', color: DtwColors.streakGold };
    if (score >= 20) return { grade: 'S', label: 'REFLEX MASTER', color: DtwColors.safeGreen };
    if (score >= 15) return { grade: 'A', label: 'TARGET SECURED', color: DtwColors.cyanAccent };
    if (score >= 10) return { grade: 'B', label: 'SHARP REFLEX', color: DtwColors.safeGreenHighlight };
    return { grade: 'C', label: 'CADET', color: DtwColors.textSecondary };
  }

  if (modeId === 'rush') {
    if (score >= 30) return { grade: 'S+', label: 'SPEED DEMON', color: DtwColors.streakGold };
    if (score >= 20) return { grade: 'S', label: 'BLITZ MASTER', color: DtwColors.safeGreen };
    if (score >= 15) return { grade: 'A', label: 'FAST HANDS', color: DtwColors.cyanAccent };
    return { grade: 'B', label: 'REACTION SPEED', color: DtwColors.textSecondary };
  }

  // Survival
  if (score >= 35) return { grade: 'S+', label: 'IMMORTAL', color: DtwColors.streakGold };
  if (score >= 25) return { grade: 'S', label: 'SURVIVOR', color: DtwColors.safeGreen };
  if (score >= 15) return { grade: 'A', label: 'TENACIOUS', color: DtwColors.cyanAccent };
  return { grade: 'B', label: 'FALLEN', color: DtwColors.dangerRedHighlight };
}
