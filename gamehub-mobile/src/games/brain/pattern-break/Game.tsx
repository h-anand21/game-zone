// ============================================================
// PATTERN BREAKER — Root Master Application Component
// 3D Cognitive Adventure: Spot the Rule. Break the Pattern.
// Commercial-Grade Modular React Native Architecture
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import type { GameEngine } from '../../engine/GameEngine';
import { usePatternBreakStore } from './store/patternBreakStore';
import { ExitConfirmationModal } from './components/overlays/ExitConfirmationModal';

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
  const {
    currentScreen,
    isPaused,
    togglePause,
    score,
    showExitModal,
    setShowExitModal,
    setScreen,
    goBack,
  } = usePatternBreakStore();

  // Sync engine pause state if needed
  useEffect(() => {
    if (enginePaused !== isPaused && currentScreen === 'gameplay') {
      togglePause();
    }
  }, [enginePaused, isPaused, currentScreen, togglePause]);

  // Robust Android Hardware Back Button Handling
  useEffect(() => {
    const onHardwareBack = () => {
      // 1. If Exit Modal is open, close it
      if (showExitModal) {
        setShowExitModal(false);
        return true;
      }

      // 2. If in active gameplay/countdown/rule_shift
      if (
        currentScreen === 'gameplay' ||
        currentScreen === 'countdown' ||
        currentScreen === 'rule_shift' ||
        currentScreen === 'feedback'
      ) {
        if (!isPaused) {
          togglePause(); // Safely open Pause modal instead of abruptly exiting
        } else {
          setScreen('home'); // If already paused, exit gameplay to home
        }
        return true;
      }

      // 3. If in Result screen, return to Home
      if (currentScreen === 'result') {
        setScreen('home');
        return true;
      }

      // 4. If in Splash screen, advance to Home
      if (currentScreen === 'splash') {
        setScreen('home');
        return true;
      }

      // 5. If in any sub-screen (difficulty, pattern_type, settings, etc.)
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
  }, [currentScreen, isPaused, showExitModal, togglePause, setScreen, goBack, setShowExitModal]);

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
      <ExitConfirmationModal onConfirmExit={() => onFinish(score, false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#061018',
  },
});
