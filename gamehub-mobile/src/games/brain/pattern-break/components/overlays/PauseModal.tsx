// ============================================================
// PATTERN BREAKER — PauseModal Component
// Glassmorphism pause overlay with live score, resume, restart & exit
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameButton } from '../buttons/GameButton';
import { PBColors, PBTypography, PBRadius, PBShadows, uiAssets } from '../../theme';

interface PauseModalProps {
  score: number;
  round: number;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  round,
  onResume,
  onRestart,
  onExit,
}) => {
  return (
    <View style={styles.overlay}>
      <LinearGradient
        colors={['rgba(24, 47, 57, 0.96)', 'rgba(10, 23, 30, 0.98)']}
        style={styles.card}
      >
        <Text style={styles.title}>GAME PAUSED</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>POINTS</Text>
            <Text style={styles.statVal}>{score}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>ROUND</Text>
            <Text style={styles.statVal}>{round}</Text>
          </View>
        </View>

        <View style={styles.actionsCol}>
          <GameButton
            asset={uiAssets.actions.resume}
            height={58}
            onPress={onResume}
            accessibilityLabel="Resume Game"
          />
          <GameButton
            asset={uiAssets.actions.restart}
            height={54}
            onPress={onRestart}
            accessibilityLabel="Restart Level"
          />
          <GameButton
            asset={uiAssets.actions.exit}
            height={54}
            onPress={onExit}
            accessibilityLabel="Exit to Home"
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 16, 24, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 999,
  },
  card: {
    width: '100%',
    padding: 24,
    borderRadius: PBRadius.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.35)',
    ...PBShadows.cardElevation,
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: PBRadius.md,
    gap: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 1,
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    color: PBColors.accent,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  actionsCol: {
    width: '100%',
    gap: 10,
    marginTop: 6,
  },
  exitBtn: {
    borderColor: 'rgba(255, 92, 97, 0.4)',
  },
});
