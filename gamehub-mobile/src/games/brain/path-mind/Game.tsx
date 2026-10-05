// ============================================================
// PATH MIND — Master Game Router & Orchestrator
// Unified Design System, Screen Architecture & Hardware Back Handling
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import type { GameEngine } from '../../engine/GameEngine';
import { usePathMindStore } from './store/pathMindStore';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModeSelectionScreen } from './screens/ModeSelectionScreen';
import { DifficultyScreen } from './screens/DifficultyScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { WorldMapScreen } from './screens/WorldMapScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { ResultScreen } from './screens/ResultScreen';
import { BuildPathScreen } from './screens/BuildPathScreen';
import { DailyPathScreen } from './screens/DailyPathScreen';
import { CollectionScreen } from './screens/CollectionScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ExitConfirmationModal } from './components/overlays/ExitConfirmationModal';

interface PathMindProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const PathMindGame: React.FC<PathMindProps> = ({ onFinish }) => {
  const {
    currentScreen,
    setScreen,
    goBack,
    showExitModal,
    setShowExitModal,
    score,
    currentLevel,
  } = usePathMindStore();

  // Robust Android Hardware Back Button Handling
  useEffect(() => {
    const onHardwareBack = () => {
      // 1. If Exit Modal is open, close it
      if (showExitModal) {
        setShowExitModal(false);
        return true;
      }

      // 2. If in any subscreen, navigate back
      if (currentScreen !== 'home') {
        goBack();
        return true;
      }

      // 3. If on Home screen, show Exit confirmation modal instead of killing the app
      setShowExitModal(true);
      return true;
    };

    const backSub = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => backSub.remove();
  }, [currentScreen, showExitModal, goBack, setShowExitModal]);

  const handleConfirmExit = () => {
    setShowExitModal(false);
    onFinish?.(score, false, { level: currentLevel });
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'modes':
        return <ModeSelectionScreen />;
      case 'difficulty':
        return <DifficultyScreen />;
      case 'how_to_play':
        return <HowToPlayScreen />;
      case 'world_map':
        return <WorldMapScreen />;
      case 'gameplay':
        return <GameplayScreen />;
      case 'result':
        return <ResultScreen />;
      case 'builder':
        return <BuildPathScreen />;
      case 'daily':
        return <DailyPathScreen />;
      case 'collection':
        return <CollectionScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'home':
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderActiveScreen()}
      <ExitConfirmationModal
        visible={showExitModal}
        level={currentLevel}
        score={score}
        onCancel={() => setShowExitModal(false)}
        onConfirm={handleConfirmExit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071318',
  },
});
