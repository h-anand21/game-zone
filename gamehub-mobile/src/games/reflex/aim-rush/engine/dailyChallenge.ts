// ============================================================
// AIM RUSH — Deterministic Daily Challenge Engine
// Generates identical daily challenge seed from calendar date
// ============================================================

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Pseudo-Random Number Generator (Linear Congruential Generator)
export function createDailySeededRNG(dateStr: string) {
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed * 31 + dateStr.charCodeAt(i)) >>> 0;
  }

  return function nextFloat(): number {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export function getDailyChallengeMetadata(dateStr: string) {
  const rng = createDailySeededRNG(dateStr);
  const targetScoreGoal = 350 + Math.floor(rng() * 300);
  const durationSeconds = 35;
  const rewardCoins = 150 + Math.floor(rng() * 100);

  return {
    date: dateStr,
    title: `DAILY CHAIN • ${dateStr}`,
    targetScoreGoal,
    durationSeconds,
    rewardCoins,
    bonusMultiplier: 1.5,
  };
}
