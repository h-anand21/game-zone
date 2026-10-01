// ============================================================
// Number Rush — Root Application Controller & Screen Router
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import { NRTheme } from './theme';
import { useNumberRushStore } from './store/numberRushStore';
import {
  SplashScreen,
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
import { ExitConfirmationModal } from './components/ExitConfirmationModal';

import { useNavigation } from 'expo-router';

interface NumberRushAppProps {
  onExit?: () => void;
  onFinishGame?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
}

export const NumberRushApp: React.FC<NumberRushAppProps> = ({ onExit }) => {
  const navigation = useNavigation();
  const {
    currentScreen,
    setScreen,
    loadPersistedData,
    setOnExitApp,
    setShowExitModal,
    showExitModal,
    togglePause,
  } = useNumberRushStore();

  useEffect(() => {
    loadPersistedData();
    if (onExit) {
      setOnExitApp(onExit);
    }
  }, [onExit]);

  // 1. Intercept Expo Router Navigation beforeRemove (Android gesture navigation / swipe back / route pop)
  useEffect(() => {
    if (!navigation) return;

    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      const state = useNumberRushStore.getState();

      // If user clicked confirm exit in the modal, allow navigation to pop
      if (state.isExiting) {
        return;
      }

      // Stop default OS exit/pop action
      e.preventDefault();

      if (state.showExitModal) {
        state.setShowExitModal(false);
        return;
      }

      if (state.currentScreen === 'home') {
        state.setShowExitModal(true);
        return;
      }

      if (state.currentScreen === 'gameplay') {
        state.togglePause();
        return;
      }

      // Any other subscreen returns cleanly to Home
      state.setScreen('home');
    });

    return unsubscribe;
  }, [navigation]);

  // 2. Intercept Android Hardware Back Button (3-button navigation)
  useEffect(() => {
    const handleHardwareBack = () => {
      const state = useNumberRushStore.getState();

      if (state.isExiting) {
        return false;
      }

      if (state.showExitModal) {
        state.setShowExitModal(false);
        return true;
      }

      if (state.currentScreen === 'home') {
        state.setShowExitModal(true);
        return true;
      }

      if (state.currentScreen === 'gameplay') {
        state.togglePause();
        return true;
      }

      // Any other subscreen returns cleanly to Home
      state.setScreen('home');
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
    return () => sub.remove();
  }, []);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
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
      <ExitConfirmationModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NRTheme.colors.bgDark,
  },
});
