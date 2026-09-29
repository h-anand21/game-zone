// ============================================================
// Mind Lock — Screen 4: Game Mode Selection Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { MLColors, MLSpacing, MLTypography } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { ModeCard } from '../components/ModeCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { Mascot } from '../components/Mascot';
import { useMindLockStore } from '../store/mindLockStore';
import type { GameMode } from '../types';

export const GameModeSelectionScreen: React.FC = () => {
  const { selectedMode, selectMode, startGame, setScreen, stats } = useMindLockStore();

  const handlePlayMode = (mode: GameMode) => {
    if (mode === 'daily') {
      setScreen('daily');
    } else {
      selectMode(mode);
      startGame(mode);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Choose Your Mode" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner with Mascot */}
        <View style={styles.bannerRow}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.title}>CHOOSE YOUR MODE</Text>
            <Text style={styles.subtitle}>Different challenges, sharper mind!</Text>
          </View>
          <Mascot mood="settings" size={90} />
        </View>

        {/* 1. Classic Memory */}
        <ModeCard
          mode="classic"
          title="Classic Memory"
          description="The original Mind Lock experience. Watch the pattern and repeat it."
          bestScore={stats.bestScore}
          accentColor={MLColors.primary}
          selected={selectedMode === 'classic'}
          onPress={() => handlePlayMode('classic')}
          icon={
            <View style={styles.classicIcon}>
              <View style={[styles.padMini, { backgroundColor: MLColors.padRed }]} />
              <View style={[styles.padMini, { backgroundColor: MLColors.padBlue }]} />
              <View style={[styles.padMini, { backgroundColor: MLColors.padGreen }]} />
              <View style={[styles.padMini, { backgroundColor: MLColors.padYellow }]} />
            </View>
          }
        />

        {/* 2. Speed Mode */}
        <ModeCard
          mode="speed"
          title="Speed Mode"
          description="Faster patterns. Quicker thinking. Beat the shrinking timer!"
          bestScore={320}
          accentColor={MLColors.padBlue}
          selected={selectedMode === 'speed'}
          onPress={() => handlePlayMode('speed')}
          icon={
            <Svg width="44" height="44" viewBox="0 0 24 24" fill={MLColors.padBlue}>
              <Path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
            </Svg>
          }
        />

        {/* 3. Endless Mode */}
        <ModeCard
          mode="endless"
          title="Endless Mode"
          description="Keep going as long as you can. Combo multipliers increase indefinitely."
          bestScore={28}
          accentColor={MLColors.padGreen}
          selected={selectedMode === 'endless'}
          onPress={() => handlePlayMode('endless')}
          icon={
            <Svg width="46" height="46" viewBox="0 0 24 24" fill={MLColors.padGreen}>
              <Path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.98l-2.83-2.83c-.97-.97-2.33-1.53-3.77-1.53-2.94 0-5.4 2.46-5.4 5.4s2.46 5.4 5.4 5.4c1.44 0 2.8-.56 3.77-1.53L12 13.02l2.83 2.83c.97.97 2.33 1.53 3.77 1.53 2.94 0 5.4-2.46 5.4-5.4s-2.46-5.4-5.4-5.4zm-13.2 8.8c-1.84 0-3.4-1.56-3.4-3.4s1.56-3.4 3.4-3.4c.9 0 1.76.36 2.38.98L10.02 12l-2.24 2.24c-.62.62-1.48.98-2.38.98zm13.2 0c-.9 0-1.76-.36-2.38-.98L13.98 12l2.24-2.24c.62-.62 1.48-.98 2.38-.98 1.84 0 3.4 1.56 3.4 3.4s-1.56 3.4-3.4 3.4z" />
            </Svg>
          }
        />

        {/* 4. Daily Challenge */}
        <ModeCard
          mode="daily"
          title="Daily Challenge"
          description="A new pattern everyday. Complete rounds to unlock rare chests."
          accentColor={MLColors.purple}
          selected={selectedMode === 'daily'}
          onPress={() => handlePlayMode('daily')}
          icon={
            <Svg width="44" height="44" viewBox="0 0 24 24" fill={MLColors.purple}>
              <Path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5z" />
            </Svg>
          }
        />

        {/* 5. Reverse Mode (Locked) */}
        <ModeCard
          mode="reverse"
          title="Reverse Mode"
          description="Repeat the pattern in reverse order! A true test of mental agility."
          locked={true}
          unlockText="Unlock at Level 10"
          onPress={() => {}}
          icon={
            <Svg width="44" height="44" viewBox="0 0 24 24" fill={MLColors.textDim}>
              <Path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
            </Svg>
          }
        />

        {/* 6. Color Chaos (Locked) */}
        <ModeCard
          mode="chaos"
          title="Color Chaos"
          description="More colors. More complexity. Shifting pad positions!"
          locked={true}
          unlockText="Unlock at Level 20"
          onPress={() => {}}
          icon={
            <Svg width="44" height="44" viewBox="0 0 24 24" fill={MLColors.textDim}>
              <Circle cx="12" cy="12" r="5" />
              <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </Svg>
          }
        />
      </ScrollView>

      <BottomNavigation currentTab="modes" />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: MLSpacing.sm,
    backgroundColor: '#0F2033',
    padding: MLSpacing.md,
    borderRadius: MLSpacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 244, 222, 0.08)',
  },
  bannerTextContainer: {
    flex: 1,
  },
  title: {
    color: MLColors.white,
    fontSize: MLTypography.h4,
    fontWeight: MLTypography.black,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: MLColors.textMuted,
    fontSize: MLTypography.bodySmall,
    marginTop: 2,
  },
  classicIcon: {
    width: 38,
    height: 38,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padMini: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
});
