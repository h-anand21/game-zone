// ============================================================
// Find One — Pure Logic Unit Tests
// ============================================================

import { generateRound, getGridSize, calculateAccuracy, CHARACTER_PAIRS, CATEGORIES_DATA } from '../logic';

describe('Find One — Logic Engine', () => {
  it('should scale grid size based on score correctly', () => {
    expect(getGridSize(0)).toBe(4);
    expect(getGridSize(5)).toBe(4);
    expect(getGridSize(9)).toBe(4);
    expect(getGridSize(10)).toBe(5);
    expect(getGridSize(24)).toBe(5);
    expect(getGridSize(25)).toBe(6);
    expect(getGridSize(50)).toBe(6);
  });

  it('should generate a 4x4 round with exactly 16 tiles and 1 odd tile for score 0', () => {
    const round = generateRound(0, 'animals');
    expect(round.gridSize).toBe(4);
    expect(round.tiles).toHaveLength(16);

    const oddTiles = round.tiles.filter((t) => t.isOdd);
    expect(oddTiles).toHaveLength(1);
    expect(round.oddIndex).toBeGreaterThanOrEqual(0);
    expect(round.oddIndex).toBeLessThan(16);
    expect(round.tiles[round.oddIndex].isOdd).toBe(true);
  });

  it('should generate a 5x5 round with 25 tiles for score 15', () => {
    const round = generateRound(15, 'food');
    expect(round.gridSize).toBe(5);
    expect(round.tiles).toHaveLength(25);
    const oddTiles = round.tiles.filter((t) => t.isOdd);
    expect(oddTiles).toHaveLength(1);
  });

  it('should generate a 6x6 round with 36 tiles for score 30', () => {
    const round = generateRound(30, 'vehicles');
    expect(round.gridSize).toBe(6);
    expect(round.tiles).toHaveLength(36);
    const oddTiles = round.tiles.filter((t) => t.isOdd);
    expect(oddTiles).toHaveLength(1);
  });

  it('should calculate accuracy accurately', () => {
    expect(calculateAccuracy(0, 0)).toBe(100);
    expect(calculateAccuracy(10, 0)).toBe(100);
    expect(calculateAccuracy(8, 2)).toBe(80);
    expect(calculateAccuracy(38, 5)).toBe(88);
  });

  it('should have character pairs defined for all 5 categories', () => {
    const categories = ['animals', 'clothes', 'food', 'vehicles', 'characters'];
    categories.forEach((cat) => {
      const pairs = CHARACTER_PAIRS.filter((p) => p.category === cat);
      expect(pairs.length).toBeGreaterThan(0);
    });
  });

  it('should provide complete CATEGORIES_DATA with 5 categories', () => {
    expect(CATEGORIES_DATA).toHaveLength(5);
  });
});
