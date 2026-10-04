// ============================================================
// PATH MIND — Screen 20: SettingsScreen
// Audio, Haptics, Assist Options & Chamber Preferences
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Dimensions } from 'react-native';
import { GameBackground } from '../components/ui/GameBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { TitlePlaque } from '../components/ui/TitlePlaque';
import { GamePanel } from '../components/ui/GamePanel';
import { GameButton } from '../components/ui/GameButton';
import { usePathMindStore } from '../store/pathMindStore';
import { pmColors } from '../design-system/colors';
import { pmTypography } from '../design-system/typography';
import { pmRadii } from '../design-system/radii';
import { pmShadows } from '../design-system/shadows';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const SettingsScreen: React.FC = () => {
  const {
    goBack,
    soundEnabled,
    musicEnabled,
    hapticsEnabled,
    toggleSound,
    toggleMusic,
    toggleHaptics,
    refillHearts,
    hearts,
    coins,
  } = usePathMindStore();

  const [assistMode, setAssistMode] = useState<boolean>(true);

  return (
    <GameBackground variant="universal" overlayDarkness={0.25}>
      <GameHeader
        onBack={goBack}
        hearts={hearts}
        coins={coins}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TitlePlaque
          title="CHAMBER SETTINGS"
          subtitle="AUDIO & EXPEDITION PREFERENCES"
          variant="gold"
          size="medium"
          style={styles.titlePlaque}
        />

        {/* Audio & Haptic Toggles */}
        <GamePanel variant="stone" style={styles.settingsPanel}>
          <Text style={styles.panelTitle}>EXPEDITION CONTROLS</Text>

          {/* Sound FX */}
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>SOUND EFFECTS</Text>
              <Text style={styles.settingSub}>Stone clacks, rune hums, completion chime</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: '#1A2634', true: pmColors.successGreen }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Music */}
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>AMBIENT MUSIC</Text>
              <Text style={styles.settingSub}>Ancient temple atmosphere melodies</Text>
            </View>
            <Switch
              value={musicEnabled}
              onValueChange={toggleMusic}
              trackColor={{ false: '#1A2634', true: pmColors.successGreen }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Haptics */}
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>HAPTIC VIBRATION</Text>
              <Text style={styles.settingSub}>Tactile stone vibration on rune taps</Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: '#1A2634', true: pmColors.successGreen }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Assist Mode */}
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>RUNE GLOW ASSIST</Text>
              <Text style={styles.settingSub}>Subtle pulsing pulse on next valid rune</Text>
            </View>
            <Switch
              value={assistMode}
              onValueChange={setAssistMode}
              trackColor={{ false: '#1A2634', true: pmColors.cyanGlow }}
              thumbColor="#FFFFFF"
            />
          </View>
        </GamePanel>

        {/* Resource Recovery */}
        <GamePanel variant="wood" style={styles.recoveryPanel}>
          <Text style={styles.recoveryTitle}>EXPEDITION SUPPLIES</Text>
          <Text style={styles.recoverySub}>
            Current Health: {hearts} / 3 Hearts. Refill your vital energy before entering dangerous chambers.
          </Text>
          <GameButton
            label="REFILL HEARTS (FREE)"
            variant="green"
            size="small"
            width={190}
            height={42}
            disabled={hearts >= 3}
            onPress={refillHearts}
            style={{ marginTop: 10 }}
            accessibilityLabel="Refill Hearts"
          />
        </GamePanel>

        {/* Back Button */}
        <View style={styles.ctaWrap}>
          <GameButton
            label="RESUME EXPEDITION"
            iconName="play"
            variant="gold"
            size="large"
            width={Math.min(SCREEN_WIDTH - 48, 280)}
            height={56}
            onPress={goBack}
            accessibilityLabel="Resume Expedition"
          />
        </View>
      </ScrollView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
    alignItems: 'center',
  },
  titlePlaque: {
    width: Math.min(SCREEN_WIDTH - 36, 320),
    marginBottom: 14,
    marginTop: 4,
  },
  settingsPanel: {
    width: Math.min(SCREEN_WIDTH - 36, 340),
    padding: 14,
    marginBottom: 14,
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: pmColors.textCyan,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  settingLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: pmColors.textPrimary,
    letterSpacing: 0.5,
  },
  settingSub: {
    ...pmTypography.caption,
    color: pmColors.textSecondary,
    marginTop: 2,
    maxWidth: 220,
  },
  recoveryPanel: {
    width: Math.min(SCREEN_WIDTH - 36, 340),
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  recoveryTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: pmColors.goldBright,
    letterSpacing: 0.8,
  },
  recoverySub: {
    ...pmTypography.caption,
    color: pmColors.textWood,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  ctaWrap: {
    alignItems: 'center',
  },
});
