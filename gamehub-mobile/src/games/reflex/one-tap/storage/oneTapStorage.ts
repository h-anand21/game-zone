// ============================================================
// ONE TAP: PRECISION GAME — Local Persistence Storage
// Async storage for user stats, best records and settings
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { OneTapUserProfile, OneTapSettings, OneTapRunResult } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_USER_PROFILE } from '../config';

const STORAGE_KEYS = {
  PROFILE: '@one_tap_user_profile_v1',
  SETTINGS: '@one_tap_settings_v1',
};

export const OneTapStorage = {
  async getProfile(): Promise<OneTapUserProfile> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        return { ...DEFAULT_USER_PROFILE, ...JSON.parse(data) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_USER_PROFILE;
  },

  async saveProfile(profile: OneTapUserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.warn('Failed to save OneTap profile:', err);
    }
  },

  async recordRunResult(result: OneTapRunResult): Promise<{
    profile: OneTapUserProfile;
    isNewPersonalBest: boolean;
  }> {
    const current = await this.getProfile();
    const isNewPersonalBest = result.finalScore > current.personalBestScore;

    const nextTotalGames = current.totalGamesPlayed + 1;
    const nextMaxCombo = Math.max(current.maxComboRecorded, result.maxCombo);
    const nextBestScore = Math.max(current.personalBestScore, result.finalScore);
    const nextFastest =
      current.fastestReactionMs === 0
        ? result.averageReactionTimeMs
        : Math.min(current.fastestReactionMs, result.averageReactionTimeMs);

    const prevLifetime = current.lifetimeAccuracy * (nextTotalGames - 1);
    const nextAccuracy =
      Math.round(((prevLifetime + result.accuracyPercentage) / nextTotalGames) * 10) / 10;

    const updated: OneTapUserProfile = {
      ...current,
      totalRuns: current.totalRuns + 1,
      totalGamesPlayed: nextTotalGames,
      previousBestScore: isNewPersonalBest ? current.personalBestScore : current.previousBestScore,
      personalBestScore: nextBestScore,
      bestCombo: nextMaxCombo,
      maxComboRecorded: nextMaxCombo,
      bestAccuracy: Math.max(current.bestAccuracy, result.accuracyPercentage),
      lifetimeAccuracy: nextAccuracy,
      fastestReactionMs: nextFastest,
      averageReactionMs: Math.round(
        (current.averageReactionMs + result.averageReactionTimeMs) / 2
      ),
      totalPerfects: current.totalPerfects + result.perfectCount,
      totalPerfectHits: current.totalPerfectHits + result.perfectCount,
      totalGreats: current.totalGreats + result.greatCount,
      totalGoods: current.totalGoods + result.goodCount,
      totalMisses: current.totalMisses + result.missCount,
      totalCoins: current.totalCoins + result.earnedCoins,
      coins: current.coins + result.earnedCoins,
      totalXp: current.totalXp + result.earnedXp,
      xp: current.xp + result.earnedXp,
      lastPlayedDate: new Date().toISOString(),
    };

    await this.saveProfile(updated);
    return { profile: updated, isNewPersonalBest };
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
    } catch (err) {
      console.warn('Failed to save OneTap settings:', err);
    }
  },

  async resetAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.PROFILE, STORAGE_KEYS.SETTINGS]);
    } catch (err) {
      console.warn('Failed to reset OneTap data:', err);
    }
  },
};
