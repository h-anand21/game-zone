import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { SectionTitle } from '../components/common/SectionTitle';
import { GameButton } from '../components/buttons/GameButton';
import { PBPatternType } from '../types';
import { PBColors, PBRadius, PBShadows, uiAssets } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';
import { Image, ImageSourcePropType } from 'react-native';

interface CategoryOption {
  id: PBPatternType;
  title: string;
  desc: string;
  asset: ImageSourcePropType;
  color: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'RANDOM', title: 'RANDOM', desc: 'Surprise me with any pattern!', asset: uiAssets.icons.shuffle, color: '#19D3FF' },
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
          <ScreenPlaque type="pattern_type" height={105} />

          {/* Challenge Mode Selector */}
          <SectionTitle
            title="CHALLENGE RUN TYPE"
            subtitle="Choose speedrun pacing or dynamic rule-shifting"
            badge="ACTIVE MODE"
            accentColor={PBColors.primary}
          />

          <View style={styles.modeSwitcherBar}>
            {(['quick', 'shift', 'daily'] as const).map((m) => {
              const isModeActive = playMode === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => setPlayMode(m)}
                  style={[styles.modeTab, isModeActive && styles.modeTabActive]}
                >
                  <Text style={[styles.modeTabText, isModeActive && styles.modeTabTextActive]}>
                    {m === 'quick' ? '⚡ QUICK' : m === 'shift' ? '🔄 SHIFT' : '📅 DAILY'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Rule Family Selector */}
          <SectionTitle
            title="RULE FAMILY SELECTION"
            subtitle="Lock into one family or keep dynamic random shuffle"
            badge="DEFAULT: RANDOM"
            accentColor={PBColors.accent}
            style={{ marginTop: 12 }}
          />

          <View style={styles.grid}>
            {CATEGORIES.map((cat) => {
              const isSelected = patternType === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setPatternType(cat.id)}
                  style={[
                    styles.card,
                    isSelected && { borderColor: cat.color, borderWidth: 2 },
                    isSelected && PBShadows.cyanGlow,
                  ]}
                >
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
        </ScrollView>

        <View style={styles.bottomBar}>
          <GameButton
            asset={uiAssets.actions.start}
            height={68}
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
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  modeSwitcherBar: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: PBRadius.md,
    backgroundColor: 'rgba(24, 47, 57, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTabActive: {
    backgroundColor: 'rgba(25, 211, 255, 0.25)',
    borderColor: PBColors.primary,
  },
  modeTabText: {
    fontSize: 11,
    fontWeight: '800',
    color: PBColors.textMuted,
    letterSpacing: 1,
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  subtext: {
    fontSize: 10.5,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'rgba(24, 47, 57, 0.88)',
    borderRadius: PBRadius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.22)',
    alignItems: 'center',
    minHeight: 120,
  },
  patternBtnHolder: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  patternBtnImg: {
    width: '100%',
    height: '100%',
  },
  desc: {
    fontSize: 9.5,
    color: PBColors.textMuted,
    textAlign: 'center',
    lineHeight: 13,
  },
  bottomBar: {
    padding: 16,
  },
});
