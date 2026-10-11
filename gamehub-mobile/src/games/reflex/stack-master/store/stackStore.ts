// ============================================================
// STACK MASTER — Global Zustand Store with AsyncStorage
// Key: @stack_master_save_v1
// ============================================================

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  StackGameState,
  RunRecord,
  UserSettings,
  GameMode,
} from '../types';
import { INITIAL_DAILY_MISSIONS, INITIAL_ACHIEVEMENTS } from '../data/missions';

const STORAGE_KEY = '@stack_master_save_v1';

interface StackStoreActions {
  loadState: () => Promise<void>;
  saveState: () => Promise<void>;

  recordRun: (run: Omit<RunRecord, 'id' | 'date' | 'isNewBest'>) => { isNewBest: boolean; run: RunRecord };
  claimMission: (missionId: string) => void;
  claimAchievement: (achievementId: string) => void;

  equipTheme: (themeId: string) => void;
  unlockTheme: (themeId: string) => void;

  equipCosmetic: (cosmeticId: string) => void;
  unlockCosmetic: (cosmeticId: string) => void;

  updateSettings: (partial: Partial<UserSettings>) => void;
  completeIntro: () => void;
  resetAllData: () => Promise<void>;
}

export type StackStore = StackGameState & StackStoreActions;

const DEFAULT_STATE: StackGameState = {
  coins: 250,
  crystals: 25,
  playerLevel: 1,
  playerXp: 0,
  playerTitle: 'Novice Stacker',

  bestScore: 0,
  bestHeight: 0,
  highestCombo: 0,
  totalRuns: 0,
  totalPlacements: 0,
  totalPerfects: 0,
  totalPlayTimeSeconds: 0,

  modeBest: {
    classic: { score: 0, height: 0 },
    zen: { score: 0, height: 0 },
    rush: { score: 0, height: 0 },
    precision: { score: 0, height: 0 },
    daily: { score: 0, height: 0 },
  },

  selectedThemeId: 'neon-city',
  selectedCosmeticId: 'cyber-prism',
  unlockedThemes: ['neon-city', 'nature-wood'],
  unlockedCosmetics: ['cyber-prism', 'solar-amber'],

  settings: {
    sound: true,
    music: true,
    haptics: true,
    assistMode: false,
    reducedMotion: false,
  },

  introCompleted: false,

  dailyStreak: 1,
  lastDailyDate: '',
  dailyChallengeCompleted: false,

  runHistory: [],
  missions: INITIAL_DAILY_MISSIONS,
  achievements: INITIAL_ACHIEVEMENTS,
};

function getPlayerTitle(level: number): string {
  if (level >= 25) return 'Celestial Sovereign';
  if (level >= 20) return 'Sky Legend';
  if (level >= 15) return 'Master Architect';
  if (level >= 10) return 'Cloud Piercer';
  if (level >= 5) return 'Rising Adept';
  return 'Novice Stacker';
}

export const useStackStore = create<StackStore>((set, get) => ({
  ...DEFAULT_STATE,

  loadState: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set((state) => ({
          ...state,
          ...parsed,
          // ensure missions and achievements have all properties
          missions: parsed.missions || INITIAL_DAILY_MISSIONS,
          achievements: parsed.achievements || INITIAL_ACHIEVEMENTS,
          modeBest: { ...DEFAULT_STATE.modeBest, ...(parsed.modeBest || {}) },
          settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
        }));
      }
    } catch (err) {
      console.warn('Failed to load Stack Master state:', err);
    }
  },

  saveState: async () => {
    try {
      const state = get();
      const persistable: StackGameState = {
        coins: state.coins,
        crystals: state.crystals,
        playerLevel: state.playerLevel,
        playerXp: state.playerXp,
        playerTitle: state.playerTitle,

        bestScore: state.bestScore,
        bestHeight: state.bestHeight,
        highestCombo: state.highestCombo,
        totalRuns: state.totalRuns,
        totalPlacements: state.totalPlacements,
        totalPerfects: state.totalPerfects,
        totalPlayTimeSeconds: state.totalPlayTimeSeconds,

        modeBest: state.modeBest,
        selectedThemeId: state.selectedThemeId,
        selectedCosmeticId: state.selectedCosmeticId,
        unlockedThemes: state.unlockedThemes,
        unlockedCosmetics: state.unlockedCosmetics,

        settings: state.settings,
        introCompleted: state.introCompleted,

        dailyStreak: state.dailyStreak,
        lastDailyDate: state.lastDailyDate,
        dailyChallengeCompleted: state.dailyChallengeCompleted,

        runHistory: state.runHistory,
        missions: state.missions,
        achievements: state.achievements,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch (err) {
      console.warn('Failed to save Stack Master state:', err);
    }
  },

  recordRun: (runData) => {
    const state = get();
    const mode = runData.mode as GameMode;
    const isNewBestScore = runData.score > (state.modeBest[mode]?.score ?? 0);
    const isNewBestHeight = runData.height > (state.modeBest[mode]?.height ?? 0);
    const isNewBest = isNewBestScore || isNewBestHeight;

    const fullRun: RunRecord = {
      ...runData,
      id: `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      isNewBest,
    };

    // XP & Level calculations (100 XP per level)
    const earnedXp = Math.max(Math.round(runData.score * 1.2), 10);
    const nextXp = state.playerXp + earnedXp;
    const newLevel = Math.floor(nextXp / 100) + 1;
    const earnedCoins = Math.round(runData.height * 2 + runData.perfectPlacements * 3);

    // Update missions
    const updatedMissions = state.missions.map((m) => {
      let nextProg = m.progress;
      if (m.id === 'm-play-3') nextProg += 1;
      if (m.id === 'm-height-20') nextProg = Math.max(nextProg, runData.height);
      if (m.id === 'm-perfect-5') nextProg = Math.max(nextProg, runData.perfectPlacements);
      if (m.id === 'm-combo-4') nextProg = Math.max(nextProg, runData.maxCombo);

      const completed = nextProg >= m.target;
      return {
        ...m,
        progress: nextProg,
        completed: m.completed || completed,
      };
    });

    // Update achievements
    const updatedAchievements = state.achievements.map((ach) => {
      let cur = ach.current;
      if (ach.id === 'ach-first-step') cur = 1;
      if (ach.id === 'ach-height-25') cur = Math.max(cur, runData.height);
      if (ach.id === 'ach-height-50') cur = Math.max(cur, runData.height);
      if (ach.id === 'ach-perfect-10') cur = Math.max(cur, runData.perfectPlacements);
      if (ach.id === 'ach-combo-7') cur = Math.max(cur, runData.maxCombo);
      if (ach.id === 'ach-runs-20') cur = state.totalRuns + 1;
      if (ach.id === 'ach-score-500') cur = Math.max(cur, runData.score);
      if (ach.id === 'ach-accuracy-90' && runData.height >= 20 && runData.accuracy >= 90) cur = 1;

      return {
        ...ach,
        current: cur,
        completed: ach.completed || cur >= ach.target,
      };
    });

    // Update mode best
    const updatedModeBest = {
      ...state.modeBest,
      [mode]: {
        score: Math.max(state.modeBest[mode]?.score ?? 0, runData.score),
        height: Math.max(state.modeBest[mode]?.height ?? 0, runData.height),
      },
    };

    set({
      coins: state.coins + earnedCoins,
      playerXp: nextXp,
      playerLevel: newLevel,
      playerTitle: getPlayerTitle(newLevel),
      bestScore: Math.max(state.bestScore, runData.score),
      bestHeight: Math.max(state.bestHeight, runData.height),
      highestCombo: Math.max(state.highestCombo, runData.maxCombo),
      totalRuns: state.totalRuns + 1,
      totalPlacements: state.totalPlacements + runData.totalPlacements,
      totalPerfects: state.totalPerfects + runData.perfectPlacements,
      totalPlayTimeSeconds: state.totalPlayTimeSeconds + runData.durationSeconds,
      modeBest: updatedModeBest,
      runHistory: [fullRun, ...state.runHistory].slice(0, 20),
      missions: updatedMissions,
      achievements: updatedAchievements,
    });

    get().saveState();
    return { isNewBest, run: fullRun };
  },

  claimMission: (missionId) => {
    const state = get();
    const target = state.missions.find((m) => m.id === missionId);
    if (!target || !target.completed || target.claimed) return;

    set({
      coins: state.coins + target.rewardCoins,
      missions: state.missions.map((m) =>
        m.id === missionId ? { ...m, claimed: true } : m
      ),
    });
    get().saveState();
  },

  claimAchievement: (achievementId) => {
    const state = get();
    const target = state.achievements.find((a) => a.id === achievementId);
    if (!target || !target.completed || target.claimed) return;

    set({
      crystals: state.crystals + 15,
      coins: state.coins + 100,
      achievements: state.achievements.map((a) =>
        a.id === achievementId ? { ...a, claimed: true } : a
      ),
    });
    get().saveState();
  },

  equipTheme: (themeId) => {
    set({ selectedThemeId: themeId });
    get().saveState();
  },

  unlockTheme: (themeId) => {
    const state = get();
    if (!state.unlockedThemes.includes(themeId)) {
      set({ unlockedThemes: [...state.unlockedThemes, themeId] });
      get().saveState();
    }
  },

  equipCosmetic: (cosmeticId) => {
    set({ selectedCosmeticId: cosmeticId });
    get().saveState();
  },

  unlockCosmetic: (cosmeticId) => {
    const state = get();
    if (!state.unlockedCosmetics.includes(cosmeticId)) {
      set({ unlockedCosmetics: [...state.unlockedCosmetics, cosmeticId] });
      get().saveState();
    }
  },

  updateSettings: (partial) => {
    const state = get();
    set({ settings: { ...state.settings, ...partial } });
    get().saveState();
  },

  completeIntro: () => {
    set({ introCompleted: true });
    get().saveState();
  },

  resetAllData: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ ...DEFAULT_STATE, introCompleted: true });
  },
}));
