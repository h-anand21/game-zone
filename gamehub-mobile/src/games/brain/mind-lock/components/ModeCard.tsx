// ============================================================
// Mind Lock — Mode Card Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect, Polygon } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import type { GameMode } from '../types';

interface ModeCardProps {
  mode: GameMode;
  title: string;
  description: string;
  bestScore?: number;
  icon: React.ReactNode;
  accentColor?: string;
  selected?: boolean;
  locked?: boolean;
  unlockText?: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const ModeCard: React.FC<ModeCardProps> = ({
  title,
  description,
  bestScore,
  icon,
  accentColor = MLColors.primary,
  selected = false,
  locked = false,
  unlockText,
  onPress,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      style={({ pressed }) => [
        styles.container,
        selected && {
          borderColor: accentColor,
          borderWidth: 2,
          shadowColor: accentColor,
          shadowRadius: 12,
          shadowOpacity: 0.6,
          elevation: 10,
        },
        pressed && !locked && styles.pressed,
        locked && styles.lockedContainer,
        style,
      ]}
    >
      <LinearGradient
        colors={
          locked
            ? ['#142233', '#0B1522']
            : ['#172B45', '#0E1C2D']
        }
        style={styles.gradient}
      >
        {/* Header row: Title & Best Score */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, locked && styles.lockedText]}>{title}</Text>
          {locked ? (
            <View style={styles.unlockBadge}>
              <Svg width="12" height="12" viewBox="0 0 24 24" fill={MLColors.textMuted}>
                <Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </Svg>
              <Text style={styles.unlockBadgeText}>{unlockText || 'Locked'}</Text>
            </View>
          ) : bestScore !== undefined ? (
            <View style={styles.bestScoreBadge}>
              <Text style={styles.trophyIcon}>🏆</Text>
              <Text style={styles.bestScoreText}>Best {bestScore}</Text>
            </View>
          ) : null}
        </View>

        {/* Center: Description & Large Mode Graphic */}
        <View style={styles.contentRow}>
          <Text style={[styles.description, locked && styles.lockedText]} numberOfLines={2}>
            {description}
          </Text>
          <View style={styles.iconWrapper}>{icon}</View>
        </View>

        {/* Action Button */}
        {locked ? (
          <View style={styles.lockedBtn}>
            <Text style={styles.lockedBtnText}>LOCKED</Text>
          </View>
        ) : (
          <LinearGradient
            colors={
              accentColor === MLColors.padBlue
                ? (MLColors.blueGradient as [string, string, ...string[]])
                : accentColor === MLColors.padGreen
                ? (MLColors.greenGradient as [string, string, ...string[]])
                : accentColor === MLColors.purple
                ? (MLColors.purpleGradient as [string, string, ...string[]])
                : (MLColors.goldGradient as [string, string, ...string[]])
            }
            style={styles.playBtn}
          >
            <Svg width="14" height="14" viewBox="0 0 24 24" fill="#0A121D">
              <Polygon points="5 3 19 12 5 21 5 3" />
            </Svg>
            <Text style={styles.playBtnText}>PLAY</Text>
            <Text style={styles.arrowText}>›</Text>
          </LinearGradient>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: MLRadius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 244, 222, 0.1)',
    ...MLShadows.md,
    marginBottom: MLSpacing.md,
  },
  gradient: {
    padding: MLSpacing.base,
    borderRadius: MLRadius.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: MLSpacing.xs,
  },
  title: {
    color: MLColors.white,
    fontSize: MLTypography.h4,
    fontWeight: MLTypography.black,
    letterSpacing: 0.5,
  },
  bestScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 201, 40, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: MLRadius.pill,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 40, 0.3)',
  },
  trophyIcon: {
    fontSize: 12,
  },
  bestScoreText: {
    color: MLColors.primary,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
  },
  unlockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: MLRadius.pill,
    gap: 4,
  },
  unlockBadgeText: {
    color: MLColors.textMuted,
    fontSize: 11,
    fontWeight: MLTypography.semibold,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: MLSpacing.sm,
    gap: MLSpacing.md,
  },
  description: {
    flex: 1,
    color: MLColors.textMuted,
    fontSize: MLTypography.bodySmall,
    lineHeight: 18,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: MLSpacing.base,
    borderRadius: MLRadius.pill,
    gap: 6,
    marginTop: MLSpacing.xs,
  },
  playBtnText: {
    color: '#0A121D',
    fontSize: MLTypography.bodySmall,
    fontWeight: MLTypography.black,
    letterSpacing: 1,
  },
  arrowText: {
    color: '#0A121D',
    fontSize: 16,
    fontWeight: MLTypography.bold,
    lineHeight: 16,
  },
  lockedBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: MLRadius.pill,
    marginTop: MLSpacing.xs,
  },
  lockedBtnText: {
    color: MLColors.textDim,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
    letterSpacing: 1,
  },
  lockedContainer: {
    opacity: 0.65,
  },
  lockedText: {
    color: MLColors.textDim,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});
