// ============================================================
// GameHub — Home Screen
// ============================================================

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { GAME_REGISTRY, GAME_CATEGORIES } from '@/constants/games';
import { useProfileStore } from '@/store';

export default function HomeScreen() {
  const router = useRouter();
  const { level, xp, coins, totalGamesPlayed } = useProfileStore();

  const featuredGames = GAME_REGISTRY.filter(
    (g) => g.status === 'available' || g.status === 'coming-soon'
  ).slice(0, 6);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to</Text>
        <Text style={styles.title}>GameHub</Text>
        <Text style={styles.subtitle}>35 Games • One Platform</Text>
      </View>

      {/* Quick Play */}
      <Pressable
        style={({ pressed }) => [styles.quickPlayCard, pressed && styles.pressed]}
        onPress={() => router.push('/(tabs)/games')}
      >
        <Text style={styles.quickPlayIcon}>🎮</Text>
        <View style={styles.quickPlayContent}>
          <Text style={styles.quickPlayTitle}>Quick Play</Text>
          <Text style={styles.quickPlaySubtitle}>Jump into a random game</Text>
        </View>
        <Text style={styles.quickPlayArrow}>→</Text>
      </Pressable>

      {/* Stats Summary */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{xp}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalGamesPlayed}</Text>
          <Text style={styles.statLabel}>Games</Text>
        </View>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoriesGrid}>
        {GAME_CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={({ pressed }) => [styles.categoryCard, pressed && styles.pressed]}
            onPress={() => router.push('/(tabs)/games')}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
            <Text style={styles.categoryCount}>
              {GAME_REGISTRY.filter((g) => g.category === cat.id).length}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Featured Games */}
      <Text style={styles.sectionTitle}>Featured Games</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
        {featuredGames.map((game) => (
          <Pressable
            key={game.id}
            style={({ pressed }) => [styles.featuredCard, pressed && styles.pressed]}
          >
            <Text style={styles.featuredIcon}>{game.icon}</Text>
            <Text style={styles.featuredName}>{game.name}</Text>
            <Text style={styles.featuredCategory}>{game.category}</Text>
            {game.status === 'coming-soon' && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: Spacing.md,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  title: {
    fontSize: 40,
    color: Colors.textPrimary,
    fontWeight: Typography.extrabold,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  quickPlayCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  quickPlayIcon: {
    fontSize: 36,
    marginRight: Spacing.md,
  },
  quickPlayContent: {
    flex: 1,
  },
  quickPlayTitle: {
    fontSize: Typography.h3,
    color: '#FFFFFF',
    fontWeight: Typography.bold,
  },
  quickPlaySubtitle: {
    fontSize: Typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  quickPlayArrow: {
    fontSize: Typography.h2,
    color: '#FFFFFF',
    fontWeight: Typography.bold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: Typography.h3,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  statLabel: {
    fontSize: Typography.tiny,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: Typography.medium,
  },
  sectionTitle: {
    fontSize: Typography.h4,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    marginBottom: Spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  categoryCard: {
    width: '31%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  categoryLabel: {
    fontSize: Typography.caption,
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
  categoryCount: {
    fontSize: Typography.tiny,
    color: Colors.textMuted,
    marginTop: 2,
  },
  featuredScroll: {
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  featuredCard: {
    width: 140,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  featuredIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  featuredName: {
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
    textAlign: 'center',
  },
  featuredCategory: {
    fontSize: Typography.tiny,
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.warning,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  comingSoonText: {
    fontSize: 9,
    color: Colors.textInverse,
    fontWeight: Typography.bold,
  },
  bottomSpacer: {
    height: 100,
  },
});
