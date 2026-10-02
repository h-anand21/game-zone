// ============================================================
// PATTERN QUEST — Screen 17: SettingsScreen
// Ancient Temple Settings: Audio, Haptics, Assist, Game Data
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { GameHeader } from '../components/common/GameHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { GameButton } from '../components/buttons/GameButton';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';

export const SettingsScreen: React.FC = () => {
  const {
    setScreen,
    soundEnabled,
    musicEnabled,
    vibrationEnabled,
    assistMode,
    motionControl,
    toggleSound,
    toggleMusic,
    toggleVibration,
    toggleAssistMode,
    toggleMotionControl,
    resetProgress,
  } = usePatternQuestStore();

  const handleResetData = () => {
    Alert.alert(
      'Reset Expedition Data?',
      'Are you sure you want to reset your score, combos, and chamber progress?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetProgress() },
      ]
    );
  };

  return (
    <GameBackground screen="settings" overlayDarkness={0.25}>
      <GameHeader onBack={() => setScreen('home')} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenPlaque screen="settings" width={280} height={140} style={styles.plaque} />

        {/* Audio Controls */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>AUDIO & FEEDBACK</Text>

          <Pressable style={styles.toggleRow} onPress={toggleSound}>
            <View style={styles.rowLabelGroup}>
              <Text style={pqTypography.bodyBold}>Sound Effects</Text>
              <Text style={pqTypography.caption}>Chamber audio & rune chimes</Text>
            </View>
            <Image
              source={soundEnabled ? pqAssets.icons.toggleOn : pqAssets.icons.toggleOff}
              style={styles.toggleIcon}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable style={styles.toggleRow} onPress={toggleMusic}>
            <View style={styles.rowLabelGroup}>
              <Text style={pqTypography.bodyBold}>Expedition Music</Text>
              <Text style={pqTypography.caption}>Atmospheric jungle melodies</Text>
            </View>
            <Image
              source={musicEnabled ? pqAssets.icons.toggleOn : pqAssets.icons.toggleOff}
              style={styles.toggleIcon}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable style={styles.toggleRow} onPress={toggleVibration}>
            <View style={styles.rowLabelGroup}>
              <Text style={pqTypography.bodyBold}>Haptic Touch</Text>
              <Text style={pqTypography.caption}>Vibration feedback on tap</Text>
            </View>
            <Image
              source={vibrationEnabled ? pqAssets.icons.toggleOn : pqAssets.icons.toggleOff}
              style={styles.toggleIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Assist & Accessibility */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>GAMEPLAY ASSIST</Text>

          <Pressable style={styles.toggleRow} onPress={toggleAssistMode}>
            <View style={styles.rowLabelGroup}>
              <Text style={pqTypography.bodyBold}>Color Blind Assist</Text>
              <Text style={pqTypography.caption}>High-contrast visual shape tags</Text>
            </View>
            <Image
              source={assistMode ? pqAssets.icons.toggleOn : pqAssets.icons.toggleOff}
              style={styles.toggleIcon}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable style={styles.toggleRow} onPress={toggleMotionControl}>
            <View style={styles.rowLabelGroup}>
              <Text style={pqTypography.bodyBold}>Subtle Ambient Motion</Text>
              <Text style={pqTypography.caption}>Smooth parallax leaf & particle drift</Text>
            </View>
            <Image
              source={motionControl ? pqAssets.icons.toggleOn : pqAssets.icons.toggleOff}
              style={styles.toggleIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Game Data */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>GAME DATA</Text>

          <View style={styles.dangerRow}>
            <View style={{ flex: 1 }}>
              <Text style={pqTypography.bodyBold}>Reset All Expeditions</Text>
              <Text style={pqTypography.caption}>Clears local score & chamber stars</Text>
            </View>
            <GameButton
              buttonAsset={pqAssets.buttons.clear}
              onPress={handleResetData}
              width={110}
              height={44}
            />
          </View>
        </View>
      </ScrollView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: pqSpacing.base,
    paddingBottom: 40,
    alignItems: 'center',
  },
  plaque: {
    marginBottom: pqSpacing.md,
  },
  settingsGroup: {
    width: '100%',
    backgroundColor: 'rgba(18, 26, 36, 0.95)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 1.5,
    borderColor: '#374151',
    padding: pqSpacing.base,
    marginBottom: pqSpacing.base,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: pqColors.textGold,
    letterSpacing: 1.2,
    marginBottom: pqSpacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: pqSpacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rowLabelGroup: {
    flex: 1,
    marginRight: pqSpacing.md,
  },
  toggleIcon: {
    width: 54,
    height: 30,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: pqSpacing.xs,
  },
});
