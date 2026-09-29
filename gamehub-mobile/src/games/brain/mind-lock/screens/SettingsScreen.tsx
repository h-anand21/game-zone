// ============================================================
// Mind Lock — Screen 15: Settings Dashboard Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { MLColors, MLRadius, MLShadows, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Mascot } from '../components/Mascot';
import { WoodenSign } from '../components/WoodenSign';
import { ToggleRow } from '../components/ToggleRow';
import { SettingRow } from '../components/SettingRow';
import { BottomNavigation } from '../components/BottomNavigation';
import { DangerButton } from '../components/DangerButton';
import { ModalCard } from '../components/ModalCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { useMindLockStore } from '../store/mindLockStore';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, resetProgress } = useMindLockStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleConfirmReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Settings" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Wooden Sign Title + Mascot with Gears */}
        <View style={styles.bannerRow}>
          <WoodenSign subtitle="CUSTOMIZE YOUR GAME EXPERIENCE" title="SETTINGS" />
          <View style={styles.mascotHolder}>
            <View style={styles.speechPill}>
              <Text style={styles.speechText}>Make it your own!</Text>
            </View>
            <Mascot mood="settings" size={110} />
          </View>
        </View>

        {/* 1. Sound Effects Toggle */}
        <ToggleRow
          title="Sound Effects"
          description="Play sounds for taps, matches and rewards"
          value={settings.soundEffects}
          iconBgColor={MLColors.danger}
          onToggle={(val) => updateSettings({ soundEffects: val })}
          icon={
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
              <Path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </Svg>
          }
        />

        {/* 2. Background Music Toggle */}
        <ToggleRow
          title="Background Music"
          description="Relaxing brain-training music while you play"
          value={settings.backgroundMusic}
          iconBgColor={MLColors.padBlue}
          onToggle={(val) => updateSettings({ backgroundMusic: val })}
          icon={
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
              <Path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </Svg>
          }
        />

        {/* 3. Haptic Feedback Toggle */}
        <ToggleRow
          title="Haptic Feedback"
          description="Feel the game with realistic tactile vibrations"
          value={settings.hapticFeedback}
          iconBgColor={MLColors.purple}
          onToggle={(val) => updateSettings({ hapticFeedback: val })}
          icon={
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
              <Path d="M0 15h2V9H0v6zm3 2h2V7H3v10zm19-8v6h2V9h-2zm-3 8h2V7h-2v10zM16.5 3h-9C6.67 3 6 3.67 6 4.5v15c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5zM16 19H8V5h8v14z" />
            </Svg>
          }
        />

        {/* 4. Notifications Toggle */}
        <ToggleRow
          title="Notifications"
          description="Daily challenges, rewards and pattern updates"
          value={settings.notifications}
          iconBgColor={MLColors.success}
          onToggle={(val) => updateSettings({ notifications: val })}
          icon={
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
              <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </Svg>
          }
        />

        {/* 5. Game Difficulty Option */}
        <SettingRow
          title="Game Difficulty"
          subtitle="Choose the speed and complexity of pattern challenge"
          iconBgColor={MLColors.warning}
          selectedValue={settings.difficulty}
          options={[
            { label: 'Easy', value: 'easy' },
            { label: 'Medium', value: 'medium' },
            { label: 'Hard', value: 'hard' },
          ]}
          onSelect={(val) => updateSettings({ difficulty: val as any })}
          icon={
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="#0A121D">
              <Path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
            </Svg>
          }
        />

        {/* 6. Theme Option */}
        <SettingRow
          title="Theme"
          subtitle="Adjust the app appearance"
          iconBgColor={MLColors.cyan}
          selectedValue={settings.theme}
          options={[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Auto', value: 'auto' },
          ]}
          onSelect={(val) => updateSettings({ theme: val as any })}
          icon={
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="#0A121D">
              <Path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </Svg>
          }
        />

        {/* Danger Section: Reset Progress */}
        <Pressable
          onPress={() => setShowResetConfirm(true)}
          style={styles.dangerCard}
        >
          <LinearGradient
            colors={['#3B1414', '#1F0B0B']}
            style={styles.dangerInner}
          >
            <View style={styles.trashCircle}>
              <Text style={{ fontSize: 18 }}>🗑️</Text>
            </View>
            <View style={styles.dangerTextHolder}>
              <Text style={styles.dangerTitle}>Reset Progress</Text>
              <Text style={styles.dangerSub}>
                This will reset your game scores, streak, and unlocked badges.
              </Text>
            </View>
            <Text style={styles.dangerArrow}>›</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>

      {/* Reset Confirmation Modal */}
      <ModalCard
        visible={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
      >
        <Text style={styles.modalEmoji}>⚠️</Text>
        <Text style={styles.modalTitle}>RESET ALL PROGRESS?</Text>
        <Text style={styles.modalMessage}>
          Are you sure you want to reset all Mind Lock progress? This cannot be undone.
        </Text>
        <View style={styles.modalActionsRow}>
          <DangerButton
            title="RESET"
            size="md"
            onPress={handleConfirmReset}
            style={{ flex: 1 }}
          />
          <PrimaryButton
            title="CANCEL"
            size="md"
            showPlayIcon={false}
            onPress={() => setShowResetConfirm(false)}
            style={{ flex: 1 }}
          />
        </View>
      </ModalCard>

      <BottomNavigation currentTab="settings" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MLColors.background,
  },
  scrollContent: {
    paddingHorizontal: MLSpacing.base,
    paddingBottom: MLSpacing.xl,
  },
  bannerRow: {
    alignItems: 'center',
    marginVertical: MLSpacing.sm,
  },
  woodenSign: {
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: MLRadius.lg,
    borderWidth: 2,
    borderColor: '#4A2006',
    alignItems: 'center',
    ...MLShadows.md,
  },
  signTitle: {
    color: '#FFF8EB',
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
    letterSpacing: 1,
  },
  signSub: {
    color: '#FFE2B8',
    fontSize: MLTypography.caption,
    fontWeight: MLTypography.semibold,
  },
  mascotHolder: {
    alignItems: 'center',
    marginTop: -10,
    position: 'relative',
  },
  speechPill: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#FFFFFF',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: MLRadius.pill,
    zIndex: 10,
    ...MLShadows.sm,
  },
  speechText: {
    color: '#0A121D',
    fontSize: 9,
    fontWeight: MLTypography.black,
  },
  dangerCard: {
    borderRadius: MLRadius.lg,
    overflow: 'hidden',
    marginTop: MLSpacing.sm,
    marginBottom: MLSpacing.lg,
  },
  dangerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: MLSpacing.md,
    borderRadius: MLRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 75, 0.4)',
    gap: MLSpacing.sm,
  },
  trashCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 75, 75, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerTextHolder: {
    flex: 1,
  },
  dangerTitle: {
    color: MLColors.danger,
    fontSize: MLTypography.body,
    fontWeight: MLTypography.bold,
  },
  dangerSub: {
    color: MLColors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  dangerArrow: {
    color: MLColors.danger,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  modalTitle: {
    color: MLColors.danger,
    fontSize: MLTypography.h3,
    fontWeight: MLTypography.black,
    letterSpacing: 1,
    textAlign: 'center',
  },
  modalMessage: {
    color: MLColors.cream,
    fontSize: MLTypography.bodySmall,
    textAlign: 'center',
    lineHeight: 18,
    marginVertical: MLSpacing.md,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: MLSpacing.sm,
    width: '100%',
  },
});
