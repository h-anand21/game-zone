// ============================================================
// GameHub — Reaction Fire Pure Logic
// ============================================================

export function getRandomDelayMs(minMs = 2000, maxMs = 5000): number {
  return Math.floor(Math.random() * (maxMs - minMs)) + minMs;
}

export function calculateReactionScore(reactionTimeMs: number): number {
  if (reactionTimeMs <= 0) return 0;
  // <200ms = 100pts, 200-500ms = 90-30pts
  if (reactionTimeMs < 200) return 100;
  return Math.max(10, Math.floor(100 - (reactionTimeMs - 200) / 4));
}
