// ============================================================
// GameHub — Profile Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { getDatabase } from '@/storage/sqlite/database';
import { UserRepository } from '@/storage/sqlite/repositories/UserRepository';
import { StatsRepository } from '@/storage/sqlite/repositories/StatsRepository';
import { AchievementRepository } from '@/storage/sqlite/repositories/AchievementRepository';

interface ProfileState {
  // State
  displayName: string;
  username: string;
  avatarUrl: string | null;
  xp: number;
  level: number;
  coins: number;
  totalGamesPlayed: number;
  totalWins: number;
  achievementCount: number;
  isLoaded: boolean;

  // Actions
  loadProfile: () => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  displayName: 'Guest Player',
  username: '@guest',
  avatarUrl: null,
  xp: 0,
  level: 1,
  coins: 0,
  totalGamesPlayed: 0,
  totalWins: 0,
  achievementCount: 0,
  isLoaded: false,

  loadProfile: async () => {
    try {
      const db = await getDatabase();
      const userRepo = new UserRepository(db);
      const statsRepo = new StatsRepository(db);
      const achieveRepo = new AchievementRepository(db);

      const user = await userRepo.getUser();
      if (!user) return;

      const totals = await statsRepo.getTotals();
      const achieveCount = await achieveRepo.getUnlockedCount(user.id);

      set({
        displayName: user.display_name,
        username: user.username,
        avatarUrl: user.avatar_url,
        xp: user.xp,
        level: user.level,
        coins: user.coins,
        totalGamesPlayed: totals.totalGamesPlayed,
        totalWins: totals.totalWins,
        achievementCount: achieveCount,
        isLoaded: true,
      });
    } catch (error) {
      console.error('[Profile] Load failed:', error);
    }
  },

  addXp: async (amount: number) => {
    try {
      const db = await getDatabase();
      const userRepo = new UserRepository(db);
      const { newXp, newLevel } = await userRepo.addXp(amount);
      set({ xp: newXp, level: newLevel });
    } catch (error) {
      console.error('[Profile] Add XP failed:', error);
    }
  },

  addCoins: async (amount: number) => {
    try {
      const db = await getDatabase();
      const userRepo = new UserRepository(db);
      const newCoins = await userRepo.addCoins(amount);
      set({ coins: newCoins });
    } catch (error) {
      console.error('[Profile] Add coins failed:', error);
    }
  },

  updateDisplayName: async (name: string) => {
    try {
      const db = await getDatabase();
      const userRepo = new UserRepository(db);
      await userRepo.updateProfile({ displayName: name });
      set({ displayName: name });
    } catch (error) {
      console.error('[Profile] Update name failed:', error);
    }
  },

  refresh: async () => {
    await get().loadProfile();
  },
}));
