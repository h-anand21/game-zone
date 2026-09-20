// ============================================================
// GameHub — Achievement Engine
// ============================================================

import { ACHIEVEMENTS } from './achievement-definitions';
import type { Achievement } from '@/constants/types';

export interface EvaluationContext {
  gameId: string;
  score: number;
  won: boolean;
  totalGamesPlayed: number;
  currentLevel: number;
  unlockedAchievementCodes: Set<string>;
}

export function checkAchievements(context: EvaluationContext): {
  newlyUnlocked: Achievement[];
  totalXPEarned: number;
} {
  const newlyUnlocked: Achievement[] = [];
  let totalXPEarned = 0;

  const isUnlocked = (code: string) => context.unlockedAchievementCodes.has(code);

  // 1. FIRST_GAME
  if (context.totalGamesPlayed >= 1 && !isUnlocked('FIRST_GAME')) {
    const ach = ACHIEVEMENTS.find((a) => a.code === 'FIRST_GAME');
    if (ach) newlyUnlocked.push(ach);
  }

  // 2. GAMES_10
  if (context.totalGamesPlayed >= 10 && !isUnlocked('GAMES_10')) {
    const ach = ACHIEVEMENTS.find((a) => a.code === 'GAMES_10');
    if (ach) newlyUnlocked.push(ach);
  }

  // 3. GAMES_50
  if (context.totalGamesPlayed >= 50 && !isUnlocked('GAMES_50')) {
    const ach = ACHIEVEMENTS.find((a) => a.code === 'GAMES_50');
    if (ach) newlyUnlocked.push(ach);
  }

  // 4. LEVEL_5
  if (context.currentLevel >= 5 && !isUnlocked('LEVEL_5')) {
    const ach = ACHIEVEMENTS.find((a) => a.code === 'LEVEL_5');
    if (ach) newlyUnlocked.push(ach);
  }

  // 5. TTT_WINNER
  if (context.gameId === 'tic-tac-toe' && context.won && !isUnlocked('TTT_WINNER')) {
    const ach = ACHIEVEMENTS.find((a) => a.code === 'TTT_WINNER');
    if (ach) newlyUnlocked.push(ach);
  }

  // 6. SNAKE_100
  if (context.gameId === 'snake' && context.score >= 100 && !isUnlocked('SNAKE_100')) {
    const ach = ACHIEVEMENTS.find((a) => a.code === 'SNAKE_100');
    if (ach) newlyUnlocked.push(ach);
  }

  // 7. MINDLOCK_5
  if (context.gameId === 'mind-lock' && context.score >= 5 && !isUnlocked('MINDLOCK_5')) {
    const ach = ACHIEVEMENTS.find((a) => a.code === 'MINDLOCK_5');
    if (ach) newlyUnlocked.push(ach);
  }

  // 8. FINDONE_SPEED
  if (context.gameId === 'find-one' && context.score >= 10 && !isUnlocked('FINDONE_SPEED')) {
    const ach = ACHIEVEMENTS.find((a) => a.code === 'FINDONE_SPEED');
    if (ach) newlyUnlocked.push(ach);
  }

  // 9. NUMBERRUSH_MATH
  if (context.gameId === 'number-rush' && context.score >= 15 && !isUnlocked('NUMBERRUSH_MATH')) {
    const ach = ACHIEVEMENTS.find((a) => a.code === 'NUMBERRUSH_MATH');
    if (ach) newlyUnlocked.push(ach);
  }

  totalXPEarned = newlyUnlocked.reduce((sum, a) => sum + a.xpReward, 0);

  return { newlyUnlocked, totalXPEarned };
}
