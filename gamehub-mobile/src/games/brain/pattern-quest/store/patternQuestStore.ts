// ============================================================
// PATTERN QUEST — Zustand Global State Store
// ============================================================

import { create } from 'zustand';
import {
  MapRegion,
  PQAchievement,
  PQDifficulty,
  PQGameMode,
  PQScreen,
  PatternQuestPuzzle,
  UserStats,
} from '../types';
import { generatePatternPuzzle } from '../utils/patternEngine';
import { useProfileStore } from '@/store/profile-store';

export const INITIAL_REGIONS: MapRegion[] = [
  {
    id: 'jungle_gate',
    name: 'Jungle Gate',
    templeNumber: 1,
    unlocked: true,
    stars: 3,
    maxStars: 3,
    description: 'Begin your journey through the ancient overgrown threshold.',
    color: '#2ECC71',
  },
  {
    id: 'crystal_river',
    name: 'Crystal River',
    templeNumber: 2,
    unlocked: true,
    stars: 2,
    maxStars: 3,
    description: 'Bioluminescent waterways and cascading light runes.',
    color: '#00F0FF',
  },
  {
    id: 'hidden_temple',
    name: 'Hidden Temple',
    templeNumber: 3,
    unlocked: true,
    stars: 1,
    maxStars: 3,
    description: 'A subterranean sanctuary with interlocking stone puzzles.',
    color: '#F5B041',
  },
  {
    id: 'crystal_cave',
    name: 'Crystal Cave',
    templeNumber: 4,
    unlocked: false,
    stars: 0,
    maxStars: 3,
    description: 'Gleaming quartz chambers echoing with rhythmic patterns.',
    color: '#9B51E0',
  },
  {
    id: 'sky_ruins',
    name: 'Sky Ruins',
    templeNumber: 5,
    unlocked: false,
    stars: 0,
    maxStars: 3,
    description: 'Floating monoliths connected by radiant light bridges.',
    color: '#3498DB',
  },
  {
    id: 'ancient_vault',
    name: 'Ancient Vault',
    templeNumber: 6,
    unlocked: false,
    stars: 0,
    maxStars: 3,
    description: 'The golden core of the ancients guarding the ultimate secret.',
    color: '#E67E22',
  },
];

export const INITIAL_ACHIEVEMENTS: PQAchievement[] = [
  {
    id: 'temple_scout',
    title: 'Temple Scout',
    description: 'Complete Temple 01 at Jungle Gate',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rewardStars: 10,
  },
  {
    id: 'sharp_eyes',
    title: 'Sharp Eyes',
    description: 'Solve 10 shape & color patterns without mistakes',
    unlocked: false,
    progress: 4,
    maxProgress: 10,
    rewardStars: 20,
  },
  {
    id: 'lightning_mind',
    title: 'Lightning Mind',
    description: 'Answer 5 puzzles under 4 seconds each in Rush Mode',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    rewardStars: 30,
  },
  {
    id: 'memory_master',
    title: 'Memory Master',
    description: 'Perfect recall on a 5-item Memory Shift sequence',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    rewardStars: 25,
  },
  {
    id: 'unbroken',
    title: 'Unbroken',
    description: 'Achieve a 10x Combo streak in any mode',
    unlocked: false,
    progress: 3,
    maxProgress: 10,
    rewardStars: 50,
  },
  {
    id: 'pattern_master',
    title: 'Pattern Master',
    description: 'Clear all 6 regions across the Mystic Island',
    unlocked: false,
    progress: 2,
    maxProgress: 6,
    rewardStars: 100,
  },
];

interface PatternQuestState {
  currentScreen: PQScreen;
  previousScreen: PQScreen | null;
  gameMode: PQGameMode;
  difficulty: PQDifficulty;
  smartMode: boolean;
  currentRegionIndex: number;
  
  // Game session
  currentPuzzle: PatternQuestPuzzle | null;
  puzzleIndex: number;
  score: number;
  combo: number;
  maxCombo: number;
  lives: number;
  timeLeft: number;
  timerActive: boolean;
  selectedOptionIndex: number | null;
  answerState: 'idle' | 'correct' | 'wrong';
  eliminatedOptionIndices: number[];
  
  // Tools & Powerups
  isMagicLensActive: boolean;
  magicLensCharges: number;
  hintsRemaining: number;
  
  // Progress & Regions
  mapRegions: MapRegion[];
  achievements: PQAchievement[];
  userStats: UserStats;
  
  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  assistMode: boolean;
  motionControl: boolean;
  language: string;

  // Actions
  setScreen: (screen: PQScreen) => void;
  setGameMode: (mode: PQGameMode) => void;
  setDifficulty: (diff: PQDifficulty) => void;
  setSmartMode: (val: boolean) => void;
  selectRegion: (index: number) => void;
  startNewGame: (mode?: PQGameMode, diff?: PQDifficulty) => void;
  submitAnswer: (index: number) => boolean;
  clearAnswerState: () => void;
  nextPuzzle: () => void;
  useHint: () => void;
  useMagicLens: (action: 'reveal' | 'remove' | 'freeze') => void;
  tickTimer: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleVibration: () => void;
  toggleAssistMode: () => void;
  toggleMotionControl: () => void;
  showExitModal: boolean;
  setShowExitModal: (show: boolean) => void;
  goBack: () => void;
  resetProgress: () => void;
  getUserName: () => string;
}

export const usePatternQuestStore = create<PatternQuestState>((set, get) => ({
  currentScreen: 'splash',
  previousScreen: null,
  showExitModal: false,
  gameMode: 'DISCOVER',
  difficulty: 'EASY',
  smartMode: true,
  currentRegionIndex: 0,

  currentPuzzle: null,
  puzzleIndex: 1,
  score: 0,
  combo: 0,
  maxCombo: 0,
  lives: 3,
  timeLeft: 30,
  timerActive: false,
  selectedOptionIndex: null,
  answerState: 'idle',
  eliminatedOptionIndices: [],

  isMagicLensActive: false,
  magicLensCharges: 3,
  hintsRemaining: 3,

  mapRegions: INITIAL_REGIONS,
  achievements: INITIAL_ACHIEVEMENTS,
  userStats: {
    patternsSolved: 0,
    totalAttempts: 0,
    accuracy: 100,
    bestCombo: 0,
    hintsUsed: 0,
    averageTimeSeconds: 4.2,
    perfectRuns: 0,
    skillBreakdown: {
      shape: 75,
      rotation: 60,
      memory: 80,
      position: 70,
    },
  },

  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  assistMode: false,
  motionControl: true,
  language: 'English',

  getUserName: () => {
    try {
      const displayName = useProfileStore.getState().displayName;
      if (displayName && displayName.trim() !== '') {
        return displayName;
      }
    } catch {
      // fallback
    }
    return 'Alex Scout';
  },

  setScreen: (screen) => {
    set((state) => ({
      previousScreen: state.currentScreen,
      currentScreen: screen,
    }));
  },

  setShowExitModal: (show) => set({ showExitModal: show }),

  goBack: () => {
    const { previousScreen, currentScreen } = get();
    if (previousScreen && previousScreen !== currentScreen) {
      set({ currentScreen: previousScreen, previousScreen: 'home' });
    } else {
      set({ currentScreen: 'home' });
    }
  },

  setGameMode: (mode) => set({ gameMode: mode }),
  setDifficulty: (diff) => set({ difficulty: diff }),
  setSmartMode: (val) => set({ smartMode: val }),
  selectRegion: (index) => set({ currentRegionIndex: index }),

  startNewGame: (overrideMode, overrideDiff) => {
    const mode = overrideMode || get().gameMode;
    const diff = overrideDiff || get().difficulty;
    const puzzle = generatePatternPuzzle(diff, mode);

    set({
      gameMode: mode,
      difficulty: diff,
      currentPuzzle: puzzle,
      puzzleIndex: 1,
      score: 0,
      combo: 0,
      lives: 3,
      timeLeft: puzzle.timeLimitSeconds,
      timerActive: true,
      selectedOptionIndex: null,
      answerState: 'idle',
      eliminatedOptionIndices: [],
      isMagicLensActive: false,
      currentScreen: mode === 'MEMORY' ? 'memory_shift' : mode === 'RUSH' ? 'rush_mode' : 'gameplay',
    });
  },

  submitAnswer: (index: number) => {
    const { currentPuzzle, score, combo, maxCombo, lives, userStats } = get();
    if (!currentPuzzle || get().answerState !== 'idle') return false;

    const isCorrect = index === currentPuzzle.correctOptionIndex;
    const newAttempts = userStats.totalAttempts + 1;

    if (isCorrect) {
      const newCombo = combo + 1;
      const points = 100 + newCombo * 20;
      const newScore = score + points;
      const newSolved = userStats.patternsSolved + 1;
      const newAccuracy = Math.round((newSolved / newAttempts) * 100);

      set({
        selectedOptionIndex: index,
        answerState: 'correct',
        score: newScore,
        combo: newCombo,
        maxCombo: Math.max(maxCombo, newCombo),
        userStats: {
          ...userStats,
          patternsSolved: newSolved,
          totalAttempts: newAttempts,
          accuracy: newAccuracy,
          bestCombo: Math.max(userStats.bestCombo, newCombo),
        },
      });
      return true;
    } else {
      const newLives = Math.max(0, lives - 1);
      const newAccuracy = Math.round((userStats.patternsSolved / newAttempts) * 100);
      const { eliminatedOptionIndices } = get();

      set({
        selectedOptionIndex: index,
        answerState: 'wrong',
        combo: 0,
        lives: newLives,
        eliminatedOptionIndices: [...eliminatedOptionIndices, index],
        userStats: {
          ...userStats,
          totalAttempts: newAttempts,
          accuracy: newAccuracy,
        },
      });
      return false;
    }
  },

  clearAnswerState: () => {
    set({ answerState: 'idle', selectedOptionIndex: null });
  },

  nextPuzzle: () => {
    const { difficulty, gameMode, puzzleIndex, lives } = get();
    if (lives <= 0 || puzzleIndex >= 5) {
      // Level Complete or Final Results
      set({ timerActive: false, currentScreen: 'level_complete' });
      return;
    }

    const nextP = generatePatternPuzzle(difficulty, gameMode);
    set({
      currentPuzzle: nextP,
      puzzleIndex: puzzleIndex + 1,
      timeLeft: nextP.timeLimitSeconds,
      selectedOptionIndex: null,
      answerState: 'idle',
      eliminatedOptionIndices: [],
      isMagicLensActive: false,
      timerActive: true,
    });
  },

  useHint: () => {
    const { hintsRemaining, currentPuzzle, eliminatedOptionIndices, userStats } = get();
    if (hintsRemaining <= 0 || !currentPuzzle) return;

    // Eliminate one incorrect option
    const incorrectIndices = currentPuzzle.options
      .map((_, i) => i)
      .filter((i) => i !== currentPuzzle.correctOptionIndex && !eliminatedOptionIndices.includes(i));

    if (incorrectIndices.length > 0) {
      const toEliminate = incorrectIndices[0];
      set({
        hintsRemaining: hintsRemaining - 1,
        eliminatedOptionIndices: [...eliminatedOptionIndices, toEliminate],
        userStats: {
          ...userStats,
          hintsUsed: userStats.hintsUsed + 1,
        },
      });
    }
  },

  useMagicLens: (action) => {
    const { magicLensCharges, currentPuzzle, eliminatedOptionIndices } = get();
    if (magicLensCharges <= 0 || !currentPuzzle) return;

    if (action === 'remove') {
      const incorrectIndices = currentPuzzle.options
        .map((_, i) => i)
        .filter((i) => i !== currentPuzzle.correctOptionIndex && !eliminatedOptionIndices.includes(i));
      if (incorrectIndices.length > 0) {
        set({
          magicLensCharges: magicLensCharges - 1,
          eliminatedOptionIndices: [...eliminatedOptionIndices, incorrectIndices[0]],
        });
      }
    } else if (action === 'freeze') {
      set({
        magicLensCharges: magicLensCharges - 1,
        timeLeft: get().timeLeft + 10,
      });
    } else if (action === 'reveal') {
      set({
        magicLensCharges: magicLensCharges - 1,
        isMagicLensActive: true,
      });
    }
  },

  tickTimer: () => {
    const { timeLeft, timerActive, lives } = get();
    if (!timerActive) return;

    if (timeLeft <= 1) {
      // Time is up -> loose a life
      const newLives = Math.max(0, lives - 1);
      if (newLives <= 0) {
        set({ timerActive: false, lives: 0, currentScreen: 'final_results' });
      } else {
        set({
          lives: newLives,
          combo: 0,
          answerState: 'wrong',
        });
      }
    } else {
      set({ timeLeft: timeLeft - 1 });
    }
  },

  pauseGame: () => set({ timerActive: false }),
  resumeGame: () => set({ timerActive: true }),

  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),
  toggleVibration: () => set((s) => ({ vibrationEnabled: !s.vibrationEnabled })),
  toggleAssistMode: () => set((s) => ({ assistMode: !s.assistMode })),
  toggleMotionControl: () => set((s) => ({ motionControl: !s.motionControl })),

  resetProgress: () => {
    set({
      score: 0,
      combo: 0,
      maxCombo: 0,
      mapRegions: INITIAL_REGIONS,
      achievements: INITIAL_ACHIEVEMENTS,
      userStats: {
        patternsSolved: 0,
        totalAttempts: 0,
        accuracy: 100,
        bestCombo: 0,
        hintsUsed: 0,
        averageTimeSeconds: 4.0,
        perfectRuns: 0,
        skillBreakdown: {
          shape: 50,
          rotation: 50,
          memory: 50,
          position: 50,
        },
      },
    });
  },
}));
