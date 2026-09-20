// ============================================================
// GameHub — Profile Screen
// ============================================================

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useProfileStore, useAuthStore } from '@/store';

export default function ProfileScreen() {
  const router = useRouter();
  const { displayName, username, avatarUrl, xp, level, coins, totalGamesPlayed, achievementCount } = useProfileStore();
  const { isGuest } = useAuthStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Pressable onPress={() => router.push('/settings')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </Pressable>
      </View>

      {/* Avatar & Name */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.username}>@{username}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Level {level}</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{xp}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalGamesPlayed}</Text>
          <Text style={styles.statLabel}>Games Played</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{achievementCount}</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
      </View>

      {/* Sections */}
      <Pressable style={styles.menuItem}>
        <Text style={styles.menuIcon}>🏆</Text>
        <Text style={styles.menuText}>Achievements</Text>
        <Text style={styles.menuArrow}>›</Text>
      </Pressable>
      <Pressable style={styles.menuItem}>
        <Text style={styles.menuIcon}>📊</Text>
        <Text style={styles.menuText}>Game Statistics</Text>
        <Text style={styles.menuArrow}>›</Text>
      </Pressable>
      <Pressable style={styles.menuItem}>
        <Text style={styles.menuIcon}>🏅</Text>
        <Text style={styles.menuText}>Leaderboards</Text>
        <Text style={styles.menuArrow}>›</Text>
      </Pressable>
      <Pressable style={styles.menuItem}>
        <Text style={styles.menuIcon}>📜</Text>
        <Text style={styles.menuText}>Match History</Text>
        <Text style={styles.menuArrow}>›</Text>
      </Pressable>

      <View style={styles.accountSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.accountNote}>
          Playing as guest. Create a cloud account to sync your progress across devices.
        </Text>
        <Pressable style={styles.createAccountButton}>
          <Text style={styles.createAccountText}>Create Account</Text>
        </Pressable>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingTop: 60, paddingHorizontal: Spacing.md },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: { fontSize: Typography.h1, color: Colors.textPrimary, fontWeight: Typography.extrabold },
  settingsIcon: { fontSize: 24 },
  profileCard: {
    alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.xl, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
    ...Shadows.medium,
  },
  avatarText: { fontSize: 32, color: '#FFFFFF', fontWeight: Typography.bold },
  displayName: { fontSize: Typography.h3, color: Colors.textPrimary, fontWeight: Typography.bold },
  username: { fontSize: Typography.bodySmall, color: Colors.textMuted, marginTop: 2 },
  levelBadge: {
    marginTop: Spacing.sm, backgroundColor: Colors.primary + '20', borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
  },
  levelText: { fontSize: Typography.caption, color: Colors.primary, fontWeight: Typography.semibold },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: {
    width: '48%', backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  statValue: { fontSize: Typography.h2, color: Colors.textPrimary, fontWeight: Typography.bold },
  statLabel: { fontSize: Typography.caption, color: Colors.textMuted, marginTop: 2 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  menuIcon: { fontSize: 20, marginRight: Spacing.md },
  menuText: { flex: 1, fontSize: Typography.body, color: Colors.textPrimary, fontWeight: Typography.medium },
  menuArrow: { fontSize: 20, color: Colors.textMuted },
  accountSection: {
    marginTop: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: Typography.h4, color: Colors.textPrimary, fontWeight: Typography.bold,
    marginBottom: Spacing.sm,
  },
  accountNote: { fontSize: Typography.bodySmall, color: Colors.textSecondary, lineHeight: 20 },
  createAccountButton: {
    marginTop: Spacing.md, backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, alignItems: 'center',
  },
  createAccountText: { fontSize: Typography.body, color: '#FFFFFF', fontWeight: Typography.semibold },
  bottomSpacer: { height: 100 },
});
