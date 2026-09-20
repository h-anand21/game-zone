// ============================================================
// GameHub — Battle Screen (Placeholder)
// ============================================================

import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

export default function BattleScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Battle Arena</Text>
        <Text style={styles.subtitle}>FPS multiplayer combat</Text>
      </View>

      <View style={styles.comingSoon}>
        <Text style={styles.comingSoonIcon}>⚔️</Text>
        <Text style={styles.comingSoonTitle}>Coming Soon</Text>
        <Text style={styles.comingSoonText}>
          The Battle Arena with 5 FPS game modes is being built.{'\n'}
          Free For All • Team Deathmatch • Gun Game{'\n'}
          Capture Point • 1v1 Duel
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Phase 8+</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  title: { fontSize: Typography.h1, color: Colors.textPrimary, fontWeight: Typography.extrabold },
  subtitle: { fontSize: Typography.bodySmall, color: Colors.textMuted, marginTop: 2 },
  comingSoon: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl,
  },
  comingSoonIcon: { fontSize: 64, marginBottom: Spacing.md },
  comingSoonTitle: {
    fontSize: Typography.h2, color: Colors.textPrimary, fontWeight: Typography.bold,
    marginBottom: Spacing.sm,
  },
  comingSoonText: {
    fontSize: Typography.bodySmall, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 22,
  },
  badge: {
    marginTop: Spacing.lg, backgroundColor: Colors.categoryBattle + '20',
    borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  badgeText: { fontSize: Typography.caption, color: Colors.categoryBattle, fontWeight: Typography.semibold },
});
