// ============================================================
// GameHub — Mind Lock Pure Logic
// ============================================================

import type { PadColor, PadConfig } from './types';
import { MLColors } from './theme';

export const PADS: PadConfig[] = [
  {
    id: 'red',
    color: MLColors.padRed,
    activeColor: MLColors.padRedActive,
    glowColor: MLColors.padRedGlow,
    soundFreq: 261,
    label: 'RED',
    symbol: 'lightning',
  },
  {
    id: 'blue',
    color: MLColors.padBlue,
    activeColor: MLColors.padBlueActive,
    glowColor: MLColors.padBlueGlow,
    soundFreq: 329,
    label: 'BLUE',
    symbol: 'waves',
  },
  {
    id: 'green',
    color: MLColors.padGreen,
    activeColor: MLColors.padGreenActive,
    glowColor: MLColors.padGreenGlow,
    soundFreq: 392,
    label: 'GREEN',
    symbol: 'leaf',
  },
  {
    id: 'yellow',
    color: MLColors.padYellow,
    activeColor: MLColors.padYellowActive,
    glowColor: MLColors.padYellowGlow,
    soundFreq: 523,
    label: 'YELLOW',
    symbol: 'star',
  },
];

export function getRandomPad(): PadColor {
  const colors: PadColor[] = ['red', 'blue', 'green', 'yellow'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function generateNextSequence(currentSequence: PadColor[]): PadColor[] {
  return [...currentSequence, getRandomPad()];
}
