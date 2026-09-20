// ============================================================
// GameHub — Dynamic Game Route
// ============================================================

import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getGameById } from '@/constants/games';
import { Colors, Spacing, Typography, BorderRadius, CATEGORY_COLORS } from '@/constants/theme';

export default function GameScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const router = useRouter();
  const game = getGameById(gameId);

  if (!game) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorText}>Game not found</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const categoryColor = CATEGORY_COLORS[game.category] || Colors.primary;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backArrow}>
          <Text style={styles.backArrowText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{game.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Game Area */}
      <View style={styles.center}>
        <View style={[styles.iconWrapper, { backgroundColor: categoryColor + '20' }]}>
          <Text style={styles.gameIcon}>{game.icon}</Text>
        </View>
        <Text style={styles.gameName}>{game.name}</Text>
        <Text style={styles.gameDescription}>{game.description}</Text>

        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: categoryColor + '20' }]}>
            <Text style={[styles.tagText, { color: categoryColor }]}>{game.category}</Text>
          </View>
          {game.offline && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>Offline</Text>
            </View>
          )}
        </View>

        {game.status === 'coming-soon' ? (
          <View style={styles.comingSoonCard}>
            <Text style={styles.comingSoonText}>🚧 Coming Soon</Text>
            <Text style={styles.comingSoonSubtext}>This game is under development</Text>
          </View>
        ) : (
          <Pressable style={[styles.playButton, { backgroundColor: categoryColor }]}>
            <Text style={styles.playButtonText}>▶ Play Now</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md,
  },
  backArrow: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backArrowText: { fontSize: 24, color: Colors.textPrimary },
  headerTitle: {
    fontSize: Typography.h4, color: Colors.textPrimary, fontWeight: Typography.semibold,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  iconWrapper: {
    width: 100, height: 100, borderRadius: BorderRadius.xl,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg,
  },
  gameIcon: { fontSize: 48 },
  gameName: {
    fontSize: Typography.h2, color: Colors.textPrimary, fontWeight: Typography.bold,
    marginBottom: Spacing.sm,
  },
  gameDescription: {
    fontSize: Typography.body, color: Colors.textSecondary, textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  tags: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  tag: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceLight,
  },
  tagText: { fontSize: Typography.caption, color: Colors.textMuted, fontWeight: Typography.medium, textTransform: 'capitalize' },
  playButton: {
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.lg, minWidth: 200, alignItems: 'center',
  },
  playButtonText: { fontSize: Typography.h4, color: '#FFFFFF', fontWeight: Typography.bold },
  comingSoonCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  comingSoonText: {
    fontSize: Typography.h4, color: Colors.warning, fontWeight: Typography.semibold,
  },
  comingSoonSubtext: { fontSize: Typography.bodySmall, color: Colors.textMuted, marginTop: Spacing.xs },
  errorIcon: { fontSize: 48, marginBottom: Spacing.md },
  errorText: { fontSize: Typography.h3, color: Colors.textPrimary, fontWeight: Typography.semibold },
  backButton: {
    marginTop: Spacing.lg, backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl,
  },
  backButtonText: { color: '#FFFFFF', fontSize: Typography.body, fontWeight: Typography.semibold },
});
