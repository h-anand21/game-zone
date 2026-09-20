// ============================================================
// GameHub — Daily Streak System
// ============================================================

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string; // YYYY-MM-DD
}

/** Rewards schedule for daily login / play streak */
export const STREAK_REWARDS: Record<number, number> = {
  1: 10,
  2: 15,
  3: 20,
  4: 30,
  5: 45,
  6: 60,
  7: 100, // Day 7 bonus
};

export function getStreakReward(streakDay: number): number {
  const day = ((streakDay - 1) % 7) + 1;
  return STREAK_REWARDS[day] || 10;
}

/**
 * Checks and updates the daily streak state.
 * Returns { streakState, rewardEarned, updated }
 */
export function updateDailyStreak(current: StreakState, todayDateStr: string): {
  updatedState: StreakState;
  rewardEarned: number;
  isNewDay: boolean;
} {
  if (!current.lastPlayedDate) {
    const newState: StreakState = {
      currentStreak: 1,
      longestStreak: 1,
      lastPlayedDate: todayDateStr,
    };
    return { updatedState: newState, rewardEarned: getStreakReward(1), isNewDay: true };
  }

  if (current.lastPlayedDate === todayDateStr) {
    // Already played today
    return { updatedState: current, rewardEarned: 0, isNewDay: false };
  }

  const lastDate = new Date(current.lastPlayedDate);
  const todayDate = new Date(todayDateStr);
  const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let newStreak = 1;
  if (diffDays === 1) {
    newStreak = current.currentStreak + 1;
  } else {
    // Streak broken
    newStreak = 1;
  }

  const newState: StreakState = {
    currentStreak: newStreak,
    longestStreak: Math.max(current.longestStreak, newStreak),
    lastPlayedDate: todayDateStr,
  };

  return {
    updatedState: newState,
    rewardEarned: getStreakReward(newStreak),
    isNewDay: true,
  };
}
