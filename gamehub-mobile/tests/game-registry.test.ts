// ============================================================
// GameHub Mobile — Game Registry Verification Test
// ============================================================

import { GAME_REGISTRY } from '../src/constants/games';

export function runGameRegistryTests() {
  console.log('[Test] Running Game Registry Verification...');

  // 1. Total games count
  if (GAME_REGISTRY.length !== 35) {
    throw new Error(`Expected 35 games, found ${GAME_REGISTRY.length}`);
  }

  // 2. Unique IDs check
  const ids = GAME_REGISTRY.map((g) => g.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== 35) {
    throw new Error('Duplicate game IDs found in registry');
  }

  // 3. Category counts
  const categories = new Set(GAME_REGISTRY.map((g) => g.category));
  const expectedCategories = ['brain', 'reflex', 'arcade', 'classic', 'party', 'battle'];
  for (const cat of expectedCategories) {
    if (!categories.has(cat as any)) {
      throw new Error(`Missing category: ${cat}`);
    }
  }

  // 4. Non-FPS vs FPS count
  const nonFps = GAME_REGISTRY.filter((g) => g.category !== 'battle');
  const fps = GAME_REGISTRY.filter((g) => g.category === 'battle');
  if (nonFps.length !== 30 || fps.length !== 5) {
    throw new Error(`Expected 30 non-FPS & 5 FPS modes, got ${nonFps.length} & ${fps.length}`);
  }

  console.log('✅ Game Registry Verification Passed: All 35 games valid (30 non-FPS + 5 FPS modes)');
  return true;
}

// Execute test
runGameRegistryTests();
