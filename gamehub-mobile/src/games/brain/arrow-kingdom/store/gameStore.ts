// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Global Zustand Game Store
// Tracks currencies, progression, stars, themes & persistence
// ============================================================

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeId } from '../game/types';
import { ArrowHaptics } from '../utils/haptics';
import { ArrowAudio } from '../utils/sound';

const STORAGE_KEY = '@arrow_kingdom_game_state_v1';

export interface LevelRecord {
  stars: number;
  bestMoves: number;
}

interface GameStoreState {
  // Currencies & Lives
  coins: number;
  gems: number;
  hearts: number;
  hintsRemaining: number;

  // Level Progression
  currentLevel: number;
  unlockedLevels: number;
  completedLevels: Record<number, LevelRecord>;

  // Themes
  selectedTheme: ThemeId;
  unlockedThemes: ThemeId[];

  // Daily Challenge
  dailyCompletedDate: string | null;
  dailyStreak: number;

  // Achievements
  claimedAchievements: string[];

  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;

  // Actions
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  addHints: (amount: number) => void;
  useHint: () => boolean;
  completeLevel: (levelId: number, stars: number, moves: number, rewardCoins: number, rewardGems?: number) => void;
  setCurrentLevel: (levelId: number) => void;
  unlockTheme: (themeId: ThemeId, cost: number) => boolean;
  selectTheme: (themeId: ThemeId) => void;
  claimDailyReward: (rewardCoins: number, rewardGems: number) => void;
  claimAchievement: (achievementId: string, rewardCoins: number, rewardGems: number) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleHaptics: () => void;
  resetAllData: () => void;
  loadState: () => Promise<void>;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  coins: 1250,
  gems: 25,
  hearts: 3,
  hintsRemaining: 3,

  currentLevel: 1,
  unlockedLevels: 1,
  completedLevels: {},

  selectedTheme: 'neon',
  unlockedThemes: ['neon'],

  dailyCompletedDate: null,
  dailyStreak: 0,

  claimedAchievements: [],

  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,

  addCoins: (amount: number) => {
    set((state) => {
      const next = { ...state, coins: state.coins + amount };
      persistState(next);
      return next;
    });
  },

  spendCoins: (amount: number) => {
    const { coins } = get();
    if (coins < amount) return false;
    set((state) => {
      const next = { ...state, coins: state.coins - amount };
      persistState(next);
      return next;
    });
    return true;
  },

  addGems: (amount: number) => {
    set((state) => {
      const next = { ...state, gems: state.gems + amount };
      persistState(next);
      return next;
    });
  },

  spendGems: (amount: number) => {
    const { gems } = get();
    if (gems < amount) return false;
    set((state) => {
      const next = { ...state, gems: state.gems - amount };
      persistState(next);
      return next;
    });
    return true;
  },

  addHints: (amount: number) => {
    set((state) => {
      const next = { ...state, hintsRemaining: state.hintsRemaining + amount };
      persistState(next);
      return next;
    });
  },

  useHint: () => {
    const { hintsRemaining } = get();
    if (hintsRemaining <= 0) return false;
    set((state) => {
      const next = { ...state, hintsRemaining: state.hintsRemaining - 1 };
      persistState(next);
      return next;
    });
    return true;
  },

  completeLevel: (levelId: number, stars: number, moves: number, rewardCoins: number, rewardGems = 0) => {
    set((state) => {
      const existing = state.completedLevels[levelId];
      const bestStars = existing ? Math.max(existing.stars, stars) : stars;
      const bestMoves = existing ? Math.min(existing.bestMoves, moves) : moves;

      const nextCompleted = {
        ...state.completedLevels,
        [levelId]: { stars: bestStars, bestMoves },
      };

      const nextUnlocked = Math.max(state.unlockedLevels, levelId + 1);

      const next = {
        ...state,
        completedLevels: nextCompleted,
        unlockedLevels: nextUnlocked,
        coins: state.coins + rewardCoins,
        gems: state.gems + rewardGems,
      };

      persistState(next);
      return next;
    });
  },

  setCurrentLevel: (levelId: number) => {
    set({ currentLevel: levelId });
  },

  unlockTheme: (themeId: ThemeId, cost: number) => {
    const { coins, unlockedThemes } = get();
    if (unlockedThemes.includes(themeId)) return true;
    if (coins < cost) return false;

    set((state) => {
      const next = {
        ...state,
        coins: state.coins - cost,
        unlockedThemes: [...state.unlockedThemes, themeId],
        selectedTheme: themeId,
      };
      persistState(next);
      return next;
    });
    return true;
  },

  selectTheme: (themeId: ThemeId) => {
    const { unlockedThemes } = get();
    if (!unlockedThemes.includes(themeId)) return;
    set((state) => {
      const next = { ...state, selectedTheme: themeId };
      persistState(next);
      return next;
    });
  },

  claimDailyReward: (rewardCoins: number, rewardGems: number) => {
    const today = new Date().toISOString().slice(0, 10);
    set((state) => {
      const next = {
        ...state,
        dailyCompletedDate: today,
        dailyStreak: state.dailyStreak + 1,
        coins: state.coins + rewardCoins,
        gems: state.gems + rewardGems,
      };
      persistState(next);
      return next;
    });
  },

  claimAchievement: (achievementId: string, rewardCoins: number, rewardGems: number) => {
    set((state) => {
      if (state.claimedAchievements.includes(achievementId)) return state;
      const next = {
        ...state,
        claimedAchievements: [...state.claimedAchievements, achievementId],
        coins: state.coins + rewardCoins,
        gems: state.gems + rewardGems,
      };
      persistState(next);
      return next;
    });
  },

  toggleSound: () => {
    set((state) => {
      const nextVal = !state.soundEnabled;
      ArrowAudio.setEnabled(nextVal);
      const next = { ...state, soundEnabled: nextVal };
      persistState(next);
      return next;
    });
  },

  toggleMusic: () => {
    set((state) => {
      const next = { ...state, musicEnabled: !state.musicEnabled };
      persistState(next);
      return next;
    });
  },

  toggleHaptics: () => {
    set((state) => {
      const next = { ...state, hapticsEnabled: !state.hapticsEnabled };
      persistState(next);
      return next;
    });
  },

  resetAllData: () => {
    const resetState = {
      coins: 1250,
      gems: 25,
      hearts: 3,
      hintsRemaining: 3,
      currentLevel: 1,
      unlockedLevels: 1,
      completedLevels: {},
      selectedTheme: 'neon' as ThemeId,
      unlockedThemes: ['neon' as ThemeId],
      dailyCompletedDate: null,
      dailyStreak: 0,
      claimedAchievements: [],
      soundEnabled: true,
      musicEnabled: true,
      hapticsEnabled: true,
    };
    set(resetState);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  },

  loadState: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set((state) => ({ ...state, ...parsed }));
        if (parsed.soundEnabled !== undefined) {
          ArrowAudio.setEnabled(parsed.soundEnabled);
        }
      }
    } catch {}
  },
}));

function persistState(state: Partial<GameStoreState>) {
  try {
    const payload = {
      coins: state.coins,
      gems: state.gems,
      hearts: state.hearts,
      hintsRemaining: state.hintsRemaining,
      currentLevel: state.currentLevel,
      unlockedLevels: state.unlockedLevels,
      completedLevels: state.completedLevels,
      selectedTheme: state.selectedTheme,
      unlockedThemes: state.unlockedThemes,
      dailyCompletedDate: state.dailyCompletedDate,
      dailyStreak: state.dailyStreak,
      claimedAchievements: state.claimedAchievements,
      soundEnabled: state.soundEnabled,
      musicEnabled: state.musicEnabled,
      hapticsEnabled: state.hapticsEnabled,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => {});
  } catch {}
}
