// ============================================================
// GameHub — Game History
// Recent games, per-game history, and statistics aggregation
// ============================================================

export interface GameHistoryEntry {
  id: string;
  gameId: string;
  gameName: string;
  category: string;
  score: number;
  duration: number;          // seconds
  result: 'win' | 'loss' | 'draw' | 'completed';
  difficulty: string;
  xpEarned: number;
  coinsEarned: number;
  achievementsUnlocked: string[];
  playedAt: string;          // ISO timestamp
}

export interface GameStats {
  gameId: string;
  gameName: string;
  totalGamesPlayed: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  winRate: number;
  bestScore: number;
  averageScore: number;
  totalPlayTime: number;     // seconds
  lastPlayedAt: string;
  favoriteDay: string;       // day of week most played
}

// In-memory history store (backed by SQLite in production via ScoreRepository)
let _history: GameHistoryEntry[] = [];

/**
 * Add a new game history entry
 */
export function addGameHistory(entry: GameHistoryEntry): void {
  _history.unshift(entry);
  // Keep last 500 entries in memory
  if (_history.length > 500) {
    _history = _history.slice(0, 500);
  }
}

/**
 * Get recent games (paginated)
 */
export function getRecentGames(limit: number = 20, offset: number = 0): GameHistoryEntry[] {
  return _history.slice(offset, offset + limit);
}

/**
 * Get history for a specific game
 */
export function getGameHistory(gameId: string, limit: number = 20): GameHistoryEntry[] {
  return _history.filter((e) => e.gameId === gameId).slice(0, limit);
}

/**
 * Get aggregated stats for a specific game
 */
export function getGameStats(gameId: string): GameStats | null {
  const entries = _history.filter((e) => e.gameId === gameId);
  if (entries.length === 0) return null;

  const wins = entries.filter((e) => e.result === 'win').length;
  const losses = entries.filter((e) => e.result === 'loss').length;
  const draws = entries.filter((e) => e.result === 'draw').length;
  const scores = entries.map((e) => e.score);
  const totalPlayTime = entries.reduce((sum, e) => sum + e.duration, 0);

  // Find favorite day
  const dayCounts: Record<string, number> = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  entries.forEach((e) => {
    const day = dayNames[new Date(e.playedAt).getDay()];
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  const favoriteDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return {
    gameId,
    gameName: entries[0].gameName,
    totalGamesPlayed: entries.length,
    totalWins: wins,
    totalLosses: losses,
    totalDraws: draws,
    winRate: entries.length > 0 ? Math.round((wins / entries.length) * 100) : 0,
    bestScore: Math.max(...scores),
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    totalPlayTime,
    lastPlayedAt: entries[0].playedAt,
    favoriteDay,
  };
}

/**
 * Get global stats across all games
 */
export function getGlobalStats() {
  const totalGames = _history.length;
  const totalWins = _history.filter((e) => e.result === 'win').length;
  const totalXP = _history.reduce((sum, e) => sum + e.xpEarned, 0);
  const totalCoins = _history.reduce((sum, e) => sum + e.coinsEarned, 0);
  const totalPlayTime = _history.reduce((sum, e) => sum + e.duration, 0);
  const totalAchievements = new Set(_history.flatMap((e) => e.achievementsUnlocked)).size;

  // Most played game
  const gameCounts: Record<string, number> = {};
  _history.forEach((e) => {
    gameCounts[e.gameName] = (gameCounts[e.gameName] || 0) + 1;
  });
  const mostPlayedGame = Object.entries(gameCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Most played category
  const categoryCounts: Record<string, number> = {};
  _history.forEach((e) => {
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
  });
  const favoriteCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return {
    totalGames,
    totalWins,
    winRate: totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0,
    totalXP,
    totalCoins,
    totalPlayTime,
    totalAchievements,
    mostPlayedGame,
    favoriteCategory,
  };
}

/**
 * Clear all history (for testing/reset)
 */
export function clearGameHistory(): void {
  _history = [];
}

/**
 * Format play time to human readable
 */
export function formatPlayTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}
