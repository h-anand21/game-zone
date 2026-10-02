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
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'sharp_eye',
    title: 'SHARP EYE',
    description: 'Achieve 5 correct breaker taps in a row.',
    icon: 'eye',
    unlocked: false,
    progress: 0,
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
    progress: 0,
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
  roundStartTime: number | null;

  // Modals & PowerUps
  isPaused: boolean;
  isRuleShift: boolean;
  ruleShiftData: { from: string; to: string } | null;
  powerUps: { reveal: number; freeze: number; scan: number };
  isFrozen: boolean;
  scannedRule: string | null;

  // Meta Progression & Real Player Analytics
  gamesPlayed: number;
  totalBreakersFound: number;
  totalWrongTaps: number;
  reactionTimes: number[];
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
  patternType: 'RANDOM', // Default is RANDOM / SHUFFLE

  score: 0,
  round: 1,
  timeLeft: 20,
  bestScore: 0,
  currentStreak: 0,
  bestStreak: 0,
  correctCount: 0,
  wrongCount: 0,
  timeBonus: 0,
  lastFeedback: null,

  puzzle: null,
  tileStates: {},
  revealedTileIndices: [],
  roundStartTime: null,

  isPaused: false,
  isRuleShift: false,
  ruleShiftData: null,
  powerUps: { reveal: 2, freeze: 1, scan: 3 },
  isFrozen: false,
  scannedRule: null,

  gamesPlayed: 0,
  totalBreakersFound: 0,
  totalWrongTaps: 0,
  reactionTimes: [],
  playerLevel: 1,
  playerXP: 0,
  categoryMastery: {
    NUMBER: { level: 1, progress: 0 },
    SHAPE: { level: 1, progress: 0 },
    COLOR: { level: 1, progress: 0 },
    COUNT: { level: 1, progress: 0 },
    DIRECTION: { level: 1, progress: 0 },
    MIXED: { level: 1, progress: 0 },
  },
  achievements: INITIAL_ACHIEVEMENTS,
  dailyCompleted: false,
  dailyStreak: 0,

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
    const { patternType, difficulty, gamesPlayed } = get();
    const puzzle = generatePatternPuzzle(patternType, difficulty, 9);
    set({
      gamesPlayed: gamesPlayed + 1,
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
      roundStartTime: Date.now(),
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

    // Trigger Rule Shift every 3 rounds in Shift mode
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
        roundStartTime: Date.now(),
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
      roundStartTime: Date.now(),
      scannedRule: null,
      isRuleShift: false,
      lastFeedback: null,
      currentScreen: 'gameplay',
    });
  },

  selectTile: (index: number) => {
    const {
      puzzle,
      score,
      currentStreak,
      bestStreak,
      correctCount,
      wrongCount,
      timeLeft,
      bestScore,
      totalBreakersFound,
      totalWrongTaps,
      reactionTimes,
      roundStartTime,
      playerXP,
      playerLevel,
      categoryMastery,
    } = get();
    if (!puzzle) return { isBreaker: false };

    const now = Date.now();
    const solveSeconds = roundStartTime ? Math.max(0.4, Math.min(10, (now - roundStartTime) / 1000)) : 1.2;

    if (index === puzzle.breakerIndex) {
      // Correct Breaker!
      const newScore = score + 1;
      const newStreak = currentStreak + 1;
      const newBestStreak = Math.max(bestStreak, newStreak);
      const newBestScore = Math.max(bestScore, newScore);
      const newTime = Math.min(30, timeLeft + 2); // +2s reward

      // Update Category Mastery dynamically
      const catKey = puzzle.patternType === 'RANDOM' ? 'MIXED' : puzzle.patternType;
      const currentCat = categoryMastery[catKey] || { level: 1, progress: 0 };
      const newProg = currentCat.progress + 10;
      const updatedLevel = newProg >= 100 ? currentCat.level + 1 : currentCat.level;
      const updatedCatProg = newProg >= 100 ? newProg - 100 : newProg;

      // Update Achievements dynamically
      const achievements = get().achievements;
      const updatedAchievements = achievements.map((ach) => {
        if (ach.id === 'first_break') {
          return { ...ach, unlocked: true, progress: 1 };
        }
        if (ach.id === 'sharp_eye') {
          const prog = Math.min(5, Math.max(ach.progress, newBestStreak));
          return { ...ach, progress: prog, unlocked: prog >= 5 };
        }
        if (ach.id === 'speed_mind') {
          if (solveSeconds <= 2) {
            return { ...ach, progress: 1, unlocked: true };
          }
        }
        if (ach.id === 'rule_master') {
          const activeCount = Object.values(categoryMastery).filter(
            (c) => c.level > 1 || c.progress > 0
          ).length;
          const prog = Math.min(6, activeCount);
          return { ...ach, progress: prog, unlocked: prog >= 6 };
        }
        return ach;
      });

      set({
        score: newScore,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        bestScore: newBestScore,
        correctCount: correctCount + 1,
        totalBreakersFound: totalBreakersFound + 1,
        reactionTimes: [...reactionTimes.slice(-19), Number(solveSeconds.toFixed(2))],
        timeLeft: newTime,
        lastFeedback: 'perfect',
        tileStates: { [index]: 'correct' },
        playerXP: leveledUp ? newXP - 500 : newXP,
        playerLevel: leveledUp ? playerLevel + 1 : playerLevel,
        categoryMastery: {
          ...categoryMastery,
          [catKey]: {
            level: updatedLevel,
            progress: updatedCatProg,
          },
        },
        achievements: updatedAchievements,
      });

      return { isBreaker: true };
    } else {
      // Wrong Tile!
      const newTime = Math.max(0, timeLeft - 3); // -3s penalty
      set({
        currentStreak: 0,
        wrongCount: wrongCount + 1,
        totalWrongTaps: totalWrongTaps + 1,
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
      gamesPlayed: 0,
      totalBreakersFound: 0,
      totalWrongTaps: 0,
      reactionTimes: [],
      playerLevel: 1,
      playerXP: 0,
      dailyStreak: 0,
    });
  },
}));
