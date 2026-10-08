// ============================================================
// ONE TAP: PRECISION GAME — GameHUD Component
// Score, Combo, Round, Time & In-Run Telemetry
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SvgPause } from './icons/OneTapIcons';
import { OTColors } from '../theme/colors';

interface GameHUDProps {
  score: number;
  combo: number;
  currentRound: number;
  totalRounds?: number;
  elapsedSeconds: number;
  isFeverActive: boolean;
  feverTimeRemaining: number;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  combo,
  currentRound,
  totalRounds = 10,
  elapsedSeconds,
  isFeverActive,
  feverTimeRemaining,
  onPause,
}) => {
  return (
    <View style={styles.container}>
      {/* Top HUD Primary Row */}
      <View style={styles.topRow}>
        {/* Pause HUD Button */}
        <Pressable
          style={({ pressed }) => [styles.pauseBtn, pressed && styles.btnPressed]}
          onPress={onPause}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Pause Game"
        >
          <SvgPause size={18} color={OTColors.cyan} />
        </Pressable>

        {/* Center Live Score */}
        <View style={styles.scoreBox}>
          <Text style={styles.hudLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        {/* Right Combo Multiplier */}
        <View style={styles.comboBox}>
          <Text style={styles.hudLabel}>COMBO</Text>
          <Text
            style={[
              styles.comboValue,
              { color: combo > 1 ? OTColors.cyan : OTColors.textSecondary },
            ]}
          >
            ×{combo}
          </Text>
        </View>
      </View>

      {/* Sub HUD Telemetry Row (Round & Time) */}
      <View style={styles.telemetryRow}>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>ROUND</Text>
          <Text style={styles.telemetryValue}>
            {String(currentRound).padStart(2, '0')} / {totalRounds ? String(totalRounds).padStart(2, '0') : '∞'}
          </Text>
        </View>

        {/* Fever Mode Pill if Active */}
        {isFeverActive && (
          <View style={styles.feverBadge}>
            <Text style={styles.feverBadgeText}>
              FEVER ×2 ({feverTimeRemaining.toFixed(1)}s)
            </Text>
          </View>
        )}

        <View style={styles.telemetryItemRight}>
          <Text style={styles.telemetryLabel}>TIME</Text>
          <Text style={styles.telemetryValue}>{elapsedSeconds.toFixed(1)}s</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pauseBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 21, 28, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  scoreBox: {
    alignItems: 'center',
  },
  hudLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: OTColors.textSecondary,
    letterSpacing: 2,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },
  comboBox: {
    alignItems: 'flex-end',
    minWidth: 44,
  },
  comboValue: {
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  telemetryItem: {
    alignItems: 'flex-start',
  },
  telemetryItemRight: {
    alignItems: 'flex-end',
  },
  telemetryLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: OTColors.textMuted,
    letterSpacing: 1.5,
  },
  telemetryValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginTop: 1,
  },
  feverBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: OTColors.feverSoft,
    borderWidth: 1,
    borderColor: OTColors.feverHot,
    borderRadius: 12,
  },
  feverBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: OTColors.feverHot,
    letterSpacing: 1,
  },
});
