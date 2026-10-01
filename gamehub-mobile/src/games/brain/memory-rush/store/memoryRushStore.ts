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
  playerInputSequence: (number | string)[];
  selectedTileIds: string[];

  lastFeedback: {
    type: 'perfect' | 'miss' | 'streak' | null;
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
  advanceToNextRound: () => boolean;
  handleTileSelect: (tile: NumberTileData) => { isCorrect: boolean; isComplete: boolean };
  handleAnswerChoice: (value: number) => { isCorrect: boolean; isComplete: boolean };
  handleTimeoutMiss: () => void;
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
    const { roundConfig, tiles } = get();
    if (!roundConfig) return;

    if (roundConfig.actualType === 'memoryGrid' || roundConfig.actualType === 'sequenceRush') {
      const hiddenTiles = tiles.map((t) => ({ ...t, state: 'hidden' as const }));
      set({ tiles: hiddenTiles, phase: 'hide' });
    } else {
      set({ phase: 'hide' });
    }
  },

  advanceToQuestion: () => {
    const { roundConfig, tiles } = get();
    if (!roundConfig) return;

    if (roundConfig.actualType === 'memoryGrid') {
      const hiddenTiles = tiles.map((t) => ({ ...t, state: 'hidden' as const }));
      set({ tiles: hiddenTiles, phase: 'question', startTimeMs: Date.now() });
    } else if (roundConfig.actualType === 'sequenceRush') {
      const hiddenTiles = tiles.map((t) => ({ ...t, state: 'hidden' as const, sequenceStep: undefined }));
      set({
        tiles: hiddenTiles,
        phase: 'question',
        startTimeMs: Date.now(),
        playerInputSequence: [],
      });
    } else if (roundConfig.actualType === 'numberShift') {
      const mutatedTiles = tiles.map((t) => {
        if (t.id === roundConfig.changedTileId) {
          return {
            ...t,
            value: roundConfig.changedNewValue!,
            originalValue: roundConfig.changedOriginalValue,
            state: 'default' as const,
            isChanged: true,
          };
        }
        return { ...t, state: 'default' as const };
      });
      set({ tiles: mutatedTiles, phase: 'question', startTimeMs: Date.now() });
    } else if (roundConfig.actualType === 'missingNumber') {
      const questionTiles = tiles.map((t) => {
        if (t.value === roundConfig.vanishedValue) {
          return {
            ...t,
            state: 'hidden' as const,
            isMissing: true,
          };
        }
        return { ...t, state: 'default' as const };
      });
      set({ tiles: questionTiles, phase: 'question', startTimeMs: Date.now() });
    }
  },

  advanceToNextRound: () => {
    const { round, totalRounds, mode, difficulty, settings } = get();
    if (round >= totalRounds) {
      return false;
    }
    const nextRound = round + 1;
    const { config, initialTiles } = generateRoundConfig(mode, difficulty, nextRound, settings.smartDifficulty);

    set({
      round: nextRound,
      roundConfig: config,
      tiles: initialTiles,
      playerInputSequence: [],
      selectedTileIds: [],
      phase: 'preview',
      startTimeMs: Date.now(),
      lastFeedback: { type: null, message: '' },
    });
    return true;
  },

  handleTimeoutMiss: () => {
    const { roundConfig, tiles, totalAttempts } = get();
    if (!roundConfig) return;

    const newTotal = totalAttempts + 1;

    let updatedTiles = [...tiles];
    if (roundConfig.actualType === 'memoryGrid') {
      updatedTiles = tiles.map((t) =>
        t.row === roundConfig.targetPos?.row && t.col === roundConfig.targetPos?.col
          ? { ...t, state: 'correct' as const, value: roundConfig.targetValue || t.value }
          : t
      );
    } else if (roundConfig.actualType === 'sequenceRush') {
      const expectedTileIds = roundConfig.sequenceTileIds || [];
      updatedTiles = tiles.map((t) => {
        const stepIdx = expectedTileIds.indexOf(t.id);
        if (stepIdx !== -1) {
          return { ...t, state: 'correct' as const, sequenceStep: stepIdx + 1 };
        }
        return t;
      });
    } else if (roundConfig.actualType === 'numberShift') {
      updatedTiles = tiles.map((t) =>
        t.id === roundConfig.changedTileId
          ? { ...t, state: 'correct' as const, isChanged: true }
          : t
      );
    } else if (roundConfig.actualType === 'missingNumber') {
      updatedTiles = tiles.map((t) =>
        t.isMissing
          ? { ...t, state: 'correct' as const, value: roundConfig.vanishedValue! }
          : t
      );
    }

    set({
      tiles: updatedTiles,
      combo: 0,
      totalAttempts: newTotal,
      lastFeedback: { type: 'miss', message: 'TIME UP! CORRECT ANSWER REVEALED' },
    });
  },

  handleTileSelect: (tile) => {
    const { roundConfig, combo, maxCombo, score, difficulty, startTimeMs, correctAnswers, totalAttempts, playerInputSequence, tiles } = get();
    if (!roundConfig) return { isCorrect: false, isComplete: false };

    const reaction = Date.now() - startTimeMs;

    // 1. MEMORY GRID
    if (roundConfig.actualType === 'memoryGrid') {
      const isCorrect = tile.row === roundConfig.targetPos?.row && tile.col === roundConfig.targetPos?.col;
      const newTotal = totalAttempts + 1;
      const newCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;

      if (isCorrect) {
        const newCombo = combo + 1;
        const pts = calculateScore(true, newCombo, reaction, 10000, difficulty);
        const newScore = score + pts;

        const updatedTiles = tiles.map((t) =>
          t.id === tile.id ? { ...t, state: 'correct' as const, value: roundConfig.targetValue || t.value } : t
        );

        set({
          tiles: updatedTiles,
          combo: newCombo,
          maxCombo: Math.max(maxCombo, newCombo),
          score: newScore,
          correctAnswers: newCorrect,
          totalAttempts: newTotal,
          lastFeedback: { type: 'perfect', message: 'PERFECT LOCATION!', points: pts },
        });

        return { isCorrect: true, isComplete: true };
      } else {
        const updatedTiles = tiles.map((t) => {
          if (t.id === tile.id) return { ...t, state: 'wrong' as const };
          if (t.row === roundConfig.targetPos?.row && t.col === roundConfig.targetPos?.col) {
            return { ...t, state: 'correct' as const, value: roundConfig.targetValue || t.value };
          }
          return t;
        });

        set({
          tiles: updatedTiles,
          combo: 0,
          totalAttempts: newTotal,
          lastFeedback: {
            type: 'miss',
            message: `MISTAKE! NUMBER ${roundConfig.targetValue ?? ''} WAS HERE`,
          },
        });

        return { isCorrect: false, isComplete: true };
      }
    }

    // 2. SEQUENCE RUSH
    if (roundConfig.actualType === 'sequenceRush') {
      const expectedTileIds = roundConfig.sequenceTileIds || [];
      const currentStep = playerInputSequence.length;
      const expectedTileId = expectedTileIds[currentStep];

      const isStepCorrect = tile.id === expectedTileId;
      const newTotal = totalAttempts + 1;

      if (isStepCorrect) {
        const newSeq = [...playerInputSequence, tile.id];
        const isComplete = newSeq.length === expectedTileIds.length;

        const updatedTiles = tiles.map((t) =>
          t.id === tile.id ? { ...t, state: 'correct' as const, sequenceStep: currentStep + 1 } : t
        );

        if (isComplete) {
          const newCorrect = correctAnswers + 1;
          const newCombo = combo + 1;
          const pts = calculateScore(true, newCombo, reaction, 10000, difficulty) + expectedTileIds.length * 60;
          const newScore = score + pts;

          set({
            tiles: updatedTiles,
            playerInputSequence: newSeq,
            combo: newCombo,
            maxCombo: Math.max(maxCombo, newCombo),
            score: newScore,
            correctAnswers: newCorrect,
            totalAttempts: newTotal,
            lastFeedback: { type: 'perfect', message: 'SEQUENCE COMPLETE!', points: pts },
          });

          return { isCorrect: true, isComplete: true };
        } else {
          set({
            tiles: updatedTiles,
            playerInputSequence: newSeq,
            totalAttempts: newTotal,
            lastFeedback: { type: 'streak', message: `STEP ${currentStep + 1} ✓` },
          });

          return { isCorrect: true, isComplete: false };
        }
      } else {
        const updatedTiles = tiles.map((t) => {
          if (t.id === tile.id) return { ...t, state: 'wrong' as const };
          const stepIdx = expectedTileIds.indexOf(t.id);
          if (stepIdx !== -1) {
            return { ...t, state: 'correct' as const, sequenceStep: stepIdx + 1 };
          }
          return t;
        });

        set({
          tiles: updatedTiles,
          combo: 0,
          totalAttempts: newTotal,
          lastFeedback: { type: 'miss', message: 'WRONG SEQUENCE! CORRECT ORDER REVEALED' },
        });

        return { isCorrect: false, isComplete: true };
      }
    }

    // 3. NUMBER SHIFT
    if (roundConfig.actualType === 'numberShift') {
      const isCorrect = tile.id === roundConfig.changedTileId;
      const newTotal = totalAttempts + 1;
      const newCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;

      if (isCorrect) {
        const newCombo = combo + 1;
        const pts = calculateScore(true, newCombo, reaction, 10000, difficulty);
        const newScore = score + pts;

        const updatedTiles = tiles.map((t) =>
          t.id === tile.id ? { ...t, state: 'correct' as const } : t
        );

        set({
          tiles: updatedTiles,
          combo: newCombo,
          maxCombo: Math.max(maxCombo, newCombo),
          score: newScore,
          correctAnswers: newCorrect,
          totalAttempts: newTotal,
          lastFeedback: { type: 'perfect', message: 'MUTATION DETECTED!', points: pts },
        });

        return { isCorrect: true, isComplete: true };
      } else {
        const updatedTiles = tiles.map((t) => {
          if (t.id === tile.id) return { ...t, state: 'wrong' as const };
          if (t.id === roundConfig.changedTileId) return { ...t, state: 'correct' as const, isChanged: true };
          return t;
        });

        set({
          tiles: updatedTiles,
          combo: 0,
          totalAttempts: newTotal,
          lastFeedback: {
            type: 'miss',
            message: `WRONG! CHANGED WAS ${roundConfig.changedOriginalValue} ➔ ${roundConfig.changedNewValue}`,
          },
        });

        return { isCorrect: false, isComplete: true };
      }
    }

    return { isCorrect: false, isComplete: false };
  },

  handleAnswerChoice: (value) => {
    const { roundConfig, combo, maxCombo, score, difficulty, startTimeMs, correctAnswers, totalAttempts, tiles } = get();
    if (!roundConfig) return { isCorrect: false, isComplete: false };

    const reaction = Date.now() - startTimeMs;
    const isCorrect = value === roundConfig.vanishedValue;

    const newTotal = totalAttempts + 1;
    const newCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;

    if (isCorrect) {
      const newCombo = combo + 1;
      const pts = calculateScore(true, newCombo, reaction, 10000, difficulty);
      const newScore = score + pts;

      const updatedTiles = tiles.map((t) =>
        t.isMissing ? { ...t, state: 'correct' as const, value: roundConfig.vanishedValue! } : t
      );

      set({
        tiles: updatedTiles,
        combo: newCombo,
        maxCombo: Math.max(maxCombo, newCombo),
        score: newScore,
        correctAnswers: newCorrect,
        totalAttempts: newTotal,
        lastFeedback: { type: 'perfect', message: 'VANISHED NUMBER FOUND!', points: pts },
      });

      return { isCorrect: true, isComplete: true };
    } else {
      const updatedTiles = tiles.map((t) =>
        t.isMissing ? { ...t, state: 'correct' as const, value: roundConfig.vanishedValue! } : t
      );

      set({
        tiles: updatedTiles,
        combo: 0,
        totalAttempts: newTotal,
        lastFeedback: {
          type: 'miss',
          message: `WRONG! MISSING NUMBER WAS ${roundConfig.vanishedValue}`,
        },
      });

      return { isCorrect: false, isComplete: true };
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
