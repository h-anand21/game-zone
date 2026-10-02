// ============================================================
// PATTERN QUEST — Main Game Component
// Master Screen Router & Orchestrator
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import type { GameEngine } from '../../engine/GameEngine';
import { usePatternQuestStore } from './store/patternQuestStore';
import { ExitConfirmationModal } from './components/overlays/ExitConfirmationModal';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { WorldMapScreen } from './screens/WorldMapScreen';
import { ModeSelectionScreen } from './screens/ModeSelectionScreen';
import { DifficultyScreen } from './screens/DifficultyScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { ReadyScreen } from './screens/ReadyScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { MemoryShiftScreen } from './screens/MemoryShiftScreen';
import { RushModeScreen } from './screens/RushModeScreen';
import { LevelCompleteScreen } from './screens/LevelCompleteScreen';
import { FinalResultsScreen } from './screens/FinalResultsScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';

interface PatternQuestGameProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const PatternQuestGame: React.FC<PatternQuestGameProps> = ({
  onFinish,
  isPaused: _enginePaused,
}) => {
  const {
    currentScreen,
    score,
    showExitModal,
    setShowExitModal,
    setScreen,
    goBack,
  } = usePatternQuestStore();

  // Robust Android Hardware Back Button Handling
  useEffect(() => {
    const onHardwareBack = () => {
      // 1. If Exit Modal is open, close it
      if (showExitModal) {
        setShowExitModal(false);
        return true;
      }

      // 2. If in active gameplay / rush / memory shift / ready
      if (
        currentScreen === 'gameplay' ||
        currentScreen === 'rush_mode' ||
        currentScreen === 'memory_shift' ||
        currentScreen === 'ready'
      ) {
        // Show exit confirmation modal instead of abruptly cutting out
        setShowExitModal(true);
        return true;
      }

      // 3. If in Results or Level Complete screen, return to Home
      if (currentScreen === 'final_results' || currentScreen === 'level_complete') {
        setScreen('home');
        return true;
      }

      // 4. If in Splash screen, advance to Home
      if (currentScreen === 'splash') {
        setScreen('home');
        return true;
      }

      // 5. If in any sub-screen (world_map, mode_select, difficulty, how_to_play, achievements, profile, settings)
      if (currentScreen !== 'home') {
        goBack();
        return true;
      }

      // 6. If on Home screen, show Exit confirmation modal instead of killing the app
      setShowExitModal(true);
      return true;
    };

    const backSub = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => backSub.remove();
  }, [currentScreen, showExitModal, setScreen, goBack, setShowExitModal]);

  const handleConfirmExit = () => {
    setShowExitModal(false);
    onFinish?.(score, false);
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'home':
        return <HomeScreen />;
      case 'world_map':
        return <WorldMapScreen />;
      case 'mode_select':
        return <ModeSelectionScreen />;
      case 'difficulty':
        return <DifficultyScreen />;
      case 'how_to_play':
        return <HowToPlayScreen />;
      case 'ready':
        return <ReadyScreen />;
      case 'gameplay':
        return <GameplayScreen />;
      case 'memory_shift':
        return <MemoryShiftScreen />;
      case 'rush_mode':
        return <RushModeScreen />;
      case 'level_complete':
        return <LevelCompleteScreen />;
      case 'final_results':
        return <FinalResultsScreen />;
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {renderActiveScreen()}
      <ExitConfirmationModal onConfirmExit={handleConfirmExit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D3B2E',
  },
});
