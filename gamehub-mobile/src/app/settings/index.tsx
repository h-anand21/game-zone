// ============================================================
// GameHub — Settings Screen
// ============================================================

import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { useState } from 'react';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Audio */}
      <Text style={styles.sectionTitle}>Audio</Text>
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sound Effects</Text>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: Colors.surfaceLight, true: Colors.primary + '80' }}
            thumbColor={soundEnabled ? Colors.primary : Colors.textMuted}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Music</Text>
          <Switch
            value={musicEnabled}
            onValueChange={setMusicEnabled}
            trackColor={{ false: Colors.surfaceLight, true: Colors.primary + '80' }}
            thumbColor={musicEnabled ? Colors.primary : Colors.textMuted}
          />
        </View>
        <View style={[styles.settingRow, styles.lastRow]}>
          <Text style={styles.settingLabel}>Vibration</Text>
          <Switch
            value={vibrateEnabled}
            onValueChange={setVibrateEnabled}
            trackColor={{ false: Colors.surfaceLight, true: Colors.primary + '80' }}
            thumbColor={vibrateEnabled ? Colors.primary : Colors.textMuted}
          />
        </View>
      </View>

      {/* Notifications */}
      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.section}>
        <View style={[styles.settingRow, styles.lastRow]}>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: Colors.surfaceLight, true: Colors.primary + '80' }}
            thumbColor={notificationsEnabled ? Colors.primary : Colors.textMuted}
          />
        </View>
      </View>

      {/* Data */}
      <Text style={styles.sectionTitle}>Data & Storage</Text>
      <View style={styles.section}>
        <Pressable style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sync Status</Text>
          <Text style={styles.settingValue}>Offline</Text>
        </Pressable>
        <Pressable style={[styles.settingRow, styles.lastRow]}>
          <Text style={styles.settingLabel}>Clear Local Cache</Text>
          <Text style={styles.settingValue}>›</Text>
        </Pressable>
      </View>

      {/* About */}
      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
        <View style={[styles.settingRow, styles.lastRow]}>
          <Text style={styles.settingLabel}>Build</Text>
          <Text style={styles.settingValue}>Phase 1</Text>
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  sectionTitle: {
    fontSize: Typography.caption, color: Colors.textMuted, fontWeight: Typography.semibold,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm, marginTop: Spacing.lg,
    marginLeft: Spacing.xs,
  },
  section: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1,
    borderColor: Colors.border, overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  lastRow: { borderBottomWidth: 0 },
  settingLabel: { fontSize: Typography.body, color: Colors.textPrimary },
  settingValue: { fontSize: Typography.body, color: Colors.textMuted },
  bottomSpacer: { height: 40 },
});
