// ============================================================
// DON'T TAP WRONG — Screen 14: Settings Screen
// Toggles for Sound, Haptics, Motion, Graphics & Data Reset
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, Alert, ScrollView } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { HeaderBar } from '../components/common/HeaderBar';
import { ArcadeButton } from '../components/common/ArcadeButton';
import { DtwColors } from '../theme/colors';
import type { GameSettings } from '../types';

interface SettingsScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetData: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onBack,
}) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);

  const updateField = <K extends keyof GameSettings>(field: K, value: GameSettings[K]) => {
    const next = { ...localSettings, [field]: value };
    setLocalSettings(next);
    onUpdateSettings(next);
  };

  const handleResetConfirm = () => {
    Alert.alert(
      'RESET ALL GAME DATA?',
      'This will erase all high scores, streak records, and play history for Don’t Tap Wrong. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'RESET DATA',
          style: 'destructive',
          onPress: () => {
            onResetData();
            Alert.alert('DATA RESET', 'All Don’t Tap Wrong records have been restored to defaults.');
          },
        },
      ]
    );
  };

  return (
    <BackgroundLayer variant="lobby">
      <View style={styles.container}>
        <HeaderBar
          title="SETTINGS"
          subtitle="SYSTEM CONFIGURATION"
          onBack={onBack}
        />

        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {/* Audio Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>🔊 AUDIO & SOUND</Text>

            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>SOUND EFFECTS</Text>
                <Text style={styles.settingSub}>Tactile hit clicks and buzzer cues</Text>
              </View>
              <Switch
                value={localSettings.soundEnabled}
                onValueChange={(val) => updateField('soundEnabled', val)}
                trackColor={{ false: '#202B37', true: DtwColors.safeGreen }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>MUSIC & AMBIENCE</Text>
                <Text style={styles.settingSub}>Atmospheric arena background tone</Text>
              </View>
              <Switch
                value={localSettings.musicEnabled}
                onValueChange={(val) => updateField('musicEnabled', val)}
                trackColor={{ false: '#202B37', true: DtwColors.cyanAccent }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Feedback & Accessibility */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>⚡ SENSORY & ACCESSIBILITY</Text>

            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>HAPTIC FEEDBACK</Text>
                <Text style={styles.settingSub}>Physical vibrations on taps & milestones</Text>
              </View>
              <Switch
                value={localSettings.hapticsEnabled}
                onValueChange={(val) => updateField('hapticsEnabled', val)}
                trackColor={{ false: '#202B37', true: DtwColors.safeGreen }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>REDUCE MOTION</Text>
                <Text style={styles.settingSub}>Minimize screen flashes and expansions</Text>
              </View>
              <Switch
                value={localSettings.reducedMotion}
                onValueChange={(val) => updateField('reducedMotion', val)}
                trackColor={{ false: '#202B37', true: DtwColors.streakGold }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Dangerous Zone */}
          <View style={[styles.sectionCard, styles.dangerCard]}>
            <Text style={[styles.sectionTitle, { color: DtwColors.dangerRed }]}>
              ⚠️ DANGER ZONE
            </Text>
            <Text style={styles.dangerDesc}>
              Clear local records, personal bests, and career statistics.
            </Text>

            <ArcadeButton
              title="RESET ALL GAME DATA"
              variant="red"
              size="normal"
              onPress={handleResetConfirm}
              style={styles.resetBtn}
            />
          </View>
        </ScrollView>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollList: {
    padding: 16,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: 'rgba(21, 28, 37, 0.9)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: DtwColors.cyanAccent,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: DtwColors.textPrimary,
    letterSpacing: 1,
  },
  settingSub: {
    fontSize: 10,
    color: DtwColors.textMuted,
    marginTop: 2,
  },
  dangerCard: {
    borderColor: 'rgba(255, 82, 93, 0.3)',
    backgroundColor: 'rgba(46, 18, 21, 0.4)',
  },
  dangerDesc: {
    fontSize: 11,
    color: DtwColors.textSecondary,
    marginBottom: 14,
  },
  resetBtn: {
    width: '100%',
  },
});

export default SettingsScreen;
