// ============================================================
// Number Rush — Combo Streak Multiplier Badge
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NRTheme } from '../theme';

interface ComboBadgeProps {
  combo: number;
}

export const ComboBadge: React.FC<ComboBadgeProps> = ({ combo }) => {
  if (combo <= 1) {
    return (
      <View style={[styles.container, styles.inactiveContainer]}>
        <Text style={styles.idleText}>1x</Text>
      </View>
    );
  }

  const isMegaCombo = combo >= 5;
  const isUltraCombo = combo >= 10;

  let badgeBg = '#FF9F1A';
  let badgeBorder = '#FFE082';

  if (isUltraCombo) {
    badgeBg = '#FF3838';
    badgeBorder = '#FFD700';
  } else if (isMegaCombo) {
    badgeBg = '#FF5722';
    badgeBorder = '#FFE082';
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: badgeBg,
          borderColor: badgeBorder,
        },
        isMegaCombo && styles.megaGlow,
      ]}
    >
      <Text style={styles.flameIcon}>🔥</Text>
      <Text style={styles.comboText}>x{combo}</Text>
      <Text style={styles.subText}>{isUltraCombo ? 'MAX!' : 'STREAK'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 2,
    ...NRTheme.shadows.card,
  },
  inactiveContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  megaGlow: {
    ...NRTheme.shadows.glowGold,
  },
  flameIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  comboText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  subText: {
    color: '#FFE082',
    fontWeight: '900',
    fontSize: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  idleText: {
    color: '#8CA0BA',
    fontWeight: '700',
    fontSize: 13,
  },
});
