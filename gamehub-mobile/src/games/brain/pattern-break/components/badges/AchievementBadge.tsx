// ============================================================
// PATTERN BREAKER — AchievementBadge Component
// Illustrated sci-fi achievement crest with unlocked/locked states & progress
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polygon, Circle } from 'react-native-svg';
import { AchievementItem } from '../../types';
import { PBColors, PBTypography, PBRadius, PBShadows, uiAssets } from '../../theme';

interface AchievementBadgeProps {
  achievement: AchievementItem;
}

const getAchievementIconAsset = (icon: string) => {
  if (icon === 'flash' || icon === '⚡') return uiAssets.icons.energy;
  if (icon === 'eye' || icon === '👁️') return uiAssets.icons.search;
  if (icon === 'trophy' || icon === '👑') return uiAssets.icons.crown;
  if (icon === 'sync' || icon === '🌀') return uiAssets.icons.shuffle;
  return uiAssets.icons.star;
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const { title, description, icon, unlocked, progress, maxProgress } = achievement;
  const percent = Math.min(100, Math.round((progress / maxProgress) * 100));
  const iconAsset = getAchievementIconAsset(icon);

  return (
    <View style={[styles.container, unlocked && PBShadows.amberGlow]}>
      <LinearGradient
        colors={
          unlocked
            ? (['#233F4F', '#142934'] as const)
            : (['#142028', '#0B1318'] as const)
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.body, unlocked && styles.bodyUnlocked]}
      >
        {/* Left Crest Graphic */}
        <View style={styles.crestBox}>
          <Svg width={46} height={46} viewBox="0 0 50 50">
            <Polygon
              points="25,4 46,15 46,35 25,46 4,35 4,15"
              fill={unlocked ? '#D97706' : '#1E293B'}
              stroke={unlocked ? '#FFD54A' : '#475569'}
              strokeWidth="2"
            />
            <Circle
              cx="25"
              cy="25"
              r="15"
              fill={unlocked ? 'rgba(255, 213, 74, 0.25)' : 'rgba(0, 0, 0, 0.4)'}
            />
          </Svg>
          <View style={styles.vectorIconHolder}>
            <Image
              source={iconAsset}
              style={[styles.crestIcon, !unlocked && { opacity: 0.4 }]}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Right Details */}
        <View style={styles.detailsCol}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, unlocked && styles.titleUnlocked]}>
              {title}
            </Text>
            {unlocked ? (
              <View style={styles.unlockedPill}>
                <Text style={styles.unlockedText}>UNLOCKED</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.desc}>{description}</Text>

          {/* Progress Bar */}
          {!unlocked ? (
            <View style={styles.progressContainer}>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {progress}/{maxProgress}
              </Text>
            </View>
          ) : null}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: PBRadius.lg,
    marginVertical: 5,
    overflow: 'hidden',
  },
  body: {
    borderRadius: PBRadius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(169, 187, 197, 0.16)',
    gap: 14,
  },
  bodyUnlocked: {
    borderColor: 'rgba(255, 213, 74, 0.5)',
  },
  crestBox: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  vectorIconHolder: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crestIcon: {
    width: 22,
    height: 22,
  },
  detailsCol: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontWeight: '900',
    color: PBColors.textSecondary,
    letterSpacing: 0.8,
  },
  titleUnlocked: {
    color: PBColors.accent,
  },
  desc: {
    fontSize: 11,
    color: PBColors.textMuted,
    lineHeight: 15,
  },
  unlockedPill: {
    backgroundColor: 'rgba(255, 213, 74, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: PBColors.accent,
  },
  unlockedText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 0.8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
    borderWidth: 0.8,
    borderColor: 'rgba(25, 211, 255, 0.2)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PBColors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '800',
    color: PBColors.textMuted,
  },
});
