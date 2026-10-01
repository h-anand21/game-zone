// ============================================================
// MEMORY RUSH — Central State Management (Zustand)
// ============================================================

import { create } from 'zustand';
import type {
  GameMode,
  GameDifficulty,
  InGamePhase,
  AppNavScreen,
  NumberTileData,
  RoundConfig,
  PlayerStats,
  GameSettings,
  DailyChallengeState,
  PowerUpInventory,
  PowerUpType,
} from '../types';
import {
  generateRoundConfig,
  getGridDimensions,
} from '../logic/gameEngine';
import { calculateScore, calculateAccuracy, getPerformanceTitle } from '../logic/scoring';

interface MemoryRushState {
  currentScreen: AppNavScreen;
  mode: GameMode;
  difficulty: GameDifficulty;
  phase: InGamePhase;
  isPaused: boolean;
  showExitModal: boolean;
  hasCompletedTutorial: boolean;

  round: number;
  totalRounds: number;
  score: number;
  combo: number;
  maxCombo: number;
  correctAnswers: number;
  totalAttempts: number;
  startTimeMs: number;
  reactionTimeMs: number;

  tiles: NumberTileData[];
  roundConfig: RoundConfig | null;
  playerInputSequence: number[];
  selectedTileIds: string[];

  lastFeedback: {
    type: 'perfect' | 'miss' | null;
    message: string;
    points?: number;
  };

  playerStats: PlayerStats;
  settings: GameSettings;
  dailyChallenge: DailyChallengeState;
  powerUps: PowerUpInventory;

  // Convenience aliases for screens
  selectedMode: GameMode;
  selectedDifficulty: GameDifficulty;
  currentRound: number;
  stats: PlayerStats;
  recentRuns: PlayerStats['recentRuns'];
  lastRoundResult: {
    points: number;
    accuracy: number;
    reactionTime: number;
    combo: number;
    timeBonus: number;
    isPerfect: boolean;
  };
  finalRunResult: {
    totalScore: number;
    accuracy: number;
    bestCombo: number;
    avgReactionTime: number;
    memoryLevel: number;
    performanceTitle: string;
    roundScores: number[];
  };

  setScreen: (screen: AppNavScreen) => void;
  setMode: (mode: GameMode) => void;
  setSelectedMode: (mode: GameMode) => void;
  setDifficulty: (diff: GameDifficulty) => void;
  setSelectedDifficulty: (diff: GameDifficulty) => void;
  setPaused: (paused: boolean) => void;
  setShowExitModal: (show: boolean) => void;
  toggleSetting: (key: keyof GameSettings) => void;
  updateSettings: (partial: Partial<GameSettings>) => void;
  resetProgress: () => void;
  completeTutorial: () => void;

  startNewGame: (overrideMode?: GameMode, overrideDiff?: GameDifficulty) => void;
  startRound: () => void;
  advanceToHide: () => void;
  advanceToQuestion: () => void;
  handleTileSelect: (tile: NumberTileData) => { isCorrect: boolean; isComplete: boolean };
  handleAnswerChoice: (value: number) => { isCorrect: boolean };
  usePowerUp: (type: PowerUpType) => boolean;
}

const INITIAL_STATS: PlayerStats = {
  bestScore: 2840,
  bestStreak: 14,
  accuracy: 91,
  gamesPlayed: 46,
  avgReactionTimeMs: 820,
  modeAccuracy: {
    memoryGrid: 92,
    sequenceRush: 86,
    numberShift: 78,
    missingNumber: 95,
    fusionRush: 89,
  },
  recentRuns: [
    { id: '1', date: 'TODAY', score: 2840, accuracy: 94, mode: 'memoryGrid', difficulty: 'medium' },
    { id: '2', date: 'TODAY', score: 2510, accuracy: 89, mode: 'sequenceRush', difficulty: 'medium' },
    { id: '3', date: 'TODAY', score: 1920, accuracy: 83, mode: 'numberShift', difficulty: 'easy' },
  ],
};

const INITIAL_SETTINGS: GameSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  animationsEnabled: true,
  smartDifficulty: true,
  highContrast: false,
  largeNumbers: false,
  reducedMotion: false,
};

const INITIAL_DAILY: DailyChallengeState = {
  completed: false,
  roundsCleared: 7,
  totalRounds: 10,
  rewardXp: 500,
  score: 1850,
  accuracy: 90,
};

const INITIAL_POWER_UPS: PowerUpInventory = {
  freeze: 2,
  reveal: 3,
  secondChance: 1,
};

export const useMemoryRushStore = create<MemoryRushState>((set, get) => ({
  currentScreen: 'splash',
  mode: 'memoryGrid',
  difficulty: 'easy',
  phase: 'idle',
  isPaused: false,
  showExitModal: false,
  hasCompletedTutorial: false,

  round: 1,
  totalRounds: 10,
  score: 0,
  combo: 0,
  maxCombo: 0,
  correctAnswers: 0,
  totalAttempts: 0,
  startTimeMs: 0,
  reactionTimeMs: 0,

  tiles: [],
  roundConfig: null,
  playerInputSequence: [],
  selectedTileIds: [],

  lastFeedback: { type: null, message: '' },

  playerStats: INITIAL_STATS,
  settings: INITIAL_SETTINGS,
  dailyChallenge: INITIAL_DAILY,
  powerUps: INITIAL_POWER_UPS,

  // Alias getters
  get selectedMode() { return get().mode; },
  get selectedDifficulty() { return get().difficulty; },
  get currentRound() { return get().round; },
  get stats() { return get().playerStats; },
  get recentRuns() { return get().playerStats.recentRuns; },
  get lastRoundResult() {
    const s = get();
    return {
      points: s.lastFeedback.points || 240,
      accuracy: calculateAccuracy(s.correctAnswers, s.totalAttempts || 1),
      reactionTime: Number((s.reactionTimeMs / 1000).toFixed(2)) || 0.81,
      combo: s.combo || 5,
      timeBonus: 4,
      isPerfect: s.lastFeedback.type === 'perfect',
    };
  },
  get finalRunResult() {
    const s = get();
    const acc = calculateAccuracy(s.correctAnswers, s.totalAttempts || 1);
    return {
      totalScore: s.score || 3840,
      accuracy: acc || 94,
      bestCombo: s.maxCombo || 8,
      avgReactionTime: 0.76,
      memoryLevel: Math.max(1, Math.floor((s.score || 3840) / 300)),
      performanceTitle: getPerformanceTitle(acc, s.maxCombo, s.score || 3840),
      roundScores: [400, 600, 350, 800, 500],
    };
  },

  setScreen: (screen) => set({ currentScreen: screen }),
  setMode: (mode) => set({ mode }),
  setSelectedMode: (mode) => set({ mode }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setSelectedDifficulty: (difficulty) => set({ difficulty }),
  setPaused: (isPaused) => set({ isPaused }),
  setShowExitModal: (showExitModal) => set({ showExitModal }),
  completeTutorial: () => set({ hasCompletedTutorial: true }),

  toggleSetting: (key) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: !state.settings[key],
      },
    })),

  updateSettings: (partial) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...partial,
      },
    })),

  resetProgress: () =>
    set({
      playerStats: INITIAL_STATS,
      dailyChallenge: INITIAL_DAILY,
    }),

  startNewGame: (overrideMode, overrideDiff) => {
    const activeMode = overrideMode || get().mode;
    const activeDiff = overrideDiff || get().difficulty;

    set({
      mode: activeMode,
      difficulty: activeDiff,
      round: 1,
      totalRounds: activeDiff === 'hard' ? 10 : activeDiff === 'medium' ? 8 : 6,
      score: 0,
      combo: 0,
      maxCombo: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      currentScreen: 'gameplay',
      phase: 'countdown',
      lastFeedback: { type: null, message: '' },
    });
  },

  startRound: () => {
    const { mode, difficulty, round, settings } = get();
    const { config, initialTiles } = generateRoundConfig(mode, difficulty, round, settings.smartDifficulty);

    set({
      roundConfig: config,
      tiles: initialTiles,
      playerInputSequence: [],
      selectedTileIds: [],
      phase: 'preview',
      startTimeMs: Date.now(),
      lastFeedback: { type: null, message: '' },
    });
  },

  advanceToHide: () => {
    const hiddenTiles = get().tiles.map((t) => ({ ...t, state: 'hidden' as const }));
    set({ tiles: hiddenTiles, phase: 'hide' });
  },

  advanceToQuestion: () => {
    set({ phase: 'question', startTimeMs: Date.now() });
  },

  handleTileSelect: (tile) => {
    const { roundConfig, combo, maxCombo, score, difficulty, startTimeMs, correctAnswers, totalAttempts, playerStats } = get();
    if (!roundConfig) return { isCorrect: false, isComplete: false };

    const reaction = Date.now() - startTimeMs;
    let isCorrect = false;

    if (roundConfig.actualType === 'memoryGrid') {
      isCorrect = tile.row === roundConfig.targetPos?.row && tile.col === roundConfig.targetPos?.col;
    }

    const newTotal = totalAttempts + 1;
    const newCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;

    if (isCorrect) {
      const newCombo = combo + 1;
      const pts = calculateScore(true, newCombo, reaction, 10000, difficulty);
      const newScore = score + pts;

      const updatedTiles = get().tiles.map((t) =>
        t.id === tile.id ? { ...t, state: 'correct' as const } : t
      );

      set({
        tiles: updatedTiles,
        combo: newCombo,
        maxCombo: Math.max(maxCombo, newCombo),
        score: newScore,
        correctAnswers: newCorrect,
        totalAttempts: newTotal,
        lastFeedback: { type: 'perfect', message: 'PERFECT!', points: pts },
      });

      return { isCorrect: true, isComplete: true };
    } else {
      const updatedTiles = get().tiles.map((t) =>
        t.id === tile.id ? { ...t, state: 'wrong' as const } : t
      );

      set({
        tiles: updatedTiles,
        combo: 0,
        totalAttempts: newTotal,
        lastFeedback: { type: 'miss', message: 'MISS' },
      });

      return { isCorrect: false, isComplete: false };
    }
  },

  handleAnswerChoice: (value) => {
    const { roundConfig, combo, maxCombo, score, difficulty, startTimeMs, correctAnswers, totalAttempts } = get();
    if (!roundConfig) return { isCorrect: false };

    const reaction = Date.now() - startTimeMs;
    let isCorrect = false;

    if (roundConfig.actualType === 'missingNumber') {
      isCorrect = roundConfig.missingNumbers?.includes(value) ?? false;
    } else if (roundConfig.actualType === 'sequenceRush') {
      // Input sequence check
      const currentSeq = [...get().playerInputSequence, value];
      set({ playerInputSequence: currentSeq });

      const expected = roundConfig.sequenceOrder || [];
      const isPartiallyCorrect = currentSeq.every((v, i) => v === expected[i]);
      if (isPartiallyCorrect && currentSeq.length === expected.length) {
        isCorrect = true;
      } else if (!isPartiallyCorrect) {
        isCorrect = false;
      } else {
        return { isCorrect: true };
      }
    }

    const newTotal = totalAttempts + 1;
    const newCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;

    if (isCorrect) {
      const newCombo = combo + 1;
      const pts = calculateScore(true, newCombo, reaction, 10000, difficulty);
      const newScore = score + pts;

      set({
        combo: newCombo,
        maxCombo: Math.max(maxCombo, newCombo),
        score: newScore,
        correctAnswers: newCorrect,
        totalAttempts: newTotal,
        lastFeedback: { type: 'perfect', message: 'PERFECT!', points: pts },
      });

      return { isCorrect: true };
    } else {
      set({
        combo: 0,
        totalAttempts: newTotal,
        lastFeedback: { type: 'miss', message: 'MISS' },
      });

      return { isCorrect: false };
    }
  },

  usePowerUp: (type) => {
    const count = get().powerUps[type];
    if (count <= 0) return false;

    set((state) => ({
      powerUps: {
        ...state.powerUps,
        [type]: state.powerUps[type] - 1,
      },
    }));

    if (type === 'reveal' && get().phase === 'question') {
      const revealedTiles = get().tiles.map((t) => ({ ...t, state: 'preview' as const }));
      set({ tiles: revealedTiles });
      setTimeout(() => {
        get().advanceToHide();
      }, 1200);
    }

    return true;
  },
}));
