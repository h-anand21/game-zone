// ============================================================
// Find One — Root Application Controller
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { FOColors } from './theme';
import { useFindOneStore } from './store/findOneStore';
import {
  HomeScreen,
  HowToPlayScreen,
  GameplayScreen,
  PauseModal,
  GameOverScreen,
  NewBestScreen,
} from './screens';

interface FindOneAppProps {
  onExit?: () => void;
  onFinishGame?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
}

export const FindOneApp: React.FC<FindOneAppProps> = ({ onExit, onFinishGame }) => {
  const { currentScreen, loadPersistedData, score, isPaused } = useFindOneStore();

  useEffect(() => {
    loadPersistedData();
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'how-to-play':
        return <HowToPlayScreen />;
      case 'gameplay':
        return (
          <>
            <GameplayScreen />
            <PauseModal />
          </>
        );
      case 'game-over':
        return <GameOverScreen />;
      case 'new-best':
        return <NewBestScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {renderScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FOColors.background,
  },
});
