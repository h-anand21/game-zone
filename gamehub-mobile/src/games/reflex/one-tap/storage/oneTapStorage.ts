// ============================================================
// ONE TAP: PRECISION GAME — Local Persistence Storage
// Async storage for user stats, best records and settings
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { OneTapUserProfile, OneTapSettings, OneTapRunResult } from '../types';

const STORAGE_KEYS = {
  PROFILE: '@one_tap_user_profile_v1',
  SETTINGS: '@one_tap_settings_v1',
};

const DEFAULT_PROFILE: OneTapUserProfile = {
  totalRuns: 0,
  personalBestScore: 742,
  previousBestScore: 0,
  bestCombo: 18,
  bestAccuracy: 88.5,
  fastestReactionMs: 160,
  averageReactionMs: 240,
  totalPerfects: 45,
  totalGreats: 72,
  totalGoods: 98,
  totalMisses: 12,
  totalCoins: 250,
  totalXp: 180,
  unlockedModes: ['classic', 'endless', 'rush'],
  tutorialCompleted: false,
  dailyChallengeBest: 0,
};

const DEFAULT_SETTINGS: OneTapSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
  visualFxLevel: 'high',
};

export const OneTapStorage = {
  async getProfile(): Promise<OneTapUserProfile> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  },

  async saveProfile(profile: OneTapUserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  },

  async recordRun(result: OneTapRunResult): Promise<{
    isNewBest: boolean;
    profile: OneTapUserProfile;
  }> {
    const profile = await this.getProfile();
    const isNewBest = result.finalScore > profile.personalBestScore;

    const previousBest = profile.personalBestScore;
    const newBest = isNewBest ? result.finalScore : previousBest;

    const updatedProfile: OneTapUserProfile = {
      ...profile,
      totalRuns: profile.totalRuns + 1,
      previousBestScore: isNewBest ? previousBest : profile.previousBestScore,
      personalBestScore: newBest,
      bestCombo: Math.max(profile.bestCombo, result.maxCombo),
      bestAccuracy: Math.max(profile.bestAccuracy, result.accuracyPercentage),
      fastestReactionMs:
        profile.fastestReactionMs === 0
          ? result.averageReactionTimeMs
          : Math.min(profile.fastestReactionMs, result.averageReactionTimeMs),
      totalPerfects: profile.totalPerfects + result.perfectCount,
      totalGreats: profile.totalGreats + result.greatCount,
      totalGoods: profile.totalGoods + result.goodCount,
      totalMisses: profile.totalMisses + result.missCount,
      totalCoins: profile.totalCoins + result.earnedCoins,
      totalXp: profile.totalXp + result.earnedXp,
      lastPlayedDate: new Date().toISOString(),
    };

    await this.saveProfile(updatedProfile);
    return { isNewBest, profile: updatedProfile };
  },

  async getSettings(): Promise<OneTapSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  },

  async saveSettings(settings: OneTapSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  },

  async resetAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
    } catch {
      // Ignore
    }
  },
};
