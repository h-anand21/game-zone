// ============================================================
// GameHub FPS Server — Hit & Anti-Cheat Validation
// ============================================================

import type { FPSPlayer } from './player.js';
import type { Vector3 } from '../protocol/fps-events.js';

interface WeaponStats {
  damage: number;
  headshotMultiplier: number;
  maxRange: number;
  fireRate: number; // shots per sec
}

const WEAPON_REGISTRY: Record<string, WeaponStats> = {
  pistol: { damage: 25, headshotMultiplier: 1.8, maxRange: 40, fireRate: 4 },
  rifle: { damage: 34, headshotMultiplier: 2.0, maxRange: 100, fireRate: 10 },
  smg: { damage: 20, headshotMultiplier: 1.5, maxRange: 50, fireRate: 15 },
  shotgun: { damage: 70, headshotMultiplier: 1.3, maxRange: 20, fireRate: 1.2 },
  sniper: { damage: 95, headshotMultiplier: 2.5, maxRange: 200, fireRate: 0.8 },
};

function distance(a: Vector3, b: Vector3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function validateAndCalculateHit(
  attacker: FPSPlayer,
  target: FPSPlayer,
  weaponId: string,
  isHeadshot: boolean
): { isValid: boolean; damage: number; reason?: string } {
  if (attacker.isDead) return { isValid: false, damage: 0, reason: 'Attacker is dead' };
  if (target.isDead) return { isValid: false, damage: 0, reason: 'Target is dead' };

  const weapon = WEAPON_REGISTRY[weaponId] || WEAPON_REGISTRY.rifle;
  const dist = distance(attacker.position, target.position);

  // Validate range
  if (dist > weapon.maxRange + 5) {
    return { isValid: false, damage: 0, reason: `Target out of range (${dist.toFixed(1)}m > ${weapon.maxRange}m)` };
  }

  // Calculate damage
  let baseDamage = weapon.damage;
  if (isHeadshot) {
    baseDamage *= weapon.headshotMultiplier;
  }

  return { isValid: true, damage: Math.round(baseDamage) };
}
