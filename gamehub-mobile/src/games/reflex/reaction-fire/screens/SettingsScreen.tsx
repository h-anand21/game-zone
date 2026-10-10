// ============================================================
// REACTION FIRE — Screen 12: Settings & Configuration
// Audio, sensory haptics, motion toggles, tutorial replay & data reset
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBar } from '../components/HeaderBar';
import { ArcadeButton } from '../components/ArcadeButton';
import { RfColors } from '../theme';
import type { ReactionSettings } from '../types';

interface SettingsScreenProps {
  settings: ReactionSettings;
  onUpdateSettings: (newSettings: ReactionSettings) => void;
  onReplayIntro: () => void;
  onResetData: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onReplayIntro,
  onResetData,
  onBack,
}) => {
  const [local, setLocal] = useState<ReactionSettings>(settings);

  const update = <K extends keyof ReactionSettings>(key: K, val: ReactionSettings[K]) => {
    const next = { ...local, [key]: val };
    setLocal(next);
    onUpdateSettings(next);
  };

  const handleResetConfirm = () => {
    Alert.alert(
      'RESET REACTION FIRE DATA?',
      'This will erase all personal bests, reaction logs, daily challenge progress, and mission rewards. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'RESET ALL DATA',
          style: 'destructive',
          onPress: () => {
            onResetData();
            Alert.alert('DATA RESET', 'All Reaction Fire telemetry has been reset to defaults.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="SETTINGS"
        subtitle="SYSTEM PREFERENCES"
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        {/* Audio Toggles */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🔊 AUDIO & SOUND</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>SOUND EFFECTS</Text>
              <Text style={styles.settingSub}>Signal GO bursts & tactile tap feedback</Text>
            </View>
            <Switch
              value={local.soundEnabled}
              onValueChange={(val) => update('soundEnabled', val)}
              trackColor={{ false: '#183957', true: RfColors.goLime }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>AMBIENT MUSIC</Text>
              <Text style={styles.settingSub}>Atmospheric arena synthesizer tone</Text>
            </View>
            <Switch
              value={local.musicEnabled}
              onValueChange={(val) => update('musicEnabled', val)}
              trackColor={{ false: '#183957', true: RfColors.primaryBlue }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Gameplay & Sensory Toggles */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚡ SENSORY & FEEDBACK</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>HAPTIC VIBRATION</Text>
              <Text style={styles.settingSub}>Physical feedback on hits & false starts</Text>
            </View>
            <Switch
              value={local.hapticsEnabled}
              onValueChange={(val) => update('hapticsEnabled', val)}
              trackColor={{ false: '#183957', true: RfColors.goLime }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>REDUCED MOTION</Text>
              <Text style={styles.settingSub}>Minimize radar rotation & screen sweeps</Text>
            </View>
            <Switch
              value={local.reducedMotion}
              onValueChange={(val) => update('reducedMotion', val)}
              trackColor={{ false: '#183957', true: RfColors.rewardGold }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Tutorial & Onboarding */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📖 TUTORIAL</Text>
          <ArcadeButton
            title="REPLAY INTRO ONBOARDING"
            variant="glass"
            size="normal"
            icon="🔄"
            onPress={onReplayIntro}
            style={styles.btn}
          />
        </View>

        {/* Data Danger Zone */}
        <View style={[styles.sectionCard, styles.dangerCard]}>
          <Text style={[styles.sectionTitle, { color: RfColors.signalRed }]}>⚠️ DANGER ZONE</Text>
          <Text style={styles.dangerDesc}>
            Clear all saved reaction logs, personal best records, and mission XP.
          </Text>

          <ArcadeButton
            title="RESET ALL LOCAL DATA"
            variant="red"
            size="normal"
            onPress={handleResetConfirm}
            style={styles.btn}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RfColors.bgMain,
  },
  scrollList: {
    padding: 16,
    paddingBottom: 36,
    gap: 14,
  },
  sectionCard: {
    backgroundColor: 'rgba(10, 23, 41, 0.9)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: RfColors.secondaryCyan,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: RfColors.textPrimary,
    letterSpacing: 1,
  },
  settingSub: {
    fontSize: 10,
    color: RfColors.textMuted,
    marginTop: 2,
  },
  dangerCard: {
    borderColor: 'rgba(255, 77, 99, 0.3)',
    backgroundColor: 'rgba(59, 15, 21, 0.35)',
  },
  dangerDesc: {
    fontSize: 11,
    color: RfColors.textSecondary,
    marginBottom: 14,
  },
  btn: {
    width: '100%',
  },
});

export default SettingsScreen;
