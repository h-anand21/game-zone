// ============================================================
// PATTERN QUEST — Screen 06: HowToPlayScreen
// Illustrated 4-Step Adventure Tutorial with Live Visual Example
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { GameHeader } from '../components/common/GameHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { GameButton } from '../components/buttons/GameButton';
import { PatternTile } from '../components/game/PatternTile';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';

export const HowToPlayScreen: React.FC = () => {
  const { setScreen } = usePatternQuestStore();

  const sampleSequence = [
    { id: '1', shape: 'triangle' as const, color: '#00F0FF', rotation: 0, size: 'medium' as const, style: 'filled' as const },
    { id: '2', shape: 'circle' as const, color: '#FFD700', rotation: 0, size: 'medium' as const, style: 'filled' as const },
    { id: '3', shape: 'triangle' as const, color: '#00F0FF', rotation: 0, size: 'medium' as const, style: 'filled' as const },
  ];

  return (
    <GameBackground screen="how_to_play" overlayDarkness={0.25}>
      <GameHeader onBack={() => setScreen('home')} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenPlaque screen="how_to_play" width={270} height={135} style={styles.plaque} />

        {/* Live Visual Puzzle Board Demo */}
        <View style={styles.exampleBoard}>
          <Text style={styles.exampleTitle}>ANCIENT RUNIC SEQUENCE</Text>
          <View style={styles.sequenceRow}>
            {sampleSequence.map((t) => (
              <PatternTile key={t.id} tile={t} size={54} />
            ))}
            <PatternTile isQuestionMark size={54} />
          </View>
          <Text style={styles.exampleExplanation}>
            Pattern: Triangle (Cyan) → Circle (Gold) → Triangle (Cyan) → <Text style={{ color: pqColors.goldBright, fontWeight: '800' }}>Circle (Gold)</Text>
          </Text>
        </View>

        {/* 4 Illustrated Steps */}
        <View style={styles.stepsContainer}>
          <View style={styles.stepCard}>
            <View style={styles.stepNumBadge}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepHeading}>LOOK</Text>
              <Text style={pqTypography.body}>
                Carefully examine the shapes, rotations, colors, and transformations.
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumBadge}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepHeading}>THINK</Text>
              <Text style={pqTypography.body}>
                Deduce the sacred cycle: Is it alternating, rotating by 90°, or changing colors?
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumBadge}>
              <Text style={styles.stepNumText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepHeading}>CHOOSE</Text>
              <Text style={pqTypography.body}>
                Tap the matching rune among the 4 choices before the temple hourglass expires.
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumBadge}>
              <Text style={styles.stepNumText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepHeading}>GET RESULTS</Text>
              <Text style={pqTypography.body}>
                Stack multipliers with combos, earn stars, and unlock new mystic regions!
              </Text>
            </View>
          </View>
        </View>

        <GameButton
          buttonAsset={pqAssets.buttons.playNow}
          onPress={() => setScreen('ready')}
          width={240}
          height={64}
          style={{ marginTop: pqSpacing.md }}
        />
      </ScrollView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: pqSpacing.base,
    paddingBottom: 40,
    alignItems: 'center',
  },
  plaque: {
    marginBottom: pqSpacing.md,
  },
  exampleBoard: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 33, 0.95)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2,
    borderColor: pqColors.crystalCyan,
    padding: pqSpacing.base,
    alignItems: 'center',
    marginBottom: pqSpacing.base,
  },
  exampleTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: pqColors.turquoiseLight,
    letterSpacing: 1,
    marginBottom: pqSpacing.md,
  },
  sequenceRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: pqSpacing.md,
  },
  exampleExplanation: {
    ...pqTypography.caption,
    textAlign: 'center',
    color: pqColors.textSecondary,
  },
  stepsContainer: {
    width: '100%',
    gap: pqSpacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(18, 26, 36, 0.92)',
    borderRadius: pqSpacing.radiusMd,
    borderWidth: 1.5,
    borderColor: '#374151',
    padding: pqSpacing.md,
    alignItems: 'center',
  },
  stepNumBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(23, 195, 178, 0.2)',
    borderWidth: 1.5,
    borderColor: pqColors.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: pqSpacing.md,
  },
  stepNumText: {
    fontSize: 16,
    fontWeight: '900',
    color: pqColors.turquoiseLight,
  },
  stepContent: {
    flex: 1,
  },
  stepHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: pqColors.textGold,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
});
