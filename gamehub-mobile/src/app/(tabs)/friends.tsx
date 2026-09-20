// ============================================================
// GameHub — Friends Screen (Placeholder)
// ============================================================

import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

export default function FriendsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <Text style={styles.subtitle}>Play together, compete together</Text>
      </View>

      <View style={styles.comingSoon}>
        <Text style={styles.comingSoonIcon}>👥</Text>
        <Text style={styles.comingSoonTitle}>Coming Soon</Text>
        <Text style={styles.comingSoonText}>
          Add friends, send game invitations, and compete on leaderboards together.
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Phase 7+</Text>
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
    fontSize: Typography.bodySmall, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22,
  },
  badge: {
    marginTop: Spacing.lg, backgroundColor: Colors.primaryLight + '20',
    borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  badgeText: { fontSize: Typography.caption, color: Colors.primaryLight, fontWeight: Typography.semibold },
});
