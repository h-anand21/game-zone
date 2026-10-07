// ============================================================
// AIM RUSH — Minimal Futuristic GameHUD Component
// Compact digital telemetry display (Score, Chain, Timer, Lives)
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ARColors } from '../theme/colors';
import { GameModeConfig } from '../types';

interface GameHUDProps {
  score: number;
  chain: number;
  timeLeftSeconds: number;
  lives: number;
  maxLives: number;
  mode: GameModeConfig;
  isRushActive: boolean;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  chain,
  timeLeftSeconds,
  lives,
  maxLives,
  mode,
  isRushActive,
  onPause,
}) => {
  // Format score to 3+ digits (e.g. 024)
  const scoreDisplay = score.toString().padStart(3, '0');

  // Format chain (e.g. ×07)
  const chainDisplay = `×${chain.toString().padStart(2, '0')}`;

  // Format time (e.g. 08.4s or 15s)
  const isTimeLow = timeLeftSeconds <= 5;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Top HUD Telemetry Bar */}
      <View style={styles.topRow}>
        {/* Left: Pause Button + Mode Tag */}
        <View style={styles.leftGroup}>
          <Pressable
            style={styles.pauseButton}
            onPress={onPause}
            accessibilityRole="button"
            accessibilityLabel="Pause Game"
          >
            <Ionicons name="pause" size={18} color={ARColors.cyan} />
          </Pressable>

          <View style={[styles.modeBadge, { borderColor: mode.color }]}>
            <Text style={[styles.modeText, { color: mode.color }]}>{mode.title}</Text>
          </View>
        </View>

        {/* Center: Score & Chain Multiplier */}
        <View style={styles.centerGroup}>
          <View style={styles.scoreCapsule}>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.scoreText}>{scoreDisplay}</Text>
          </View>

          <View style={[styles.chainCapsule, chain >= 5 && styles.chainActiveCapsule]}>
            <Text style={[styles.statLabel, chain >= 5 && { color: ARColors.lime }]}>CHAIN</Text>
            <Text style={[styles.chainText, chain >= 5 && { color: ARColors.lime }]}>
              {chainDisplay}
            </Text>
          </View>
        </View>

        {/* Right: Timer & Lives */}
        <View style={styles.rightGroup}>
          <View style={[styles.timerCapsule, isTimeLow && styles.timerLowCapsule]}>
            <Text style={[styles.timerText, isTimeLow && styles.timerLowText]}>
              {timeLeftSeconds}s
            </Text>
          </View>

          {/* Lives Indicator */}
          {maxLives > 1 && (
            <View style={styles.livesRow}>
              {Array.from({ length: maxLives }).map((_, i) => (
                <Text
                  key={i}
                  style={[
                    styles.heartIcon,
                    { color: i < lives ? ARColors.red : ARColors.border },
                  ]}
                >
                  ♥
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Rush State Notification Badge */}
      {isRushActive && (
        <View style={styles.rushBanner} pointerEvents="none">
          <Text style={styles.rushText}>⚡ RUSH ACTIVE • SPEED ×1.5 ⚡</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 50,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ARColors.surfaceCard,
    borderWidth: 1.5,
    borderColor: ARColors.border,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: ARColors.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pauseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1.2,
    borderColor: ARColors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: ARColors.surfaceDark,
  },
  modeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  centerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreCapsule: {
    alignItems: 'center',
  },
  chainCapsule: {
    alignItems: 'center',
  },
  chainActiveCapsule: {
    transform: [{ scale: 1.05 }],
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: ARColors.textMuted,
    letterSpacing: 1,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1.5,
  },
  chainText: {
    fontSize: 18,
    fontWeight: '900',
    color: ARColors.cyan,
    letterSpacing: 1.2,
  },
  rightGroup: {
    alignItems: 'flex-end',
    gap: 2,
  },
  timerCapsule: {
    backgroundColor: ARColors.surfaceDark,
    borderWidth: 1.2,
    borderColor: ARColors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  timerLowCapsule: {
    borderColor: ARColors.red,
    backgroundColor: ARColors.redSoft,
  },
  timerText: {
    fontSize: 15,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 0.8,
  },
  timerLowText: {
    color: ARColors.red,
  },
  livesRow: {
    flexDirection: 'row',
    gap: 2,
  },
  heartIcon: {
    fontSize: 12,
  },
  rushBanner: {
    alignSelf: 'center',
    backgroundColor: ARColors.limeSoft,
    borderWidth: 1.2,
    borderColor: ARColors.lime,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 6,
  },
  rushText: {
    fontSize: 10,
    fontWeight: '900',
    color: ARColors.lime,
    letterSpacing: 1.2,
  },
});
