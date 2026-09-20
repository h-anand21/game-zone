// ============================================================
// GameHub — FPS Protocol: Realtime Events
// ============================================================
// These types define the WebSocket message protocol between
// the Unity FPS client and the FPS realtime server.

// ── Client → Server Events ──────────────────────────────────

export interface ClientAuthEvent {
  type: 'auth';
  token: string;
}

export interface ClientJoinRoomEvent {
  type: 'join_room';
  roomId: string;
}

export interface ClientInputEvent {
  type: 'input';
  sequence: number;
  timestamp: number;
  moveX: number;
  moveZ: number;
  lookX: number;
  lookY: number;
  jump: boolean;
  crouch: boolean;
  fire: boolean;
  reload: boolean;
  weaponSlot: number;
}

export interface ClientLeaveEvent {
  type: 'leave';
}

export type ClientEvent =
  | ClientAuthEvent
  | ClientJoinRoomEvent
  | ClientInputEvent
  | ClientLeaveEvent;

// ── Server → Client Events ──────────────────────────────────

export interface ServerAuthResultEvent {
  type: 'auth_result';
  success: boolean;
  playerId?: string;
  error?: string;
}

export interface ServerStateSnapshotEvent {
  type: 'state_snapshot';
  tick: number;
  timestamp: number;
  players: PlayerSnapshot[];
}

export interface PlayerSnapshot {
  playerId: string;
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  health: number;
  weapon: string;
  isAlive: boolean;
  isCrouching: boolean;
}

export interface ServerHitConfirmEvent {
  type: 'hit_confirm';
  targetId: string;
  damage: number;
  isKill: boolean;
  weaponId: string;
}

export interface ServerPlayerKilledEvent {
  type: 'player_killed';
  killerId: string;
  victimId: string;
  weaponId: string;
}

export interface ServerPlayerRespawnEvent {
  type: 'player_respawn';
  playerId: string;
  posX: number;
  posY: number;
  posZ: number;
}

export interface ServerMatchStartEvent {
  type: 'match_start';
  matchId: string;
  mapId: string;
  gameMode: string;
  duration: number; // seconds
}

export interface ServerMatchEndEvent {
  type: 'match_end';
  matchId: string;
  results: {
    playerId: string;
    kills: number;
    deaths: number;
    score: number;
    position: number;
    result: 'win' | 'loss' | 'draw';
  }[];
}

export interface ServerPlayerDisconnectedEvent {
  type: 'player_disconnected';
  playerId: string;
}

export interface ServerPlayerReconnectedEvent {
  type: 'player_reconnected';
  playerId: string;
}

export interface ServerErrorEvent {
  type: 'error';
  code: string;
  message: string;
}

export type ServerEvent =
  | ServerAuthResultEvent
  | ServerStateSnapshotEvent
  | ServerHitConfirmEvent
  | ServerPlayerKilledEvent
  | ServerPlayerRespawnEvent
  | ServerMatchStartEvent
  | ServerMatchEndEvent
  | ServerPlayerDisconnectedEvent
  | ServerPlayerReconnectedEvent
  | ServerErrorEvent;
