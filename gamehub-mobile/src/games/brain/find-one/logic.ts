// ============================================================
// GameHub — Find One Pure Logic
// ============================================================

import type { GridTile, RoundData } from './types';

export function generateRound(score: number): RoundData {
  // Grid size grows with score: 2x2 (score < 3), 3x3 (< 8), 4x4 (< 15), 5x5 (>= 15)
  let gridSize = 2;
  if (score >= 15) gridSize = 5;
  else if (score >= 8) gridSize = 4;
  else if (score >= 3) gridSize = 3;

  const totalTiles = gridSize * gridSize;
  const oddIndex = Math.floor(Math.random() * totalTiles);

  // Generate base HSL color
  const hue = Math.floor(Math.random() * 360);
  const sat = 70 + Math.floor(Math.random() * 20); // 70-90%
  const lightness = 45 + Math.floor(Math.random() * 20); // 45-65%

  const baseColor = `hsl(${hue}, ${sat}%, ${lightness}%)`;

  // Difficulty delta decreases as score increases
  const delta = Math.max(3, 25 - Math.floor(score * 1.2));
  const oddLightness = lightness + (Math.random() > 0.5 ? delta : -delta);
  const oddColor = `hsl(${hue}, ${sat}%, ${oddLightness}%)`;

  const tiles: GridTile[] = Array.from({ length: totalTiles }).map((_, idx) => ({
    id: idx,
    color: idx === oddIndex ? oddColor : baseColor,
    isOdd: idx === oddIndex,
  }));

  return { gridSize, tiles, oddIndex };
}
