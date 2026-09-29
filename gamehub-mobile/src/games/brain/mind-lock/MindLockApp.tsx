// ============================================================
// Mind Lock — Root Application Controller
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { MLColors } from './theme';
import { useMindLockStore } from './store/mindLockStore';
import {
  SplashScreen,
  OnboardingScreen,
  HomeScreen,
  GameModeSelectionScreen,
  GameplayScreen,
  CorrectFeedbackScreen,
  GameOverScreen,
  VictoryScreen,
  LevelMapScreen,
  DailyChallengeScreen,
  ChallengesScreen,
  AchievementsScreen,
  ProfileScreen,
  StatisticsScreen,
  SettingsScreen,
  PauseScreen,
  RewardUnlockScreen,
} from './screens';

interface MindLockAppProps {
  onExit?: () => void;
  onFinishGame?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
}

export const MindLockApp: React.FC<MindLockAppProps> = ({ onExit, onFinishGame }) => {
  const { currentScreen, loadPersistedData, score, round, gameStatus } = useMindLockStore();

  useEffect(() => {
    loadPersistedData();
  }, []);

  // When game completes or fails, sync to host GameHub if callback is provided
  useEffect(() => {
    if (gameStatus === 'GAME_OVER' && onFinishGame) {
      onFinishGame(score, round >= 5, { maxRoundReached: round });
    }
  }, [gameStatus, score, round]);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'home':
        return <HomeScreen />;
      case 'modes':
        return <GameModeSelectionScreen />;
      case 'gameplay':
        return <GameplayScreen />;
      case 'correct':
        return <CorrectFeedbackScreen />;
      case 'game-over':
        return <GameOverScreen />;
      case 'victory':
        return <VictoryScreen />;
      case 'levels':
        return <LevelMapScreen />;
      case 'daily':
        return <DailyChallengeScreen />;
      case 'challenges':
        return <ChallengesScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'statistics':
        return <StatisticsScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'pause':
        return <PauseScreen />;
      case 'reward':
        return <RewardUnlockScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={MLColors.background} />
      {renderActiveScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MLColors.background,
  },
});
