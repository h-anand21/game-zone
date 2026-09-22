// ============================================================
// GameHub — Casual Multiplayer Protocol: WebSocket Events
// ============================================================
// These types define the WebSocket message protocol between
// the mobile app and the backend casual multiplayer server.
// Used for: TicTacToe, RPS, Quiz Battle, Guess the Drawing

// ── Client → Server Events ──────────────────────────────────

export interface CasualCreateRoomEvent {
  type: 'CREATE_ROOM';
  gameId: string;
  playerName: string;
  maxPlayers: number;
}

export interface CasualJoinRoomEvent {
  type: 'JOIN_ROOM';
  roomCode: string;
  playerName: string;
}

export interface CasualLeaveRoomEvent {
  type: 'LEAVE_ROOM';
  roomCode: string;
}

export interface CasualMakeMoveEvent {
  type: 'MAKE_MOVE';
  roomCode: string;
  move: Record<string, unknown>;
}

export interface CasualGameOverEvent {
  type: 'GAME_OVER';
  roomCode: string;
  winnerId?: string;
}

export interface CasualChatEvent {
  type: 'CHAT';
  roomCode: string;
  message: string;
}

export type CasualClientEvent =
  | CasualCreateRoomEvent
  | CasualJoinRoomEvent
  | CasualLeaveRoomEvent
  | CasualMakeMoveEvent
  | CasualGameOverEvent
  | CasualChatEvent;

// ── Server → Client Events ──────────────────────────────────

export interface CasualRoomCreatedEvent {
  type: 'ROOM_CREATED';
  room: CasualRoomState;
}

export interface CasualRoomJoinedEvent {
  type: 'ROOM_JOINED';
  room: CasualRoomState;
}

export interface CasualPlayerJoinedEvent {
  type: 'PLAYER_JOINED';
  player: CasualPlayer;
  room: CasualRoomState;
}

export interface CasualPlayerLeftEvent {
  type: 'PLAYER_LEFT';
  playerId: string;
  room: CasualRoomState;
}

export interface CasualMoveMadeEvent {
  type: 'MOVE_MADE';
  playerId: string;
  move: Record<string, unknown>;
}

export interface CasualGameResultEvent {
  type: 'GAME_RESULT';
  winnerId: string | null;
  reason: 'win' | 'draw' | 'forfeit' | 'timeout';
}

export interface CasualRoomClosedEvent {
  type: 'ROOM_CLOSED';
  reason: string;
}

export interface CasualChatMessageEvent {
  type: 'CHAT_MESSAGE';
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
}

export interface CasualErrorEvent {
  type: 'ERROR';
  code: string;
  message: string;
}

export type CasualServerEvent =
  | CasualRoomCreatedEvent
  | CasualRoomJoinedEvent
  | CasualPlayerJoinedEvent
  | CasualPlayerLeftEvent
  | CasualMoveMadeEvent
  | CasualGameResultEvent
  | CasualRoomClosedEvent
  | CasualChatMessageEvent
  | CasualErrorEvent;

// ── Shared Types ────────────────────────────────────────────

export interface CasualPlayer {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: number;
}

export interface CasualRoomState {
  code: string;
  gameId: string;
  state: 'WAITING' | 'PLAYING' | 'FINISHED';
  maxPlayers: number;
  players: CasualPlayer[];
  createdAt: number;
}
