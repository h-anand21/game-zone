// ============================================================
// Woodland Bubble Shooter — Core Types & Physics Contracts
// ============================================================

export type BubbleColor = 'red' | 'green' | 'blue' | 'gold' | 'teal' | 'orange';

export type PowerUpType = 'fireball' | 'lightning' | 'rainbow';

export type BubbleKind = 'normal' | 'stone' | PowerUpType;

export interface HexCoord {
  row: number;
  col: number;
}

export interface HexCell {
  id: string;
  row: number;
  col: number;
  color: BubbleColor;
  kind: BubbleKind;
  hasFirefly?: boolean;
}

export type HexGrid = (HexCell | null)[][];

export type LevelGoalType = 'clear_all' | 'rescue_fireflies';

export interface BubbleLevelConfig {
  levelNumber: number;
  worldIndex: number;
  worldName: string;
  name: string;
  subtitle: string;
  goalType: LevelGoalType;
  maxShots: number;
  starThresholds: [number, number, number];
  rows: string[];
  /** Optional initial free boosters granted on level entry */
  bonusPowerUps?: Partial<Record<PowerUpType, number>>;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
}

export interface AimRayResult {
  points: TrajectoryPoint[];
  hitCoord: HexCoord | null;
  snapCoord: HexCoord | null;
  hitCenter: TrajectoryPoint | null;
}

export interface ActiveProjectile {
  id: string;
  color: BubbleColor;
  kind: BubbleKind;
  path: TrajectoryPoint[];
  targetCoord: HexCoord;
  progressDistance: number;
  totalDistance: number;
}

export interface FallingBubble {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: BubbleColor;
  kind: BubbleKind;
  hasFirefly?: boolean;
  delayMs: number;
}

export interface PopParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export interface FloatingPopup {
  id: string;
  x: number;
  y: number;
  text: string;
  subText?: string;
  color: string;
  isCallout?: boolean;
}

export interface ShotImpactResult {
  nextGrid: HexGrid;
  poppedCells: HexCell[];
  droppedCells: HexCell[];
  rescuedCount: number;
  stonesCleared: number;
  clearedByPowerUp: boolean;
  pointsEarned: number;
  calloutText: string;
}

export interface LevelProgressStats {
  unlockedLevel: number;
  levelStars: Record<number, number>;
  highScore: number;
  powerUps: Record<PowerUpType, number>;
}
