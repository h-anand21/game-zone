// ============================================================
// AIM RUSH — Target Manager
// Spawns, bounds-checks, and updates moving targets in the arena
// ============================================================

import { TargetItem, TargetType, GameModeConfig } from '../types';
import { computeDifficulty } from './difficulty';

export interface ArenaBounds {
  width: number;
  height: number;
  safeTop: number;
  safeBottom: number;
  safeLeft: number;
  safeRight: number;
}

export function spawnTarget(
  bounds: ArenaBounds,
  mode: GameModeConfig,
  score: number,
  chain: number,
  previousTarget?: TargetItem,
  forcedType?: TargetType
): TargetItem {
  const diff = computeDifficulty(mode, score, chain);
  const radius = diff.radius;

  // Arena safe limits with padding
  const minX = bounds.safeLeft + radius + 12;
  const maxX = bounds.width - bounds.safeRight - radius - 12;
  const minY = bounds.safeTop + radius + 15;
  const maxY = bounds.height - bounds.safeBottom - radius - 18;

  const validSpanX = Math.max(20, maxX - minX);
  const validSpanY = Math.max(20, maxY - minY);

  let targetX = minX + validSpanX / 2;
  let targetY = minY + validSpanY / 2;

  // Retry up to 8 times to find position with healthy distance from previous target
  const minDistance = Math.min(180, radius * 3.5);
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidateX = minX + Math.random() * validSpanX;
    const candidateY = minY + Math.random() * validSpanY;

    if (!previousTarget) {
      targetX = candidateX;
      targetY = candidateY;
      break;
    }

    const dist = Math.hypot(candidateX - previousTarget.x, candidateY - previousTarget.y);
    if (dist >= minDistance) {
      targetX = candidateX;
      targetY = candidateY;
      break;
    }
  }

  // Determine target type
  let type: TargetType = forcedType || 'normal';
  if (!forcedType) {
    const roll = Math.random();
    if (roll < diff.dangerChance) {
      type = 'danger';
    } else if (roll < diff.dangerChance + diff.movingChance) {
      type = 'moving';
    } else if (Math.random() < 0.25) {
      type = 'perfect'; // Bonus center-ring target
    }
  }

  // Set initial velocity for moving targets
  let velocityX = 0;
  let velocityY = 0;
  if (type === 'moving') {
    const angle = Math.random() * Math.PI * 2;
    velocityX = Math.cos(angle) * diff.movingSpeed;
    velocityY = Math.sin(angle) * diff.movingSpeed;
  }

  const now = Date.now();
  return {
    id: `tgt_${now}_${Math.random().toString(36).substring(2, 6)}`,
    x: targetX,
    y: targetY,
    radius,
    type,
    spawnedAt: now,
    lifetimeMs: diff.lifetimeMs,
    expiresAt: now + diff.lifetimeMs,
    velocityX,
    velocityY,
    points: type === 'danger' ? -20 : type === 'perfect' ? 35 : 10,
  };
}

export function updateMovingTargets(
  targets: TargetItem[],
  bounds: ArenaBounds,
  deltaSeconds: number
): TargetItem[] {
  return targets.map((t) => {
    if (t.velocityX === 0 && t.velocityY === 0) return t;

    let nextX = t.x + t.velocityX * deltaSeconds;
    let nextY = t.y + t.velocityY * deltaSeconds;
    let nextVx = t.velocityX;
    let nextVy = t.velocityY;

    const minX = bounds.safeLeft + t.radius + 6;
    const maxX = bounds.width - bounds.safeRight - t.radius - 6;
    const minY = bounds.safeTop + t.radius + 8;
    const maxY = bounds.height - bounds.safeBottom - t.radius - 8;

    // Bounce horizontally
    if (nextX <= minX) {
      nextX = minX;
      nextVx = Math.abs(nextVx);
    } else if (nextX >= maxX) {
      nextX = maxX;
      nextVx = -Math.abs(nextVx);
    }

    // Bounce vertically
    if (nextY <= minY) {
      nextY = minY;
      nextVy = Math.abs(nextVy);
    } else if (nextY >= maxY) {
      nextY = maxY;
      nextVy = -Math.abs(nextVy);
    }

    return {
      ...t,
      x: nextX,
      y: nextY,
      velocityX: nextVx,
      velocityY: nextVy,
    };
  });
}
