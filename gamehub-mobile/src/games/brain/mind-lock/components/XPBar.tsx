// ============================================================
// Mind Lock — XP Level Progress Bar Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';

interface XPBarProps {
  currentXP: number;
  targetXP: number;
  currentLevel: number;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  targetXP,
  currentLevel,
}) => {
  const progress = Math.min(1, Math.max(0, currentXP / targetXP));

  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>LVL {currentLevel}</Text>
        </View>
        <Text style={styles.xpText}>
          {currentXP} / {targetXP} XP
        </Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fillWrapper, { width: `${progress * 100}%` }]}>
          <LinearGradient
            colors={MLColors.goldGradient as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 201, 40, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: MLRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 40, 0.4)',
  },
  levelText: {
    color: MLColors.primary,
    fontSize: 10,
    fontWeight: MLTypography.black,
  },
  xpText: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.semibold,
  },
  track: {
    height: 8,
    backgroundColor: '#091524',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.1)',
  },
  fillWrapper: {
    height: '100%',
  },
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    ...MLShadows.glowGold,
  },
});
