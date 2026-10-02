// ============================================================
// PATTERN BREAKER — Global Game State (Zustand Store)
// ============================================================

import { create } from 'zustand';
import {
  PBScreen,
  PBPatternType,
  PBDifficulty,
  PBPlayMode,
  PatternPuzzle,
  TileState,
  PowerUpType,
  AchievementItem,
} from '../types';
import { generatePatternPuzzle } from '../utils/patternGenerator';

const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'first_break',
    title: 'FIRST BREAK',
    description: 'Spot your first pattern breaker.',
    icon: 'flash',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
  },
  {
    id: 'sharp_eye',
    title: 'SHARP EYE',
    description: 'Achieve 5 correct breaker taps in a row.',
    icon: 'eye',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
  },
  {
    id: 'speed_mind',
    title: 'SPEED MIND',
    description: 'Break a complex pattern in under 2 seconds.',
    icon: 'flash',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'rule_master',
    title: 'RULE MASTER',
    description: 'Triumph across all 6 distinct rule families.',
    icon: 'trophy',
    unlocked: false,
    progress: 3,
    maxProgress: 6,
  },
  {
    id: 'shift_survivor',
    title: 'SHIFT SURVIVOR',
    description: 'Clear a live mid-game Rule Shift seamlessly.',
    icon: 'sync',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
];

interface PatternBreakState {
  currentScreen: PBScreen;
  playMode: PBPlayMode;
  difficulty: PBDifficulty;
  patternType: PBPatternType;

  // Live Round State
  score: number;
  round: number;
  timeLeft: number;
  bestScore: number;
  currentStreak: number;
  bestStreak: number;
  correctCount: number;
  wrongCount: number;
  timeBonus: number;
  lastFeedback: 'perfect' | 'wrong' | null;

  // Active Board
  puzzle: PatternPuzzle | null;
  tileStates: Record<number, TileState>;
  revealedTileIndices: number[];

  // Modals & PowerUps
  isPaused: boolean;
  isRuleShift: boolean;
  ruleShiftData: { from: string; to: string } | null;
  powerUps: { reveal: number; freeze: number; scan: number };
  isFrozen: boolean;
  scannedRule: string | null;

  // Meta Progression
  playerLevel: number;
  playerXP: number;
  categoryMastery: Record<string, { level: number; progress: number }>;
  achievements: AchievementItem[];
  dailyCompleted: boolean;
  dailyStreak: number;

  // Navigation History & Exit Modal
  screenHistory: PBScreen[];
  showExitModal: boolean;
  setShowExitModal: (show: boolean) => void;
  goBack: () => void;

  // Actions
  setScreen: (screen: PBScreen) => void;
  setPlayMode: (mode: PBPlayMode) => void;
  setDifficulty: (diff: PBDifficulty) => void;
  setPatternType: (type: PBPatternType) => void;
  startNewRun: () => void;
  startNextRound: () => void;
  selectTile: (index: number) => { isBreaker: boolean };
  decrementTimer: () => void;
  usePowerUp: (type: PowerUpType) => boolean;
  togglePause: () => void;
  resetProgress: () => void;
}

export const usePatternBreakStore = create<PatternBreakState>((set, get) => ({
  currentScreen: 'home',
  playMode: 'quick',
  difficulty: 'MEDIUM',
  patternType: 'MIXED',

  score: 0,
  round: 1,
  timeLeft: 20,
  bestScore: 24,
  currentStreak: 0,
  bestStreak: 7,
  correctCount: 0,
  wrongCount: 0,
  timeBonus: 0,
  lastFeedback: null,

  puzzle: null,
  tileStates: {},
  revealedTileIndices: [],

  isPaused: false,
  isRuleShift: false,
  ruleShiftData: null,
  powerUps: { reveal: 2, freeze: 1, scan: 3 },
  isFrozen: false,
  scannedRule: null,

  playerLevel: 12,
  playerXP: 340,
  categoryMastery: {
    NUMBER: { level: 4, progress: 85 },
    SHAPE: { level: 3, progress: 65 },
    COLOR: { level: 5, progress: 95 },
    COUNT: { level: 3, progress: 50 },
    DIRECTION: { level: 2, progress: 35 },
    MIXED: { level: 4, progress: 70 },
  },
  achievements: INITIAL_ACHIEVEMENTS,
  dailyCompleted: false,
  dailyStreak: 6,

  screenHistory: [],
  showExitModal: false,
  setShowExitModal: (showExitModal) => set({ showExitModal }),

  setScreen: (screen) => {
    const current = get().currentScreen;
    if (current === screen) return;
    set((state) => ({
      // Don't push intermediate game flow screens (countdown, rule_shift, feedback) to history
      screenHistory:
        current === 'countdown' || current === 'rule_shift' || current === 'feedback'
          ? state.screenHistory
          : [...state.screenHistory, current],
      currentScreen: screen,
    }));
  },

  goBack: () => {
    const history = get().screenHistory;
    if (history.length > 0) {
      const prev = history[history.length - 1];
      set({
        screenHistory: history.slice(0, -1),
        currentScreen: prev,
      });
    } else {
      set({ currentScreen: 'home' });
    }
  },
  setPlayMode: (playMode) => set({ playMode }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setPatternType: (patternType) => set({ patternType }),

  startNewRun: () => {
    const { patternType, difficulty } = get();
    const puzzle = generatePatternPuzzle(patternType, difficulty, 9);
    set({
      score: 0,
      round: 1,
      timeLeft: puzzle.timeLimit,
      currentStreak: 0,
      correctCount: 0,
      wrongCount: 0,
      timeBonus: 0,
      puzzle,
      tileStates: {},
      revealedTileIndices: [],
      powerUps: { reveal: 2, freeze: 1, scan: 3 },
      isFrozen: false,
      scannedRule: null,
      isPaused: false,
      isRuleShift: false,
      lastFeedback: null,
      currentScreen: 'countdown',
    });
  },

  startNextRound: () => {
    const { round, patternType, difficulty, playMode } = get();
    const nextRound = round + 1;

    // Trigger Rule Shift every 4 rounds in Shift mode
    if (playMode === 'shift' && nextRound % 3 === 0) {
      const fromType = patternType;
      const allTypes: PBPatternType[] = ['NUMBER', 'SHAPE', 'COLOR', 'COUNT', 'DIRECTION'];
      const nextType = allTypes[Math.floor(Math.random() * allTypes.length)];
      const puzzle = generatePatternPuzzle(nextType, difficulty, 9);

      set({
        round: nextRound,
        patternType: nextType,
        puzzle,
        timeLeft: puzzle.timeLimit,
        tileStates: {},
        revealedTileIndices: [],
        scannedRule: null,
        isRuleShift: true,
        ruleShiftData: { from: fromType, to: nextType },
        lastFeedback: null,
      });
      return;
    }

    const puzzle = generatePatternPuzzle(patternType, difficulty, 9);
    set({
      round: nextRound,
      puzzle,
      timeLeft: puzzle.timeLimit,
      tileStates: {},
      revealedTileIndices: [],
      scannedRule: null,
      isRuleShift: false,
      lastFeedback: null,
      currentScreen: 'gameplay',
    });
  },

  selectTile: (index: number) => {
    const { puzzle, score, currentStreak, bestStreak, correctCount, wrongCount, timeLeft, bestScore } = get();
    if (!puzzle) return { isBreaker: false };

    if (index === puzzle.breakerIndex) {
      // Correct Breaker!
      const newScore = score + 1;
      const newStreak = currentStreak + 1;
      const newBestStreak = Math.max(bestStreak, newStreak);
      const newBestScore = Math.max(bestScore, newScore);
      const newTime = Math.min(30, timeLeft + 2); // +2s reward

      set({
        score: newScore,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        bestScore: newBestScore,
        correctCount: correctCount + 1,
        timeLeft: newTime,
        lastFeedback: 'perfect',
        tileStates: { [index]: 'correct' },
      });

      return { isBreaker: true };
    } else {
      // Wrong Tile!
      const newTime = Math.max(0, timeLeft - 3); // -3s penalty
      set({
        currentStreak: 0,
        wrongCount: wrongCount + 1,
        timeLeft: newTime,
        lastFeedback: 'wrong',
        tileStates: { [index]: 'wrong' },
      });

      return { isBreaker: false };
    }
  },

  decrementTimer: () => {
    const { timeLeft, isFrozen, isPaused, currentScreen } = get();
    if (isPaused || isFrozen || currentScreen !== 'gameplay') return;

    if (timeLeft <= 1) {
      set({ timeLeft: 0, currentScreen: 'result' });
    } else {
      set({ timeLeft: timeLeft - 1 });
    }
  },

  usePowerUp: (type: PowerUpType) => {
    const { powerUps, puzzle, revealedTileIndices } = get();
    if (!puzzle || powerUps[type] <= 0) return false;

    if (type === 'reveal') {
      // Reveal 2 safe non-breaker tiles
      const safeIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(
        (i) => i !== puzzle.breakerIndex && !revealedTileIndices.includes(i)
      );
      const revealed = safeIndices.slice(0, 2);

      set({
        powerUps: { ...powerUps, reveal: powerUps.reveal - 1 },
        revealedTileIndices: [...revealedTileIndices, ...revealed],
      });
      return true;
    }

    if (type === 'freeze') {
      set({
        powerUps: { ...powerUps, freeze: powerUps.freeze - 1 },
        isFrozen: true,
      });
      setTimeout(() => {
        set({ isFrozen: false });
      }, 4000);
      return true;
    }

    if (type === 'scan') {
      set({
        powerUps: { ...powerUps, scan: powerUps.scan - 1 },
        scannedRule: puzzle.ruleDescription,
      });
      return true;
    }

    return false;
  },

  togglePause: () => {
    const { isPaused, currentScreen } = get();
    if (isPaused) {
      set({ isPaused: false, currentScreen: 'gameplay' });
    } else {
      set({ isPaused: true, currentScreen: 'pause' });
    }
  },

  resetProgress: () => {
    set({
      score: 0,
      bestScore: 0,
      currentStreak: 0,
      bestStreak: 0,
      correctCount: 0,
      wrongCount: 0,
      playerLevel: 1,
      playerXP: 0,
      dailyStreak: 0,
    });
  },
}));
