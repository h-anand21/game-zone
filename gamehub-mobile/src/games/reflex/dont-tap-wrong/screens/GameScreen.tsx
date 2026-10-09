// ============================================================
// DON'T TAP WRONG — Main Game Play Screen
// Live 3x3 neon grid, real-time timer, streak counter, score HUD
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { NeonTile } from '../components/common/NeonTile';
import { NeonBadge } from '../components/common/NeonBadge';
import { NeonButton } from '../components/common/NeonButton';
import { DtwColors } from '../theme/colors';
import type { GameSessionState } from '../types';

interface GameScreenProps {
  session: GameSessionState;
  onTilePress: (index: number) => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onExitToMenu: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  session,
  onTilePress,
  onPause,
  onResume,
  onRestart,
  onExitToMenu,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const handlePauseToggle = () => {
    if (isPaused) {
      onResume();
      setIsPaused(false);
    } else {
      onPause();
      setIsPaused(true);
    }
  };

  const handleRestart = () => {
    setIsPaused(false);
    onRestart();
  };

  const handleExit = () => {
    setIsPaused(false);
    onExitToMenu();
  };

  // Calculate timer fill percentage
  const totalDuration =
    session.mode === 'CLASSIC' ? 20 : session.mode === 'RUSH' ? 15 : 30;
  const timePercent = Math.max(0, Math.min(100, (session.timeRemaining / totalDuration) * 100));

  return (
    <BackgroundLayer variant="game">
      <View style={styles.container}>
        {/* Top Game Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={handlePauseToggle} style={styles.pauseBtn}>
            <Text style={styles.pauseBtnText}>⏸ PAUSE</Text>
          </Pressable>

          <View style={styles.modeIndicator}>
            <NeonBadge
              label={session.mode}
              color={
                session.mode === 'SURVIVAL'
                  ? DtwColors.dangerRed
                  : session.mode === 'RUSH'
                  ? DtwColors.streakGold
                  : DtwColors.cyanAccent
              }
              size="sm"
            />
          </View>

          <View style={styles.scorePlaque}>
            <Text style={styles.scoreLabel}>SCORE</Text>
            <Text style={styles.scoreValue}>{session.score}</Text>
          </View>
        </View>

        {/* Timer Progress Bar */}
        <View style={styles.timerSection}>
          <View style={styles.timerLabels}>
            <Text style={styles.timerTitle}>TIME REMAINING</Text>
            <Text
              style={[
                styles.timerSeconds,
                session.timeRemaining <= 5 && { color: DtwColors.dangerRed },
              ]}
            >
              {session.timeRemaining.toFixed(1)}s
            </Text>
          </View>
          <View style={styles.timerTrack}>
            <View
              style={[
                styles.timerFill,
                {
                  width: `${timePercent}%`,
                  backgroundColor:
                    session.timeRemaining <= 5
                      ? DtwColors.dangerRed
                      : session.timeRemaining <= 10
                      ? DtwColors.streakGold
                      : DtwColors.cyanAccent,
                },
              ]}
            />
          </View>
        </View>

        {/* Dynamic Streak & Multiplier HUD */}
        <View style={styles.streakRow}>
          <View style={styles.streakBox}>
            <Text style={styles.streakLabel}>CURRENT STREAK</Text>
            <Text style={styles.streakValue}>
              🔥 {session.currentStreak}
            </Text>
          </View>

          <View
            style={[
              styles.multiplierBadge,
              session.multiplier > 1 && styles.multiplierActive,
            ]}
          >
            <Text style={styles.multiplierLabel}>BOOST</Text>
            <Text style={styles.multiplierValue}>
              {session.multiplier.toFixed(1)}x
            </Text>
          </View>

          <View style={styles.streakBox}>
            <Text style={styles.streakLabel}>ACCURACY</Text>
            <Text style={styles.streakValue}>
              {session.totalTaps > 0
                ? `${Math.round((session.safeTaps / session.totalTaps) * 100)}%`
                : '100%'}
            </Text>
          </View>
        </View>

        {/* Main 3x3 Reactive Grid */}
        <View style={styles.gridWrapper}>
          <View style={styles.gridContainer}>
            {session.tiles.map((tile, idx) => (
              <NeonTile
                key={tile.id}
                tile={tile}
                onPress={() => onTilePress(idx)}
                disabled={session.isGameOver || isPaused}
              />
            ))}
          </View>
        </View>

        {/* Bottom Quick Status */}
        <View style={styles.bottomStatsBar}>
          <View style={styles.bottomStatItem}>
            <Text style={[styles.bottomStatDot, { color: DtwColors.safeGreen }]}>●</Text>
            <Text style={styles.bottomStatLabel}>Safe:</Text>
            <Text style={styles.bottomStatValue}>{session.safeTaps}</Text>
          </View>

          <View style={styles.bottomStatItem}>
            <Text style={[styles.bottomStatDot, { color: DtwColors.dangerRed }]}>●</Text>
            <Text style={styles.bottomStatLabel}>Wrong:</Text>
            <Text style={styles.bottomStatValue}>{session.dangerTaps}</Text>
          </View>

          <View style={styles.bottomStatItem}>
            <Text style={[styles.bottomStatDot, { color: DtwColors.textMuted }]}>●</Text>
            <Text style={styles.bottomStatLabel}>Best Streak:</Text>
            <Text style={styles.bottomStatValue}>{session.maxStreak}</Text>
          </View>
        </View>

        {/* Pause Modal */}
        <Modal
          visible={isPaused}
          transparent
          animationType="fade"
          onRequestClose={handlePauseToggle}
        >
          <View style={styles.pauseOverlay}>
            <View style={styles.pauseDialog}>
              <Text style={styles.pauseTitle}>GAME PAUSED</Text>
              <Text style={styles.pauseSub}>Mode: {session.mode}</Text>

              <View style={styles.pauseStats}>
                <Text style={styles.pauseStatText}>Current Score: {session.score}</Text>
                <Text style={styles.pauseStatText}>Time Left: {session.timeRemaining.toFixed(1)}s</Text>
              </View>

              <NeonButton
                title="RESUME RUN"
                onPress={handlePauseToggle}
                color={DtwColors.safeGreen}
                size="md"
                fullWidth
                style={styles.pauseActionBtn}
              />

              <NeonButton
                title="RESTART"
                onPress={handleRestart}
                color={DtwColors.cyanAccent}
                variant="outline"
                size="md"
                fullWidth
                style={styles.pauseActionBtn}
              />

              <NeonButton
                title="QUIT TO LOBBY"
                onPress={handleExit}
                color={DtwColors.dangerRed}
                variant="outline"
                size="md"
                fullWidth
              />
            </View>
          </View>
        </Modal>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pauseBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  pauseBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: DtwColors.textPrimary,
    letterSpacing: 1,
  },
  modeIndicator: {
    alignItems: 'center',
  },
  scorePlaque: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1.5,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '900',
    color: DtwColors.textPrimary,
  },
  timerSection: {
    marginTop: 8,
    marginBottom: 6,
  },
  timerLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timerTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1,
  },
  timerSeconds: {
    fontSize: 14,
    fontWeight: '900',
    color: DtwColors.cyanAccent,
  },
  timerTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: 4,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(8, 14, 24, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  streakBox: {
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: DtwColors.textMuted,
    letterSpacing: 0.8,
  },
  streakValue: {
    fontSize: 14,
    fontWeight: '900',
    color: DtwColors.textPrimary,
    marginTop: 2,
  },
  multiplierBadge: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  multiplierActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: DtwColors.streakGold,
  },
  multiplierLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: DtwColors.streakGold,
    letterSpacing: 1,
  },
  multiplierValue: {
    fontSize: 14,
    fontWeight: '900',
    color: DtwColors.streakGold,
  },
  gridWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 360,
  },
  bottomStatsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 14, 24, 0.7)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bottomStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomStatDot: {
    fontSize: 12,
    marginRight: 4,
  },
  bottomStatLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: DtwColors.textMuted,
    marginRight: 4,
  },
  bottomStatValue: {
    fontSize: 12,
    fontWeight: '900',
    color: DtwColors.textPrimary,
  },
  pauseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pauseDialog: {
    width: '100%',
    backgroundColor: DtwColors.bgCard,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: DtwColors.cyanAccent,
    padding: 20,
    alignItems: 'center',
  },
  pauseTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: DtwColors.textPrimary,
    letterSpacing: 2,
  },
  pauseSub: {
    fontSize: 12,
    fontWeight: '700',
    color: DtwColors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  pauseStats: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  pauseStatText: {
    fontSize: 13,
    color: DtwColors.textPrimary,
    marginVertical: 2,
    fontWeight: '600',
  },
  pauseActionBtn: {
    marginBottom: 10,
  },
});
