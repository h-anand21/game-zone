// ============================================================
// PATTERN BREAKER — Root Master Application Component
// 3D Cognitive Adventure: Spot the Rule. Break the Pattern.
// Commercial-Grade Modular React Native Architecture
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import type { GameEngine } from '../../engine/GameEngine';
import { usePatternBreakStore } from './store/patternBreakStore';

// Screen imports
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { PlayModeScreen } from './screens/PlayModeScreen';
import { DifficultyScreen } from './screens/DifficultyScreen';
import { PatternTypeScreen } from './screens/PatternTypeScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { DailyChallengeScreen } from './screens/DailyChallengeScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';

interface PatternBreakProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const PatternBreakGame: React.FC<PatternBreakProps> = ({
  onFinish,
  isPaused: enginePaused,
}) => {
  const { currentScreen, isPaused, togglePause, score, bestScore } = usePatternBreakStore();

  // Sync engine pause state if needed
  useEffect(() => {
    if (enginePaused !== isPaused && currentScreen === 'gameplay') {
      togglePause();
    }
  }, [enginePaused, isPaused, currentScreen, togglePause]);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'home':
        return <HomeScreen />;
      case 'play_mode':
        return <PlayModeScreen />;
      case 'difficulty':
        return <DifficultyScreen />;
      case 'pattern_type':
        return <PatternTypeScreen />;
      case 'how_to_play':
        return <HowToPlayScreen />;
      case 'countdown':
      case 'gameplay':
      case 'pause':
      case 'rule_shift':
      case 'feedback':
        return <GameplayScreen />;
      case 'result':
        return <ResultScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'daily_challenge':
        return <DailyChallengeScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {renderActiveScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#061018',
  },
});
