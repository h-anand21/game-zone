// ============================================================
// Mind Lock — Pure Logic & Generation Tests
// ============================================================

import { PADS, getRandomPad, generateNextSequence } from '../logic';
import type { PadColor } from '../types';

describe('Mind Lock Logic', () => {
  it('should define exactly 4 color pads with correct symbols and colors', () => {
    expect(PADS).toHaveLength(4);
    const ids = PADS.map((p) => p.id);
    expect(ids).toEqual(['red', 'blue', 'green', 'yellow']);

    const symbols = PADS.map((p) => p.symbol);
    expect(symbols).toEqual(['lightning', 'waves', 'leaf', 'star']);
  });

  it('should generate a valid random pad color', () => {
    const validColors: PadColor[] = ['red', 'blue', 'green', 'yellow'];
    for (let i = 0; i < 50; i++) {
      const pad = getRandomPad();
      expect(validColors).toContain(pad);
    }
  });

  it('should add exactly one random pad to sequence each round', () => {
    let sequence: PadColor[] = [];
    for (let round = 1; round <= 10; round++) {
      sequence = generateNextSequence(sequence);
      expect(sequence).toHaveLength(round);
    }
  });
});
