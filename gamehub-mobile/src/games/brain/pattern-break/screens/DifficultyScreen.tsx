// ============================================================
// PATTERN BREAKER — 05 Difficulty Screen
// Select level: Explorer (Easy), Thinker (Medium), Breaker (Hard)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { GameButton } from '../components/buttons/GameButton';
import { GameCard } from '../components/cards/GameCard';
import { PBDifficulty } from '../types';
import { PBColors, uiAssets } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

export const DifficultyScreen: React.FC = () => {
  const { difficulty, setDifficulty, setScreen, goBack } = usePatternBreakStore();

  const handleSelect = (diff: PBDifficulty) => {
    setDifficulty(diff);
  };

  const handleProceed = () => {
    setScreen('pattern_type');
  };

  return (
    <GameBackground variant="observatory">
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title="SELECT LEVEL"
          onBack={goBack}
          onSettings={() => setScreen('settings')}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerInfo}>
            <Text style={styles.subtext}>DIFFICULTY SCALING</Text>
          </View>

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
        </ScrollView>

        <View style={styles.bottomBar}>
          <GameButton
            asset={uiAssets.actions.continue}
            height={68}
            onPress={handleProceed}
            accessibilityLabel="Continue to Pattern Selection"
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
    gap: 10,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 10.5,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 2,
  },
  bottomBar: {
    padding: 16,
  },
});
