// ============================================================
// AIM RUSH — Screen 12: SettingsScreen
// Recreated from "Neon Cyberpunk Settings Interface.png" reference
// Hardware audio toggles, haptics, FX controls, and safe areas
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { ARColors } from '../theme/colors';
import { AimRushSettings } from '../types';
import { AimRushStorage } from '../storage/aimRushStorage';
import { AimRushHaptics } from '../haptics/hapticManager';
import { AimRushAudio } from '../audio/audioManager';

interface SettingsScreenProps {
  settings: AimRushSettings;
  onUpdateSettings: (s: AimRushSettings) => void;
  onResetProgress: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [localSettings, setLocalSettings] = useState<AimRushSettings>(settings);

  const toggleSound = (val: boolean) => {
    const updated = { ...localSettings, soundEnabled: val };
    setLocalSettings(updated);
    AimRushAudio.setSoundEnabled(val);
    AimRushStorage.saveSettings(updated);
    onUpdateSettings(updated);
  };

  const toggleMusic = (val: boolean) => {
    const updated = { ...localSettings, musicEnabled: val };
    setLocalSettings(updated);
    AimRushAudio.setMusicEnabled(val);
    AimRushStorage.saveSettings(updated);
    onUpdateSettings(updated);
  };

  const toggleHaptics = (val: boolean) => {
    const updated = { ...localSettings, hapticsEnabled: val };
    setLocalSettings(updated);
    AimRushHaptics.setEnabled(val);
    AimRushStorage.saveSettings(updated);
    onUpdateSettings(updated);
  };

  const toggleReducedFx = (val: boolean) => {
    const updated = { ...localSettings, reducedFx: val };
    setLocalSettings(updated);
    AimRushStorage.saveSettings(updated);
    onUpdateSettings(updated);
  };

  const handleReset = () => {
    Alert.alert(
      'RESET ALL PROGRESS?',
      'This will erase personal best scores, chains, and mission progress. This action cannot be undone.',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'CONFIRM RESET',
          style: 'destructive',
          onPress: onResetProgress,
        },
      ]
    );
  };

  return (
    <BackgroundLayer screen="other" overlayDarkness={0.35}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(12, insets.top + 6),
            paddingBottom: Math.max(16, insets.bottom + 8),
          },
        ]}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <Pressable style={styles.iconCircle} onPress={onBack}>
            <Ionicons name="arrow-back" size={18} color={ARColors.white} />
          </Pressable>
          <View style={styles.titleBox}>
            <Text style={styles.headerTitle}>SETTINGS</Text>
            <Text style={styles.headerSub}>SYSTEM CALIBRATION</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Settings Group Card */}
        <View style={styles.groupCard}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="volume-high-outline" size={20} color={ARColors.cyan} />
              <Text style={styles.rowLabel}>SOUND EFFECTS</Text>
            </View>
            <Switch
              value={localSettings.soundEnabled}
              onValueChange={toggleSound}
              thumbColor={localSettings.soundEnabled ? ARColors.cyan : ARColors.border}
              trackColor={{ false: ARColors.surfaceDark, true: ARColors.cyanSoft }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="musical-notes-outline" size={20} color={ARColors.cyan} />
              <Text style={styles.rowLabel}>BACKGROUND MUSIC</Text>
            </View>
            <Switch
              value={localSettings.musicEnabled}
              onValueChange={toggleMusic}
              thumbColor={localSettings.musicEnabled ? ARColors.cyan : ARColors.border}
              trackColor={{ false: ARColors.surfaceDark, true: ARColors.cyanSoft }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="phone-portrait-outline" size={20} color={ARColors.lime} />
              <Text style={styles.rowLabel}>TACTILE HAPTICS</Text>
            </View>
            <Switch
              value={localSettings.hapticsEnabled}
              onValueChange={toggleHaptics}
              thumbColor={localSettings.hapticsEnabled ? ARColors.lime : ARColors.border}
              trackColor={{ false: ARColors.surfaceDark, true: ARColors.limeSoft }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="eye-outline" size={20} color={ARColors.textSecondary} />
              <Text style={styles.rowLabel}>REDUCED VISUAL FX</Text>
            </View>
            <Switch
              value={localSettings.reducedFx}
              onValueChange={toggleReducedFx}
              thumbColor={localSettings.reducedFx ? ARColors.cyan : ARColors.border}
              trackColor={{ false: ARColors.surfaceDark, true: ARColors.cyanSoft }}
            />
          </View>
        </View>

        {/* Reset Progress Section */}
        <View style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>DATA MANAGEMENT</Text>
          <Pressable style={styles.resetBtn} onPress={handleReset}>
            <Ionicons name="trash-outline" size={16} color={ARColors.red} />
            <Text style={styles.resetBtnText}>RESET CAREER DATA</Text>
          </Pressable>
        </View>

        {/* Bottom Back Action */}
        <Pressable style={styles.bottomBackBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={16} color={ARColors.white} />
          <Text style={styles.bottomBackText}>RETURN TO HUB</Text>
        </Pressable>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 16, 26, 0.9)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  headerSub: {
    fontSize: 8.5,
    fontWeight: '800',
    color: ARColors.cyan,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  groupCard: {
    backgroundColor: 'rgba(10, 16, 26, 0.92)',
    borderWidth: 1.5,
    borderColor: 'rgba(53, 231, 255, 0.35)',
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: ARColors.white,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(53, 231, 255, 0.15)',
    marginVertical: 4,
  },
  dangerCard: {
    backgroundColor: 'rgba(10, 16, 26, 0.92)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 77, 97, 0.3)',
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  dangerTitle: {
    fontSize: 9.5,
    fontWeight: '900',
    color: ARColors.red,
    letterSpacing: 1.2,
  },
  resetBtn: {
    height: 44,
    backgroundColor: ARColors.redSoft,
    borderWidth: 1.2,
    borderColor: ARColors.red,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: ARColors.red,
    letterSpacing: 1,
  },
  bottomBackBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 16, 26, 0.95)',
    borderWidth: 1.5,
    borderColor: ARColors.cyan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
  },
  bottomBackText: {
    fontSize: 12,
    fontWeight: '900',
    color: ARColors.white,
    letterSpacing: 1.5,
  },
});
