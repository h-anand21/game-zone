// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Screen 07: Settings Screen
// System configuration: audio, haptics, credits & progression reset
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Switch, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { FantasyBackground } from '../components/ui/FantasyBackground';
import { WoodHeader } from '../components/ui/WoodHeader';
import { GameButton } from '../components/ui/GameButton';
import { useGameStore } from '../store/gameStore';
import { ArrowHaptics } from '../utils/haptics';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const musicEnabled = useGameStore((state) => state.musicEnabled);
  const hapticsEnabled = useGameStore((state) => state.hapticsEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const toggleMusic = useGameStore((state) => state.toggleMusic);
  const toggleHaptics = useGameStore((state) => state.toggleHaptics);
  const resetAllData = useGameStore((state) => state.resetAllData);

  const handleResetConfirm = () => {
    Alert.alert(
      'RESET KINGDOM DATA?',
      'This will erase all unlocked levels, high scores, coins, gems, and themes. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'RESET PROGRESS',
          style: 'destructive',
          onPress: () => {
            ArrowHaptics.blocked();
            resetAllData();
            Alert.alert('DATA RESET', 'All kingdom records have been restored to defaults.');
          },
        },
      ]
    );
  };

  return (
    <FantasyBackground>
      <View style={styles.container}>
        <WoodHeader
          title="SETTINGS"
          subtitle="SYSTEM & AUDIO"
          onBack={onBack}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 36) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Audio & Haptic Controls Card */}
          <View style={styles.card}>
            <LinearGradient colors={['#10395C', '#071F36']} style={styles.cardGrad}>
              <Text style={styles.sectionHeader}>🔊 AUDIO & SENSORY</Text>

              {/* Sound Effects Toggle */}
              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingTitle}>SOUND EFFECTS</Text>
                  <Text style={styles.settingSub}>Whooshes, clicks & victory chimes</Text>
                </View>
                <Switch
                  value={soundEnabled}
                  onValueChange={() => {
                    ArrowHaptics.touch();
                    toggleSound();
                  }}
                  trackColor={{ false: '#1C2633', true: '#22C51D' }}
                  thumbColor={soundEnabled ? '#FFF' : '#888'}
                />
              </View>

              <View style={styles.divider} />

              {/* Ambient Music Toggle */}
              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingTitle}>KINGDOM AMBIENCE</Text>
                  <Text style={styles.settingSub}>Magical background atmosphere</Text>
                </View>
                <Switch
                  value={musicEnabled}
                  onValueChange={() => {
                    ArrowHaptics.touch();
                    toggleMusic();
                  }}
                  trackColor={{ false: '#1C2633', true: '#22C51D' }}
                  thumbColor={musicEnabled ? '#FFF' : '#888'}
                />
              </View>

              <View style={styles.divider} />

              {/* Haptic Feedback Toggle */}
              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingTitle}>TACTILE HAPTICS</Text>
                  <Text style={styles.settingSub}>Vibrations on slides, bumps & stars</Text>
                </View>
                <Switch
                  value={hapticsEnabled}
                  onValueChange={() => {
                    ArrowHaptics.touch();
                    toggleHaptics();
                  }}
                  trackColor={{ false: '#1C2633', true: '#22C51D' }}
                  thumbColor={hapticsEnabled ? '#FFF' : '#888'}
                />
              </View>
            </LinearGradient>
          </View>

          {/* About & Game Info Card */}
          <View style={styles.card}>
            <LinearGradient colors={['#10395C', '#071F36']} style={styles.cardGrad}>
              <Text style={styles.sectionHeader}>👑 ABOUT ARROW KINGDOM</Text>
              <Text style={styles.infoText}>Version: 1.0.0 (Production Release)</Text>
              <Text style={styles.infoText}>Genre: Fantasy Neon Arrow Slide Escape</Text>
              <Text style={styles.infoText}>Engine: Pure Native React Native + Expo</Text>
            </LinearGradient>
          </View>

          {/* Danger Zone: Reset Progress */}
          <View style={styles.card}>
            <LinearGradient colors={['#2D0E12', '#140608']} style={[styles.cardGrad, styles.dangerGrad]}>
              <Text style={[styles.sectionHeader, { color: COLORS.red }]}>⚠️ DANGER ZONE</Text>
              <Text style={styles.dangerDesc}>
                Erase all completed levels, high scores, collected coins, gems, and custom themes.
              </Text>
              <GameButton
                title="RESET PROGRESS 🗑️"
                variant="red"
                size="medium"
                onPress={handleResetConfirm}
                style={styles.resetBtn}
              />
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    </FantasyBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#3D1C08',
    backgroundColor: '#351503',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
  },
  cardGrad: {
    padding: 18,
    borderRadius: 17,
  },
  dangerGrad: {
    borderColor: 'rgba(255, 70, 85, 0.4)',
    borderWidth: 1,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 1,
  },
  settingSub: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 4,
  },
  infoText: {
    fontSize: 11,
    color: '#E2EEF9',
    lineHeight: 18,
  },
  dangerDesc: {
    fontSize: 11,
    color: COLORS.muted,
    lineHeight: 16,
    marginBottom: 14,
  },
  resetBtn: {
    width: '100%',
  },
});

export default SettingsScreen;
