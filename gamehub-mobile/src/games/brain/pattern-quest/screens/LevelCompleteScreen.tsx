// ============================================================
// PATTERN QUEST — Screen 13: LevelCompleteScreen
// Victory Screen: 3 Stars, Stats breakdown, Continue & Replay
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { GameButton } from '../components/buttons/GameButton';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LevelCompleteScreen: React.FC = () => {
  const { score, maxCombo, userStats, setScreen, startNewGame } = usePatternQuestStore();

  return (
    <GameBackground screen="level_complete" overlayDarkness={0.25}>
      <View style={styles.container}>
        <ScreenPlaque screen="level_complete" width={280} height={140} style={styles.plaque} />

        {/* 3 Gold Stars */}
        <View style={styles.starRow}>
          <Image source={pqAssets.hud.star} style={[styles.starIcon, styles.sideStar]} resizeMode="contain" />
          <Image source={pqAssets.hud.star} style={[styles.starIcon, styles.centerStar]} resizeMode="contain" />
          <Image source={pqAssets.hud.star} style={[styles.starIcon, styles.sideStar]} resizeMode="contain" />
        </View>

        {/* Stone Victory Chamber Card */}
        <View style={styles.statsCard}>
          <Text style={styles.victoryTitle}>CHAMBER CONQUERED</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={pqTypography.hudLabel}>SCORE</Text>
              <Text style={[pqTypography.h2, { color: pqColors.goldBright }]}>{score}</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={pqTypography.hudLabel}>ACCURACY</Text>
              <Text style={[pqTypography.h2, { color: pqColors.crystalCyan }]}>{userStats.accuracy}%</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={pqTypography.hudLabel}>BEST COMBO</Text>
              <Text style={[pqTypography.h2, { color: pqColors.turquoiseLight }]}>x{maxCombo}</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={pqTypography.hudLabel}>SOLVED</Text>
              <Text style={[pqTypography.h2, { color: pqColors.jungleGreenBright }]}>{userStats.patternsSolved}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
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
        </View>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: pqSpacing.xl,
    paddingHorizontal: pqSpacing.base,
  },
  plaque: {
    marginTop: pqSpacing.xs,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  starIcon: {
    width: 48,
    height: 48,
  },
  centerStar: {
    width: 68,
    height: 68,
    transform: [{ translateY: -10 }],
  },
  sideStar: {
    transform: [{ rotate: '15deg' }],
  },
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(18, 26, 36, 0.95)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2,
    borderColor: '#C5832B',
    padding: pqSpacing.base,
    alignItems: 'center',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  victoryTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: pqColors.textGold,
    letterSpacing: 1.5,
    marginBottom: pqSpacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    width: '48%',
    backgroundColor: 'rgba(12, 18, 26, 0.8)',
    borderRadius: pqSpacing.radiusSm,
    padding: pqSpacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  buttonStack: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
});
