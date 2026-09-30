// ============================================================
// Find One — Type Definitions
// ============================================================

export type CategoryType = 'animals' | 'clothes' | 'food' | 'vehicles' | 'characters';

export type GridSize = 4 | 5 | 6;

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'extreme';

export type FindOneScreen =
  | 'home'
  | 'how-to-play'
  | 'gameplay'
  | 'game-over'
  | 'new-best';

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export interface CharacterAsset {
  id: string;
  name: string;
  category: CategoryType;
  emoji: string;
  color?: string;
  accessory?: string;
}

export interface CharacterPair {
  id: string;
  category: CategoryType;
  base: CharacterAsset;
  odd: CharacterAsset;
  description: string;
  difficulty: DifficultyLevel;
}

export interface TileItem {
  id: number;
  characterId: string;
  name: string;
  emoji: string;
  color?: string;
  isOdd: boolean;
  highlighted?: boolean;
}

export interface RoundData {
  gridSize: GridSize;
  tiles: TileItem[];
  oddIndex: number;
  baseName: string;
  oddName: string;
  category: CategoryType;
  targetDescription: string;
}

export interface PlayerStats {
  bestScore: number;
  bestTimeSeconds: number;
  bestStreak: number;
  totalGames: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  coins: number;
  rank: number;
}

export interface GameSettings {
  soundEffects: boolean;
  hapticFeedback: boolean;
}
