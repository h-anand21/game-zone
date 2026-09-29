// ============================================================
// Mind Lock — Screen 12: Achievements & Badges Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Mascot } from '../components/Mascot';
import { ProgressBar } from '../components/ProgressBar';
import { BadgeCard } from '../components/BadgeCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { useMindLockStore } from '../store/mindLockStore';
import type { AchievementGroup } from '../types';

export const AchievementsScreen: React.FC = () => {
  const { achievements } = useMindLockStore();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  const filters = [
    { id: 'all', label: 'All', icon: '▦' },
    { id: 'gameplay', label: 'Game Play', icon: '🎮' },
    { id: 'speed', label: 'Speed', icon: '⚡' },
    { id: 'streak', label: 'Streak', icon: '🔥' },
    { id: 'mastery', label: 'Mastery', icon: '👑' },
  ];

  const sections: { group: AchievementGroup; title: string; icon: string }[] = [
    { group: 'gameplay', title: 'Game Play Badges', icon: '🧠' },
    { group: 'speed', title: 'Speed Challenge Badges', icon: '⚡' },
    { group: 'streak', title: 'Streak Badges', icon: '🔥' },
    { group: 'mastery', title: 'Pattern Mastery Badges', icon: '👑' },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Achievements" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner with Mascot */}
        <View style={styles.bannerRow}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>ACHIEVEMENTS</Text>
            <Text style={styles.bannerSub}>
              Collect badges. Complete challenges. Show your progress!
            </Text>
          </View>
          <Mascot mood="achievements" size={105} />
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((f) => {
            const isSelected = selectedFilter === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setSelectedFilter(f.id)}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillSelected,
                ]}
              >
                <Text style={styles.filterIcon}>{f.icon}</Text>
                <Text
                  style={[
                    styles.filterLabel,
                    isSelected && styles.filterLabelSelected,
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Overall Achievement Progress Card */}
        <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.overallCard}>
          <View style={styles.overallLeft}>
            <Text style={styles.trophyEmoji}>🏆</Text>
            <View style={styles.overallInfo}>
              <View style={styles.overallLabels}>
                <Text style={styles.overallTitle}>Achievement Progress</Text>
                <Text style={styles.overallCount}>
                  {unlockedCount} / {totalCount} ({Math.round((unlockedCount / totalCount) * 100)}%)
                </Text>
              </View>
              <ProgressBar
                progress={unlockedCount / totalCount}
                colorVariant="gold"
                height={8}
              />
            </View>
          </View>

          <View style={styles.nextRewardBox}>
            <Text style={styles.nextRewardLabel}>Next Reward</Text>
            <Text style={styles.chestIcon}>🎁</Text>
            <Text style={styles.nextRewardTarget}>18 / 30</Text>
            <Text style={styles.nextRewardName}>Rare Chest</Text>
          </View>
        </LinearGradient>

        {/* Badge Category Sections */}
        {sections.map((sec) => {
          if (selectedFilter !== 'all' && selectedFilter !== sec.group) {
            return null;
          }

          const groupBadges = achievements.filter((a) => a.group === sec.group);
          const groupUnlocked = groupBadges.filter((a) => a.unlocked).length;

          return (
            <View key={sec.group} style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderLeft}>
                  <Text style={styles.sectionIcon}>{sec.icon}</Text>
                  <Text style={styles.sectionTitle}>{sec.title}</Text>
                </View>
                <Text style={styles.sectionFraction}>
                  {groupUnlocked} / {groupBadges.length} Unlocked ›
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.badgesScroll}
              >
                {groupBadges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    title={badge.title}
                    description={badge.description}
                    unlocked={badge.unlocked}
                    current={badge.current}
                    target={badge.target}
                  />
                ))}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>

      <BottomNavigation currentTab="achievements" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MLColors.background,
  },
  scrollContent: {
    paddingHorizontal: MLSpacing.base,
    paddingBottom: MLSpacing.xl,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F2033',
    padding: MLSpacing.md,
    borderRadius: MLRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    marginVertical: MLSpacing.sm,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: MLColors.primary,
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
    letterSpacing: 1,
  },
  bannerSub: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    marginTop: 2,
    lineHeight: 16,
  },
  filterRow: {
    gap: MLSpacing.sm,
    paddingVertical: MLSpacing.sm,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E1D2E',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: MLRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
    gap: 6,
  },
  filterPillSelected: {
    backgroundColor: MLColors.primary,
    borderColor: '#FFF4DE',
    ...MLShadows.glowGold,
  },
  filterIcon: {
    fontSize: 14,
  },
  filterLabel: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
  },
  filterLabelSelected: {
    color: '#0A121D',
  },
  overallCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: MLSpacing.md,
    borderRadius: MLRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 40, 0.25)',
    marginVertical: MLSpacing.sm,
    gap: MLSpacing.md,
  },
  overallLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: MLSpacing.sm,
  },
  trophyEmoji: {
    fontSize: 26,
  },
  overallInfo: {
    flex: 1,
  },
  overallLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  overallTitle: {
    color: MLColors.white,
    fontSize: MLTypography.bodySmall,
    fontWeight: MLTypography.bold,
  },
  overallCount: {
    color: MLColors.primary,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.black,
  },
  nextRewardBox: {
    backgroundColor: '#091523',
    padding: 8,
    borderRadius: MLRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.1)',
    alignItems: 'center',
    minWidth: 80,
  },
  nextRewardLabel: {
    color: MLColors.textDim,
    fontSize: 8,
  },
  chestIcon: {
    fontSize: 18,
    marginVertical: 2,
  },
  nextRewardTarget: {
    color: MLColors.primary,
    fontSize: 9,
    fontWeight: MLTypography.bold,
  },
  nextRewardName: {
    color: MLColors.textMuted,
    fontSize: 8,
  },
  sectionContainer: {
    marginTop: MLSpacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: MLSpacing.sm,
    paddingHorizontal: 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    color: MLColors.white,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.bold,
  },
  sectionFraction: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
  },
  badgesScroll: {
    gap: MLSpacing.sm,
    paddingVertical: MLSpacing.xs,
  },
});
