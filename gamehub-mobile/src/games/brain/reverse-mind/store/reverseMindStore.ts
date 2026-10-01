// ============================================================
// REVERSE MIND — Central Game State Store (Zustand)
// ============================================================

import { create } from 'zustand';
import type {
  GameMode,
  GameDifficulty,
  InGamePhase,
  AppNavScreen,
  GameObject,
  SequenceItem,
  MindShiftRule,
  PlayerStats,
  GameSettings,
  RoundConfig,
} from '../types';
import { MIND_SHIFT_RULES } from '../data/rules';
import { GAME_OBJECTS } from '../data/objects';
import {
  getRoundConfig,
  generateSequence,
  applyMindShiftRule,
  generateGridOptions,
  validateInput,
  calculateScore,
  calculateCombo,
  calculateXP,
  calculateRewards,
  calculateAccuracy,
} from '../logic/reverseMindEngine';

interface ReverseMindState {
  // Navigation & High-level State
  currentScreen: AppNavScreen;
  mode: GameMode;
  difficulty: GameDifficulty;
  phase: InGamePhase;
  isPaused: boolean;

  // Level & Round Progression
  level: number;
  round: number;
  totalRounds: number;
  score: number;
  combo: number;
  maxCombo: number;
  mistakes: number;
  maxMistakes: number;
  totalTaps: number;
  correctTaps: number;

  // Sequence & Input State
  sequence: SequenceItem[];
  expectedTarget: GameObject[];
  playerInput: GameObject[];
  gridOptions: GameObject[];
  mindShiftRule: MindShiftRule;
  roundConfig: RoundConfig;

  // Timer & Feedback
  remainingTimeMs: number;
  totalTimeMs: number;
  lastFeedback: {
    type: 'correct' | 'wrong' | null;
    message: string;
    expectedName?: string;
    tappedName?: string;
  };

  // Rewards & Results
  lastEarnedRewards: {
    coins: number;
    gems: number;
    boosterUnlocked: boolean;
    xpEarned: number;
  };

  // Player Stats & Settings
  playerStats: PlayerStats;
  settings: GameSettings;

  // Actions
  setScreen: (screen: AppNavScreen) => void;
  setMode: (mode: GameMode) => void;
  setDifficulty: (diff: GameDifficulty) => void;
  setPaused: (paused: boolean) => void;
  toggleSetting: (key: keyof GameSettings) => void;

  // Game Loop Actions
  startNewGame: (mode?: GameMode, diff?: GameDifficulty) => void;
  startRound: () => void;
  advanceToMemory: () => void;
  advanceToFlipping: () => void;
  advanceToInput: () => void;
  handleTileTap: (object: GameObject) => {
    isCorrect: boolean;
    isComplete: boolean;
    mistakesLeft: number;
  };
  dismissMindShift: () => void;
  nextRoundOrComplete: () => void;
  restartCurrentGame: () => void;
  claimRewardsAndExit: () => void;
}

const INITIAL_PLAYER_STATS: PlayerStats = {
  level: 1,
  xp: 120,
  coins: 450,
  gems: 12,
  gamesPlayed: 14,
  totalCorrect: 86,
  totalWrong: 12,
  bestCombo: 8,
  streakDays: 4,
  classicBest: 1850,
  quickFlipBest: 1420,
  mindShiftBest: 2100,
  dailyStreak: 3,
  lastDailyDate: '2026-10-01',
};

const INITIAL_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  particlesEnabled: true,
  speedMultiplier: 1.0,
};

export const useReverseMindStore = create<ReverseMindState>((set, get) => ({
  currentScreen: 'splash',
  mode: 'classic',
  difficulty: 'easy',
  phase: 'idle',
  isPaused: false,

  level: 1,
  round: 1,
  totalRounds: 5,
  score: 0,
  combo: 0,
  maxCombo: 0,
  mistakes: 0,
  maxMistakes: 2,
  totalTaps: 0,
  correctTaps: 0,

  sequence: [],
  expectedTarget: [],
  playerInput: [],
  gridOptions: [],
  mindShiftRule: MIND_SHIFT_RULES.none,
  roundConfig: getRoundConfig('classic', 'easy', 1),

  remainingTimeMs: 3000,
  totalTimeMs: 3000,
  lastFeedback: { type: null, message: '' },

  lastEarnedRewards: {
    coins: 0,
    gems: 0,
    boosterUnlocked: false,
    xpEarned: 0,
  },

  playerStats: INITIAL_PLAYER_STATS,
  settings: INITIAL_SETTINGS,

  setScreen: (screen) => set({ currentScreen: screen }),
  setMode: (mode) => set({ mode }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setPaused: (isPaused) => set({ isPaused }),

  toggleSetting: (key) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: typeof state.settings[key] === 'boolean' ? !state.settings[key] : state.settings[key],
      },
    })),

  startNewGame: (overrideMode, overrideDiff) => {
    const mode = overrideMode || get().mode;
    const diff = overrideDiff || get().difficulty;

    set({
      mode,
      difficulty: diff,
      level: 1,
      round: 1,
      totalRounds: diff === 'easy' ? 5 : diff === 'medium' ? 7 : 10,
      score: 0,
      combo: 0,
      maxCombo: 0,
      mistakes: 0,
      totalTaps: 0,
      correctTaps: 0,
      playerInput: [],
      lastFeedback: { type: null, message: '' },
      currentScreen: 'gameplay',
      phase: 'countdown',
    });

    get().startRound();
  },

  startRound: () => {
    const { mode, difficulty, round } = get();
    const config = getRoundConfig(mode, difficulty, round);
    const seq = generateSequence(config.sequenceLength, GAME_OBJECTS, config.mindShiftRule);
    const target = applyMindShiftRule(seq, config.mindShiftRule);
    const options = generateGridOptions(target, config.gridDecoyCount);

    set({
      roundConfig: config,
      sequence: seq,
      expectedTarget: target,
      playerInput: [],
      gridOptions: options,
      mindShiftRule: config.mindShiftRule,
      maxMistakes: config.maxMistakes,
      mistakes: 0,
      remainingTimeMs: config.displayDurationMs,
      totalTimeMs: config.displayDurationMs,
      phase: 'memory',
      lastFeedback: { type: null, message: '' },
    });
  },

  advanceToMemory: () => {
    set({ phase: 'memory' });
  },

  advanceToFlipping: () => {
    set({ phase: 'flipping' });
  },

  advanceToInput: () => {
    const { mindShiftRule } = get();
    // If there's an active non-trivial rule, prompt Mind Shift overlay first
    if (mindShiftRule.id !== 'none' && get().round > 1) {
      set({ phase: 'mindShift' });
    } else {
      set({ phase: 'input' });
    }
  },

  dismissMindShift: () => {
    set({ phase: 'input' });
  },

  handleTileTap: (object) => {
    const { playerInput, expectedTarget, combo, maxCombo, score, round, difficulty, mistakes, maxMistakes, totalTaps, correctTaps } = get();
    const currentIndex = playerInput.length;

    const validation = validateInput(object, currentIndex, expectedTarget);
    const newTotalTaps = totalTaps + 1;

    if (validation.isCorrect) {
      const newPlayerInput = [...playerInput, object];
      const newCombo = calculateCombo(combo, true);
      const newMaxCombo = Math.max(maxCombo, newCombo);
      const addedScore = calculateScore(round, newCombo, 1500, difficulty);
      const newScore = score + addedScore;
      const newCorrectTaps = correctTaps + 1;

      set({
        playerInput: newPlayerInput,
        combo: newCombo,
        maxCombo: newMaxCombo,
        score: newScore,
        totalTaps: newTotalTaps,
        correctTaps: newCorrectTaps,
        lastFeedback: {
          type: 'correct',
          message: `CORRECT! +${addedScore}`,
        },
      });

      if (validation.isComplete) {
        // Round completely solved!
        setTimeout(() => {
          get().nextRoundOrComplete();
        }, 600);
      }

      return { isCorrect: true, isComplete: validation.isComplete, mistakesLeft: maxMistakes - mistakes };
    } else {
      // Wrong item tapped!
      const newMistakes = mistakes + 1;
      const mistakesLeft = maxMistakes - newMistakes;

      set({
        combo: 0,
        mistakes: newMistakes,
        totalTaps: newTotalTaps,
        lastFeedback: {
          type: 'wrong',
          message: `OOPS!`,
          expectedName: validation.expectedObject?.name,
          tappedName: object.name,
        },
      });

      if (mistakesLeft < 0) {
        // Game Over on Hard or too many mistakes
        setTimeout(() => {
          set({ phase: 'gameResult' });
        }, 1000);
      }

      return { isCorrect: false, isComplete: false, mistakesLeft };
    }
  },

  nextRoundOrComplete: () => {
    const { round, totalRounds, score, correctTaps, totalTaps, maxCombo, playerStats } = get();

    if (round >= totalRounds) {
      // Level Completed!
      const accuracy = calculateAccuracy(correctTaps, totalTaps);
      const rewards = calculateRewards(score, accuracy, maxCombo);
      const xp = calculateXP(score, accuracy === 100);

      const updatedStats: PlayerStats = {
        ...playerStats,
        xp: playerStats.xp + xp,
        coins: playerStats.coins + rewards.coins,
        gems: playerStats.gems + rewards.gems,
        gamesPlayed: playerStats.gamesPlayed + 1,
        totalCorrect: playerStats.totalCorrect + correctTaps,
        totalWrong: playerStats.totalWrong + (totalTaps - correctTaps),
        bestCombo: Math.max(playerStats.bestCombo, maxCombo),
        classicBest: Math.max(playerStats.classicBest, score),
      };

      set({
        phase: 'levelComplete',
        lastEarnedRewards: { ...rewards, xpEarned: xp },
        playerStats: updatedStats,
      });
    } else {
      // Advance to next round
      set((state) => ({ round: state.round + 1 }));
      get().startRound();
    }
  },

  restartCurrentGame: () => {
    get().startNewGame(get().mode, get().difficulty);
  },

  claimRewardsAndExit: () => {
    set({
      currentScreen: 'home',
      phase: 'idle',
    });
  },
}));
