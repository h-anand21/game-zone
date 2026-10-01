// ============================================================
// REVERSE MIND — Core TypeScript Definitions & Models
// ============================================================

export type GameMode = 'classic' | 'quick-flip' | 'mind-shift' | 'daily-flip' | 'practice';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export type InGamePhase =
  | 'idle'
  | 'countdown'
  | 'memory'
  | 'flipping'
  | 'input'
  | 'mindShift'
  | 'feedback'
  | 'levelComplete'
  | 'gameResult';

export type AppNavScreen =
  | 'splash'
  | 'welcome'
  | 'how-it-works'
  | 'avatar'
  | 'home'
  | 'modes'
  | 'difficulty'
  | 'rule-preview'
  | 'ready'
  | 'gameplay'
  | 'level-complete'
  | 'game-result'
  | 'rewards'
  | 'daily'
  | 'stats'
  | 'achievements'
  | 'collection'
  | 'profile'
  | 'practice'
  | 'settings';

export type ObjectCategory =
  | 'animal'
  | 'food'
  | 'vehicle'
  | 'nature'
  | 'toy'
  | 'object'
  | 'expression'
  | 'number';

export type ObjectColor =
  | 'red'
  | 'gold'
  | 'blue'
  | 'cyan'
  | 'green'
  | 'purple'
  | 'orange';

export type MemoryObjectState =
  | 'idle'
  | 'highlight'
  | 'selected'
  | 'correct'
  | 'wrong'
  | 'hidden'
  | 'disabled'
  | 'flipping';

export interface GameObject {
  id: string;
  category: ObjectCategory;
  name: string;
  symbol: string;
  color: ObjectColor;
  hexColor: string;
  borderColor: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description?: string;
}

export interface SequenceItem {
  uid: string;
  object: GameObject;
  originalIndex: number;
  expectedReverseIndex: number;
  isHighlighted?: boolean;
}

export type MindShiftRuleType =
  | 'none'
  | 'ignore_red'
  | 'ignore_category'
  | 'reverse_only_highlighted'
  | 'start_middle'
  | 'color_inversion';

export interface MindShiftRule {
  id: MindShiftRuleType;
  title: string;
  subtitle: string;
  instruction: string;
  ruleTag: string;
  badgeColor: string;
  ignoredCategory?: ObjectCategory;
  description: string;
}

export interface RoundConfig {
  sequenceLength: number;
  displayDurationMs: number;
  inputTimeoutMs: number;
  maxMistakes: number;
  gridDecoyCount: number;
  mindShiftRule: MindShiftRule;
}

export interface PlayerStats {
  level: number;
  xp: number;
  coins: number;
  gems: number;
  gamesPlayed: number;
  totalCorrect: number;
  totalWrong: number;
  bestCombo: number;
  streakDays: number;
  classicBest: number;
  quickFlipBest: number;
  mindShiftBest: number;
  dailyStreak: number;
  lastDailyDate: string;
  selectedAvatar: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  progress: number;
  goal: number;
  unlocked: boolean;
  rewardCoins: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CollectibleItem {
  id: string;
  category: 'character' | 'theme' | 'avatar' | 'badge';
  name: string;
  preview: string;
  unlocked: boolean;
  equipped: boolean;
  costCoins?: number;
  costGems?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  particlesEnabled: boolean;
  speedMultiplier: number;
}
