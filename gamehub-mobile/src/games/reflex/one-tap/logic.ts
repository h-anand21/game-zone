// ============================================================
// GameHub — One Tap Pure Logic
// ============================================================

export function getRandomTargetZone(difficultyLevel: number): { start: number; end: number } {
  const width = Math.max(10, 30 - difficultyLevel * 2); // gets narrower!
  const start = Math.floor(Math.random() * (70 - width)) + 15;
  return { start, end: start + width };
}
