// ============================================================
// Number Rush — Core Type Definitions
// ============================================================

export type GameModeId =
  | 'quick-rush'
  | 'animal-count'
  | 'emoji-count'
  | 'number-box'
  | 'mixed-rush';

export type CategoryId = 'rush' | 'think' | 'observe' | 'puzzle';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ScreenId =
  | 'home'
  | 'mode-hub'
  | 'countdown'
  | 'gameplay'
  | 'level-complete'
  | 'leaderboard'
  | 'profile'
  | 'achievements'
  | 'settings'
  | 'how-to-play'
  | 'daily-rush';

export type AnimalType =
  | 'tiger'
  | 'lion'
  | 'monkey'
  | 'elephant'
  | 'giraffe'
  | 'zebra';

export interface AnimalItem {
  id: string;
  type: AnimalType;
  xPercent: number; // 5% to 85%
  yPercent: number; // 10% to 75%
  scale: number;
  flipHorizontal: boolean;
  isTarget: boolean;
}

export interface EmojiGridItem {
  id: string;
  char: string;
  name: string;
  isTarget: boolean;
}

export interface NumberBoxCell {
  row: number;
  col: number;
  val: number | null; // null represents the missing "?" cell
  isTarget: boolean;
}

export interface QuestionData {
  id: string;
  mode: GameModeId;
  subType?: string;
  questionText: string;
  badgeText?: string;
  options: (number | string)[];
  correctAnswer: number | string;
  timeLimit: number;
  isSpecialRound?: boolean;
  specialRoundMultiplier?: number;
  animalData?: {
    targetAnimal: AnimalType;
    animals: AnimalItem[];
    targetCount: number;
  };
  emojiData?: {
    targetChar: string;
    targetName: string;
    items: EmojiGridItem[];
    gridCols: number;
    targetCount: number;
  };
  numberBoxData?: {
    grid: NumberBoxCell[];
    size: 3;
    ruleDescription: string;
  };
  quickRushData?: {
    expression: string;
    hint?: string;
  };
}

export type PowerUpType = 'freeze' | 'eliminate' | 'time' | 'hint';

export interface PowerUpState {
  freeze: number;
  eliminate: number;
  time: number;
  hint: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  totalScore: number;
  bestScore: number;
  maxCombo: number;
  accuracy: number;
  totalCorrect: number;
  totalWrong: number;
  coins: number;
  gems: number;
  level: number;
  xp: number;
  dailyStreak: number;
  lastDailyClaimDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  category: string;
  current: number;
  max: number;
  unlocked: boolean;
  rewardCoins: number;
}

export interface GameSettings {
  soundEffects: boolean;
  backgroundMusic: boolean;
  hapticFeedback: boolean;
  bgVolume: number;
}

export interface ModeConfig {
  id: GameModeId;
  name: string;
  category: CategoryId;
  badge: string;
  tagline: string;
  icon: string;
  themeColor: string;
  secondaryColor: string;
  cardGradient: [string, string];
  description: string;
  starRequirement: number;
}

export interface CategoryConfig {
  id: CategoryId;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  gradient: [string, string];
  modes: GameModeId[];
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  score: number;
  combo: number;
  mode: string;
  isCurrentUser?: boolean;
  countryBadge: string;
}
