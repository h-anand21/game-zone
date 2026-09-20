// ============================================================
// GameHub — Aim Rush Pure Logic
// ============================================================

import type { Target } from './types';

export function createRandomTarget(id: number): Target {
  return {
    id,
    x: Math.floor(Math.random() * 70) + 10,
    y: Math.floor(Math.random() * 70) + 10,
    size: Math.floor(Math.random() * 20) + 50,
  };
}
