// ============================================================
// Number Rush — Arcade Settings Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, WoodPanel, GameButton, BottomNavBar } from '../components';

export const SettingsModal: React.FC = () => {
  const { setScreen, settings, updateSettings } = useNumberRushStore();

  const handleResetData = () => {
    Alert.alert(
      'Reset Data?',
      'Are you sure you want to reset your local progress and stats?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // reset logic
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="SETTINGS" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Audio Preferences */}
        <Text style={styles.sectionTitle}>AUDIO & FEEDBACK</Text>

        <WoodPanel style={styles.settingCard} variant="card" hasRivets={false}>
          {/* Sound Effects Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔊</Text>
              <View>
                <Text style={styles.settingName}>Sound Effects</Text>
                <Text style={styles.settingSub}>Tap tones, chimes & countdowns</Text>
              </View>
            </View>
            <Switch
              value={settings.soundEffects}
              onValueChange={(val) => updateSettings({ soundEffects: val })}
              trackColor={{ false: '#3A4B5F', true: '#2ED573' }}
              thumbColor={settings.soundEffects ? '#FFFFFF' : '#8CA0BA'}
            />
          </View>

          {/* Music Toggle */}
          <View style={[styles.settingRow, styles.borderTop]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🎵</Text>
              <View>
                <Text style={styles.settingName}>Background Music</Text>
                <Text style={styles.settingSub}>Jungle arcade soundtrack</Text>
              </View>
            </View>
            <Switch
              value={settings.backgroundMusic}
              onValueChange={(val) => updateSettings({ backgroundMusic: val })}
              trackColor={{ false: '#3A4B5F', true: '#2ED573' }}
              thumbColor={settings.backgroundMusic ? '#FFFFFF' : '#8CA0BA'}
            />
          </View>

          {/* Haptics Toggle */}
          <View style={[styles.settingRow, styles.borderTop]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📳</Text>
              <View>
                <Text style={styles.settingName}>Haptic Feedback</Text>
                <Text style={styles.settingSub}>Tactile vibration on tap & success</Text>
              </View>
            </View>
            <Switch
              value={settings.hapticFeedback}
              onValueChange={(val) => updateSettings({ hapticFeedback: val })}
              trackColor={{ false: '#3A4B5F', true: '#2ED573' }}
              thumbColor={settings.hapticFeedback ? '#FFFFFF' : '#8CA0BA'}
            />
          </View>
        </WoodPanel>

        {/* Game Info & Support */}
        <Text style={styles.sectionTitle}>ABOUT NUMBER RUSH</Text>

        <WoodPanel style={styles.settingCard} variant="glass" hasRivets={false}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🎮</Text>
              <View>
                <Text style={styles.settingName}>Game Version</Text>
                <Text style={styles.settingSub}>v1.0.0 • Premium Arcade Edition</Text>
              </View>
            </View>
          </View>

          <View style={[styles.settingRow, styles.borderTop]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📱</Text>
              <View>
                <Text style={styles.settingName}>Target Engine</Text>
                <Text style={styles.settingSub}>Expo + React Native + Skia + SVG</Text>
              </View>
            </View>
          </View>
        </WoodPanel>

        {/* Reset Data Button */}
        <GameButton
          title="RESET LOCAL PROGRESS"
          icon="⚠️"
          variant="red"
          size="md"
          fullWidth
          onPress={handleResetData}
          style={{ marginTop: 20 }}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NRTheme.colors.bgDark,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    color: '#8CA0BA',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  settingCard: {
    padding: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  settingName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  settingSub: {
    color: '#8CA0BA',
    fontSize: 11,
    marginTop: 2,
  },
});
