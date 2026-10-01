// ============================================================
// REVERSE MIND — Mode Selection & Difficulty Screen (SVG Icons)
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameBackground } from '../components/GameBackground';
import { GlowButton } from '../components/GlowButton';
import { BottomTabBar } from '../components/BottomTabBar';
import {
  ReverseArrowIconSvg,
  LightningIconSvg,
  BrainIconSvg,
  TargetIconSvg,
  RocketIconSvg,
} from '../components/SvgIcons';
import type { GameMode, GameDifficulty, AppNavScreen } from '../types';
import { useReverseMindStore } from '../store/reverseMindStore';
import { RMTheme } from '../theme';

interface ModeSelectionScreenProps {
  initialMode?: GameMode;
  onLaunchGame: (mode: GameMode, difficulty: GameDifficulty) => void;
  onNavigate: (screen: AppNavScreen) => void;
  onBack: () => void;
}

interface ModeMeta {
  id: GameMode;
  name: string;
  tagline: string;
  desc: string;
  renderIcon: (color: string) => React.ReactNode;
  color: string;
  gradient: [string, string];
}

const MODES: ModeMeta[] = [
  {
    id: 'classic',
    name: 'CLASSIC REVERSE',
    tagline: 'STANDARD INVERSION',
    desc: 'Memorize the object sequence and tap every object in exact reverse order.',
    renderIcon: (color) => <ReverseArrowIconSvg size={30} color={color} />,
    color: RMTheme.colors.cyanNeon,
    gradient: ['#162842', '#0D1A2B'],
  },
  {
    id: 'quick-flip',
    name: 'QUICK FLIP',
    tagline: 'SPEED BLITZ',
    desc: 'Ultra-fast memory flash! Rapid display time and high combo rewards.',
    renderIcon: (color) => <LightningIconSvg size={30} color={color} />,
    color: RMTheme.colors.purpleNeon,
    gradient: ['#28184C', '#180C30'],
  },
  {
    id: 'mind-shift',
    name: 'MIND SHIFT',
    tagline: 'DYNAMIC RULES',
    desc: 'Rules mutate mid-game! Reverse while ignoring red items, specific categories, or order shifts.',
    renderIcon: (color) => <BrainIconSvg size={30} color={color} />,
    color: RMTheme.colors.orangeNeon,
    gradient: ['#381F08', '#201004'],
  },
  {
    id: 'practice',
    name: 'CASUAL PRACTICE',
    tagline: 'UNTIMED RELAXATION',
    desc: 'No time limits, no fail states. Pure cognitive exercise at your own pace.',
    renderIcon: (color) => <TargetIconSvg size={30} color={color} />,
    color: RMTheme.colors.emeraldGreen,
    gradient: ['#0D2B1E', '#061910'],
  },
];

export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
  initialMode = 'classic',
  onLaunchGame,
  onNavigate,
  onBack,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(initialMode);
  const [difficulty, setDifficulty] = useState<GameDifficulty>('easy');

  const activeModeMeta = MODES.find((m) => m.id === selectedMode) || MODES[0];

  return (
    <GameBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>CHOOSE MODE</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Mode Carousel Cards */}
          <View style={styles.modesContainer}>
            {MODES.map((mode) => {
              const isSelected = selectedMode === mode.id;

              return (
                <Pressable
                  key={mode.id}
                  onPress={() => {
                    setSelectedMode(mode.id);
                    useReverseMindStore.getState().setMode(mode.id);
                  }}
                  style={({ pressed }) => [
                    styles.modeCard,
                    isSelected && { borderColor: mode.color },
                    pressed && styles.pressed,
                  ]}
                >
                  <LinearGradient
                    colors={mode.gradient}
                    style={styles.cardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.cardLeft}>{mode.renderIcon(mode.color)}</View>
                    <View style={styles.cardCenter}>
                      <Text style={[styles.cardTagline, { color: mode.color }]}>
                        {mode.tagline}
                      </Text>
                      <Text style={styles.cardTitle}>{mode.name}</Text>
                      <Text style={styles.cardDesc}>{mode.desc}</Text>
                    </View>
                    <View style={styles.cardRight}>
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && { borderColor: mode.color, backgroundColor: mode.color },
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </View>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </View>

          {/* Difficulty Selector */}
          <View style={styles.difficultySection}>
            <Text style={styles.sectionHeader}>SELECT DIFFICULTY</Text>
            <View style={styles.difficultyRow}>
              {(['easy', 'medium', 'hard'] as GameDifficulty[]).map((diff) => {
                const isSelected = difficulty === diff;
                const diffColor =
                  diff === 'easy'
                    ? RMTheme.colors.emeraldGreen
                    : diff === 'medium'
                    ? RMTheme.colors.primaryGold
                    : RMTheme.colors.coralRed;

                return (
                  <Pressable
                    key={diff}
                    onPress={() => setDifficulty(diff)}
                    style={[
                      styles.diffTab,
                      isSelected && { borderColor: diffColor, backgroundColor: 'rgba(255,255,255,0.08)' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.diffText,
                        isSelected && { color: diffColor, fontWeight: '900' },
                      ]}
                    >
                      {diff.toUpperCase()}
                    </Text>
                    <Text style={styles.diffSubtext}>
                      {diff === 'easy' ? '3-5 items' : diff === 'medium' ? '4-6 items' : '5-8 items'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Difficulty Rules Summary Box */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>RULES PREVIEW</Text>
            <Text style={styles.summaryItem}>
              • Allowed Mistakes: <Text style={styles.summaryBold}>{difficulty === 'easy' ? '2 mistakes' : difficulty === 'medium' ? '1 mistake' : '0 mistakes'}</Text>
            </Text>
            <Text style={styles.summaryItem}>
              • Memorize Window: <Text style={styles.summaryBold}>{difficulty === 'easy' ? '3.0 sec' : difficulty === 'medium' ? '2.0 sec' : '1.2 sec'}</Text>
            </Text>
            <Text style={styles.summaryItem}>
              • Inversion Target: <Text style={styles.summaryBold}>Exact reverse order</Text>
            </Text>
          </View>

          {/* Start Button */}
          <View style={styles.launchBtnWrapper}>
            <GlowButton
              title={`START ${activeModeMeta.name}`}
              variant="gold"
              size="lg"
              icon={<RocketIconSvg size={22} color="#07111F" />}
              onPress={() => onLaunchGame(selectedMode, difficulty)}
            />
          </View>
        </ScrollView>

        <BottomTabBar currentScreen="modes" onNavigate={onNavigate} />
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modesContainer: {
    gap: 12,
    marginBottom: 20,
  },
  modeCard: {
    borderRadius: RMTheme.radii.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardGradient: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },
  cardLeft: {
    marginRight: 12,
  },
  cardCenter: {
    flex: 1,
  },
  cardTagline: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 11,
    color: RMTheme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  cardRight: {
    marginLeft: 8,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#07111F',
  },
  difficultySection: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: RMTheme.colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  diffTab: {
    flex: 1,
    borderRadius: RMTheme.radii.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  diffText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8CA0B8',
  },
  diffSubtext: {
    fontSize: 9,
    color: RMTheme.colors.textMuted,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: 'rgba(16, 27, 43, 0.65)',
    borderRadius: RMTheme.radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 14,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  summaryItem: {
    fontSize: 12,
    color: RMTheme.colors.textSecondary,
    marginVertical: 2,
  },
  summaryBold: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  launchBtnWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
