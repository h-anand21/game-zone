// ============================================================
// AIM RUSH — TARGET CHAIN: Types
// Strict TypeScript definitions for the entire game architecture
// ============================================================

export type GameState =
  | 'splash'
  | 'intro'
  | 'home'
  | 'mode_select'
  | 'how_to_play'
  | 'practice'
  | 'countdown'
  | 'playing'
  | 'paused'
  | 'result'
  | 'missions'
  | 'stats'
  | 'settings';

export type GameModeId = 'classic' | 'rush' | 'precision' | 'daily';

export interface GameModeConfig {
  id: GameModeId;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  durationSeconds: number;
  targetGoal?: number;
  initialLives: number;
  baseRadius: number;
  speedMultiplier: number;
  dangerChance: number;
  color: string;
}

export type TargetType = 'normal' | 'perfect' | 'moving' | 'danger' | 'decoy';

export type HitAccuracyTier = 'perfect' | 'great' | 'good' | 'miss';

export interface TargetItem {
  id: string;
  x: number;          // Center X in pixels
  y: number;          // Center Y in pixels
  radius: number;     // Hitbox radius in pixels
  type: TargetType;
  spawnedAt: number;
  lifetimeMs: number;
  expiresAt: number;
  velocityX: number;
  velocityY: number;
  points: number;
}

export type Target = TargetItem;

export interface TouchResult {
  hit: boolean;
  target?: TargetItem;
  tier?: HitAccuracyTier;
  distanceFromCenter?: number;
  accuracyPercent?: number; // 0 - 100%
  pointsAwarded?: number;
  touchX: number;
  touchY: number;
}

export interface HitEffectItem {
  id: string;
  x: number;
  y: number;
  tier: HitAccuracyTier;
  points: number;
  createdAt: number;
}

export interface ParticleItem {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export interface AimRushRunResult {
  score: number;
  mode: GameModeId;
  totalHits: number;
  perfectHits: number;
  greatHits: number;
  goodHits: number;
  misses: number;
  maxChain: number;
  accuracy: number;        // 0 - 100%
  durationMs: number;
  isNewPersonalBest: boolean;
  dateIso: string;
}

export interface AimRushUserProfile {
  personalBestScore: number;
  bestChain: number;
  totalRuns: number;
  totalTargetsHit: number;
  totalPerfects: number;
  totalMisses: number;
  totalPlayTimeSeconds: number;
  tutorialCompleted: boolean;
  lastDailyDateCompleted?: string;
}

export interface AimRushSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  reducedFx: boolean;
  graphicsQuality: 'low' | 'medium' | 'high';
}

export interface AimRushMission {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  current: number;
  target: number;
  completed: boolean;
  claimed: boolean;
}
