// ============================================================
// PATTERN BREAKER — 19 Settings Screen
// Clean audio, vibration, appearance & progress management toggles
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { GlassCard } from '../components/cards/GlassCard';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { PBColors, PBTypography, PBRadius } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

export const SettingsScreen: React.FC = () => {
  const { setScreen, resetProgress } = usePatternBreakStore();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [ambientGlow, setAmbientGlow] = useState(true);

  const handleReset = () => {
    Alert.alert(
      'RESET PROGRESS',
      'Are you sure you want to reset all your Pattern Breaker stats and scores? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            resetProgress();
            Alert.alert('Reset Complete', 'Your progress has been refreshed.');
          },
        },
      ]
    );
  };

  const renderToggleRow = (
    label: string,
    desc: string,
    value: boolean,
    onChange: (val: boolean) => void
  ) => (
    <View style={styles.toggleRow}>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(25, 211, 255, 0.45)' }}
        thumbColor={value ? PBColors.primary : '#6D818B'}
      />
    </View>
  );

  return (
    <GameBackground variant="observatory">
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title="SETTINGS"
          onBack={() => setScreen('home')}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section 1: Gameplay & Audio */}
          <Text style={styles.sectionHeader}>GAMEPLAY & AUDIO</Text>
          <GlassCard variant="neutral" style={styles.card}>
            {renderToggleRow('Sound Effects', 'Audio chimes on tile taps', soundEnabled, setSoundEnabled)}
            <View style={styles.divider} />
            {renderToggleRow('Haptic Feedback', 'Vibration pulse on breaker breaks', hapticEnabled, setHapticEnabled)}
            <View style={styles.divider} />
            {renderToggleRow('Arcade Animations', 'Dynamic particle bursts & cracks', animationsEnabled, setAnimationsEnabled)}
          </GlassCard>

          {/* Section 2: Appearance & Atmosphere */}
          <Text style={styles.sectionHeader}>APPEARANCE</Text>
          <GlassCard variant="neutral" style={styles.card}>
            {renderToggleRow('Ambient Ruins Glow', 'Neon atmospheric portal particles', ambientGlow, setAmbientGlow)}
          </GlassCard>

          {/* Section 3: Data & Storage */}
          <Text style={styles.sectionHeader}>ACCOUNT & DATA</Text>
          <GlassCard variant="neutral" style={styles.card}>
            <SecondaryButton
              title="RESET PROGRESS DATA"
              onPress={handleReset}
              style={styles.dangerBtn}
            />
          </GlassCard>

          <View style={styles.footerInfo}>
            <Text style={styles.versionText}>PATTERN BREAKER v2.0 • COMMERCIAL EDITION</Text>
            <Text style={styles.taglineText}>SPOT THE RULE. BREAK THE PATTERN.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  sectionHeader: {
    fontSize: 10.5,
    fontWeight: '900',
    color: PBColors.accent,
    letterSpacing: 1.5,
    marginTop: 8,
    marginLeft: 4,
  },
  card: {
    padding: 14,
    gap: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: 10,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  toggleDesc: {
    fontSize: 10,
    color: PBColors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  dangerBtn: {
    borderColor: 'rgba(255, 92, 97, 0.5)',
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    gap: 4,
  },
  versionText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: PBColors.textMuted,
    letterSpacing: 1,
  },
  taglineText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: PBColors.accent,
    letterSpacing: 1.2,
  },
});
