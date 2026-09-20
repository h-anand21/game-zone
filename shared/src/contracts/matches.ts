// ============================================================
// GameHub — Shared Contracts: Matches
// ============================================================

import type { MatchStatus } from '../enums/match-status';
import type { GameMode } from '../enums/game-mode';

/** Match as returned by the API. */
export interface MatchResponse {
  id: string;
  gameId: string;
  matchType: string;
  gameMode: GameMode | null;
  status: MatchStatus;
  startedAt: string | null;
  endedAt: string | null;
  winnerId: string | null;
  createdAt: string;
  players: MatchPlayerResponse[];
}

/** A single player's result within a match. */
export interface MatchPlayerResponse {
  userId: string;
  displayName: string;
  team: string | null;
  score: number;
  kills: number;
  deaths: number;
  position: number;
  result: 'win' | 'loss' | 'draw';
}

/** FPS match result submitted by the FPS server. */
export interface FpsMatchResultRequest {
  matchId: string;
  gameMode: GameMode;
  mapId: string;
  duration: number; // seconds
  players: FpsPlayerResult[];
}

export interface FpsPlayerResult {
  userId: string;
  team: string | null;
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  position: number;
  result: 'win' | 'loss' | 'draw';
  weaponStats: Record<string, { kills: number; hits: number; shots: number }>;
}
