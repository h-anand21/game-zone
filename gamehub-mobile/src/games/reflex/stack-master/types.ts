// ============================================================
// STACK MASTER — Core TypeScript Types & Models
// ============================================================

export type ScreenId =
  | 'splash'
  | 'intro'
  | 'home'
  | 'mode-select'
  | 'tutorial'
  | 'tower-themes'
  | 'gameplay'
  | 'pause'
  | 'results'
  | 'personal-best'
  | 'stats'
  | 'daily-challenge'
  | 'collection'
  | 'profile'
  | 'settings'
  | 'run-breakdown';

export type GameMode = 'classic' | 'zen' | 'rush' | 'precision' | 'daily';

export interface TowerBlock {
  id: number;
  x: number; // Percentage 0 - 100
  width: number; // Percentage 0 - 100
  y: number; // Layer index (0 is base)
  color: string;
  isPerfect?: boolean;
}

export interface FallingPiece {
  id: string;
  x: number;
  width: number;
  y: number;
  color: string;
  direction: 'left' | 'right';
}

export interface PlacementResult {
  type: 'perfect' | 'good' | 'miss';
  survivingX: number;
  survivingWidth: number;
  cutX?: number;
  cutWidth?: number;
  cutDirection?: 'left' | 'right';
  bonusPoints: number;
}

export interface RunRecord {
  id: string;
  date: string;
  mode: GameMode;
  score: number;
  height: number;
  maxCombo: number;
  perfectPlacements: number;
  partialPlacements: number;
  totalPlacements: number;
  accuracy: number;
  durationSeconds: number;
  themeId: string;
  isNewBest: boolean;
}

export interface TowerTheme {
  id: string;
  name: string;
  description: string;
  icon: string;
  primaryColor: string;
  accentColor: string;
  unlocked: boolean;
  unlockRequirement: string;
  bgKey: 'gameplay' | 'home' | 'sunrise';
}

export interface BlockCosmetic {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  colors: [string, string];
  unlocked: boolean;
  unlockRequirement: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  rewardCoins: number;
  completed: boolean;
  claimed: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  completed: boolean;
  claimed: boolean;
}

export interface UserSettings {
  sound: boolean;
  music: boolean;
  haptics: boolean;
  assistMode: boolean;
  reducedMotion: boolean;
}

export interface StackGameState {
  // Currencies & Progression
  coins: number;
  crystals: number;
  playerLevel: number;
  playerXp: number;
  playerTitle: string;

  // Best Records
  bestScore: number;
  bestHeight: number;
  highestCombo: number;
  totalRuns: number;
  totalPlacements: number;
  totalPerfects: number;
  totalPlayTimeSeconds: number;

  // Mode Records
  modeBest: Record<GameMode, { score: number; height: number }>;

  // Unlocked content
  selectedThemeId: string;
  selectedCosmeticId: string;
  unlockedThemes: string[];
  unlockedCosmetics: string[];

  // Settings
  settings: UserSettings;

  // Onboarding
  introCompleted: boolean;

  // Daily Challenge & Streak
  dailyStreak: number;
  lastDailyDate: string;
  dailyChallengeCompleted: boolean;

  // History & Missions
  runHistory: RunRecord[];
  missions: DailyMission[];
  achievements: AchievementItem[];
}
