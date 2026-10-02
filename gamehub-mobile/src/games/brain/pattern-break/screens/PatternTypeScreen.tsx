// ============================================================
// PATTERN BREAKER — 06 Pattern Type & Custom Mode Screen
// Unmistakably interactive selectable cards vs section divider titles
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { SectionTitle } from '../components/common/SectionTitle';
import { GameButton } from '../components/buttons/GameButton';
import { PBPatternType } from '../types';
import { PBColors, PBRadius, PBShadows, uiAssets } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

interface CategoryOption {
  id: PBPatternType;
  title: string;
  desc: string;
  asset: ImageSourcePropType;
  color: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'RANDOM', title: 'RANDOM', desc: 'Dynamic shuffle across all rules', asset: uiAssets.pattern.random, color: '#19D3FF' },
  { id: 'NUMBER', title: 'NUMBER', desc: 'Sequence & arithmetic', asset: uiAssets.pattern.number, color: '#19D3FF' },
  { id: 'SHAPE', title: 'SHAPE', desc: 'Visual geometry', asset: uiAssets.pattern.shape, color: '#FFD54A' },
  { id: 'COLOR', title: 'COLOR', desc: 'Harmonic hue rhythm', asset: uiAssets.pattern.color, color: '#FF6EA7' },
  { id: 'COUNT', title: 'COUNT', desc: 'Quantity resonance', asset: uiAssets.pattern.count, color: '#38E58C' },
  { id: 'DIRECTION', title: 'DIRECTION', desc: 'Vector & rotation', asset: uiAssets.pattern.direction, color: '#A78BFA' },
  { id: 'MIXED', title: 'MIXED', desc: 'Fusion multi-rules', asset: uiAssets.pattern.mixed, color: '#FB923C' },
];

export const PatternTypeScreen: React.FC = () => {
  const {
    patternType,
    setPatternType,
    playMode,
    setPlayMode,
    setScreen,
    goBack,
    startNewRun,
  } = usePatternBreakStore();

  const handleStart = () => {
    startNewRun();
  };

  const handleSelectMode = (m: 'quick' | 'shift' | 'daily') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    setPlayMode(m);
  };

  const handleSelectPattern = (id: PBPatternType) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    setPatternType(id);
  };

  return (
    <GameBackground variant="observatory">
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          onBack={goBack}
          onSettings={() => setScreen('settings')}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 3D Sculpted Screen Name Badge */}
          <ScreenPlaque type="pattern_type" height={100} />

          {/* Section Divider: Non-clickable header */}
          <SectionTitle
            title="CHALLENGE RUN TYPE"
            subtitle="Select pacing or dynamic in-game rule shifts"
            badge="ACTIVE MODE"
            accentColor={PBColors.primary}
          />

          {/* Mode Switcher Buttons */}
          <View style={styles.modeSwitcherBar}>
            {(['quick', 'shift', 'daily'] as const).map((m) => {
              const isModeActive = playMode === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => handleSelectMode(m)}
                  style={({ pressed }) => [
                    styles.modeTab,
                    isModeActive && styles.modeTabActive,
                    pressed && styles.itemPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isModeActive }}
                >
                  <Text style={[styles.modeTabText, isModeActive && styles.modeTabTextActive]}>
                    {m === 'quick' ? '⚡ QUICK' : m === 'shift' ? '🔄 SHIFT' : '📅 DAILY'}
                  </Text>
                  <View
                    style={[
                      styles.modeIndicatorPill,
                      isModeActive && styles.modeIndicatorPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modeIndicatorText,
                        isModeActive && styles.modeIndicatorTextActive,
                      ]}
                    >
                      {isModeActive ? '✓ SELECTED' : 'TAP TO SET'}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Section Divider: Non-clickable header */}
          <SectionTitle
            title="RULE FAMILY SELECTION"
            subtitle="Pick a single rule or keep dynamic random shuffle"
            badge="DEFAULT: RANDOM"
            accentColor={PBColors.accent}
            style={{ marginTop: 8 }}
          />

          {/* Clickable Rule Cards Grid */}
          <View style={styles.grid}>
            {CATEGORIES.map((cat) => {
              const isSelected = patternType === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => handleSelectPattern(cat.id)}
                  style={({ pressed }) => [
                    styles.card,
                    isSelected && { borderColor: cat.color, borderWidth: 2 },
                    isSelected && PBShadows.cyanGlow,
                    pressed && styles.itemPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  {/* Obvious Tap / Active Indicator Pill */}
                  <View
                    style={[
                      styles.cardActionTag,
                      isSelected && {
                        backgroundColor: `${cat.color}25`,
                        borderColor: cat.color,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.cardActionText,
                        isSelected && { color: cat.color, fontWeight: '900' },
                      ]}
                    >
                      {isSelected ? '✓ ACTIVE' : 'TAP TO PICK'}
                    </Text>
                  </View>

                  <View style={styles.patternBtnHolder}>
                    <Image
                      source={cat.asset}
                      style={styles.patternBtnImg}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.desc}>{cat.desc}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <GameButton
            asset={uiAssets.actions.start}
            height={66}
            onPress={handleStart}
            accessibilityLabel="Start Adventure"
          />
        </View>
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 8,
  },
  modeSwitcherBar: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 6,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: PBRadius.md,
    backgroundColor: 'rgba(10, 24, 34, 0.92)',
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  modeTabActive: {
    backgroundColor: 'rgba(25, 211, 255, 0.18)',
    borderColor: PBColors.primary,
    shadowColor: PBColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: PBColors.textSecondary,
    letterSpacing: 0.8,
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  modeIndicatorPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  modeIndicatorPillActive: {
    backgroundColor: 'rgba(25, 211, 255, 0.25)',
    borderColor: PBColors.primary,
  },
  modeIndicatorText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: PBColors.textMuted,
    letterSpacing: 0.5,
  },
  modeIndicatorTextActive: {
    color: PBColors.primary,
    fontWeight: '900',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'rgba(10, 24, 34, 0.94)',
    borderRadius: PBRadius.lg,
    padding: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.22)',
    alignItems: 'center',
    minHeight: 116,
    gap: 4,
  },
  cardActionTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  cardActionText: {
    fontSize: 9,
    fontWeight: '800',
    color: PBColors.textMuted,
    letterSpacing: 0.8,
  },
  patternBtnHolder: {
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternBtnImg: {
    width: '100%',
    height: '100%',
  },
  desc: {
    fontSize: 10,
    color: PBColors.textSecondary,
    textAlign: 'center',
    lineHeight: 13,
    fontWeight: '500',
  },
  itemPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.88,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
  },
});
