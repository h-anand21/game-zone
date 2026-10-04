// ============================================================
// PATH MIND — Master Game Router & Orchestrator
// Unified Design System, Screen Architecture & Hardware Back Handling
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import type { GameEngine } from '../../engine/GameEngine';
import { usePathMindStore } from './store/pathMindStore';
import { HomeScreen } from './screens/HomeScreen';
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
