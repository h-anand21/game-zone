// ============================================================
// GameHub — Shared Contracts: Games
// ============================================================

import type { GameCategory, GameStatus } from '../game-ids/games';

/** Game as returned by the API. */
export interface GameResponse {
  id: string;
  slug: string;
  name: string;
  category: GameCategory;
  isOffline: boolean;
  isMultiplayer: boolean;
  isActive: boolean;
}

/** Score submission from client. */
export interface ScoreSubmitRequest {
  gameId: string;
  score: number;
  duration: number;  // seconds
  gameVersion: string;
  scoreVersion: string;
  metadata?: Record<string, unknown>;
  /** Client-generated UUID for idempotency. */
  eventId: string;
}

export interface ScoreResponse {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  duration: number;
  gameVersion: string;
  scoreVersion: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

/** Game stats for a user + game combination. */
export interface GameStatsResponse {
  gameId: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  bestScore: number;
  totalScore: number;
}
