// ============================================================
// GameHub — Common Game Wrapper Component
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { GameEngine } from '../engine/GameEngine';
import { createScoreRecord, validateScore } from '../engine/ScoreManager';
import { PauseOverlay } from './PauseOverlay';
import { GameResultView } from './GameResult';
import { useDatabase } from '@/hooks/useDatabase';
import { useProfileStore } from '@/store';
import { calculateGameXP } from '@/features/rewards/xp-system';
import { calculateGameCoins } from '@/features/rewards/coin-system';
import { checkAchievements } from '@/features/achievements/achievement-engine';
import type { GameConfig, GameResult as GameResultData } from '@/constants/types';

interface GameWrapperProps {
  config: GameConfig;
  renderGame: (props: {
    engine: GameEngine;
    onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
    isPaused: boolean;
  }) => React.ReactNode;
}

export const GameWrapper: React.FC<GameWrapperProps> = ({ config, renderGame }) => {
  const router = useRouter();
  const db = useDatabase();
  const profileStore = useProfileStore();

  const [engine] = useState(() => new GameEngine(config));
  const [isPaused, setIsPaused] = useState(false);
  const [gameResult, setGameResult] = useState<GameResultData | null>(null);

  useEffect(() => {
    engine.ready();
    engine.start();

    return () => {
      engine.reset();
    };
  }, [engine]);

  const handlePause = () => {
    engine.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    engine.resume();
    setIsPaused(false);
  };

  const handleRestart = () => {
    setGameResult(null);
    setIsPaused(false);
    engine.reset();
    engine.ready();
    engine.start();
  };

  const handleQuit = () => {
    router.back();
  };

  const handleFinish = useCallback(
    async (score: number, won: boolean, metadata?: Record<string, unknown>) => {
      engine.finish();
      const duration = engine.getDuration();

      // Validate score locally
      const validationError = validateScore(config, score, duration);
      if (validationError) {
        console.warn(`[GameWrapper] Score validation failed: ${validationError}`);
      }

      // Calculate XP & Coins
      const xpEarned = calculateGameXP(score, duration, won);
      const coinsEarned = calculateGameCoins(score, won);

      // Evaluate achievements
      const { newlyUnlocked, totalXPEarned: achievementXP } = checkAchievements({
        gameId: config.id,
        score,
        won,
        totalGamesPlayed: profileStore.totalGamesPlayed + 1,
        currentLevel: profileStore.level,
        unlockedAchievementCodes: new Set(),
      });

      const totalXPEarned = xpEarned + achievementXP;
      const achievementNames = newlyUnlocked.map((a) => a.name);

      const result: GameResultData = {
        gameId: config.id,
        score,
        duration,
        won,
        xpEarned: totalXPEarned,
        coinsEarned,
        achievementsUnlocked: achievementNames,
        metadata,
      };

      setGameResult(result);
      engine.showResult();

      // Persist to SQLite if DB is ready
      if (db.isReady && db.scoreRepo && db.statsRepo && db.syncQueueRepo) {
        try {
          const scoreRecord = createScoreRecord(config, score, duration, metadata);
          await db.scoreRepo.insert(scoreRecord);
          await db.statsRepo.recordGameResult({
            gameId: config.id,
            score,
            result: won ? 'win' : 'loss',
          });

          // Queue sync item
          await db.syncQueueRepo.enqueue({
            id: scoreRecord.id,
            eventId: scoreRecord.eventId,
            type: 'score_submit',
            payload: {
              eventId: scoreRecord.eventId,
              gameId: config.id,
              score,
              duration,
              won,
              xpEarned: totalXPEarned,
              coinsEarned,
            },
          });

          // Refresh user profile in Zustand store
          await profileStore.addXp(totalXPEarned);
          await profileStore.addCoins(coinsEarned);
          await profileStore.refresh();
        } catch (err) {
          console.error('[GameWrapper] Failed to persist score/stats:', err);
        }
      }
    },
    [config, engine, db, profileStore]
  );

  if (gameResult) {
    return (
      <GameResultView
        gameName={config.name}
        result={gameResult}
        onPlayAgain={handleRestart}
        onHome={handleQuit}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Game Header */}
      <View style={styles.header}>
        <Pressable onPress={handleQuit} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>{config.name}</Text>

        <Pressable onPress={handlePause} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>⏸</Text>
        </Pressable>
      </View>

      {/* Main Game Surface */}
      <View style={styles.gameArea}>
        {renderGame({ engine, onFinish: handleFinish, isPaused })}
      </View>

      {/* Pause Menu Overlay */}
      {isPaused && (
        <PauseOverlay
          onResume={handleResume}
          onRestart={handleRestart}
          onQuit={handleQuit}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnText: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  headerTitle: {
    fontSize: Typography.h4,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  gameArea: {
    flex: 1,
  },
});
