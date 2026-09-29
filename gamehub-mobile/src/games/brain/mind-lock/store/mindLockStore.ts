// ============================================================
// Mind Lock — Zustand Store with Local Persistence
// ============================================================

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  GameMode,
  GameStatus,
  MindLockScreen,
  PadColor,
  PlayerProfile,
  PlayerStats,
  GameSettings,
  LevelData,
  ChallengeData,
  AchievementData,
  DailyChallengeState,
} from '../types';
import { MindLockAudio } from '../services/audio';
import { MindLockHaptics } from '../services/haptics';

const STORAGE_KEY = '@mind_lock_state_v3';

const INITIAL_PROFILE: PlayerProfile = {
  name: 'Player',
  level: 1,
  xp: 0,
  xpNextLevel: 100,
  coins: 0,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
};

const INITIAL_STATS: PlayerStats = {
  bestScore: 0,
  highestRound: 0,
  accuracy: 0,
  totalGames: 0,
  bestStreak: 0,
  totalPlayTimeSeconds: 0,
  roundDistribution: {
    '1-5': 0,
    '6-10': 0,
    '11-15': 0,
    '16-20': 0,
    '20+': 0,
  },
  modeAccuracy: {
    classic: 0,
    speed: 0,
    streak: 0,
    pattern: 0,
  },
  performanceHistory: [
    { date: 'Day 1', rounds: 0 },
    { date: 'Day 2', rounds: 0 },
    { date: 'Day 3', rounds: 0 },
    { date: 'Day 4', rounds: 0 },
    { date: 'Day 5', rounds: 0 },
    { date: 'Day 6', rounds: 0 },
    { date: 'Day 7', rounds: 0 },
  ],
};

const INITIAL_SETTINGS: GameSettings = {
  soundEffects: true,
  backgroundMusic: true,
  bgMusicVolume: 0.7,
  hapticFeedback: true,
  notifications: true,
  difficulty: 'medium',
  language: 'English',
  theme: 'dark',
};

const INITIAL_LEVELS: LevelData[] = [
  { id: 1, worldId: 1, levelNumber: 1, title: 'First Steps', targetRounds: 3, stars: 0, status: 'current' },
  { id: 2, worldId: 1, levelNumber: 2, title: 'Echo Chamber', targetRounds: 4, stars: 0, status: 'locked' },
  { id: 3, worldId: 1, levelNumber: 3, title: 'Rhythm Sync', targetRounds: 5, stars: 0, status: 'locked' },
  { id: 4, worldId: 1, levelNumber: 4, title: 'Twin Sparks', targetRounds: 6, stars: 0, status: 'locked' },
  { id: 5, worldId: 1, levelNumber: 5, title: 'Forest River', targetRounds: 7, stars: 0, status: 'locked' },
  { id: 6, worldId: 1, levelNumber: 6, title: 'Hidden Canopy', targetRounds: 8, stars: 0, status: 'locked' },
  { id: 7, worldId: 1, levelNumber: 7, title: 'Stone Sanctuary', targetRounds: 9, stars: 0, status: 'locked' },
  { id: 8, worldId: 1, levelNumber: 8, title: 'Waterfall Peak', targetRounds: 10, stars: 0, status: 'locked' },
  { id: 9, worldId: 1, levelNumber: 9, title: 'Ancient Ruin', targetRounds: 11, stars: 0, status: 'locked' },
  { id: 10, worldId: 1, levelNumber: 10, title: 'Forest Core', targetRounds: 12, stars: 0, status: 'locked' },
];

const INITIAL_DAILY: DailyChallengeState = {
  dateString: new Date().toISOString().split('T')[0],
  targetRounds: 10,
  currentStreak: 0,
  dailyScore: 0,
  completed: false,
  claimed3: false,
  claimed5: false,
  claimed8: false,
  claimed10: false,
};

const INITIAL_CHALLENGES: ChallengeData[] = [
  {
    id: 'ch-memory',
    category: 'memory',
    title: 'Memory Milestones',
    description: 'Reach higher rounds and train your memory.',
    current: 0,
    target: 10,
    rewardType: 'coins',
    rewardAmount: 200,
    completed: false,
    claimed: false,
  },
  {
    id: 'ch-speed',
    category: 'speed',
    title: 'Speed Challenges',
    description: 'Repeat patterns faster and beat the clock.',
    current: 0,
    target: 8,
    rewardType: 'xp',
    rewardAmount: 150,
    completed: false,
    claimed: false,
  },
  {
    id: 'ch-streak',
    category: 'streak',
    title: 'Streak Challenges',
    description: 'Keep your streak alive across matches.',
    current: 0,
    target: 7,
    rewardType: 'badge',
    rewardAmount: 'Special Badge',
    completed: false,
    claimed: false,
  },
  {
    id: 'ch-mastery',
    category: 'mastery',
    title: 'Pattern Mastery',
    description: 'Master complex patterns and unlock higher levels.',
    current: 0,
    target: 5,
    rewardType: 'chest',
    rewardAmount: 'Rare Chest',
    completed: false,
    claimed: false,
  },
];

const INITIAL_ACHIEVEMENTS: AchievementData[] = [
  // Gameplay
  { id: 'ac-1', group: 'gameplay', title: 'First Steps', description: 'Complete your first game', current: 0, target: 1, unlocked: false },
  { id: 'ac-2', group: 'gameplay', title: 'Round 10', description: 'Reach round 10 in any mode', current: 0, target: 10, unlocked: false },
  { id: 'ac-3', group: 'gameplay', title: 'Round 50', description: 'Reach round 50 in any mode', current: 0, target: 50, unlocked: false },
  { id: 'ac-4', group: 'gameplay', title: 'Century Club', description: 'Reach round 100', current: 0, target: 100, unlocked: false },
  { id: 'ac-5', group: 'gameplay', title: 'Master Player', description: 'Complete 5 worlds', current: 0, target: 5, unlocked: false },

  // Speed
  { id: 'ac-6', group: 'speed', title: 'Speedster', description: 'Complete 5 speed challenges', current: 0, target: 5, unlocked: false },
  { id: 'ac-7', group: 'speed', title: 'Lightning', description: 'Complete 20 speed challenges', current: 0, target: 20, unlocked: false },
  { id: 'ac-8', group: 'speed', title: 'Flash', description: 'Complete 50 speed challenges', current: 0, target: 50, unlocked: false },
  { id: 'ac-9', group: 'speed', title: 'Time King', description: 'Finish a speed challenge < 10s', current: 0, target: 1, unlocked: false },
  { id: 'ac-10', group: 'speed', title: 'Ultra Fast', description: 'Finish 5 challenges < 10s', current: 0, target: 5, unlocked: false },

  // Streak
  { id: 'ac-11', group: 'streak', title: 'Streak Starter', description: 'Reach a 3-game streak', current: 0, target: 3, unlocked: false },
  { id: 'ac-12', group: 'streak', title: 'Streak Pro', description: 'Reach a 10-game streak', current: 0, target: 10, unlocked: false },
  { id: 'ac-13', group: 'streak', title: 'Streak King', description: 'Reach a 20-game streak', current: 0, target: 20, unlocked: false },
  { id: 'ac-14', group: 'streak', title: 'Unstoppable', description: 'Reach a 50-game streak', current: 0, target: 50, unlocked: false },
  { id: 'ac-15', group: 'streak', title: 'Streak Master', description: 'Reach a 100-game streak', current: 0, target: 100, unlocked: false },

  // Mastery
  { id: 'ac-16', group: 'mastery', title: 'Pattern Learner', description: 'Complete 5 complex patterns', current: 0, target: 5, unlocked: false },
  { id: 'ac-17', group: 'mastery', title: 'Pattern Expert', description: 'Complete 25 complex patterns', current: 0, target: 25, unlocked: false },
  { id: 'ac-18', group: 'mastery', title: 'Pattern Master', description: 'Complete 50 complex patterns', current: 0, target: 50, unlocked: false },
  { id: 'ac-19', group: 'mastery', title: 'Pattern Legend', description: 'Complete 100 complex patterns', current: 0, target: 100, unlocked: false },
  { id: 'ac-20', group: 'mastery', title: 'Mind Genius', description: 'Complete 200 complex patterns', current: 0, target: 200, unlocked: false },
];


export interface RewardItem {
  type: string;
  title: string;
  subtitle: string;
  xp: number;
  badge?: string;
  nextLevel?: string;
}

interface MindLockStoreState {
  // Navigation
  currentScreen: MindLockScreen;
  screenHistory: MindLockScreen[];
  
  // Persistent State
  profile: PlayerProfile;
  stats: PlayerStats;
  settings: GameSettings;
  levels: LevelData[];
  daily: DailyChallengeState;
  challenges: ChallengeData[];
  achievements: AchievementData[];
  
  // Active Game State
  selectedMode: GameMode;
  gameStatus: GameStatus;
  round: number;
  score: number;
  currentStreak: number;
  sequence: PadColor[];
  playerInput: PadColor[];
  activePad: PadColor | null;
  activeLevelId: number | null;
  unlockedReward: RewardItem | null;
  hasSeenOnboarding: boolean;

  // Actions
  setScreen: (screen: MindLockScreen) => void;
  goBack: () => void;
  selectMode: (mode: GameMode) => void;
  startLevel: (levelId: number) => void;
  startGame: (mode?: GameMode) => void;
  setGameStatus: (status: GameStatus) => void;
  setActivePad: (pad: PadColor | null) => void;
  recordPlayerTap: (pad: PadColor) => void;
  advanceRound: () => void;
  failRound: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  exitGame: () => void;
  
  // Settings Actions
  updateSettings: (partial: Partial<GameSettings>) => void;
  resetProgress: () => void;
  
  // Storage
  loadPersistedData: () => Promise<void>;
  savePersistedData: () => Promise<void>;
  
  // Reward & Level Unlock
  showRewardModal: (reward: RewardItem) => void;
  dismissRewardModal: () => void;
  finishOnboarding: () => void;
}

export const useMindLockStore = create<MindLockStoreState>((set, get) => ({
  currentScreen: 'splash',
  screenHistory: [],
  profile: INITIAL_PROFILE,
  stats: INITIAL_STATS,
  settings: INITIAL_SETTINGS,
  levels: INITIAL_LEVELS,
  daily: INITIAL_DAILY,
  challenges: INITIAL_CHALLENGES,
  achievements: INITIAL_ACHIEVEMENTS,
  selectedMode: 'classic',
  gameStatus: 'IDLE',
  round: 1,
  score: 0,
  currentStreak: 0,
  sequence: [],
  playerInput: [],
  activePad: null,
  activeLevelId: null,
  unlockedReward: null,
  hasSeenOnboarding: true,

  setScreen: (screen) => {
    MindLockHaptics.buttonTap();
    MindLockAudio.playButton();
    set((state) => ({
      currentScreen: screen,
      screenHistory: [...state.screenHistory, state.currentScreen],
    }));
  },

  goBack: () => {
    MindLockHaptics.buttonTap();
    MindLockAudio.playButton();
    set((state) => {
      const history = [...state.screenHistory];
      const prevScreen = history.pop() || 'home';
      return {
        currentScreen: prevScreen,
        screenHistory: history,
      };
    });
  },

  selectMode: (mode) => {
    MindLockHaptics.buttonTap();
    MindLockAudio.playButton();
    set({ selectedMode: mode });
  },

  startLevel: (levelId) => {
    const targetLvl = get().levels.find((l) => l.id === levelId);
    if (targetLvl && targetLvl.status === 'locked') return; // Cannot start locked level
    set({ activeLevelId: levelId, selectedMode: 'classic' });
    get().startGame('classic');
  },

  startGame: (mode) => {
    const chosenMode = mode || get().selectedMode;
    const initialPad: PadColor = ['red', 'blue', 'green', 'yellow'][Math.floor(Math.random() * 4)] as PadColor;
    
    // If starting classic mode without explicit active level, default to the player's current level
    let levelToPlay = get().activeLevelId;
    if (chosenMode === 'classic' && !levelToPlay) {
      const currentLvl = get().levels.find((l) => l.status === 'current') || get().levels[0];
      levelToPlay = currentLvl ? currentLvl.id : 1;
    }

    set({
      selectedMode: chosenMode,
      activeLevelId: chosenMode === 'classic' ? levelToPlay : null,
      round: 1,
      score: 0,
      currentStreak: 0,
      sequence: [initialPad],
      playerInput: [],
      activePad: null,
      gameStatus: 'PLAYING_SEQUENCE',
      currentScreen: 'gameplay',
    });
  },

  setGameStatus: (status) => set({ gameStatus: status }),
  setActivePad: (pad) => set({ activePad: pad }),

  recordPlayerTap: (pad) => {
    const { sequence, playerInput, round, score, currentStreak, selectedMode, advanceRound, failRound } = get();
    
    MindLockAudio.playPad(pad);
    MindLockHaptics.padTap();
    set({ activePad: pad });
    setTimeout(() => {
      if (get().activePad === pad) set({ activePad: null });
    }, 200);

    const nextInput = [...playerInput, pad];
    set({ playerInput: nextInput });

    const expectedIndex = playerInput.length;
    // In reverse mode, compare with reversed sequence
    const targetSequence = selectedMode === 'reverse' ? [...sequence].reverse() : sequence;
    const expectedPad = targetSequence[expectedIndex];

    if (pad !== expectedPad) {
      failRound();
      return;
    }

    if (nextInput.length === sequence.length) {
      // Completed full sequence!
      advanceRound();
    }
  },

  advanceRound: () => {
    const { sequence, round, score, currentStreak, profile, stats, activeLevelId, levels, challenges, achievements } = get();
    const newStreak = currentStreak + 1;
    const roundBonus = 50 * round;
    const streakBonus = newStreak * 20;
    const newScore = score + roundBonus + streakBonus;
    const nextPad: PadColor = ['red', 'blue', 'green', 'yellow'][Math.floor(Math.random() * 4)] as PadColor;
    
    MindLockAudio.playCorrect();
    MindLockHaptics.success();

    const newBestScore = Math.max(stats.bestScore, newScore);
    const newHighestRound = Math.max(stats.highestRound, round);
    const newBestStreak = Math.max(stats.bestStreak, newStreak);

    // XP and Coins rewards
    let newXp = profile.xp + 25;
    let newLevel = profile.level;
    let newXpNextLevel = profile.xpNextLevel;
    if (newXp >= newXpNextLevel) {
      newXp = newXp - newXpNextLevel;
      newLevel += 1;
      newXpNextLevel = Math.floor(newXpNextLevel * 1.5);
    }
    const newCoins = profile.coins + 10;

    // Check if player completed an active level
    const currentLevel = activeLevelId ? levels.find((l) => l.id === activeLevelId) : null;
    const isLevelWon = currentLevel && round >= currentLevel.targetRounds;

    if (isLevelWon && currentLevel) {
      // Level Completed!
      MindLockAudio.playVictory();
      MindLockHaptics.victory();

      const earnedStars = newStreak >= currentLevel.targetRounds ? 3 : 2;
      const updatedLevels = levels.map((lvl) => {
        if (lvl.id === currentLevel.id) {
          return { ...lvl, status: 'completed' as const, stars: Math.max(lvl.stars, earnedStars) };
        }
        if (lvl.id === currentLevel.id + 1 && lvl.status === 'locked') {
          return { ...lvl, status: 'current' as const };
        }
        return lvl;
      });

      // Update achievements
      const updatedAchievements = achievements.map((ac) => {
        if (ac.id === 'ac-1') return { ...ac, current: 1, unlocked: true }; // First Steps
        if (ac.id === 'ac-2' && round >= 10) return { ...ac, current: Math.max(ac.current, round), unlocked: true };
        if (ac.id === 'ac-11' && newStreak >= 3) return { ...ac, current: Math.max(ac.current, newStreak), unlocked: true };
        return ac;
      });

      // Update challenges
      const updatedChallenges = challenges.map((ch) => {
        if (ch.id === 'ch-memory') {
          const nextVal = Math.min(ch.target, ch.current + 1);
          return { ...ch, current: nextVal, completed: nextVal >= ch.target };
        }
        return ch;
      });

      set({
        round: round,
        score: newScore + 100, // Level victory bonus
        currentStreak: newStreak,
        gameStatus: 'VICTORY',
        currentScreen: 'victory',
        levels: updatedLevels,
        achievements: updatedAchievements,
        challenges: updatedChallenges,
        profile: {
          ...profile,
          level: newLevel,
          xp: newXp + 50,
          xpNextLevel: newXpNextLevel,
          coins: newCoins + 50,
        },
        stats: {
          ...stats,
          bestScore: Math.max(newBestScore, newScore + 100),
          highestRound: newHighestRound,
          bestStreak: newBestStreak,
          totalGames: stats.totalGames + 1,
        },
      });

      get().savePersistedData();
      return;
    }

    // Normal round advance
    set({
      round: round + 1,
      score: newScore,
      currentStreak: newStreak,
      sequence: [...sequence, nextPad],
      playerInput: [],
      gameStatus: 'CORRECT',
      currentScreen: 'correct',
      profile: {
        ...profile,
        level: newLevel,
        xp: newXp,
        xpNextLevel: newXpNextLevel,
        coins: newCoins,
      },
      stats: {
        ...stats,
        bestScore: newBestScore,
        highestRound: newHighestRound,
        bestStreak: newBestStreak,
      },
    });

    get().savePersistedData();
  },

  failRound: () => {
    const { score, stats, round } = get();
    MindLockAudio.playWrong();
    MindLockHaptics.error();

    const newTotalGames = stats.totalGames + 1;
    const calcAccuracy = Math.min(100, Math.max(20, Math.round((round / (round + 1)) * 100)));

    set({
      gameStatus: 'GAME_OVER',
      currentScreen: 'game-over',
      stats: {
        ...stats,
        totalGames: newTotalGames,
        highestRound: Math.max(stats.highestRound, round),
        accuracy: stats.totalGames === 0 ? calcAccuracy : Math.round((stats.accuracy + calcAccuracy) / 2),
      },
    });

    get().savePersistedData();
  },

  pauseGame: () => {
    set({ gameStatus: 'PAUSED', currentScreen: 'pause' });
  },

  resumeGame: () => {
    set({ gameStatus: 'PLAYER_TURN', currentScreen: 'gameplay' });
  },

  restartGame: () => {
    get().startGame();
  },

  exitGame: () => {
    set({ gameStatus: 'IDLE', currentScreen: 'home' });
  },


  updateSettings: (partial) => {
    set((state) => {
      const newSettings = { ...state.settings, ...partial };
      MindLockAudio.setSoundEnabled(newSettings.soundEffects);
      MindLockAudio.setMusicEnabled(newSettings.backgroundMusic);
      MindLockAudio.setMusicVolume(newSettings.bgMusicVolume);
      MindLockHaptics.setEnabled(newSettings.hapticFeedback);
      return { settings: newSettings };
    });
    get().savePersistedData();
  },

  resetProgress: () => {
    set({
      profile: INITIAL_PROFILE,
      stats: INITIAL_STATS,
      levels: INITIAL_LEVELS,
      daily: INITIAL_DAILY,
      challenges: INITIAL_CHALLENGES,
      achievements: INITIAL_ACHIEVEMENTS,
    });
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  },

  loadPersistedData: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.profile) set({ profile: parsed.profile });
        if (parsed.stats) set({ stats: parsed.stats });
        if (parsed.settings) {
          set({ settings: parsed.settings });
          MindLockAudio.setSoundEnabled(parsed.settings.soundEffects);
          MindLockHaptics.setEnabled(parsed.settings.hapticFeedback);
        }
        if (parsed.levels) set({ levels: parsed.levels });
        if (parsed.daily) set({ daily: parsed.daily });
        if (parsed.challenges) set({ challenges: parsed.challenges });
        if (parsed.achievements) set({ achievements: parsed.achievements });
      }
    } catch {}
  },

  savePersistedData: async () => {
    try {
      const state = get();
      const payload = {
        profile: state.profile,
        stats: state.stats,
        settings: state.settings,
        levels: state.levels,
        daily: state.daily,
        challenges: state.challenges,
        achievements: state.achievements,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  },

  showRewardModal: (reward) => {
    MindLockAudio.playUnlock();
    MindLockHaptics.victory();
    set({ unlockedReward: reward, currentScreen: 'reward' });
  },

  dismissRewardModal: () => {
    set({ unlockedReward: null, currentScreen: 'levels' });
  },

  finishOnboarding: () => {
    set({ hasSeenOnboarding: true, currentScreen: 'home' });
  },
}));
