import type { TargetItem } from './types';

export function createRandomTarget(id: number): TargetItem {
  return {
    id: `tgt_${id}`,
    x: Math.floor(Math.random() * 200) + 50,
    y: Math.floor(Math.random() * 300) + 100,
    radius: 36,
    type: 'normal',
    spawnedAt: Date.now(),
    lifetimeMs: 1800,
    expiresAt: Date.now() + 1800,
    velocityX: 0,
    velocityY: 0,
    points: 10,
  };
}
