// ============================================================
// PATTERN BREAKER — 04 Play Mode Screen
// Choose challenge: Quick Break, Pattern Shift, Daily Break
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { GameCard } from '../components/cards/GameCard';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { PBPlayMode } from '../types';
import { PBColors, uiAssets } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

export const PlayModeScreen: React.FC = () => {
  const { playMode, setPlayMode, setScreen, currentScreen, goBack } = usePatternBreakStore();

  const handleSelectMode = (mode: PBPlayMode) => {
    setPlayMode(mode);
    if (mode === 'daily') {
      setScreen('daily_challenge');
    } else {
      setScreen('difficulty');
    }
  };

  return (
    <GameBackground variant="observatory">
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title="CHALLENGE MODE"
          onBack={goBack}
          onSettings={() => setScreen('settings')}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerInfo}>
            <Text style={styles.subtext}>SELECT YOUR RUN TYPE</Text>
          </View>

          {/* Card 1: QUICK BREAK */}
          <GameCard
            title="QUICK BREAK"
            subtitle="Rapid-fire random puzzles. Test your raw cognitive speed."
            iconAsset={uiAssets.icons.energy}
            badge="CLASSIC"
            selected={playMode === 'quick'}
            onPress={() => handleSelectMode('quick')}
            rightContent={<Text style={styles.arrowText}>➔</Text>}
          />

          {/* Card 2: PATTERN SHIFT */}
          <GameCard
            title="PATTERN SHIFT"
            subtitle="Rules dynamically mutate mid-game. Adapt without breaking streak!"
            iconAsset={uiAssets.icons.shuffle}
            badge="DYNAMIC"
            selected={playMode === 'shift'}
            onPress={() => handleSelectMode('shift')}
            rightContent={<Text style={styles.arrowText}>➔</Text>}
          />

          {/* Card 3: DAILY BREAK */}
          <GameCard
            title="DAILY BREAK"
            subtitle="One handcrafted daily matrix challenge with streak rewards."
            iconAsset={uiAssets.icons.calendar}
            badge="EVENT"
            selected={playMode === 'daily'}
            onPress={() => handleSelectMode('daily')}
            rightContent={<Text style={styles.arrowText}>➔</Text>}
          />
        </ScrollView>

        <BottomNavigation currentScreen={currentScreen} onNavigate={setScreen} />
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
    gap: 8,
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
  arrowText: {
    fontSize: 18,
    color: PBColors.primary,
    fontWeight: '900',
  },
});
