// ============================================================
// Mind Lock — Screen 11: Challenges Dashboard Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Mascot } from '../components/Mascot';
import { AchievementCard } from '../components/AchievementCard';
import { BadgeCard } from '../components/BadgeCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { useMindLockStore } from '../store/mindLockStore';
import type { ChallengeCategory } from '../types';

export const ChallengesScreen: React.FC = () => {
  const { challenges, achievements, setScreen } = useMindLockStore();
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory>('all');

  const categories: { id: ChallengeCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '▦' },
    { id: 'memory', label: 'Memory', icon: '🧠' },
    { id: 'speed', label: 'Speed', icon: '⚡' },
    { id: 'streak', label: 'Streak', icon: '🔥' },
    { id: 'mastery', label: 'Mastery', icon: '👑' },
  ];

  const filteredChallenges =
    selectedCategory === 'all'
      ? challenges
      : challenges.filter((c) => c.category === selectedCategory);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Challenges" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner with Mascot holding trophy */}
        <View style={styles.bannerRow}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerCrown}>👑</Text>
            <Text style={styles.title}>CHALLENGES</Text>
            <Text style={styles.subtitle}>
              Push your memory. Unlock new rewards. Become a Mind Master!
            </Text>
          </View>
          <Mascot mood="challenges" size={110} />
        </View>

        {/* Category Pills Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
              >
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.catLabel,
                    isSelected && styles.catLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Challenge Cards List */}
        <View style={styles.challengesList}>
          {filteredChallenges.map((ch) => {
            let accentColor = MLColors.primary;
            let iconSvg = <Text style={{ fontSize: 20 }}>🧠</Text>;

            if (ch.category === 'memory') {
              accentColor = MLColors.padGreen;
              iconSvg = <Text style={{ fontSize: 20 }}>🧠</Text>;
            } else if (ch.category === 'speed') {
              accentColor = MLColors.padBlue;
              iconSvg = <Text style={{ fontSize: 20 }}>⚡</Text>;
            } else if (ch.category === 'streak') {
              accentColor = MLColors.danger;
              iconSvg = <Text style={{ fontSize: 20 }}>🔥</Text>;
            } else if (ch.category === 'mastery') {
              accentColor = MLColors.purple;
              iconSvg = <Text style={{ fontSize: 20 }}>👑</Text>;
            }

            return (
              <AchievementCard
                key={ch.id}
                title={ch.title}
                description={ch.description}
                current={ch.current}
                target={ch.target}
                rewardType={ch.rewardType}
                rewardAmount={ch.rewardAmount}
                accentColor={accentColor}
                icon={iconSvg}
              />
            );
          })}
        </View>

        {/* Horizontal Achievement Cards Preview */}
        <View style={styles.achievementPreviewSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Achievement Cards</Text>
              <Text style={styles.sectionSub}>Complete unique challenges to earn exclusive badges!</Text>
            </View>
            <Pressable onPress={() => setScreen('achievements')}>
              <Text style={styles.viewAllText}>View All ›</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalBadges}
          >
            {achievements.slice(0, 5).map((a) => (
              <BadgeCard
                key={a.id}
                title={a.title}
                description={a.description}
                unlocked={a.unlocked}
                current={a.current}
                target={a.target}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <BottomNavigation currentTab="challenges" />
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
  bannerCrown: {
    fontSize: 20,
    marginBottom: 2,
  },
  title: {
    color: MLColors.primary,
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
    letterSpacing: 1,
  },
  subtitle: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    marginTop: 2,
    lineHeight: 16,
  },
  categoryRow: {
    gap: MLSpacing.sm,
    paddingVertical: MLSpacing.sm,
  },
  categoryPill: {
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
  categoryPillActive: {
    backgroundColor: MLColors.primary,
    borderColor: '#FFF4DE',
    ...MLShadows.glowGold,
  },
  catIcon: {
    fontSize: 14,
  },
  catLabel: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
  },
  catLabelActive: {
    color: '#0A121D',
  },
  challengesList: {
    marginVertical: MLSpacing.sm,
  },
  achievementPreviewSection: {
    marginTop: MLSpacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: MLSpacing.sm,
  },
  sectionTitle: {
    color: MLColors.white,
    fontSize: MLTypography.bodyLarge,
    fontWeight: MLTypography.black,
  },
  sectionSub: {
    color: MLColors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  viewAllText: {
    color: MLColors.primary,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
  },
  horizontalBadges: {
    gap: MLSpacing.sm,
    paddingVertical: MLSpacing.xs,
  },
});
