// ============================================================
// Number Rush — Root Application Controller & Screen Router
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NRTheme } from './theme';
import { useNumberRushStore } from './store/numberRushStore';
import {
  HomeScreen,
  ModeHubScreen,
  CategoryScreen,
  ModePreviewScreen,
  DifficultyModal,
  CountdownScreen,
  GameplayScreen,
  LevelCompleteScreen,
  PauseModal,
  HowToPlayModal,
  LeaderboardModal,
  ProfileModal,
  AchievementsModal,
  SettingsModal,
  DailyRushModal,
} from './screens';
import { PowerUpModal } from './components/PowerUpModal';

interface NumberRushAppProps {
  onExit?: () => void;
  onFinishGame?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
}

export const NumberRushApp: React.FC<NumberRushAppProps> = () => {
  const { currentScreen, loadPersistedData } = useNumberRushStore();

  useEffect(() => {
    loadPersistedData();
  }, []);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'mode-hub':
        return <ModeHubScreen />;
      case 'category':
        return <CategoryScreen />;
      case 'mode-preview':
        return <ModePreviewScreen />;
      case 'difficulty':
        return <DifficultyModal />;
      case 'countdown':
        return <CountdownScreen />;
      case 'gameplay':
        return (
          <>
            <GameplayScreen />
            <PauseModal />
            <PowerUpModal />
          </>
        );
      case 'level-complete':
        return <LevelCompleteScreen />;
      case 'how-to-play':
        return <HowToPlayModal />;
      case 'leaderboard':
        return <LeaderboardModal />;
      case 'profile':
        return <ProfileModal />;
      case 'achievements':
        return <AchievementsModal />;
      case 'settings':
        return <SettingsModal />;
      case 'daily-rush':
        return <DailyRushModal />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      {renderActiveScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NRTheme.colors.bgDark,
  },
});
