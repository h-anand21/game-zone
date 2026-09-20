// ============================================================
// GameHub — Coin Economy Engine
// ============================================================

/**
 * Calculates coins earned from a game session.
 */
export function calculateGameCoins(
  score: number,
  won: boolean
): number {
  let coins = won ? 15 : 5;
  coins += Math.floor(score / 50); // 1 coin per 50 score points
  return Math.min(100, Math.max(2, coins));
}
