// ============================================================
// Mind Lock — Type Definitions
// ============================================================

export type PadColor = 'red' | 'blue' | 'green' | 'yellow';

export type GameMode =
  | 'classic'
  | 'speed'
  | 'endless'
  | 'daily'
  | 'reverse'
  | 'chaos';

export type GameStatus =
  | 'IDLE'
  | 'PLAYING_SEQUENCE'
  | 'PLAYER_TURN'
  | 'CORRECT'
  | 'WRONG'
  | 'PAUSED'
  | 'GAME_OVER'
  | 'VICTORY';

export type MindLockScreen =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'modes'
  | 'gameplay'
  | 'correct'
  | 'game-over'
  | 'victory'
  | 'levels'
  | 'daily'
  | 'challenges'
  | 'achievements'
  | 'profile'
  | 'statistics'
  | 'settings'
  | 'pause'
  | 'reward';

export interface PadConfig {
  id: PadColor;
  color: string;
  activeColor: string;
  glowColor: string;
  soundFreq: number;
  label: string;
  symbol: 'lightning' | 'waves' | 'leaf' | 'star';
}

export interface LevelData {
  id: number;
  worldId: number;
  levelNumber: number;
  title: string;
  targetRounds: number;
  stars: number; // 0, 1, 2, 3
  status: 'completed' | 'current' | 'available' | 'locked';
}

export interface WorldData {
  id: number;
  name: string;
  theme: string;
  totalLevels: number;
  completedLevels: number;
  unlocked: boolean;
}

export type ChallengeCategory = 'all' | 'memory' | 'speed' | 'streak' | 'mastery';

export interface ChallengeData {
  id: string;
  category: 'memory' | 'speed' | 'streak' | 'mastery';
  title: string;
  description: string;
  current: number;
  target: number;
  rewardType: 'coins' | 'xp' | 'badge' | 'chest';
  rewardAmount: number | string;
  completed: boolean;
  claimed: boolean;
}

export type AchievementGroup = 'gameplay' | 'speed' | 'streak' | 'mastery' | 'special';

export interface AchievementData {
  id: string;
  group: AchievementGroup;
  title: string;
  description: string;
  current: number;
  target: number;
  unlocked: boolean;
  badgeLevel?: number;
}

export interface HistoryRecord {
  date: string;
  round: number;
  score: number;
  mode: GameMode;
}

export interface PlayerStats {
  bestScore: number;
  highestRound: number;
  accuracy: number;
  totalGames: number;
  bestStreak: number;
  totalPlayTimeSeconds: number;
  roundDistribution: {
    '1-5': number;
    '6-10': number;
    '11-15': number;
    '16-20': number;
    '20+': number;
  };
  modeAccuracy: {
    classic: number;
    speed: number;
    streak: number;
    pattern: number;
  };
  performanceHistory: { date: string; rounds: number }[];
}

export interface PlayerProfile {
  name: string;
  level: number;
  xp: number;
  xpNextLevel: number;
  coins: number;
  avatar: string;
}

export interface GameSettings {
  soundEffects: boolean;
  backgroundMusic: boolean;
  bgMusicVolume: number; // 0.0 - 1.0
  hapticFeedback: boolean;
  notifications: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface DailyChallengeState {
  dateString: string;
  targetRounds: number;
  currentStreak: number;
  dailyScore: number;
  completed: boolean;
  claimed3: boolean;
  claimed5: boolean;
  claimed8: boolean;
  claimed10: boolean;
}
