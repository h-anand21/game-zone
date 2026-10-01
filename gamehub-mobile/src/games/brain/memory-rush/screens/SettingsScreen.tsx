import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MRIcon } from '../components/MRIcon';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { GameBackground } from '../components/GameBackground';
import { GlassCard } from '../components/GlassCard';
import { BottomTabBar, TabType } from '../components/BottomTabBar';
import { useMemoryRushStore } from '../store/memoryRushStore';

interface SettingsScreenProps {
  onNavigateTab: (tab: TabType) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigateTab }) => {
  const { settings, updateSettings, resetProgress } = useMemoryRushStore();

  const handleReset = () => {
    Alert.alert(
      "RESET PROGRESS",
      "Are you sure you want to reset all your stats, scores, and streak data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Everything",
          style: "destructive",
          onPress: () => resetProgress(),
        },
      ]
    );
  };

  const renderToggle = (
    label: string,
    description: string,
    value: boolean,
    onValueChange: (val: boolean) => void,
    icon: string
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingIconBox}>
        <MRIcon name={icon} size={18} color={colors.accent} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surfaceElevated, true: 'rgba(34, 211, 238, 0.4)' }}
        thumbColor={value ? colors.accent : colors.textSecondary}
      />
    </View>
  );

  return (
    <GameBackground variant="stats">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerSubtitle}>PREFERENCES</Text>
            <Text style={styles.headerTitle}>SETTINGS</Text>
          </View>

          {/* GAME SECTION */}
          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>GAMEPLAY</Text>
            {renderToggle(
              "Sound Effects",
              "Audio feedback during gameplay",
              settings.soundEnabled,
              (val) => updateSettings({ soundEnabled: val }),
              "volume-2"
            )}
            {renderToggle(
              "Haptic Feedback",
              "Tactile vibration on taps and answers",
              settings.vibrationEnabled,
              (val) => updateSettings({ vibrationEnabled: val }),
              "smartphone"
            )}
            {renderToggle(
              "Arcade Animations",
              "Smooth tile scale and pulse motion",
              settings.animationsEnabled,
              (val) => updateSettings({ animationsEnabled: val }),
              "activity"
            )}
            {renderToggle(
              "Smart Difficulty",
              "Auto-adjust preview time based on accuracy",
              settings.smartDifficulty,
              (val) => updateSettings({ smartDifficulty: val }),
              "cpu"
            )}
          </GlassCard>

          {/* ACCESSIBILITY SECTION */}
          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>ACCESSIBILITY</Text>
            {renderToggle(
              "High Contrast",
              "Sharper borders and higher tile visibility",
              settings.highContrast,
              (val) => updateSettings({ highContrast: val }),
              "eye"
            )}
            {renderToggle(
              "Large Numbers",
              "Increased typography scale for number tiles",
              settings.largeNumbers,
              (val) => updateSettings({ largeNumbers: val }),
              "type"
            )}
            {renderToggle(
              "Reduced Motion",
              "Minimize UI transitions and particle effects",
              settings.reducedMotion,
              (val) => updateSettings({ reducedMotion: val }),
              "feather"
            )}
          </GlassCard>

          {/* DATA SECTION */}
          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>DATA & SAVES</Text>
            <TouchableOpacity style={styles.dangerRow} onPress={handleReset} activeOpacity={0.7}>
              <View style={[styles.settingIconBox, { backgroundColor: 'rgba(251, 113, 133, 0.15)' }]}>
                <MRIcon name="trash-2" size={18} color={colors.danger} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.danger }]}>Reset Progress</Text>
                <Text style={styles.settingDesc}>Clear local high scores and stats history</Text>
              </View>
            </TouchableOpacity>
          </GlassCard>

          <View style={styles.footer}>
            <Text style={styles.versionText}>MEMORY RUSH v1.0.0</Text>
            <Text style={styles.copyrightText}>ARCADE BRAIN ENGINE</Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomTabBar currentScreen="settings" onNavigate={(scr) => onNavigateTab(scr as any)} />
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  sectionCard: {
    padding: 18,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 8,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  settingDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginVertical: 16,
    gap: 4,
  },
  versionText: {
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  copyrightText: {
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 1.5,
    opacity: 0.6,
  },
});
