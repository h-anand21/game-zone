// ============================================================
// PATTERN BREAKER — RuleShiftOverlay Component
// Signature mid-game morphing transformation: Category A ➔ Category B
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ScreenPlaque } from '../common/ScreenPlaque';
import { PBColors, PBTypography, PBRadius, PBShadows } from '../../theme';

interface RuleShiftOverlayProps {
  fromCategory: string;
  toCategory: string;
  onComplete: () => void;
}

export const RuleShiftOverlay: React.FC<RuleShiftOverlayProps> = ({
  fromCategory,
  toCategory,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'shift' | 'new_rule'>('shift');

  useEffect(() => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (e) {}

    const timer1 = setTimeout(() => {
      setPhase('new_rule');
    }, 700);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <View style={styles.overlay}>
      <LinearGradient
        colors={['rgba(6, 16, 24, 0.94)', 'rgba(8, 23, 32, 0.98)']}
        style={styles.card}
      >
        <ScreenPlaque type="rule_shift" height={130} />

        <View style={styles.morphRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.pillText}>{fromCategory}</Text>
          </View>
          <Text style={styles.arrow}>➔</Text>
          <View style={[styles.categoryPill, styles.activePill]}>
            <Text style={[styles.pillText, styles.activePillText]}>{toCategory}</Text>
          </View>
        </View>

        <Text style={styles.hintText}>
          {phase === 'shift'
            ? 'Matrix re-calibrating...'
            : `NEW RULE: Spot the ${toCategory.toLowerCase()} outlier!`}
        </Text>
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
    zIndex: 999,
    padding: 24,
  },
  card: {
    width: '100%',
    padding: 26,
    borderRadius: PBRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PBColors.accent,
    ...PBShadows.amberGlow,
  },
  badge: {
    fontSize: 11,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 2,
    marginBottom: 6,
  },
  shiftTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 16,
  },
  morphRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 12,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activePill: {
    backgroundColor: 'rgba(25, 211, 255, 0.25)',
    borderColor: PBColors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '900',
    color: PBColors.textSecondary,
    letterSpacing: 1,
  },
  activePillText: {
    color: PBColors.primary,
  },
  arrow: {
    fontSize: 20,
    color: PBColors.accent,
    fontWeight: '900',
  },
  hintText: {
    fontSize: 13,
    fontWeight: '700',
    color: PBColors.accent,
    marginTop: 10,
    textAlign: 'center',
  },
});
