// ============================================================
// REACTION FIRE — Monotonic Timing & Clocks
// ============================================================

/**
 * Returns a high-precision monotonic timestamp in milliseconds
 */
export function getMonotonicNow(): number {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
}

/**
 * Generates an unpredictable waiting delay between min and max (defaults 1,000 to 4,000 ms)
 */
export function getRandomDelayMs(minMs = 1000, maxMs = 4000): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

/**
 * Formats a reaction time in milliseconds cleanly
 */
export function formatMs(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || ms < 0) return '-- ms';
  return `${Math.round(ms)} ms`;
}
