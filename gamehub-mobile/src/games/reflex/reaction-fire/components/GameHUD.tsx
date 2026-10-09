// ============================================================
// REACTION FIRE — In-Game Heads-Up Display (HUD)
// Mode badge, round progress, endurance countdown & safe pause control
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { NeonBadge } from './NeonBadge';
import { RfColors } from '../theme';
import type { GameModeId } from '../types';
import { RF_MODES } from '../config';

interface GameHUDProps {
  mode: GameModeId;
  currentRound: number;
  totalRounds: number;
  enduranceTimeRemainingSeconds?: number;
  personalBestMs: number | null;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  mode,
  currentRound,
  totalRounds,
  enduranceTimeRemainingSeconds,
  personalBestMs,
  onPause,
}) => {
  const modeConfig = RF_MODES[mode];
  const isEndurance = mode === 'endurance';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Left: Mode Badge */}
        <NeonBadge
          label={modeConfig.name}
          color={modeConfig.badgeColor}
          size="compact"
        />

        {/* Center: Round / Timer Status */}
        {isEndurance && enduranceTimeRemainingSeconds !== undefined ? (
          <View style={styles.timerBadge}>
            <Text style={styles.timerNumber}>
              {enduranceTimeRemainingSeconds.toFixed(1)}s
            </Text>
          </View>
        ) : totalRounds > 1 ? (
          <View style={styles.roundPill}>
            <Text style={styles.roundLabel}>
              ROUND {currentRound} / {totalRounds}
            </Text>
          </View>
        ) : personalBestMs !== null ? (
          <View style={styles.pbPill}>
            <Text style={styles.pbLabel}>PB: {personalBestMs} ms</Text>
          </View>
        ) : null}

        {/* Right: Safe Pause Button */}
        <Pressable onPress={onPause} style={styles.pauseButton} hitSlop={10}>
          <Text style={styles.pauseText}>❚❚</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
    width: '100%',
    zIndex: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pauseButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseText: {
    color: RfColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  roundPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(83, 225, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(83, 225, 255, 0.25)',
  },
  roundLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: RfColors.secondaryCyan,
    letterSpacing: 1,
  },
  pbPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(183, 255, 60, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(183, 255, 60, 0.25)',
  },
  pbLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: RfColors.goLime,
    letterSpacing: 1,
  },
  timerBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 200, 87, 0.15)',
    borderWidth: 1,
    borderColor: RfColors.rewardGold,
  },
  timerNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: RfColors.rewardGold,
    letterSpacing: 1,
  },
});

export default GameHUD;
