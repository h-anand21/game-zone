// ============================================================
// Mind Lock — Badge Card Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polygon } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLTypography } from '../theme';

interface BadgeCardProps {
  title: string;
  description: string;
  unlocked: boolean;
  current?: number;
  target?: number;
  accentColor?: string;
  badgeLevel?: number;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  title,
  description,
  unlocked,
  current = 0,
  target = 10,
  accentColor = MLColors.primary,
  badgeLevel,
}) => {
  return (
    <View style={[styles.card, unlocked && styles.cardUnlocked]}>
      {/* Badge Icon / Hexagon */}
      <View style={styles.badgeWrapper}>
        <LinearGradient
          colors={
            unlocked
              ? (MLColors.goldGradient as [string, string, ...string[]])
              : (['#233852', '#122033'] as [string, string, ...string[]])
          }
          style={[styles.badgeHexagon, unlocked && MLShadows.glowGold]}
        >
          {unlocked ? (
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="#0A121D">
              <Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
            </Svg>
          ) : (
            <Svg width="20" height="20" viewBox="0 0 24 24" fill={MLColors.textDim}>
              <Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </Svg>
          )}
        </LinearGradient>
      </View>

      {/* Info */}
      <Text style={[styles.title, !unlocked && styles.titleLocked]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      {/* Unlocked tag or progress bar */}
      {unlocked ? (
        <View style={styles.unlockedTag}>
          <Text style={styles.unlockedText}>Unlocked</Text>
        </View>
      ) : (
        <View style={styles.progressContainer}>
          <View style={styles.miniTrack}>
            <View
              style={[
                styles.miniFill,
                { width: `${Math.min(1, current / target) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {current} / {target}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 104,
    backgroundColor: '#0F1E31',
    borderRadius: MLRadius.lg,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    ...MLShadows.sm,
  },
  cardUnlocked: {
    borderColor: 'rgba(255, 201, 40, 0.3)',
    backgroundColor: '#12253D',
  },
  badgeWrapper: {
    marginBottom: 8,
  },
  badgeHexagon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    color: MLColors.white,
    fontSize: 11,
    fontWeight: MLTypography.bold,
    textAlign: 'center',
    marginBottom: 2,
  },
  titleLocked: {
    color: MLColors.textMuted,
  },
  description: {
    color: MLColors.textDim,
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 12,
    height: 24,
    marginBottom: 6,
  },
  unlockedTag: {
    backgroundColor: 'rgba(85, 214, 63, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: MLRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(85, 214, 63, 0.4)',
  },
  unlockedText: {
    color: MLColors.success,
    fontSize: 9,
    fontWeight: MLTypography.bold,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 3,
  },
  miniTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#0A1320',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    backgroundColor: MLColors.primary,
  },
  progressText: {
    color: MLColors.textMuted,
    fontSize: 8,
    fontWeight: MLTypography.semibold,
  },
});
