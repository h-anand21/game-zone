// ============================================================
// REVERSE MIND — Master Application Orchestrator
// ============================================================

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, BackHandler, StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useReverseMindStore } from './store/reverseMindStore';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModeSelectionScreen } from './screens/ModeSelectionScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { DailyChallengeScreen } from './screens/DailyChallengeScreen';
import { StatsScreen } from './screens/StatsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import type { GameMode, GameDifficulty, AppNavScreen } from './types';

interface ReverseMindAppProps {
  onExit?: () => void;
  onFinishGame?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
}

export const ReverseMindApp: React.FC<ReverseMindAppProps> = ({ onExit }) => {
  const {
    currentScreen,
    setScreen,
    startNewGame,
    settings,
  } = useReverseMindStore();

  // Safe Android Hardware Back Button Handling
  const handleBack = useCallback(() => {
    if (currentScreen === 'gameplay') {
      setScreen('home');
      return true;
    }
    if (currentScreen !== 'home' && currentScreen !== 'splash') {
      setScreen('home');
      return true;
    }
    if (currentScreen === 'home') {
      onExit?.();
      return true;
    }
    return false;
  }, [currentScreen, setScreen, onExit]);

  useEffect(() => {
    const backSub = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backSub.remove();
  }, [handleBack]);

  const triggerHaptic = () => {
    if (settings.hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
  };

  const handleLaunchGame = (mode: GameMode, difficulty: GameDifficulty) => {
    triggerHaptic();
    startNewGame(mode, difficulty);
  };

  const handleNavigate = (screen: AppNavScreen) => {
    triggerHaptic();
    setScreen(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Screen Router */}
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={() => setScreen('home')} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onStartGame={(mode) => handleLaunchGame(mode, 'easy')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'modes' && (
        <ModeSelectionScreen
          onLaunchGame={handleLaunchGame}
          onNavigate={handleNavigate}
          onBack={() => setScreen('home')}
        />
      )}

      {currentScreen === 'gameplay' && (
        <GameplayScreen onBack={() => setScreen('home')} />
      )}

      {currentScreen === 'daily' && (
        <DailyChallengeScreen
          onStartDaily={() => handleLaunchGame('daily-flip', 'medium')}
          onNavigate={handleNavigate}
          onBack={() => setScreen('home')}
        />
      )}

      {currentScreen === 'stats' && (
        <StatsScreen
          onNavigate={handleNavigate}
          onBack={() => setScreen('home')}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen
          onNavigate={handleNavigate}
          onBack={() => setScreen('home')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111F',
  },
});
