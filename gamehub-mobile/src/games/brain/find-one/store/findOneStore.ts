// ============================================================
// Find One — Zustand Store with Local Persistence
// ============================================================

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import type {
  CategoryType,
  FindOneScreen,
  PlayerProfile,
  PlayerStats,
  RoundData,
  GameSettings,
} from '../types';
import { generateRound, calculateAccuracy } from '../logic';

const STORAGE_KEY = '@find_one_state_v1';

const INITIAL_PROFILE: PlayerProfile = {
  name: 'Player',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  coins: 320,
  rank: 24,
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
    const { roundData, score, timeLeft, currentStreak, correctCount, wrongCount, stats, selectedCategory } = get();
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
        timeLeft: bonusTime,
        currentStreak: nextStreak,
        correctCount: nextCorrect,
        hintHighlightIndex: null,
        roundData: nextRound,
      });

      return { isCorrect: true, isOdd: true };
    } else {
      // ❌ Wrong Tap!
      triggerHaptic('error');
      playTone(180, 0.25);

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
    const { timeLeft, isPaused, score, stats, correctCount, wrongCount, currentStreak } = get();
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

      const updatedStats: PlayerStats = {
        bestScore: Math.max(stats.bestScore, score),
        bestTimeSeconds: Math.max(stats.bestTimeSeconds, Math.round(correctCount * 1.5)),
        bestStreak: Math.max(stats.bestStreak, currentStreak),
        totalGames: newTotalGames,
        totalCorrect: newTotalCorrect,
        totalWrong: newTotalWrong,
        accuracy: overallAcc,
      };

      set({
        timeLeft: 0,
        isNewBest: isNewBestScore,
        stats: updatedStats,
        currentScreen: isNewBestScore ? 'new-best' : 'game-over',
      });

      get().savePersistedData();
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

  loadPersistedData: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.stats) set({ stats: parsed.stats });
        if (parsed.profile) set({ profile: parsed.profile });
        if (parsed.settings) set({ settings: parsed.settings });
      }
    } catch {}
  },

  savePersistedData: async () => {
    try {
      const state = get();
      const payload = {
        stats: state.stats,
        profile: state.profile,
        settings: state.settings,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  },
}));
