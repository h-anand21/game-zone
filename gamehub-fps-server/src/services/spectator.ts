// ============================================================
// GameHub FPS Server — Spectator Mode
// Allows joining a match as a spectator (read-only state stream)
// ============================================================

import { WebSocket } from 'ws';
import { logger } from '../utils/logger.js';

export interface Spectator {
  id: string;
  ws: WebSocket;
  matchId: string;
  followingPlayerId: string | null;
  joinedAt: number;
}

/** Active spectators per match */
const spectators = new Map<string, Map<string, Spectator>>();

/**
 * Add a spectator to a match
 */
export function addSpectator(matchId: string, spectatorId: string, ws: WebSocket): Spectator {
  if (!spectators.has(matchId)) {
    spectators.set(matchId, new Map());
  }

  const spec: Spectator = {
    id: spectatorId,
    ws,
    matchId,
    followingPlayerId: null,
    joinedAt: Date.now(),
  };

  spectators.get(matchId)!.set(spectatorId, spec);
  logger.info(`[Spectator] ${spectatorId} joined match ${matchId}`);

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'SPECTATOR_JOINED',
    matchId,
    message: 'Connected as spectator. Use FOLLOW_PLAYER to follow a specific player.',
  }));

  return spec;
}

/**
 * Remove a spectator
 */
export function removeSpectator(matchId: string, spectatorId: string): void {
  const matchSpecs = spectators.get(matchId);
  if (matchSpecs) {
    matchSpecs.delete(spectatorId);
    if (matchSpecs.size === 0) {
      spectators.delete(matchId);
    }
  }
  logger.info(`[Spectator] ${spectatorId} left match ${matchId}`);
}

/**
 * Set which player a spectator is following
 */
export function followPlayer(matchId: string, spectatorId: string, playerId: string): void {
  const matchSpecs = spectators.get(matchId);
  const spec = matchSpecs?.get(spectatorId);
  if (spec) {
    spec.followingPlayerId = playerId;
    spec.ws.send(JSON.stringify({
      type: 'FOLLOWING_PLAYER',
      playerId,
    }));
  }
}

/**
 * Broadcast game state to all spectators of a match
 * Called every network tick (20Hz)
 */
export function broadcastToSpectators(matchId: string, gameState: any): void {
  const matchSpecs = spectators.get(matchId);
  if (!matchSpecs || matchSpecs.size === 0) return;

  const payload = JSON.stringify({
    type: 'SPECTATOR_STATE',
    state: gameState,
    timestamp: Date.now(),
  });

  matchSpecs.forEach((spec) => {
    if (spec.ws.readyState === WebSocket.OPEN) {
      try {
        spec.ws.send(payload);
      } catch {
        // Connection error — will be cleaned up on close
      }
    }
  });
}

/**
 * Send kill feed events to spectators
 */
export function sendKillFeedToSpectators(matchId: string, killEvent: {
  killerId: string;
  killerName: string;
  victimId: string;
  victimName: string;
  weapon: string;
  isHeadshot: boolean;
}): void {
  const matchSpecs = spectators.get(matchId);
  if (!matchSpecs || matchSpecs.size === 0) return;

  const payload = JSON.stringify({
    type: 'SPECTATOR_KILL_FEED',
    event: killEvent,
  });

  matchSpecs.forEach((spec) => {
    if (spec.ws.readyState === WebSocket.OPEN) {
      try { spec.ws.send(payload); } catch { /* ignored */ }
    }
  });
}

/**
 * Notify spectators when match ends
 */
export function notifyMatchEnd(matchId: string, results: any): void {
  const matchSpecs = spectators.get(matchId);
  if (!matchSpecs) return;

  const payload = JSON.stringify({
    type: 'SPECTATOR_MATCH_END',
    results,
  });

  matchSpecs.forEach((spec) => {
    if (spec.ws.readyState === WebSocket.OPEN) {
      try { spec.ws.send(payload); } catch { /* ignored */ }
    }
  });

  // Clean up
  spectators.delete(matchId);
  logger.info(`[Spectator] Match ${matchId} ended — all spectators removed`);
}

/**
 * Get spectator count for a match
 */
export function getSpectatorCount(matchId: string): number {
  return spectators.get(matchId)?.size || 0;
}

/**
 * Get all spectators for a match
 */
export function getSpectators(matchId: string): Spectator[] {
  const matchSpecs = spectators.get(matchId);
  return matchSpecs ? Array.from(matchSpecs.values()) : [];
}
