// ============================================================
// GameHub FPS Server — Realtime Protocol & Event Types
// ============================================================

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface PlayerInputPayload {
  sequence: number;
  timestamp: number;
  position: Vector3;
  rotation: Quaternion;
  moveInput: { x: number; y: number };
  isFiring: boolean;
  isJumping: boolean;
  isCrouching: boolean;
  selectedWeapon: string;
}

export interface PlayerSnapshot {
  id: string;
  name: string;
  position: Vector3;
  rotation: Quaternion;
  health: number;
  armor: number;
  weapon: string;
  isFiring: boolean;
  isDead: boolean;
  score: number;
  kills: number;
  deaths: number;
}

export interface RoomSnapshot {
  roomId: string;
  map: string;
  mode: string;
  state: 'WAITING' | 'COUNTDOWN' | 'ACTIVE' | 'ENDED';
  timeRemaining: number;
  players: PlayerSnapshot[];
  sequence: number;
}

export interface HitEventPayload {
  targetPlayerId: string;
  weaponId: string;
  hitPosition: Vector3;
  isHeadshot: boolean;
}

export interface DamageEventPayload {
  victimId: string;
  attackerId: string;
  damage: number;
  remainingHealth: number;
  isHeadshot: boolean;
}

export interface KillEventPayload {
  victimId: string;
  attackerId: string;
  weaponId: string;
  isHeadshot: boolean;
  attackerKills: number;
  victimDeaths: number;
}
