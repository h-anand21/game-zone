// ============================================================
// GameHub — Mind Lock Pure Logic
// ============================================================

import type { PadColor, PadConfig } from './types';

export const PADS: PadConfig[] = [
  { id: 'red', color: '#EF4444', activeColor: '#F87171', soundFreq: 261 },
  { id: 'blue', color: '#3B82F6', activeColor: '#60A5FA', soundFreq: 329 },
  { id: 'green', color: '#10B981', activeColor: '#34D399', soundFreq: 392 },
  { id: 'yellow', color: '#F59E0B', activeColor: '#FBBF24', soundFreq: 523 },
];

export function getRandomPad(): PadColor {
  const colors: PadColor[] = ['red', 'blue', 'green', 'yellow'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function generateNextSequence(currentSequence: PadColor[]): PadColor[] {
  return [...currentSequence, getRandomPad()];
}
