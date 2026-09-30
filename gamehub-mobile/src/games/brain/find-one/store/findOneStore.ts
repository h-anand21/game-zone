// ============================================================
// Find One — Zustand Store with Local Persistence & SQLite Sync
// ============================================================

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { getDatabase } from '@/storage/sqlite/database';
import { ScoreRepository } from '@/storage/sqlite/repositories/ScoreRepository';
import { UserRepository } from '@/storage/sqlite/repositories/UserRepository';
import type {
  CategoryType,
  FindOneScreen,
  PlayerProfile,
  PlayerStats,
  RoundData,
  GameSettings,
  GameHistoryRecord,
} from '../types';
import { generateRound, calculateAccuracy } from '../logic';

const STORAGE_KEY = '@find_one_state_v1';

export function formatGameDate(dateObj: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
}

export function calculateRank(bestScore: number): number {
  if (bestScore >= 45) return 1;
  if (bestScore >= 35) return 3;
  if (bestScore >= 25) return 7;
  if (bestScore >= 18) return 11;
  if (bestScore >= 12) return 14;
  if (bestScore >= 6) return 21;
  if (bestScore >= 1) return 28;
  return 35;
}

const INITIAL_PROFILE: PlayerProfile = {
  name: 'Champion',
  avatar: '🐼',
  coins: 350,
  rank: 28,
};

const INITIAL_STATS: PlayerStats = {
  bestScore: 0,
  bestTimeSeconds: 0,
  bestStreak: 0,
  totalGames: 0,
  totalCorrect: 0,
  totalWrong: 0,
  accuracy: 0,
};

const INITIAL_SETTINGS: GameSettings = {
  soundEffects: true,
  hapticFeedback: true,
};

// Safe Haptic feedback helper
const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
  if (Platform.OS === 'web') return;
  try {
    if (type === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else if (type === 'heavy') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    else if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {}
};

// Pure Web Audio tone synthesizer (zero external native dependencies)
const playTone = (freq: number, duration: number = 0.12) => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
};

interface FindOneStoreState {
  currentScreen: FindOneScreen;
  selectedCategory: CategoryType;
  score: number;
  timeLeft: number;
  maxTime: number;
  roundData: RoundData;
  currentStreak: number;
  correctCount: number;
  wrongCount: number;
  hintsLeft: number;
  hintHighlightIndex: number | null;
  isPaused: boolean;
  isNewBest: boolean;
  previousBest: number;
  stats: PlayerStats;
  profile: PlayerProfile;
  settings: GameSettings;
  history: GameHistoryRecord[];

  // Actions
  setScreen: (screen: FindOneScreen) => void;
  setCategory: (category: CategoryType) => void;
  startGame: () => void;
  tapTile: (tileIndex: number) => { isCorrect: boolean; isOdd: boolean };
  tickTimer: () => void;
  useHint: () => void;
  shuffleGrid: () => void;
  skipRound: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  exitHome: () => void;
  updateProfile: (name: string, avatar: string) => void;
  addCoins: (amount: number) => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  resetStats: () => void;
  loadPersistedData: () => Promise<void>;
  savePersistedData: () => Promise<void>;
}

export const useFindOneStore = create<FindOneStoreState>((set, get) => ({
  currentScreen: 'home',
  selectedCategory: 'animals',
  score: 0,
  timeLeft: 15,
  maxTime: 20,
  roundData: generateRound(0, 'animals'),
  currentStreak: 0,
  correctCount: 0,
  wrongCount: 0,
  hintsLeft: 3,
  hintHighlightIndex: null,
  isPaused: false,
  isNewBest: false,
  previousBest: 0,
  stats: INITIAL_STATS,
  profile: INITIAL_PROFILE,
  settings: INITIAL_SETTINGS,
  history: [],

  setScreen: (screen) => {
    triggerHaptic('light');
    playTone(440, 0.08);
    set({ currentScreen: screen });
  },

  setCategory: (category) => {
    triggerHaptic('light');
    playTone(520, 0.08);
    set({
      selectedCategory: category,
      roundData: generateRound(0, category),
    });
  },

  startGame: () => {
    triggerHaptic('medium');
    playTone(587.33, 0.15);
    const cat = get().selectedCategory;
    const initialRound = generateRound(0, cat);
    set({
      score: 0,
      timeLeft: 15,
      currentStreak: 0,
      correctCount: 0,
      wrongCount: 0,
      hintsLeft: 3,
      hintHighlightIndex: null,
      isPaused: false,
      isNewBest: false,
      previousBest: get().stats.bestScore,
      roundData: initialRound,
      currentScreen: 'gameplay',
    });
  },

  tapTile: (tileIndex) => {
    const { roundData, score, timeLeft, currentStreak, correctCount, wrongCount, selectedCategory } = get();
    const isOdd = roundData.tiles[tileIndex]?.isOdd;

    if (isOdd) {
      // ✅ Correct Tap!
      triggerHaptic('success');
      playTone(659.25, 0.16);

      const nextScore = score + 1;
      const nextStreak = currentStreak + 1;
      const nextCorrect = correctCount + 1;
      const bonusTime = Math.min(25, timeLeft + 2); // +2s bonus time!

      const nextRound = generateRound(nextScore, selectedCategory);

      set({
        score: nextScore,
        currentStreak: nextStreak,
        correctCount: nextCorrect,
        timeLeft: bonusTime,
        roundData: nextRound,
        hintHighlightIndex: null,
      });

      return { isCorrect: true, isOdd: true };
    } else {
      // ❌ Wrong Tap!
      triggerHaptic('error');
      playTone(293.66, 0.18);

      const nextWrong = wrongCount + 1;
      const penalizedTime = Math.max(0, timeLeft - 3); // -3s penalty!

      set({
        currentStreak: 0,
        wrongCount: nextWrong,
        timeLeft: penalizedTime,
      });

      // If penalty causes time to hit 0, end game
      if (penalizedTime <= 0) {
        get().tickTimer();
      }

      return { isCorrect: false, isOdd: false };
    }
  },

  tickTimer: () => {
    const { timeLeft, isPaused, score, stats, correctCount, wrongCount, currentStreak, selectedCategory } = get();
    if (isPaused) return;

    if (timeLeft <= 1) {
      // Time is up! Game Over or New Best
      triggerHaptic('heavy');
      playTone(220, 0.35);

      const isNewBestScore = score > stats.bestScore && score > 0;
      const newTotalGames = stats.totalGames + 1;
      const newTotalCorrect = stats.totalCorrect + correctCount;
      const newTotalWrong = stats.totalWrong + wrongCount;
      const overallAcc = calculateAccuracy(newTotalCorrect, newTotalWrong);
      const gameAcc = calculateAccuracy(correctCount, wrongCount);
      const newBestScore = Math.max(stats.bestScore, score);
      const newRank = calculateRank(newBestScore);

      const updatedStats: PlayerStats = {
        bestScore: newBestScore,
        bestTimeSeconds: Math.max(stats.bestTimeSeconds, Math.round(correctCount * 1.5)),
        bestStreak: Math.max(stats.bestStreak, currentStreak),
        totalGames: newTotalGames,
        totalCorrect: newTotalCorrect,
        totalWrong: newTotalWrong,
        accuracy: overallAcc,
      };

      // Create new match history record with real current timestamp and date!
      const now = new Date();
      const newHistoryItem: GameHistoryRecord = {
        id: `match_${Date.now()}`,
        score,
        accuracy: gameAcc,
        streak: currentStreak,
        durationSeconds: Math.max(3, correctCount * 2),
        date: now.toISOString(),
        formattedDate: formatGameDate(now),
        category: selectedCategory,
      };

      const newHistory = [newHistoryItem, ...get().history].slice(0, 30);
      const earnedCoins = (score * 2) + (isNewBestScore ? 25 : 5);
      const updatedProfile: PlayerProfile = {
        ...get().profile,
        coins: get().profile.coins + earnedCoins,
        rank: newRank,
      };

      set({
        timeLeft: 0,
        isNewBest: isNewBestScore,
        stats: updatedStats,
        profile: updatedProfile,
        history: newHistory,
        currentScreen: isNewBestScore ? 'new-best' : 'game-over',
      });

      get().savePersistedData();

      // Background SQLite sync with ScoreRepository
      (async () => {
        try {
          const db = await getDatabase();
          const scoreRepo = new ScoreRepository(db);
          await scoreRepo.insert({
            id: `fo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            eventId: `evt_${Date.now()}`,
            gameId: 'find-one',
            gameVersion: '1.0.0',
            scoreVersion: 'v1',
            score,
            duration: Math.max(3, correctCount * 2),
            metadata: {
              accuracy: gameAcc,
              streak: currentStreak,
              category: selectedCategory,
            },
          });
        } catch {}
      })();
    } else {
      set({ timeLeft: timeLeft - 1 });
    }
  },

  useHint: () => {
    const { hintsLeft, roundData } = get();
    if (hintsLeft <= 0) return;
    triggerHaptic('medium');
    playTone(783.99, 0.2);
    set({
      hintsLeft: hintsLeft - 1,
      hintHighlightIndex: roundData.oddIndex,
    });
  },

  shuffleGrid: () => {
    triggerHaptic('medium');
    playTone(523.25, 0.15);
    const { score, selectedCategory } = get();
    const newRound = generateRound(score, selectedCategory);
    set({ roundData: newRound, hintHighlightIndex: null });
  },

  skipRound: () => {
    triggerHaptic('medium');
    playTone(587.33, 0.15);
    const { score, selectedCategory } = get();
    const newRound = generateRound(score + 1, selectedCategory);
    set({
      score: score + 1,
      roundData: newRound,
      hintHighlightIndex: null,
    });
  },

  pauseGame: () => {
    triggerHaptic('light');
    set({ isPaused: true });
  },

  resumeGame: () => {
    triggerHaptic('light');
    set({ isPaused: false });
  },

  restartGame: () => {
    get().startGame();
  },

  exitHome: () => {
    triggerHaptic('light');
    set({ isPaused: false, currentScreen: 'home' });
  },

  updateProfile: (name: string, avatar: string) => {
    triggerHaptic('success');
    playTone(587.33, 0.1);
    const trimmed = name.trim();
    set((state) => ({
      profile: {
        ...state.profile,
        name: trimmed.length > 0 ? trimmed : state.profile.name,
        avatar: avatar || state.profile.avatar,
      },
    }));
    get().savePersistedData();

    // Async sync to SQLite UserRepository
    (async () => {
      try {
        const db = await getDatabase();
        const userRepo = new UserRepository(db);
        await userRepo.updateProfile({
          displayName: trimmed.length > 0 ? trimmed : undefined,
          avatarUrl: avatar,
        });
      } catch {}
    })();
  },

  addCoins: (amount: number) => {
    triggerHaptic('success');
    playTone(783.99, 0.18);
    set((state) => ({
      profile: {
        ...state.profile,
        coins: state.profile.coins + amount,
      },
    }));
    get().savePersistedData();
  },

  updateSettings: (newSettings) => {
    triggerHaptic('light');
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
    get().savePersistedData();
  },

  resetStats: () => {
    triggerHaptic('heavy');
    set({
      stats: INITIAL_STATS,
      history: [],
      profile: {
        ...get().profile,
        rank: 35,
      },
    });
    get().savePersistedData();
  },

  loadPersistedData: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.stats) set({ stats: parsed.stats });
        if (parsed.profile) set({ profile: parsed.profile });
        if (parsed.settings) set({ settings: parsed.settings });
        if (parsed.history && Array.isArray(parsed.history)) set({ history: parsed.history });
      }

      // Check SQLite for user profile and best score
      try {
        const db = await getDatabase();
        const userRepo = new UserRepository(db);
        const user = await userRepo.getUser();
        if (user && user.display_name) {
          set((state) => ({
            profile: {
              ...state.profile,
              name: user.display_name,
              avatar: user.avatar_url || state.profile.avatar,
            },
          }));
        }

        const scoreRepo = new ScoreRepository(db);
        const best = await scoreRepo.getBestScore('find-one');
        if (best > 0) {
          set((state) => ({
            stats: {
              ...state.stats,
              bestScore: Math.max(state.stats.bestScore, best),
            },
            profile: {
              ...state.profile,
              rank: calculateRank(Math.max(state.stats.bestScore, best)),
            },
          }));
        }
      } catch {}
    } catch {}
  },

  savePersistedData: async () => {
    try {
      const state = get();
      const payload = {
        stats: state.stats,
        profile: state.profile,
        settings: state.settings,
        history: state.history,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  },
}));
