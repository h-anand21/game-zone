// ============================================================
// GameHub Mobile — Game Registry & XP Engine Unit Test
// ============================================================

import { ALL_GAMES } from '../src/constants/games';

describe('Game Registry & Category Verification', () => {
  it('should have exactly 35 games registered', () => {
    expect(ALL_GAMES.length).toBe(35);
  });

  it('should have unique IDs for all 35 games', () => {
    const ids = ALL_GAMES.map((g) => g.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(35);
  });

  it('should contain all 6 categories', () => {
    const categories = new Set(ALL_GAMES.map((g) => g.category));
    expect(categories.has('brain')).toBe(true);
    expect(categories.has('reflex')).toBe(true);
    expect(categories.has('arcade')).toBe(true);
    expect(categories.has('classic')).toBe(true);
    expect(categories.has('party')).toBe(true);
    expect(categories.has('battle')).toBe(true);
  });

  it('should have 30 non-FPS games available and 5 FPS battle modes', () => {
    const nonFps = ALL_GAMES.filter((g) => g.category !== 'battle');
    const fps = ALL_GAMES.filter((g) => g.category === 'battle');
    expect(nonFps.length).toBe(30);
    expect(fps.length).toBe(5);
  });
});
