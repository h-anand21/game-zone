// ============================================================
// GameHub FPS Server — Hit Validation Unit Test
// ============================================================

import { describe, it, expect } from 'vitest';

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

function calculateDistance(a: Vector3, b: Vector3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function calculateDamage(baseDamage: number, isHeadshot: boolean, multiplier: number): number {
  return Math.round(baseDamage * (isHeadshot ? multiplier : 1.0));
}

describe('FPS Server Hit Validation Engine', () => {
  it('should calculate accurate 3D distance between players', () => {
    const p1 = { x: 0, y: 0, z: 0 };
    const p2 = { x: 3, y: 4, z: 0 };
    expect(calculateDistance(p1, p2)).toBe(5);
  });

  it('should apply headshot multiplier correctly', () => {
    const normalDamage = calculateDamage(34, false, 2.0);
    const headshotDamage = calculateDamage(34, true, 2.0);
    expect(normalDamage).toBe(34);
    expect(headshotDamage).toBe(68);
  });
});
