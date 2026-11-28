// ============================================================
// Worms Zone 3D Arena — Core Types & Physics Contracts
// ============================================================

export type WormSkinId =
  | 'violet'
  | 'crimson'
  | 'obsidian'
  | 'steampunk'
  | 'emerald'
  | 'gold';

export type FoodKind =
  | 'cherry'
  | 'apple'
  | 'corn'
  | 'broccoli'
  | 'tomato'
  | 'mushroom'
  | 'kiwi'
  | 'cheese'
  | 'pumpkin'
  | 'cake'
  | 'sandwich'
  | 'coin';

export type BoosterType = 'magnet' | 'turbo' | 'scope';

export type ArenaMode = 'infinity' | 'time_rush' | 'treasure';

export interface Vec2 {
  x: number;
  y: number;
}

export interface WormSkinConfig {
  id: WormSkinId;
  name: string;
  cost: number;
  primary: string;
  highlight: string;
  shadow: string;
  stripeColor: string;
  stripeEvery: number;
  mouthColor: string;
  isMetallic?: boolean;
}

export interface WormEntity {
  id: string;
  name: string;
  isPlayer: boolean;
  skinId: WormSkinId;
  /** Ordered front-to-back segment centers (index 0 = head) */
  segments: Vec2[];
  angle: number;
  targetAngle: number;
  weight: number;
  radius: number;
  isBoosting: boolean;
  isEatingUntil: number;
  kills: number;
  alive: boolean;
  /** Internal smooth AI steering timer / target */
  aiTurnCooldown: number;
  aiDesiredAngle: number;
}

export interface FoodItem {
  id: string;
  x: number;
  y: number;
  kind: FoodKind;
  weightValue: number;
  coinValue: number;
  scale: number;
  isLootDrop: boolean;
}

export interface FloatingGainPopup {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  ageMs: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  weight: number;
  isPlayer: boolean;
}

export interface ActiveBoosterTimers {
  magnetMs: number;
  turboMs: number;
  scopeMs: number;
}

export interface ArenaState {
  mode: ArenaMode;
  arenaRadius: number;
  elapsedMs: number;
  timeRemainingMs: number;
  player: WormEntity;
  bots: WormEntity[];
  foods: FoodItem[];
  popups: FloatingGainPopup[];
  boosters: ActiveBoosterTimers;
  coinsCollectedThisRun: number;
  currentGoalWeight: number;
  goalTierIndex: number;
  chestsOpenedThisRun: number;
  /** Simulated background rank pool so Top Players shows 120+ arena competitors */
  ambientRivals: { id: string; name: string; baseWeight: number; growthRate: number }[];
  gameOver: boolean;
  deathReason: 'wall' | 'enemy' | 'time_up' | null;
  killedByName?: string;
}

export interface PersistentWormSave {
  coins: number;
  bestWeight: number;
  bestKills: number;
  selectedSkin: WormSkinId;
  unlockedSkins: WormSkinId[];
  boosterInventory: Record<BoosterType, number>;
}
