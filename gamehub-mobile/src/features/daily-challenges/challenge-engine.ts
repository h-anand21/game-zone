// ============================================================
// GameHub — Daily Challenges Engine
// ============================================================

export interface DailyChallenge {
  id: string;
  gameId: string | null; // null = any game
  title: string;
  description: string;
  targetProgress: number;
  currentProgress: number;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  date: string; // YYYY-MM-DD
}

export function generateDailyChallenges(dateStr: string): DailyChallenge[] {
  return [
    {
      id: `dc_${dateStr}_1`,
      gameId: null,
      title: 'Warm-Up',
      description: 'Play 3 games of any kind',
      targetProgress: 3,
      currentProgress: 0,
      xpReward: 50,
      coinReward: 20,
      completed: false,
      date: dateStr,
    },
    {
      id: `dc_${dateStr}_2`,
      gameId: 'snake',
      title: 'Slither Master',
      description: 'Score 50+ points in Snake',
      targetProgress: 50,
      currentProgress: 0,
      xpReward: 80,
      coinReward: 35,
      completed: false,
      date: dateStr,
    },
    {
      id: `dc_${dateStr}_3`,
      gameId: 'tic-tac-toe',
      title: 'Tactical Victory',
      description: 'Win 2 games of Tic Tac Toe',
      targetProgress: 2,
      currentProgress: 0,
      xpReward: 100,
      coinReward: 50,
      completed: false,
      date: dateStr,
    },
  ];
}

export function updateChallengeProgress(
  challenges: DailyChallenge[],
  gameId: string,
  score: number,
  won: boolean
): { updatedChallenges: DailyChallenge[]; totalXP: number; totalCoins: number } {
  let totalXP = 0;
  let totalCoins = 0;

  const updatedChallenges = challenges.map((ch) => {
    if (ch.completed) return ch;

    let progressAdd = 0;

    if (ch.gameId === null) {
      // Play any game challenge
      progressAdd = 1;
    } else if (ch.gameId === gameId) {
      if (ch.id.includes('_2')) {
        // Snake score challenge
        if (score >= ch.targetProgress) progressAdd = ch.targetProgress - ch.currentProgress;
      } else if (ch.id.includes('_3')) {
        // Tic Tac Toe win challenge
        if (won) progressAdd = 1;
      }
    }

    if (progressAdd > 0) {
      const newProgress = Math.min(ch.targetProgress, ch.currentProgress + progressAdd);
      const isNowCompleted = newProgress >= ch.targetProgress;

      if (isNowCompleted && !ch.completed) {
        totalXP += ch.xpReward;
        totalCoins += ch.coinReward;
      }

      return {
        ...ch,
        currentProgress: newProgress,
        completed: isNowCompleted,
      };
    }

    return ch;
  });

  return { updatedChallenges, totalXP, totalCoins };
}
