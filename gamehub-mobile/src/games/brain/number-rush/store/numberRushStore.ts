// ============================================================
// Number Rush — Core Zustand Game Engine Store
// ============================================================

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Achievement,
  Difficulty,
  GameModeId,
  GameSettings,
  LeaderboardEntry,
  PlayerStats,
  PowerUpState,
  QuestionData,
  ScreenId,
} from '../types';
import { INITIAL_ACHIEVEMENTS, INITIAL_LEADERBOARD } from '../data';
import { generateQuestionForMode } from '../logic';
import { NRAudio } from '../services/audio';
import { NRHaptics } from '../services/haptics';
import { getDatabase } from '@/storage/sqlite/database';
import { ScoreRepository } from '@/storage/sqlite/repositories/ScoreRepository';

const STORAGE_KEY = '@gamehub:number_rush_v1';

interface NumberRushState {
  // Navigation & Screen Flow
  currentScreen: ScreenId;
  previousScreen: ScreenId;
  selectedMode: GameModeId;
  difficulty: Difficulty;
  isPaused: boolean;
  countdownValue: number;
  showComboCelebration: boolean;
  comboCelebrationValue: number;
  showSpecialRoundAlert: boolean;

  // Active Gameplay Session
  roundNumber: number;
  totalRounds: number;
  score: number;
  combo: number;
  maxSessionCombo: number;
  correctAnswers: number;
  wrongAnswers: number;
  currentQuestion: QuestionData | null;
  timeLeft: number;
  maxTime: number;
  isTimerRunning: boolean;
  isTimeFrozen: boolean;
  eliminatedOptions: (number | string)[];
  isAnswerSubmitted: boolean;
  selectedAnswer: number | string | null;
  isLastAnswerCorrect: boolean | null;
  hintActive: boolean;

  // Session Results
  sessionStars: number;
  sessionCoinsEarned: number;
  sessionXpEarned: number;
  isNewBestScore: boolean;

  // Persistent Player Profile & Stats
  stats: PlayerStats;
  settings: GameSettings;
  powerUps: PowerUpState;
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];

  // Action Methods
  setScreen: (screen: ScreenId) => void;
  setSelectedMode: (mode: GameModeId) => void;
  setDifficulty: (diff: Difficulty) => void;
  togglePause: () => void;
  resumeGame: () => void;

  startCountdown: (mode?: GameModeId, diff?: Difficulty) => void;
  startActiveGame: () => void;
  submitAnswer: (answer: number | string) => void;
  nextQuestion: () => void;
  finishGame: () => void;
  restartGame: () => void;
  exitToHome: () => void;

  tickTimer: () => void;

  // Power-Ups
  useFreeze: () => boolean;
  useEliminate: () => boolean;
  useExtraTime: () => boolean;
  useHint: () => boolean;

  // Daily & Achievements
  claimDailyReward: () => boolean;
  claimAchievement: (achievementId: string) => void;

  // Settings
  updateSettings: (newSettings: Partial<GameSettings>) => void;

  // Data persistence
  loadPersistedData: () => Promise<void>;
  savePersistedData: () => Promise<void>;
}

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  totalScore: 0,
  bestScore: 0,
  maxCombo: 0,
  accuracy: 100,
  totalCorrect: 0,
  totalWrong: 0,
  coins: 450,
  gems: 15,
  level: 1,
  xp: 0,
  dailyStreak: 1,
  lastDailyClaimDate: '',
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEffects: true,
  backgroundMusic: true,
  hapticFeedback: true,
  bgVolume: 0.7,
  sfxVolume: 0.8,
  vibration: true,
  showHints: true,
  confirmActions: true,
  darkMode: true,
  animations: true,
  language: 'en',
};

const DEFAULT_POWER_UPS: PowerUpState = {
  freeze: 2,
  eliminate: 2,
  time: 3,
  hint: 3,
};

let timerInterval: any = null;

export const useNumberRushStore = create<NumberRushState>((set, get) => ({
  // Defaults
  currentScreen: 'home',
  previousScreen: 'home',
  selectedMode: 'animal-count',
  difficulty: 'easy',
  isPaused: false,
  countdownValue: 3,
  showComboCelebration: false,
  comboCelebrationValue: 0,
  showSpecialRoundAlert: false,

  roundNumber: 1,
  totalRounds: 10,
  score: 0,
  combo: 0,
  maxSessionCombo: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  currentQuestion: null,
  timeLeft: 14,
  maxTime: 14,
  isTimerRunning: false,
  isTimeFrozen: false,
  eliminatedOptions: [],
  isAnswerSubmitted: false,
  selectedAnswer: null,
  isLastAnswerCorrect: null,
  hintActive: false,

  sessionStars: 0,
  sessionCoinsEarned: 0,
  sessionXpEarned: 0,
  isNewBestScore: false,

  stats: DEFAULT_STATS,
  settings: DEFAULT_SETTINGS,
  powerUps: DEFAULT_POWER_UPS,
  achievements: INITIAL_ACHIEVEMENTS,
  leaderboard: INITIAL_LEADERBOARD,

  setScreen: (screen) => {
    NRAudio.playButton();
    NRHaptics.buttonTap();
    set((state) => ({ previousScreen: state.currentScreen, currentScreen: screen }));
  },

  setSelectedMode: (mode) => {
    NRAudio.playButton();
    NRHaptics.buttonTap();
    set({ selectedMode: mode });
  },

  setDifficulty: (diff) => {
    NRAudio.playButton();
    NRHaptics.buttonTap();
    set({ difficulty: diff });
  },

  togglePause: () => {
    const { isPaused, isTimerRunning } = get();
    NRAudio.playButton();
    NRHaptics.buttonTap();
    set({
      isPaused: !isPaused,
      isTimerRunning: isPaused ? true : false,
    });
  },

  resumeGame: () => {
    NRAudio.playButton();
    NRHaptics.buttonTap();
    set({ isPaused: false, isTimerRunning: true });
  },

  startCountdown: (mode, diff) => {
    NRAudio.playButton();
    NRHaptics.buttonTap();
    if (mode) set({ selectedMode: mode });
    if (diff) set({ difficulty: diff });

    set({
      currentScreen: 'countdown',
      countdownValue: 3,
      isPaused: false,
      score: 0,
      combo: 0,
      maxSessionCombo: 0,
      roundNumber: 1,
      correctAnswers: 0,
      wrongAnswers: 0,
      sessionStars: 0,
      sessionCoinsEarned: 0,
      sessionXpEarned: 0,
      isNewBestScore: false,
    });

    NRAudio.playCountdownTick();
    NRHaptics.medium();

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        set({ countdownValue: count });
        NRAudio.playCountdownTick();
        NRHaptics.medium();
      } else if (count === 0) {
        set({ countdownValue: 0 }); // 0 represents "RUSH!"
        NRAudio.playCountdownGo();
        NRHaptics.heavy();
      } else {
        clearInterval(interval);
        get().startActiveGame();
      }
    }, 850);
  },

  startActiveGame: () => {
    const { selectedMode, difficulty } = get();
    const q = generateQuestionForMode(selectedMode, difficulty, 1);

    set({
      currentScreen: 'gameplay',
      roundNumber: 1,
      score: 0,
      combo: 0,
      maxSessionCombo: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      currentQuestion: q,
      timeLeft: q.timeLimit,
      maxTime: q.timeLimit,
      isTimerRunning: true,
      isTimeFrozen: false,
      eliminatedOptions: [],
      isAnswerSubmitted: false,
      selectedAnswer: null,
      isLastAnswerCorrect: null,
      hintActive: false,
      showSpecialRoundAlert: Boolean(q.isSpecialRound),
    });

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      get().tickTimer();
    }, 1000);
  },

  tickTimer: () => {
    const { isTimerRunning, isPaused, isTimeFrozen, timeLeft, isAnswerSubmitted } = get();
    if (!isTimerRunning || isPaused || isAnswerSubmitted) return;

    if (isTimeFrozen) {
      return; // Freezing time skips tick
    }

    if (timeLeft <= 1) {
      // Time Out -> count as wrong answer
      NRAudio.playWrong();
      NRHaptics.error();
      get().submitAnswer('__TIMEOUT__');
    } else {
      set({ timeLeft: timeLeft - 1 });
    }
  },

  submitAnswer: (answer) => {
    const {
      currentQuestion,
      isAnswerSubmitted,
      combo,
      score,
      maxSessionCombo,
      correctAnswers,
      wrongAnswers,
      roundNumber,
      totalRounds,
      stats,
    } = get();

    if (isAnswerSubmitted || !currentQuestion) return;

    const isCorrect = String(answer) === String(currentQuestion.correctAnswer);
    let newCombo = isCorrect ? combo + 1 : 0;
    let newMaxCombo = Math.max(maxSessionCombo, newCombo);

    // Multiplier calculation
    const comboMultiplier = 1 + Math.min(newCombo * 0.2, 2.5);
    const specialMultiplier = currentQuestion.specialRoundMultiplier || 1;
    const basePoints = 100;
    const pointsAwarded = isCorrect
      ? Math.round(basePoints * comboMultiplier * specialMultiplier)
      : 0;

    const newScore = score + pointsAwarded;

    if (isCorrect) {
      NRAudio.playCorrect();
      NRHaptics.success();

      // Check combo milestones for celebration
      if (newCombo === 5 || newCombo === 10 || newCombo === 15) {
        NRAudio.playCombo();
        NRHaptics.heavy();
        set({
          showComboCelebration: true,
          comboCelebrationValue: newCombo,
        });
        setTimeout(() => {
          set({ showComboCelebration: false });
        }, 1400);
      }
    } else {
      NRAudio.playWrong();
      NRHaptics.error();
    }

    set({
      isAnswerSubmitted: true,
      selectedAnswer: answer,
      isLastAnswerCorrect: isCorrect,
      score: newScore,
      combo: newCombo,
      maxSessionCombo: newMaxCombo,
      correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers,
      wrongAnswers: isCorrect ? wrongAnswers : wrongAnswers + 1,
      isTimerRunning: false,
    });

    // Advance to next question or complete after short delay
    setTimeout(() => {
      if (roundNumber >= totalRounds) {
        get().finishGame();
      } else {
        get().nextQuestion();
      }
    }, 1100);
  },

  nextQuestion: () => {
    const { selectedMode, difficulty, roundNumber } = get();
    const nextRound = roundNumber + 1;
    const q = generateQuestionForMode(selectedMode, difficulty, nextRound);

    set({
      roundNumber: nextRound,
      currentQuestion: q,
      timeLeft: q.timeLimit,
      maxTime: q.timeLimit,
      isTimerRunning: true,
      isTimeFrozen: false,
      eliminatedOptions: [],
      isAnswerSubmitted: false,
      selectedAnswer: null,
      isLastAnswerCorrect: null,
      hintActive: false,
      showSpecialRoundAlert: Boolean(q.isSpecialRound),
    });
  },

  finishGame: () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    const {
      score,
      maxSessionCombo,
      correctAnswers,
      wrongAnswers,
      totalRounds,
      stats,
      selectedMode,
      difficulty,
    } = get();

    NRAudio.playVictory();
    NRHaptics.heavy();

    const totalQuestions = correctAnswers + wrongAnswers || 1;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

    // Star calculation
    let stars = 1;
    if (accuracy >= 80 && score >= 800) stars = 3;
    else if (accuracy >= 60 || score >= 500) stars = 2;

    const coinsEarned = Math.round(score * 0.15) + stars * 25;
    const xpEarned = Math.round(score * 0.25) + 50;

    const isNewBest = score > stats.bestScore;
    const newBest = Math.max(score, stats.bestScore);
    const newMaxComboOverall = Math.max(maxSessionCombo, stats.maxCombo);

    const newXpTotal = stats.xp + xpEarned;
    const nextLevel = Math.floor(newXpTotal / 500) + 1;

    const updatedStats: PlayerStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      totalScore: stats.totalScore + score,
      bestScore: newBest,
      maxCombo: newMaxComboOverall,
      totalCorrect: stats.totalCorrect + correctAnswers,
      totalWrong: stats.totalWrong + wrongAnswers,
      accuracy: Math.round(
        ((stats.totalCorrect + correctAnswers) /
          (stats.totalCorrect + stats.totalWrong + totalQuestions)) *
          100
      ),
      coins: stats.coins + coinsEarned,
      xp: newXpTotal,
      level: nextLevel,
    };

    set({
      currentScreen: 'level-complete',
      isTimerRunning: false,
      sessionStars: stars,
      sessionCoinsEarned: coinsEarned,
      sessionXpEarned: xpEarned,
      isNewBestScore: isNewBest,
      stats: updatedStats,
    });

    get().savePersistedData();

    // Background sync to SQLite ScoreRepository
    (async () => {
      try {
        const db = await getDatabase();
        const scoreRepo = new ScoreRepository(db);
        await scoreRepo.insert({
          id: `nr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          eventId: `evt_${Date.now()}`,
          gameId: 'number-rush',
          gameVersion: '1.0.0',
          scoreVersion: 'v1',
          score,
          duration: Math.max(10, correctAnswers * 5),
          metadata: {
            accuracy,
            maxCombo: maxSessionCombo,
            mode: selectedMode,
            difficulty,
            stars,
          },
        });
      } catch {}
    })();
  },

  restartGame: () => {
    get().startCountdown();
  },

  exitToHome: () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    set({
      currentScreen: 'home',
      isPaused: false,
      isTimerRunning: false,
    });
  },

  // Power-Ups
  useFreeze: () => {
    const { powerUps, isTimeFrozen, isTimerRunning } = get();
    if (powerUps.freeze <= 0 || isTimeFrozen || !isTimerRunning) return false;

    NRAudio.playPowerUp();
    NRHaptics.medium();

    set({
      powerUps: { ...powerUps, freeze: powerUps.freeze - 1 },
      isTimeFrozen: true,
    });

    setTimeout(() => {
      set({ isTimeFrozen: false });
    }, 5000);

    return true;
  },

  useEliminate: () => {
    const { powerUps, currentQuestion, eliminatedOptions, isTimerRunning } = get();
    if (
      powerUps.eliminate <= 0 ||
      !currentQuestion ||
      eliminatedOptions.length > 0 ||
      !isTimerRunning
    )
      return false;

    NRAudio.playPowerUp();
    NRHaptics.medium();

    // Find 2 wrong options to eliminate
    const wrongOptions = currentQuestion.options.filter(
      (opt) => String(opt) !== String(currentQuestion.correctAnswer)
    );
    const toEliminate = wrongOptions.slice(0, 2);

    set({
      powerUps: { ...powerUps, eliminate: powerUps.eliminate - 1 },
      eliminatedOptions: toEliminate,
    });

    return true;
  },

  useExtraTime: () => {
    const { powerUps, timeLeft, isTimerRunning } = get();
    if (powerUps.time <= 0 || !isTimerRunning) return false;

    NRAudio.playPowerUp();
    NRHaptics.medium();

    set({
      powerUps: { ...powerUps, time: powerUps.time - 1 },
      timeLeft: timeLeft + 5,
    });

    return true;
  },

  useHint: () => {
    const { powerUps, hintActive, isTimerRunning } = get();
    if (powerUps.hint <= 0 || hintActive || !isTimerRunning) return false;

    NRAudio.playPowerUp();
    NRHaptics.medium();

    set({
      powerUps: { ...powerUps, hint: powerUps.hint - 1 },
      hintActive: true,
    });

    return true;
  },

  claimDailyReward: () => {
    const { stats } = get();
    const today = new Date().toISOString().slice(0, 10);
    if (stats.lastDailyClaimDate === today) return false;

    const streakBonus = Math.min(stats.dailyStreak * 50, 300);
    const coinsReward = 200 + streakBonus;

    NRAudio.playVictory();
    NRHaptics.heavy();

    set({
      stats: {
        ...stats,
        coins: stats.coins + coinsReward,
        gems: stats.gems + 2,
        dailyStreak: stats.dailyStreak + 1,
        lastDailyClaimDate: today,
      },
    });

    get().savePersistedData();
    return true;
  },

  claimAchievement: (achievementId: string) => {
    const { achievements, stats } = get();
    const ach = achievements.find((a) => a.id === achievementId);
    if (!ach || !ach.unlocked) return;

    NRAudio.playVictory();
    NRHaptics.success();

    const updated = achievements.map((a) =>
      a.id === achievementId ? { ...a, rewardCoins: 0 } : a
    );

    set({
      achievements: updated,
      stats: {
        ...stats,
        coins: stats.coins + ach.rewardCoins,
      },
    });

    get().savePersistedData();
  },

  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    NRAudio.setSoundEnabled(updated.soundEffects);
    NRAudio.setMusicEnabled(updated.backgroundMusic);
    NRAudio.setVolume(updated.bgVolume);
    NRHaptics.setEnabled(updated.hapticFeedback && updated.vibration);

    set({ settings: updated });
    get().savePersistedData();
  },

  loadPersistedData: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.stats) {
          set({
            stats: { ...DEFAULT_STATS, ...parsed.stats },
            settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
            powerUps: { ...DEFAULT_POWER_UPS, ...parsed.powerUps },
            achievements: parsed.achievements || INITIAL_ACHIEVEMENTS,
          });
        }
      }
    } catch {}
  },

  savePersistedData: async () => {
    try {
      const { stats, settings, powerUps, achievements } = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ stats, settings, powerUps, achievements })
      );
    } catch {}
  },
}));
