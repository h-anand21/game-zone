// ============================================================
// Mind Lock — Screen 13: Profile Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { XPBar } from '../components/XPBar';
import { StatCard } from '../components/StatCard';
import { BadgeCard } from '../components/BadgeCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { SecondaryButton } from '../components/SecondaryButton';
import { useMindLockStore } from '../store/mindLockStore';

export const ProfileScreen: React.FC = () => {
  const { profile, stats, achievements, setScreen } = useMindLockStore();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Player Profile" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card with Avatar & Level */}
        <LinearGradient colors={['#172C46', '#0E1D30']} style={styles.profileCard}>
          <View style={styles.avatarBorder}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          </View>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userTitle}>Mind Master Apprentice</Text>

          {/* XP Progress Bar */}
          <View style={styles.xpBarWrapper}>
            <XPBar
              currentXP={profile.xp}
              targetXP={profile.xpNextLevel}
              currentLevel={profile.level}
            />
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>PLAYER METRICS</Text>
          <View style={styles.statsRow}>
            <StatCard
              label="Best Score"
              value={stats.bestScore}
              icon={<Text style={{ fontSize: 16 }}>🏆</Text>}
            />
            <StatCard
              label="Highest Round"
              value={stats.highestRound}
              icon={<Text style={{ fontSize: 16 }}>🎯</Text>}
            />
            <StatCard
              label="Best Streak"
              value={stats.bestStreak}
              icon={<Text style={{ fontSize: 16 }}>🔥</Text>}
            />
          </View>
          <View style={[styles.statsRow, { marginTop: MLSpacing.sm }]}>
            <StatCard
              label="Total Games"
              value={stats.totalGames}
              icon={<Text style={{ fontSize: 16 }}>🎮</Text>}
            />
            <StatCard
              label="Accuracy"
              value={`${stats.accuracy}%`}
              icon={<Text style={{ fontSize: 16 }}>🎯</Text>}
            />
            <StatCard
              label="Play Time"
              value="3h 45m"
              icon={<Text style={{ fontSize: 16 }}>⏱️</Text>}
            />
          </View>
        </View>

        {/* Recent Badges Unlocked */}
        <View style={styles.badgeSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>RECENT BADGES</Text>
            <Text
              style={styles.viewAllText}
              onPress={() => setScreen('achievements')}
            >
              View All ›
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesScroll}
          >
            {achievements.filter((a) => a.unlocked).map((badge) => (
              <BadgeCard
                key={badge.id}
                title={badge.title}
                description={badge.description}
                unlocked={true}
              />
            ))}
          </ScrollView>
        </View>

        {/* Action Button: Settings */}
        <SecondaryButton
          title="SETTINGS & CONTROLS"
          onPress={() => setScreen('settings')}
          style={styles.settingsBtn}
        />
      </ScrollView>

      <BottomNavigation currentTab="profile" />
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
  profileCard: {
    alignItems: 'center',
    padding: MLSpacing.lg,
    borderRadius: MLRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 40, 0.25)',
    marginVertical: MLSpacing.sm,
    ...MLShadows.md,
  },
  avatarBorder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: MLColors.primary,
    overflow: 'hidden',
    marginBottom: MLSpacing.sm,
    ...MLShadows.glowGold,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    color: MLColors.white,
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
  },
  userTitle: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    marginTop: 2,
  },
  xpBarWrapper: {
    width: '100%',
    marginTop: MLSpacing.md,
  },
  statsSection: {
    marginVertical: MLSpacing.md,
  },
  sectionTitle: {
    color: MLColors.textMuted,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.black,
    letterSpacing: 1,
    marginBottom: MLSpacing.sm,
    paddingHorizontal: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: MLSpacing.sm,
  },
  badgeSection: {
    marginVertical: MLSpacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: MLSpacing.sm,
  },
  viewAllText: {
    color: MLColors.primary,
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.bold,
  },
  badgesScroll: {
    gap: MLSpacing.sm,
    paddingVertical: MLSpacing.xs,
  },
  settingsBtn: {
    marginTop: MLSpacing.md,
    marginBottom: MLSpacing.lg,
  },
});
