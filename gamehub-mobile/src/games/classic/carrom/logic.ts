// ============================================================
// GameHub — Carrom Pure Logic
// ============================================================

import type { CarromPuck } from './types';

export function getInitialCarromPucks(): CarromPuck[] {
  return [
    { id: 1, type: 'red', x: 50, y: 50, vx: 0, vy: 0, isPocketed: false },
    { id: 2, type: 'white', x: 45, y: 50, vx: 0, vy: 0, isPocketed: false },
    { id: 3, type: 'black', x: 55, y: 50, vx: 0, vy: 0, isPocketed: false },
    { id: 4, type: 'white', x: 50, y: 45, vx: 0, vy: 0, isPocketed: false },
    { id: 5, type: 'black', x: 50, y: 55, vx: 0, vy: 0, isPocketed: false },
    { id: 0, type: 'striker', x: 50, y: 85, vx: 0, vy: 0, isPocketed: false },
  ];
}
