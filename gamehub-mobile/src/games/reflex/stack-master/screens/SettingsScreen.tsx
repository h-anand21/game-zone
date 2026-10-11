// ============================================================
// STACK MASTER — Screen 15: Settings Screen
// Audio, gameplay, visual toggles and persistent data management
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Switch, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { COLORS } from '../theme/colors';
import { useStackStore } from '../store/stackStore';
import { StackHaptics } from '../utils/haptics';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const settings = useStackStore((state) => state.settings);
  const updateSettings = useStackStore((state) => state.updateSettings);
  const resetAllData = useStackStore((state) => state.resetAllData);

  const handleToggle = (key: keyof typeof settings, val: boolean) => {
    StackHaptics.buttonPress();
    updateSettings({ [key]: val });
  };

  const handleResetConfirm = () => {
    Alert.alert(
      'Reset Stack Master Data?',
      'This will clear your local high scores, achievements, and unlocked cosmetics. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetAllData();
            Alert.alert('Reset Complete', 'Your local progress has been restored to default.');
          },
        },
      ]
    );
  };

  return (
    <ScreenBackground type="home" dimAmount={0.5}>
      <View style={styles.container}>
        <GameHeader
          title="SETTINGS"
          subtitle="PREFERENCES"
          onBack={onBack}
          showCurrency={false}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 40) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Audio Section */}
          <Text style={styles.sectionTitle}>AUDIO</Text>
          <LinearGradient colors={['#102E56', '#091C38']} style={styles.card}>
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>SOUND EFFECTS</Text>
                <Text style={styles.settingDesc}>Block placement, slices, and combos</Text>
              </View>
              <Switch
                value={settings.sound}
                onValueChange={(v) => handleToggle('sound', v)}
                trackColor={{ false: '#1D2A3D', true: COLORS.cyan }}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>MUSIC</Text>
                <Text style={styles.settingDesc}>Fantasy skylands atmospheric melodies</Text>
              </View>
              <Switch
                value={settings.music}
                onValueChange={(v) => handleToggle('music', v)}
                trackColor={{ false: '#1D2A3D', true: COLORS.cyan }}
              />
            </View>
          </LinearGradient>

          {/* Gameplay Section */}
          <Text style={styles.sectionTitle}>GAMEPLAY</Text>
          <LinearGradient colors={['#102E56', '#091C38']} style={styles.card}>
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>HAPTIC FEEDBACK</Text>
                <Text style={styles.settingDesc}>Tactile response on taps and slices</Text>
              </View>
              <Switch
                value={settings.haptics}
                onValueChange={(v) => handleToggle('haptics', v)}
                trackColor={{ false: '#1D2A3D', true: COLORS.cyan }}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>ASSIST MODE</Text>
                <Text style={styles.settingDesc}>Expanded tolerance for perfect snaps</Text>
              </View>
              <Switch
                value={settings.assistMode}
                onValueChange={(v) => handleToggle('assistMode', v)}
                trackColor={{ false: '#1D2A3D', true: COLORS.gold }}
              />
            </View>
          </LinearGradient>

          {/* Display Section */}
          <Text style={styles.sectionTitle}>DISPLAY</Text>
          <LinearGradient colors={['#102E56', '#091C38']} style={styles.card}>
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>REDUCED MOTION</Text>
                <Text style={styles.settingDesc}>Simplify falling fragments and shakes</Text>
              </View>
              <Switch
                value={settings.reducedMotion}
                onValueChange={(v) => handleToggle('reducedMotion', v)}
                trackColor={{ false: '#1D2A3D', true: COLORS.cyan }}
              />
            </View>
          </LinearGradient>

          {/* Data Reset */}
          <Text style={styles.sectionTitle}>DATA MANAGEMENT</Text>
          <View style={styles.resetWrap}>
            <SecondaryButton
              title="RESET PROGRESS DATA"
              variant="danger"
              onPress={handleResetConfirm}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#244B82',
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFF',
  },
  settingDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    maxWidth: 220,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E3B68',
    marginVertical: 10,
  },
  resetWrap: {
    marginTop: 10,
  },
});
