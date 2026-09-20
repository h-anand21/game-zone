// ============================================================
// GameHub — useFavorites Hook
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from './useDatabase';

/**
 * Hook for managing favorite games.
 */
export function useFavorites() {
  const { repos, isReady } = useDatabase();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from DB
  useEffect(() => {
    if (!isReady || !repos) return;

    repos.favorites.getGameIds().then((ids) => {
      setFavoriteIds(new Set(ids));
      setIsLoaded(true);
    });
  }, [isReady, repos]);

  /** Check if a game is favorited. */
  const isFavorite = useCallback(
    (gameId: string) => favoriteIds.has(gameId),
    [favoriteIds]
  );

  /** Toggle favorite status. */
  const toggleFavorite = useCallback(
    async (gameId: string) => {
      if (!repos) return;

      const newState = await repos.favorites.toggle(gameId);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (newState) {
          next.add(gameId);
        } else {
          next.delete(gameId);
        }
        return next;
      });

      return newState;
    },
    [repos]
  );

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    isLoaded,
    count: favoriteIds.size,
  };
}
