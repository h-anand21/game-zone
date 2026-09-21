// ============================================================
// GameHub — Result Manager
// Prepares result screen data after game completion
// ============================================================

import type { GameResult } from './GameLifecycle';

export interface ResultScreenData {
  gameId: string;
  gameName: string;
  score: number;
  duration: number;
  result: 'win' | 'loss' | 'draw' | 'completed';
  xpEarned: number;
  coinsEarned: number;
  isNewBestScore: boolean;
  previousBestScore: number;
  achievementsUnlocked: string[];
  leveledUp: boolean;
  newLevel: number | null;
  streakDay: number;
  metadata: Record<string, any>;
}

/** Base XP per game, can be overridden per game */
const BASE_XP = 15;
const BASE_COINS = 5;
const WIN_MULTIPLIER = 1.5;
const SCORE_BONUS_THRESHOLD = 500;

export class ResultManager {
  /**
   * Calculate full result screen data from a game result
   */
  static calculateRewards(
    gameId: string,
    gameName: string,
    result: GameResult,
    previousBestScore: number = 0,
    currentStreakDay: number = 0,
    currentLevel: number = 1,
  ): ResultScreenData {
    // XP calculation
    let xpEarned = BASE_XP;
    if (result.result === 'win') xpEarned = Math.floor(xpEarned * WIN_MULTIPLIER);
    if (result.score > SCORE_BONUS_THRESHOLD) xpEarned += Math.floor(result.score / 100);
    if (currentStreakDay >= 7) xpEarned = Math.floor(xpEarned * 1.2); // 20% streak bonus

    // Coins calculation
    let coinsEarned = BASE_COINS;
    if (result.result === 'win') coinsEarned += 3;
    if (result.score > previousBestScore && previousBestScore > 0) coinsEarned += 5; // New best bonus

    // Check new best score
    const isNewBestScore = result.score > previousBestScore;

    return {
      gameId,
      gameName,
      score: result.score,
      duration: result.duration,
      result: result.result,
      xpEarned,
      coinsEarned,
      isNewBestScore,
      previousBestScore,
      achievementsUnlocked: [], // Populated by AchievementEngine
      leveledUp: false,         // Populated by LevelSystem
      newLevel: null,
      streakDay: currentStreakDay,
      metadata: result.metadata || {},
    };
  }

  /**
   * Format duration for display (e.g., "2:35")
   */
  static formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Get result emoji for display
   */
  static getResultEmoji(result: string): string {
    switch (result) {
      case 'win': return '🏆';
      case 'loss': return '💀';
      case 'draw': return '🤝';
      default: return '✅';
    }
  }

  /**
   * Get motivational message based on result
   */
  static getResultMessage(result: string, score: number, bestScore: number): string {
    if (score > bestScore && bestScore > 0) return '🔥 New Personal Best!';
    switch (result) {
      case 'win': return '🎉 Great Victory!';
      case 'loss': return '💪 Better luck next time!';
      case 'draw': return '🤝 Close match!';
      default: return '✨ Well played!';
    }
  }
}
