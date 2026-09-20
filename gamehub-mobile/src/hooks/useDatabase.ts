// ============================================================
// GameHub — useDatabase Hook
// ============================================================
// Provides database-backed repository access to components.

import { useEffect, useState } from 'react';
import { getDatabase } from '@/storage/sqlite/database';
import {
  UserRepository,
  ScoreRepository,
  StatsRepository,
  ProgressRepository,
  AchievementRepository,
  SyncQueueRepository,
  SettingsRepository,
  ChallengeRepository,
  FavoriteRepository,
} from '@/storage/sqlite/repositories';
import type { SQLiteDatabase } from 'expo-sqlite';

export interface Repositories {
  db: SQLiteDatabase;
  users: UserRepository;
  scores: ScoreRepository;
  stats: StatsRepository;
  progress: ProgressRepository;
  achievements: AchievementRepository;
  syncQueue: SyncQueueRepository;
  settings: SettingsRepository;
  challenges: ChallengeRepository;
  favorites: FavoriteRepository;
}

export function useDatabase(): {
  repos: Repositories | null;
  isReady: boolean;
  userRepo: UserRepository | null;
  scoreRepo: ScoreRepository | null;
  statsRepo: StatsRepository | null;
  progressRepo: ProgressRepository | null;
  achievementRepo: AchievementRepository | null;
  syncQueueRepo: SyncQueueRepository | null;
  settingsRepo: SettingsRepository | null;
  challengeRepo: ChallengeRepository | null;
  favoriteRepo: FavoriteRepository | null;
} {
  const [repos, setRepos] = useState<Repositories | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const db = await getDatabase();
        if (!mounted) return;

        setRepos({
          db,
          users: new UserRepository(db),
          scores: new ScoreRepository(db),
          stats: new StatsRepository(db),
          progress: new ProgressRepository(db),
          achievements: new AchievementRepository(db),
          syncQueue: new SyncQueueRepository(db),
          settings: new SettingsRepository(db),
          challenges: new ChallengeRepository(db),
          favorites: new FavoriteRepository(db),
        });
        setIsReady(true);
      } catch (error) {
        console.error('[useDatabase] Init failed:', error);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    repos,
    isReady,
    userRepo: repos?.users ?? null,
    scoreRepo: repos?.scores ?? null,
    statsRepo: repos?.stats ?? null,
    progressRepo: repos?.progress ?? null,
    achievementRepo: repos?.achievements ?? null,
    syncQueueRepo: repos?.syncQueue ?? null,
    settingsRepo: repos?.settings ?? null,
    challengeRepo: repos?.challenges ?? null,
    favoriteRepo: repos?.favorites ?? null,
  };
}
