// ============================================================
// ONE TAP: PRECISION GAME — SettingsScreen
// Audio, Haptics, Accessibility & Data Preferences
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { OneTapLogo } from '../components/OneTapLogo';
import {
  SvgBackArrow,
  SvgVolumeHigh,
  SvgMusic,
  SvgPhone,
} from '../components/icons/OneTapIcons';
import { OTColors } from '../theme/colors';
import { OneTapSettings } from '../types';
import { OneTapAudio } from '../audio/audioManager';
import { OneTapHaptics } from '../haptics/hapticManager';

interface SettingsScreenProps {
  settings: OneTapSettings;
  onUpdateSettings: (newSettings: OneTapSettings) => void;
  onResetData: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onBack,
}) => {
  const toggleSound = () => {
    const nextVal = !settings.soundEnabled;
    onUpdateSettings({ ...settings, soundEnabled: nextVal });
    OneTapAudio.setSoundEnabled(nextVal);
  };

  const toggleMusic = () => {
    const nextVal = !settings.musicEnabled;
    onUpdateSettings({ ...settings, musicEnabled: nextVal });
    OneTapAudio.setMusicEnabled(nextVal);
  };

  const toggleHaptics = () => {
    const nextVal = !settings.hapticsEnabled;
    onUpdateSettings({ ...settings, hapticsEnabled: nextVal });
    OneTapHaptics.setEnabled(nextVal);
  };

  const toggleMotion = () => {
    onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion });
  };

  return (
    <BackgroundLayer screen="other" overlayDarkness={0.45}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
            onPress={onBack}
            hitSlop={8}
          >
            <SvgBackArrow size={20} color="#FFFFFF" />
          </Pressable>
          <OneTapLogo size="compact" showSubtitle={true} />
          <View style={styles.spacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.titleSection}>
            <Text style={styles.titleText}>SETTINGS</Text>
            <Text style={styles.subTitleText}>AUDIO & ACCESSIBILITY CONFIG</Text>
          </View>

          {/* Audio Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>AUDIO & FEEDBACK</Text>

            {/* Sound FX */}
            <View style={styles.toggleRow}>
              <View style={styles.labelCol}>
                <View style={styles.iconTitleRow}>
                  <SvgVolumeHigh size={16} color={OTColors.cyan} />
                  <Text style={styles.settingTitle}>SOUND FX</Text>
                </View>
                <Text style={styles.settingDesc}>Hit feedback, chimes & fever cue</Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={toggleSound}
                trackColor={{ false: '#262D38', true: OTColors.cyan }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Music */}
            <View style={styles.toggleRow}>
              <View style={styles.labelCol}>
                <View style={styles.iconTitleRow}>
                  <SvgMusic size={16} color={OTColors.cyan} />
                  <Text style={styles.settingTitle}>BGM MUSIC</Text>
                </View>
                <Text style={styles.settingDesc}>Atmospheric sci-fi pulse</Text>
              </View>
              <Switch
                value={settings.musicEnabled}
                onValueChange={toggleMusic}
                trackColor={{ false: '#262D38', true: OTColors.cyan }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Haptics */}
            <View style={styles.toggleRow}>
              <View style={styles.labelCol}>
                <View style={styles.iconTitleRow}>
                  <SvgPhone size={16} color={OTColors.lime} />
                  <Text style={styles.settingTitle}>HAPTIC VIBRATION</Text>
                </View>
                <Text style={styles.settingDesc}>Tactile ticks & impact impulses</Text>
              </View>
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={toggleHaptics}
                trackColor={{ false: '#262D38', true: OTColors.lime }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Accessibility Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>ACCESSIBILITY</Text>

            {/* Reduced Motion */}
            <View style={styles.toggleRow}>
              <View style={styles.labelCol}>
                <Text style={styles.settingTitle}>REDUCED MOTION</Text>
                <Text style={styles.settingDesc}>Disables miss screen shake</Text>
              </View>
              <Switch
                value={settings.reducedMotion}
                onValueChange={toggleMotion}
                trackColor={{ false: '#262D38', true: OTColors.gold }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Reset Progress */}
          <View style={styles.dangerCard}>
            <Text style={styles.dangerHeader}>PROGRESS VAULT</Text>
            <Pressable
              style={({ pressed }) => [styles.resetBtn, pressed && styles.btnPressed]}
              onPress={onResetData}
            >
              <Text style={styles.resetBtnText}>RESET PERSONAL RECORDS</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 21, 28, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  spacer: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  subTitleText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: OTColors.gold,
    letterSpacing: 2,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: 'rgba(16, 21, 28, 0.88)',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 16,
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 8.5,
    fontWeight: '800',
    color: OTColors.cyan,
    letterSpacing: 2,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  labelCol: {
    flex: 1,
    paddingRight: 10,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  settingDesc: {
    fontSize: 9.5,
    color: OTColors.textSecondary,
    marginTop: 2,
  },
  dangerCard: {
    backgroundColor: 'rgba(16, 21, 28, 0.8)',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 77, 97, 0.3)',
    padding: 16,
  },
  dangerHeader: {
    fontSize: 8.5,
    fontWeight: '800',
    color: OTColors.red,
    letterSpacing: 2,
    marginBottom: 10,
  },
  resetBtn: {
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 77, 97, 0.15)',
    borderWidth: 1,
    borderColor: OTColors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: OTColors.red,
    letterSpacing: 1,
  },
});
