// ============================================================
// MEMORY RUSH — Animated Multiplier Combo Badge
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MRColors } from '../constants/colors';

interface ComboBadgeProps {
  combo: number;
}

export const ComboBadge: React.FC<ComboBadgeProps> = ({ combo }) => {
  if (combo <= 1) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.comboText}>COMBO ×{combo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    borderWidth: 1.5,
    borderColor: MRColors.primaryCyan,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: MRColors.primaryCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  comboText: {
    fontSize: 12,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 1.2,
  },
});
