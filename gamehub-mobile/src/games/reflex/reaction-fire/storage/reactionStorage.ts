// ============================================================
// REACTION FIRE — Typed Local Storage Service
// Powered by AsyncStorage with safe defaults & migration protection
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  ReactionStats,
  ReactionSettings,
  DailyChallengeState,
  MissionItem,
  AchievementItem,
  RunResult,
} from '../types';
import { createInitialDailyState, getTodayDateString } from '../logic/dailyChallenge';
import { INITIAL_MISSIONS, INITIAL_ACHIEVEMENTS } from '../logic/missions';

const STORAGE_KEYS = {
  STATS: '@reaction_fire_stats_v2',
  SETTINGS: '@reaction_fire_settings_v2',
  DAILY: '@reaction_fire_daily_v2',
  MISSIONS: '@reaction_fire_missions_v2',
  ACHIEVEMENTS: '@reaction_fire_achievements_v2',
  ONBOARDING: '@reaction_fire_onboarding_v2',
};

export const DEFAULT_STATS: ReactionStats = {
  bestTimeMs: null,
  classicBestMs: null,
  fiveRoundBestMs: null,
  enduranceBestScore: 0,
  fakeoutBestMs: null,
  totalAttempts: 0,
  successfulAttempts: 0,
  falseStarts: 0,
  completedGames: 0,
  totalValidRounds: 0,
  recentAttempts: [],
  level: 1,
  xp: 0,
};

export const DEFAULT_SETTINGS: ReactionSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
  showReactionTime: true,
  showHitEffects: true,
  showHelpfulTips: true,
};

export const ReactionStorage = {
  async getStats(): Promise<ReactionStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
      if (data) return { ...DEFAULT_STATS, ...JSON.parse(data) };
    } catch {
      // Safe fallback
    }
    return DEFAULT_STATS;
  },

  async saveStats(stats: ReactionStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch {
      // Safe fallback
    }
  },

  async recordRun(result: RunResult): Promise<ReactionStats> {
    const stats = await this.getStats();

    stats.totalAttempts += result.roundTimes.length + result.falseStartsCount;
    stats.successfulAttempts += result.totalRoundsCompleted;
    stats.falseStarts += result.falseStartsCount;
    stats.completedGames += 1;
    stats.totalValidRounds += result.totalRoundsCompleted;

    // Mode-specific high scores (lower is better for ms, higher for endurance score)
    if (result.reactionTimeMs !== null && result.mode !== 'practice') {
      if (stats.bestTimeMs === null || result.reactionTimeMs < stats.bestTimeMs) {
        stats.bestTimeMs = result.reactionTimeMs;
      }

      if (result.mode === 'classic') {
        if (stats.classicBestMs === null || result.reactionTimeMs < stats.classicBestMs) {
          stats.classicBestMs = result.reactionTimeMs;
        }
      } else if (result.mode === 'five-round') {
        if (stats.fiveRoundBestMs === null || result.reactionTimeMs < stats.fiveRoundBestMs) {
          stats.fiveRoundBestMs = result.reactionTimeMs;
        }
      } else if (result.mode === 'fakeout') {
        if (stats.fakeoutBestMs === null || result.reactionTimeMs < stats.fakeoutBestMs) {
          stats.fakeoutBestMs = result.reactionTimeMs;
        }
      }
    }

    if (result.mode === 'endurance') {
      const hits = result.totalValidHits || 0;
      if (hits > stats.enduranceBestScore) {
        stats.enduranceBestScore = hits;
      }
    }

    // Append to recent attempts list (capped at 25)
    if (result.reactionTimeMs !== null) {
      stats.recentAttempts.unshift({
        id: `att-${Date.now()}`,
        mode: result.mode,
        reactionTimeMs: result.reactionTimeMs,
        status: 'success',
        timestamp: Date.now(),
      });
      if (stats.recentAttempts.length > 25) {
        stats.recentAttempts.pop();
      }
    }

    // Award XP
    const earnedXp = result.targetReached ? 75 : 30;
    stats.xp += earnedXp;
    stats.level = Math.floor(stats.xp / 500) + 1;

    await this.saveStats(stats);
    return stats;
  },

  async getSettings(): Promise<ReactionSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      // Safe fallback
    }
    return DEFAULT_SETTINGS;
  },

  async saveSettings(settings: ReactionSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Safe fallback
    }
  },

  async getDailyState(): Promise<DailyChallengeState> {
    const today = getTodayDateString();
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY);
      if (data) {
        const parsed: DailyChallengeState = JSON.parse(data);
        if (parsed.date === today) {
          return parsed;
        }
      }
    } catch {
      // Safe fallback
    }
    const fresh = createInitialDailyState(today);
    await this.saveDailyState(fresh);
    return fresh;
  },

  async saveDailyState(daily: DailyChallengeState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(daily));
    } catch {
      // Safe fallback
    }
  },

  async getMissions(): Promise<MissionItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MISSIONS);
      if (data) return JSON.parse(data);
    } catch {
      // Safe fallback
    }
    return INITIAL_MISSIONS;
  },

  async saveMissions(missions: MissionItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
    } catch {
      // Safe fallback
    }
  },

  async getAchievements(): Promise<AchievementItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (data) return JSON.parse(data);
    } catch {
      // Safe fallback
    }
    return INITIAL_ACHIEVEMENTS;
  },

  async saveAchievements(achievements: AchievementItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch {
      // Safe fallback
    }
  },

  async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING);
      return val === 'true';
    } catch {
      return false;
    }
  },

  async setCompletedOnboarding(val = true): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, val ? 'true' : 'false');
    } catch {
      // Safe fallback
    }
  },

  async resetAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.STATS,
        STORAGE_KEYS.DAILY,
        STORAGE_KEYS.MISSIONS,
        STORAGE_KEYS.ACHIEVEMENTS,
        STORAGE_KEYS.ONBOARDING,
      ]);
    } catch {
      // Safe fallback
    }
  },
};
