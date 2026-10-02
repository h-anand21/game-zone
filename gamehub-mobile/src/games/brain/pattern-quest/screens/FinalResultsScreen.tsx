// ============================================================
// PATTERN QUEST — Screen 14: FinalResultsScreen
// Comprehensive Expedition Report: Stats, Skill Breakdown, Navigation
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { GameHeader } from '../components/common/GameHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { GameButton } from '../components/buttons/GameButton';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';

export const FinalResultsScreen: React.FC = () => {
  const { score, maxCombo, userStats, setScreen, startNewGame } = usePatternQuestStore();

  return (
    <GameBackground screen="final_results" overlayDarkness={0.25}>
      <GameHeader onBack={() => setScreen('home')} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenPlaque screen="final_results" width={280} height={140} style={styles.plaque} />

        {/* Hero Score Box */}
        <View style={styles.scoreBoard}>
          <Text style={pqTypography.hudLabel}>TOTAL EXPEDITION SCORE</Text>
          <Text style={[pqTypography.h1, { fontSize: 36, color: pqColors.goldBright, marginVertical: 4 }]}>
            {score}
          </Text>
          <Text style={[pqTypography.caption, { color: pqColors.turquoiseLight }]}>
            MAX COMBO: x{maxCombo} • ACCURACY: {userStats.accuracy}%
          </Text>
        </View>

        {/* Skill Breakdown */}
        <View style={styles.skillsCard}>
          <Text style={styles.sectionTitle}>ARCHAEOLOGICAL SKILL PROFICIENCY</Text>

          <View style={styles.skillRow}>
            <Text style={styles.skillLabel}>SHAPE RECOGNITION</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${userStats.skillBreakdown.shape}%`, backgroundColor: '#00F0FF' }]} />
            </View>
            <Text style={styles.skillVal}>{userStats.skillBreakdown.shape}%</Text>
          </View>

          <View style={styles.skillRow}>
            <Text style={styles.skillLabel}>SPATIAL ROTATION</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${userStats.skillBreakdown.rotation}%`, backgroundColor: '#FFA502' }]} />
            </View>
            <Text style={styles.skillVal}>{userStats.skillBreakdown.rotation}%</Text>
          </View>

          <View style={styles.skillRow}>
            <Text style={styles.skillLabel}>TEMPLE MEMORY</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${userStats.skillBreakdown.memory}%`, backgroundColor: '#9B51E0' }]} />
            </View>
            <Text style={styles.skillVal}>{userStats.skillBreakdown.memory}%</Text>
          </View>

          <View style={styles.skillRow}>
            <Text style={styles.skillLabel}>POSITION LOGIC</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${userStats.skillBreakdown.position}%`, backgroundColor: '#2ECC71' }]} />
            </View>
            <Text style={styles.skillVal}>{userStats.skillBreakdown.position}%</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonStack}>
          <GameButton
            buttonAsset={pqAssets.buttons.nextLevel}
            onPress={() => setScreen('world_map')}
            width={260}
            height={64}
          />
          <GameButton
            buttonAsset={pqAssets.buttons.restart}
            onPress={() => startNewGame()}
            width={240}
            height={56}
          />
          <GameButton
            label="RETURN TO BASE CAMP"
            variant="wood"
            onPress={() => setScreen('home')}
            width={240}
            height={48}
            style={{ marginTop: 4 }}
          />
        </View>
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
  scoreBoard: {
    width: '100%',
    backgroundColor: 'rgba(18, 26, 36, 0.95)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2,
    borderColor: '#C5832B',
    padding: pqSpacing.base,
    alignItems: 'center',
    marginBottom: pqSpacing.md,
  },
  skillsCard: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 33, 0.92)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 1.5,
    borderColor: '#374151',
    padding: pqSpacing.base,
    marginBottom: pqSpacing.base,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: pqColors.textGold,
    letterSpacing: 1,
    marginBottom: pqSpacing.md,
    textAlign: 'center',
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: pqSpacing.sm,
  },
  skillLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: pqColors.textSecondary,
    width: 110,
  },
  progressBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(10, 16, 24, 0.8)',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  skillVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    width: 32,
    textAlign: 'right',
  },
  buttonStack: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
});
