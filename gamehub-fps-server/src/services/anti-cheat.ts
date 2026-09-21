// ============================================================
// GameHub FPS Server — Anti-Cheat Validator
// Server-side validation for FPS gameplay
// ============================================================

import { logger } from '../utils/logger.js';
import type { FPSPlayer } from '../game/player.js';

/** Maximum allowed speed (units/tick at 60Hz) */
const MAX_SPEED = 12;

/** Maximum teleport distance per tick */
const MAX_TELEPORT_DISTANCE = 50;

/** Minimum fire interval in ms (prevents rapid-fire hack) */
const MIN_FIRE_INTERVAL_MS = 50;

/** Maximum kills per minute before flagging */
const MAX_KILLS_PER_MINUTE = 20;

/** Maximum headshot ratio before flagging */
const SUSPICIOUS_HEADSHOT_RATIO = 0.85;

export interface AntiCheatResult {
  valid: boolean;
  reason?: string;
  severity: 'none' | 'warning' | 'kick' | 'ban';
}

interface PlayerTracker {
  userId: string;
  lastPosition: { x: number; y: number; z: number };
  lastFireTime: number;
  fireCount: number;
  killTimestamps: number[];
  headshotCount: number;
  totalShots: number;
  warnings: number;
  joinedAt: number;
}

const playerTrackers = new Map<string, PlayerTracker>();

/**
 * Initialize tracking for a new player
 */
export function initPlayerTracker(userId: string): void {
  playerTrackers.set(userId, {
    userId,
    lastPosition: { x: 0, y: 0, z: 0 },
    lastFireTime: 0,
    fireCount: 0,
    killTimestamps: [],
    headshotCount: 0,
    totalShots: 0,
    warnings: 0,
    joinedAt: Date.now(),
  });
}

/**
 * Remove tracking for a disconnected player
 */
export function removePlayerTracker(userId: string): void {
  playerTrackers.delete(userId);
}

/**
 * Validate a player's movement
 */
export function validateMovement(
  userId: string,
  newPosition: { x: number; y: number; z: number },
): AntiCheatResult {
  const tracker = playerTrackers.get(userId);
  if (!tracker) return { valid: true, severity: 'none' };

  const dx = newPosition.x - tracker.lastPosition.x;
  const dy = newPosition.y - tracker.lastPosition.y;
  const dz = newPosition.z - tracker.lastPosition.z;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Check for teleportation
  if (distance > MAX_TELEPORT_DISTANCE) {
    tracker.warnings++;
    logger.warn(`[AntiCheat] TELEPORT detected for ${userId}: distance=${distance.toFixed(1)}`);
    return {
      valid: false,
      reason: 'Teleport detected',
      severity: tracker.warnings >= 3 ? 'kick' : 'warning',
    };
  }

  // Check for speed hack
  if (distance > MAX_SPEED) {
    tracker.warnings++;
    logger.warn(`[AntiCheat] SPEEDHACK suspected for ${userId}: speed=${distance.toFixed(1)}`);
    return {
      valid: false,
      reason: 'Movement speed exceeds maximum',
      severity: tracker.warnings >= 5 ? 'kick' : 'warning',
    };
  }

  tracker.lastPosition = { ...newPosition };
  return { valid: true, severity: 'none' };
}

/**
 * Validate a fire event
 */
export function validateFire(userId: string): AntiCheatResult {
  const tracker = playerTrackers.get(userId);
  if (!tracker) return { valid: true, severity: 'none' };

  const now = Date.now();
  const timeSinceLastFire = now - tracker.lastFireTime;

  // Check for rapid fire
  if (timeSinceLastFire < MIN_FIRE_INTERVAL_MS && tracker.lastFireTime > 0) {
    tracker.warnings++;
    logger.warn(`[AntiCheat] RAPID FIRE from ${userId}: interval=${timeSinceLastFire}ms`);
    return {
      valid: false,
      reason: 'Fire rate too high',
      severity: tracker.warnings >= 5 ? 'kick' : 'warning',
    };
  }

  tracker.lastFireTime = now;
  tracker.fireCount++;
  tracker.totalShots++;
  return { valid: true, severity: 'none' };
}

/**
 * Validate a kill (track kill rate and headshot ratio)
 */
export function validateKill(userId: string, isHeadshot: boolean): AntiCheatResult {
  const tracker = playerTrackers.get(userId);
  if (!tracker) return { valid: true, severity: 'none' };

  const now = Date.now();
  tracker.killTimestamps.push(now);
  if (isHeadshot) tracker.headshotCount++;

  // Check kills per minute
  const oneMinuteAgo = now - 60000;
  const recentKills = tracker.killTimestamps.filter((t) => t > oneMinuteAgo);
  tracker.killTimestamps = recentKills;

  if (recentKills.length > MAX_KILLS_PER_MINUTE) {
    tracker.warnings += 2;
    logger.warn(`[AntiCheat] AIMBOT suspected for ${userId}: ${recentKills.length} kills/min`);
    return {
      valid: false,
      reason: 'Kill rate exceeds maximum',
      severity: tracker.warnings >= 5 ? 'kick' : 'warning',
    };
  }

  // Check headshot ratio (after enough data)
  if (tracker.totalShots > 30) {
    const hsRatio = tracker.headshotCount / tracker.totalShots;
    if (hsRatio > SUSPICIOUS_HEADSHOT_RATIO) {
      tracker.warnings++;
      logger.warn(`[AntiCheat] Suspicious headshot ratio for ${userId}: ${(hsRatio * 100).toFixed(0)}%`);
      return {
        valid: true, // Don't block, just warn
        reason: 'Unusually high headshot ratio',
        severity: 'warning',
      };
    }
  }

  return { valid: true, severity: 'none' };
}

/**
 * Get a player's warning count
 */
export function getWarnings(userId: string): number {
  return playerTrackers.get(userId)?.warnings || 0;
}

/**
 * Check if a player should be banned
 */
export function shouldBanPlayer(userId: string): boolean {
  const tracker = playerTrackers.get(userId);
  return (tracker?.warnings || 0) >= 10;
}
