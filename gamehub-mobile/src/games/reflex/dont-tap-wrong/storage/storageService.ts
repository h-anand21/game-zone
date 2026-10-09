// ============================================================
// DON'T TAP WRONG — Offline-first Storage Service
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile, GameSettings, RunTelemetry } from '../types';

const STORAGE_KEYS = {
  PROFILE: '@dtw_user_profile_v2',
  SETTINGS: '@dtw_game_settings_v2',
};

const DEFAULT_PROFILE: UserProfile = {
  classicHighScore: 0,
  rushHighScore: 0,
  survivalHighScore: 0,
  dailyHighScore: 0,
  bestStreak: 0,
  totalRuns: 0,
  totalSafeTaps: 0,
  totalDangerTaps: 0,
  totalTimePlayedSeconds: 0,
  dailyRunsCompleted: 0,
  lastDailyDate: '',
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
  graphicsQuality: 'high',
};

export const DtwStorage = {
  async getProfile(): Promise<UserProfile> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // Fallback
    }
  },

  async recordRun(run: RunTelemetry): Promise<{ isNewBest: boolean; profile: UserProfile }> {
    const profile = await this.getProfile();
    let isNewBest = false;

    if (run.mode === 'classic' && run.score > profile.classicHighScore) {
      profile.classicHighScore = run.score;
      isNewBest = true;
    } else if (run.mode === 'rush' && run.score > profile.rushHighScore) {
      profile.rushHighScore = run.score;
      isNewBest = true;
    } else if (run.mode === 'survival' && run.score > profile.survivalHighScore) {
      profile.survivalHighScore = run.score;
      isNewBest = true;
    } else if (run.mode === 'daily' && run.score > profile.dailyHighScore) {
      profile.dailyHighScore = run.score;
      isNewBest = true;
    }

    if (run.bestStreak > profile.bestStreak) {
      profile.bestStreak = run.bestStreak;
    }

    profile.totalRuns += 1;
    profile.totalSafeTaps += run.safeTaps;
    profile.totalDangerTaps += run.dangerTaps;
    profile.totalTimePlayedSeconds += Math.round(run.durationElapsedSeconds);

    if (run.mode === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      if (profile.lastDailyDate !== today) {
        profile.lastDailyDate = today;
        profile.dailyRunsCompleted += 1;
      }
    }

    await this.saveProfile(profile);
    return { isNewBest, profile };
  },

  async getSettings(): Promise<GameSettings> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  },

  async saveSettings(settings: GameSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Fallback
    }
  },

  async resetAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
      await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch {
      // Fallback
    }
  },
};
