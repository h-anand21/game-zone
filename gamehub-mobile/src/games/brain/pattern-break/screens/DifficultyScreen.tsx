// ============================================================
// PATTERN BREAKER — 05 Difficulty Screen
// Direct Level Select: Explorer, Thinker, Breaker
// Default Rule: MIXED
// Mode customization contained in a dedicated mode button
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { GameButton } from '../components/buttons/GameButton';
import { GameCard } from '../components/cards/GameCard';
import { PBDifficulty } from '../types';
import { PBColors, uiAssets } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

export const DifficultyScreen: React.FC = () => {
  const {
    difficulty,
    setDifficulty,
    setScreen,
    goBack,
    startNewRun,
    patternType,
    playMode,
  } = usePatternBreakStore();

  const handleSelect = (diff: PBDifficulty) => {
    setDifficulty(diff);
  };

  const handleStartGame = () => {
    startNewRun();
  };

  const getRuleAsset = () => {
    switch (patternType) {
      case 'NUMBER': return uiAssets.pattern.number;
      case 'SHAPE': return uiAssets.pattern.shape;
      case 'COLOR': return uiAssets.pattern.color;
      case 'COUNT': return uiAssets.pattern.count;
      case 'DIRECTION': return uiAssets.pattern.direction;
      case 'RANDOM': return uiAssets.pattern.random;
      case 'MIXED':
      default:
        return uiAssets.pattern.mixed;
    }
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
          <ScreenPlaque type="difficulty" height={105} />

          {/* Level 1: EXPLORER */}
          <GameCard
            title="EXPLORER"
            subtitle="Single property rules. Relaxed 30s clock for beginners."
            iconAsset={uiAssets.difficulty.easy}
            badge="EASY • 30s"
            selected={difficulty === 'EASY'}
            onPress={() => handleSelect('EASY')}
          />

          {/* Level 2: THINKER */}
          <GameCard
            title="THINKER"
            subtitle="Dual-layer relationships. Balanced 20s clock for agile minds."
            iconAsset={uiAssets.difficulty.medium}
            badge="MEDIUM • 20s"
            selected={difficulty === 'MEDIUM'}
            onPress={() => handleSelect('MEDIUM')}
          />

          {/* Level 3: BREAKER */}
          <GameCard
            title="BREAKER"
            subtitle="Multi-vector complex rules. Intense 12s adrenaline clock."
            iconAsset={uiAssets.difficulty.hard}
            badge="HARD • 12s"
            selected={difficulty === 'HARD'}
            onPress={() => handleSelect('HARD')}
          />

          {/* Dedicated Mode & Rule Customizer Button */}
          <View style={styles.modeHeader}>
            <Text style={styles.subtext}>CUSTOM GAMEPLAY MODE</Text>
          </View>

          <GameCard
            title={`RULE: ${patternType} • ${playMode === 'shift' ? 'SHIFT' : playMode === 'daily' ? 'DAILY' : 'QUICK'}`}
            subtitle="By default, puzzles use MIXED rules. Tap here to change rules or game mode."
            iconAsset={getRuleAsset()}
            badge="CHANGE ⚙️"
            onPress={() => setScreen('pattern_type')}
            rightContent={<Text style={styles.arrowText}>➔</Text>}
          />
        </ScrollView>

        {/* Primary Action Button: Immediately starts the run */}
        <View style={styles.bottomBar}>
          <GameButton
            asset={uiAssets.actions.start}
            height={68}
            onPress={handleStartGame}
            accessibilityLabel="Start Game"
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
    paddingBottom: 16,
    gap: 10,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 4,
  },
  modeHeader: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 2,
  },
  subtext: {
    fontSize: 10.5,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 2,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: '900',
    color: PBColors.primary,
  },
  bottomBar: {
    padding: 16,
  },
});
