// ============================================================
// DON'T TAP WRONG — Board Generator Engine
// Authoritative board generation with guaranteed playability,
// stable tile IDs, and deterministic daily seeding support
// ============================================================

import type { TileItem, TileType, GameModeConfig, GridTileItem } from '../types';

let boardRevisionCounter = 0;

/**
 * Simple deterministic linear congruential PRNG for seeded daily challenges
 */
class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed % 2147483647;
    if (this.state <= 0) {
      this.state += 2147483646;
    }
  }

  next(): number {
    this.state = (this.state * 16807) % 2147483647;
    return (this.state - 1) / 2147483646;
  }
}

/**
 * Returns a numerical seed from a date string (YYYY-MM-DD)
 */
export function getDailySeed(dateStr?: string): number {
  const d = dateStr || new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < d.length; i++) {
    hash = (hash << 5) - hash + d.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) + 12345;
}

/**
 * Generates an authoritative 3x3 board (9 tiles)
 * Guaranteed:
 * - At least 1 safe green tile
 * - At least 1 danger red tile
 * - No impossible setups
 * - Clean revision tracking
 */
export function generateBoard(
  mode: GameModeConfig,
  currentScore = 0,
  seed?: number,
  roundNumber = 0
): { tiles: TileItem[]; revision: number } {
  boardRevisionCounter += 1;
  const revision = boardRevisionCounter;

  // PRNG selector
  const prng = seed !== undefined ? new SeededRandom(seed + roundNumber * 7919) : null;
  const rand = () => (prng ? prng.next() : Math.random());

  // Determine tile counts according to mode rules
  const [minSafe, maxSafe] = mode.safeTileRange;
  let [minDanger, maxDanger] = mode.dangerTileRange;

  // In endless survival mode, scale danger tiles dynamically as score climbs
  if (mode.id === 'survival') {
    if (currentScore >= 25) {
      minDanger = Math.min(3, maxDanger);
      maxDanger = Math.min(4, maxDanger);
    } else if (currentScore >= 12) {
      minDanger = Math.min(2, maxDanger);
    }
  }

  // Safe and danger counts (guaranteed >= 1 each)
  const safeCount = Math.max(1, Math.floor(rand() * (maxSafe - minSafe + 1)) + minSafe);
  const dangerCount = Math.max(1, Math.floor(rand() * (maxDanger - minDanger + 1)) + minDanger);

  const gridSize = 9;
  const tiles: TileItem[] = Array.from({ length: gridSize }).map((_, idx) => ({
    id: idx,
    type: 'empty' as TileType,
    key: `t-${idx}-r${revision}`,
  }));

  // Shuffle available grid positions
  const availableIndices = Array.from({ length: gridSize }).map((_, i) => i);
  for (let i = availableIndices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
  }

  // Assign safe tiles (Green)
  for (let i = 0; i < safeCount && availableIndices.length > 0; i++) {
    const pos = availableIndices.pop()!;
    tiles[pos] = {
      id: pos,
      type: 'safe',
      key: `safe-${pos}-r${revision}`,
    };
  }

  // Assign danger tiles (Red)
  for (let i = 0; i < dangerCount && availableIndices.length > 0; i++) {
    const pos = availableIndices.pop()!;
    tiles[pos] = {
      id: pos,
      type: 'danger',
      key: `danger-${pos}-r${revision}`,
    };
  }

  return { tiles, revision };
}

/**
 * Generates an interactive practice demo step board
 */
export function generatePracticeBoard(step: 1 | 2 | 3): TileItem[] {
  boardRevisionCounter += 1;
  const rev = boardRevisionCounter;
  const tiles: TileItem[] = Array.from({ length: 9 }).map((_, idx) => ({
    id: idx,
    type: 'empty' as TileType,
    key: `demo-${idx}-r${rev}`,
  }));

  if (step === 1) {
    // Step 1: Safe tile in center slot (id 4)
    tiles[4] = { id: 4, type: 'safe', key: `demo-safe-4-r${rev}` };
  } else if (step === 2) {
    // Step 2: Safe tile in slot 2, danger in slot 6
    tiles[2] = { id: 2, type: 'safe', key: `demo-safe-2-r${rev}` };
    tiles[6] = { id: 6, type: 'danger', key: `demo-danger-6-r${rev}` };
  } else {
    // Step 3: Realistic board with 2 safe, 2 danger
    tiles[0] = { id: 0, type: 'safe', key: `demo-safe-0-r${rev}` };
    tiles[3] = { id: 3, type: 'danger', key: `demo-danger-3-r${rev}` };
    tiles[4] = { id: 4, type: 'danger', key: `demo-danger-4-r${rev}` };
    tiles[8] = { id: 8, type: 'safe', key: `demo-safe-8-r${rev}` };
  }

  return tiles;
}

/**
 * Backward compatibility helper for legacy registry / test runners
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
