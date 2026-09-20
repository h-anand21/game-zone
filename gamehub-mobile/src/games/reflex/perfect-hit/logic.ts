// ============================================================
// GameHub — Perfect Hit Pure Logic
// ============================================================

export function evaluateHitQuality(posPercent: number): { type: 'PERFECT' | 'GREAT' | 'GOOD' | 'MISS'; points: number } {
  // Center is at 50%
  const distance = Math.abs(posPercent - 50);

  if (distance <= 4) {
    return { type: 'PERFECT', points: 20 };
  } else if (distance <= 10) {
    return { type: 'GREAT', points: 10 };
  } else if (distance <= 18) {
    return { type: 'GOOD', points: 5 };
  } else {
    return { type: 'MISS', points: 0 };
  }
}
