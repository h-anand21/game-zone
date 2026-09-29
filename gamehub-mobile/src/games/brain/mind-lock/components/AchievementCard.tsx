// ============================================================
// Mind Lock — Challenge / Achievement Card Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ProgressBar } from './ProgressBar';

interface AchievementCardProps {
  title: string;
  description: string;
  current: number;
  target: number;
  rewardType: 'coins' | 'xp' | 'badge' | 'chest';
  rewardAmount: number | string;
  icon: React.ReactNode;
  accentColor?: string;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  current,
  target,
  rewardType,
  rewardAmount,
  icon,
  accentColor = MLColors.primary,
}) => {
  const progress = Math.min(1, current / target);

  const renderReward = () => {
    switch (rewardType) {
      case 'coins':
        return (
          <View style={styles.rewardBox}>
            <Text style={styles.rewardIcon}>🪙</Text>
            <View>
              <Text style={styles.rewardLabel}>Reward</Text>
              <Text style={styles.rewardValue}>{rewardAmount} Coins</Text>
            </View>
          </View>
        );
      case 'xp':
        return (
          <View style={styles.rewardBox}>
            <View style={styles.xpCircle}>
              <Text style={styles.xpText}>XP</Text>
            </View>
            <View>
              <Text style={styles.rewardLabel}>Reward</Text>
              <Text style={styles.rewardValue}>{rewardAmount} XP</Text>
            </View>
          </View>
        );
      case 'badge':
        return (
          <View style={styles.rewardBox}>
            <Text style={styles.rewardIcon}>👑</Text>
            <View>
              <Text style={styles.rewardLabel}>Reward</Text>
              <Text style={styles.rewardValue}>{rewardAmount}</Text>
            </View>
          </View>
        );
      case 'chest':
      default:
        return (
          <View style={styles.rewardBox}>
            <Text style={styles.rewardIcon}>🎁</Text>
            <View>
              <Text style={styles.rewardLabel}>Reward</Text>
              <Text style={styles.rewardValue}>{rewardAmount}</Text>
            </View>
          </View>
        );
    }
  };

  return (
    <LinearGradient
      colors={['#172B45', '#0E1C2D']}
      style={[
        styles.card,
        {
          borderColor: accentColor,
          borderWidth: 1.5,
          shadowColor: accentColor,
          shadowRadius: 6,
          shadowOpacity: 0.35,
        },
      ]}
    >
      <View style={styles.mainRow}>
        {/* Left Hexagonal Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#243D5F', '#112238']}
            style={[styles.hexagon, { borderColor: accentColor }]}
          >
            {icon}
          </LinearGradient>
        </View>

        {/* Center Details */}
        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {current}/{target}
              </Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>

          <View style={styles.progressSection}>
            <ProgressBar
              progress={progress}
              colorVariant={
                accentColor === MLColors.padGreen
                  ? 'green'
                  : accentColor === MLColors.padBlue
                  ? 'blue'
                  : accentColor === MLColors.danger
                  ? 'red'
                  : accentColor === MLColors.purple
                  ? 'purple'
                  : 'gold'
              }
              height={7}
            />
            <View style={styles.progressBottom}>
              <Text style={styles.progressLabel}>Complete {target} rounds</Text>
              <Text style={styles.progressValue}>
                {current} / {target}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Reward Box */}
        <View style={styles.rightSection}>{renderReward()}</View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: MLRadius.xl,
    padding: MLSpacing.md,
    marginBottom: MLSpacing.md,
    ...MLShadows.sm,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MLSpacing.sm,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexagon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: MLColors.white,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.bold,
  },
  countBadge: {
    backgroundColor: '#091524',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: MLRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.1)',
  },
  countText: {
    color: MLColors.textMuted,
    fontSize: 10,
    fontWeight: MLTypography.bold,
  },
  description: {
    color: MLColors.textMuted,
    fontSize: 11,
    lineHeight: 14,
  },
  progressSection: {
    marginTop: 4,
    gap: 3,
  },
  progressBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: MLColors.textDim,
    fontSize: 9,
  },
  progressValue: {
    color: MLColors.textMuted,
    fontSize: 9,
    fontWeight: MLTypography.semibold,
  },
  rightSection: {
    marginLeft: 4,
  },
  rewardBox: {
    backgroundColor: '#0A1523',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: MLRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 40, 0.25)',
    alignItems: 'center',
    gap: 2,
    minWidth: 68,
  },
  rewardIcon: {
    fontSize: 18,
  },
  rewardLabel: {
    color: MLColors.textDim,
    fontSize: 8,
    textAlign: 'center',
  },
  rewardValue: {
    color: MLColors.primary,
    fontSize: 10,
    fontWeight: MLTypography.bold,
    textAlign: 'center',
  },
  xpCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: MLColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: MLTypography.black,
  },
});
