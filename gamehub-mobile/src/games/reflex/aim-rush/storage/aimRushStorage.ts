// ============================================================
// AIM RUSH — Storage Service
// Offline-first persistence using AsyncStorage
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AimRushUserProfile, AimRushSettings, AimRushMission, AimRushRunResult } from '../types';

const STORAGE_KEYS = {
  PROFILE: '@aim_rush_profile_v2',
  SETTINGS: '@aim_rush_settings_v2',
  MISSIONS: '@aim_rush_missions_v2',
  LAST_RUN: '@aim_rush_last_run_v2',
};

const DEFAULT_PROFILE: AimRushUserProfile = {
  personalBestScore: 0,
  bestChain: 0,
  totalRuns: 0,
  totalTargetsHit: 0,
  totalPerfects: 0,
  totalMisses: 0,
  totalPlayTimeSeconds: 0,
  tutorialCompleted: false,
};

const DEFAULT_SETTINGS: AimRushSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  reducedFx: false,
  graphicsQuality: 'high',
};

const DEFAULT_MISSIONS: AimRushMission[] = [
  {
    id: 'm1',
    title: 'FIRST STRIKE',
    description: 'Hit 25 targets in any game mode',
    rewardCoins: 50,
    current: 0,
    target: 25,
    completed: false,
    claimed: false,
  },
  {
    id: 'm2',
    title: 'CHAIN ARCHITECT',
    description: 'Achieve a continuous chain of ×10 or higher',
    rewardCoins: 100,
    current: 0,
    target: 10,
    completed: false,
    claimed: false,
  },
  {
    id: 'm3',
    title: 'DEADEYE CENTER',
    description: 'Land 15 dead-center PERFECT hits',
    rewardCoins: 120,
    current: 0,
    target: 15,
    completed: false,
    claimed: false,
  },
  {
    id: 'm4',
    title: 'HIGH SCORER',
    description: 'Reach a single run score of 500+',
    rewardCoins: 200,
    current: 0,
    target: 500,
    completed: false,
    claimed: false,
  },
];

export const AimRushStorage = {
  async getProfile(): Promise<AimRushUserProfile> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch (e) {
      // Return safe defaults
    }
    return DEFAULT_PROFILE;
  },

  async saveProfile(profile: AimRushUserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      // Ignore
    }
  },

  async recordRun(result: AimRushRunResult): Promise<{ isNewBest: boolean; profile: AimRushUserProfile }> {
    const profile = await this.getProfile();
    const isNewBest = result.score > profile.personalBestScore;

    profile.totalRuns += 1;
    profile.totalTargetsHit += result.totalHits;
    profile.totalPerfects += result.perfectHits;
    profile.totalMisses += result.misses;
    profile.totalPlayTimeSeconds += Math.round(result.durationMs / 1000);

    if (result.score > profile.personalBestScore) {
      profile.personalBestScore = result.score;
    }
    if (result.maxChain > profile.bestChain) {
      profile.bestChain = result.maxChain;
    }

    if (result.mode === 'daily') {
      profile.lastDailyDateCompleted = result.dateIso.split('T')[0];
    }

    await this.saveProfile(profile);
    await this.updateMissionsFromRun(result);

    return { isNewBest, profile };
  },

  async getSettings(): Promise<AimRushSettings> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch (e) {
      // Return defaults
    }
    return DEFAULT_SETTINGS;
  },

  async saveSettings(settings: AimRushSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      // Ignore
    }
  },

  async getMissions(): Promise<AimRushMission[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.MISSIONS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // Return defaults
    }
    return DEFAULT_MISSIONS;
  },

  async saveMissions(missions: AimRushMission[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
    } catch (e) {
      // Ignore
    }
  },

  async updateMissionsFromRun(result: AimRushRunResult): Promise<void> {
    const missions = await this.getMissions();
    let changed = false;

    for (const m of missions) {
      if (m.completed) continue;

      if (m.id === 'm1') {
        m.current = Math.min(m.target, m.current + result.totalHits);
      } else if (m.id === 'm2') {
        m.current = Math.max(m.current, result.maxChain);
      } else if (m.id === 'm3') {
        m.current = Math.min(m.target, m.current + result.perfectHits);
      } else if (m.id === 'm4') {
        m.current = Math.max(m.current, result.score);
      }

      if (m.current >= m.target) {
        m.completed = true;
        changed = true;
      }
    }

    if (changed) {
      await this.saveMissions(missions);
    }
  },

  async claimMission(missionId: string): Promise<AimRushMission[]> {
    const missions = await this.getMissions();
    const updated = missions.map((m) =>
      m.id === missionId && m.completed ? { ...m, claimed: true } : m
    );
    await this.saveMissions(updated);
    return updated;
  },

  async resetAll(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
    await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
    await AsyncStorage.removeItem(STORAGE_KEYS.MISSIONS);
  },
};
