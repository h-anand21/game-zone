// ============================================================
// PATH MIND — Global State Store (Zustand)
// Single Source of Truth for Navigation, Resources & Progress
// ============================================================

import { create } from 'zustand';
import { useProfileStore } from '@/store';

export type PathMindScreen =
  | 'splash'
  | 'home'
  | 'modes'
  | 'difficulty'
  | 'how_to_play'
  | 'world_map'
  | 'gameplay'
  | 'builder'
  | 'daily'
  | 'profile'
  | 'collection'
  | 'settings'
  | 'result';

export interface PathMindState {
  // Navigation
  currentScreen: PathMindScreen;
  previousScreen: PathMindScreen | null;
  setScreen: (screen: PathMindScreen) => void;
  goBack: () => void;

  // Overlays
  showExitModal: boolean;
  setShowExitModal: (show: boolean) => void;

  // Player Resources
  hearts: number;
  maxHearts: number;
  coins: number;
  stars: number;
  addCoins: (amount: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;

  // Game Progress
  currentLevel: number;
  score: number;
  combo: number;
  maxCombo: number;
  streak: number;
  selectedMode: string;
  selectedDifficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'CUSTOM';

  // Audio & Haptics
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleHaptics: () => void;

  // Profile / Username helper
  getUserName: () => string;
}

export const usePathMindStore = create<PathMindState>((set, get) => ({
  currentScreen: 'home',
  previousScreen: null,
  showExitModal: false,

  setScreen: (screen) => {
    set((state) => ({
      previousScreen: state.currentScreen,
      currentScreen: screen,
    }));
  },

  goBack: () => {
    const { previousScreen, currentScreen } = get();
    if (previousScreen && previousScreen !== currentScreen) {
      set({ currentScreen: previousScreen, previousScreen: 'home' });
    } else {
      set({ currentScreen: 'home' });
    }
  },

  setShowExitModal: (show) => set({ showExitModal: show }),

  hearts: 3,
  maxHearts: 3,
  coins: 850,
  stars: 42,

  addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),
  loseHeart: () => set((s) => ({ hearts: Math.max(0, s.hearts - 1) })),
  refillHearts: () => set((s) => ({ hearts: s.maxHearts })),

  currentLevel: 1,
  score: 0,
  combo: 0,
  maxCombo: 0,
  streak: 5,
  selectedMode: 'CLASSIC PATH',
  selectedDifficulty: 'EASY',

  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),
  toggleHaptics: () => set((s) => ({ hapticsEnabled: !s.hapticsEnabled })),

  getUserName: () => {
    try {
      const displayName = useProfileStore.getState().displayName;
      if (displayName && displayName.trim() !== '') {
        return displayName;
      }
    } catch {
      // fallback
    }
    return 'Alex Explorer';
  },
}));
