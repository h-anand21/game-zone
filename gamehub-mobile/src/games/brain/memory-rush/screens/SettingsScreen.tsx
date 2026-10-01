// ============================================================
// MEMORY RUSH — 13 Settings Screen (Benchmark Quality Level)
// Physical Stone & Wood Panels with Gold Trim, Tactile Toggles & Saves
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JungleWorldBackground } from '../components/JungleWorldBackground';
import { JungleScreenPlaque } from '../components/JungleScreenPlaque';
import { ExplorerCompanion } from '../components/ExplorerCompanion';
import { StonePanel } from '../components/StonePanel';
import { WoodPanel } from '../components/WoodPanel';
import { BottomTabBar, TabType } from '../components/BottomTabBar';
import { MRIcon } from '../components/MRIcon';
import { MRColors } from '../constants/colors';
import { useMemoryRushStore } from '../store/memoryRushStore';

interface SettingsScreenProps {
  onNavigateTab: (tab: TabType) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigateTab }) => {
  const { settings, updateSettings, resetProgress } = useMemoryRushStore();

  const handleReset = () => {
    Alert.alert(
      "RESET PROGRESS",
      "Are you sure you want to reset all your stats, scores, and streak data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Everything",
          style: "destructive",
          onPress: () => resetProgress(),
        },
      ]
    );
  };

  const renderToggle = (
    label: string,
    description: string,
    value: boolean,
    onValueChange: (val: boolean) => void,
    icon: string
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingIconBox}>
        <MRIcon name={icon} size={18} color="#FFD700" />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: 'rgba(0, 0, 0, 0.45)', true: 'rgba(255, 215, 0, 0.45)' }}
        thumbColor={value ? '#FFD700' : '#8A9BAA'}
      />
    </View>
  );

  return (
    <JungleWorldBackground variant="settings">
      <SafeAreaView style={styles.container}>
        {/* Sculpted Screen Title Plaque */}
        <View style={styles.header}>
          <JungleScreenPlaque type="settings" height={120} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* GAMEPLAY SECTION */}
          <StonePanel variant="carved" style={styles.sectionPanel}>
            <Text style={styles.sectionHeader}>GAMEPLAY & AUDIO</Text>
            {renderToggle(
              "Sound Effects",
              "Audio feedback during gameplay",
              settings.soundEnabled,
              (val) => updateSettings({ soundEnabled: val }),
              "volume-2"
            )}
            {renderToggle(
              "Haptic Feedback",
              "Tactile vibration on taps and answers",
              settings.vibrationEnabled,
              (val) => updateSettings({ vibrationEnabled: val }),
              "smartphone"
            )}
            {renderToggle(
              "Arcade Animations",
              "Smooth tile scale and pulse motion",
              settings.animationsEnabled,
              (val) => updateSettings({ animationsEnabled: val }),
              "activity"
            )}
            {renderToggle(
              "Smart Difficulty",
              "Auto-adjust preview time based on accuracy",
              settings.smartDifficulty,
              (val) => updateSettings({ smartDifficulty: val }),
              "cpu"
            )}
          </StonePanel>

          {/* ACCESSIBILITY SECTION */}
          <StonePanel variant="slate" style={styles.sectionPanel}>
            <Text style={styles.sectionHeader}>ACCESSIBILITY</Text>
            {renderToggle(
              "High Contrast",
              "Sharper borders and higher tile visibility",
              settings.highContrast,
              (val) => updateSettings({ highContrast: val }),
              "eye"
            )}
            {renderToggle(
              "Large Numbers",
              "Increased typography scale for number tiles",
              settings.largeNumbers,
              (val) => updateSettings({ largeNumbers: val }),
              "type"
            )}
            {renderToggle(
              "Reduced Motion",
              "Minimize UI transitions and particle effects",
              settings.reducedMotion,
              (val) => updateSettings({ reducedMotion: val }),
              "feather"
            )}
          </StonePanel>

          {/* DATA SECTION */}
          <WoodPanel variant="dark" style={styles.sectionPanel}>
            <Text style={styles.sectionHeader}>DATA & TEMPLE SAVES</Text>
            <TouchableOpacity style={styles.dangerRow} onPress={handleReset} activeOpacity={0.7}>
              <View style={[styles.settingIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: '#EF4444' }]}>
                <MRIcon name="trash-2" size={18} color="#EF4444" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Reset Progress</Text>
                <Text style={styles.settingDesc}>Clear local high scores and stats history</Text>
              </View>
            </TouchableOpacity>
          </WoodPanel>

          <View style={styles.footer}>
            <Text style={styles.versionText}>MEMORY RUSH v2.0.0 • JUNGLE ADVENTURE</Text>
            <Text style={styles.copyrightText}>TEMPLE BRAIN PUZZLE ENGINE</Text>
          </View>

          <View style={{ height: 90 }} />
        </ScrollView>

        <BottomTabBar currentScreen="settings" onNavigate={(scr) => onNavigateTab(scr as any)} />
      </SafeAreaView>
    </JungleWorldBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  characterCenter: {
    alignItems: 'center',
    marginVertical: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    gap: 12,
  },
  sectionPanel: {
    width: '100%',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(10, 16, 12, 0.75)',
    borderWidth: 1.5,
    borderColor: '#546A58',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 8,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF8E7',
  },
  settingDesc: {
    fontSize: 11,
    color: '#D1DEC8',
    marginTop: 2,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginVertical: 12,
    gap: 4,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1,
  },
  copyrightText: {
    fontSize: 9.5,
    color: '#A0B4A2',
    letterSpacing: 1.5,
    opacity: 0.7,
  },
});
