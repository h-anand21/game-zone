// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Master Application Navigator
// Coordinates all 10+ screens, game runtime & persistence
// ============================================================

import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ScreenId } from './game/types';
import { useGameStore } from './store/gameStore';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { WorldMapScreen } from './screens/WorldMapScreen';
import { LevelSelectScreen } from './screens/LevelSelectScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { DailyPuzzleScreen } from './screens/DailyPuzzleScreen';
import { ThemesScreen } from './screens/ThemesScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { ShopScreen } from './screens/ShopScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { SettingsScreen } from './screens/SettingsScreen';

interface ArrowKingdomAppProps {
  onExitGame?: () => void;
}

export const ArrowKingdomApp: React.FC<ArrowKingdomAppProps> = ({ onExitGame }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [activeLevelId, setActiveLevelId] = useState(1);

  const loadState = useGameStore((state) => state.loadState);
  const unlockedLevels = useGameStore((state) => state.unlockedLevels);

  useEffect(() => {
    loadState();
  }, [loadState]);

  // Screen routing
  const navigateTo = (screen: ScreenId) => {
    setCurrentScreen(screen);
  };

  const handlePlayLevel = (levelId: number) => {
    setActiveLevelId(levelId);
    setCurrentScreen('gameplay');
  };

  const handlePlayCurrent = () => {
    setActiveLevelId(unlockedLevels);
    setCurrentScreen('gameplay');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'splash' && (
        <SplashScreen onLoaded={() => navigateTo('home')} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onNavigate={navigateTo}
          onPlayCurrentLevel={handlePlayCurrent}
        />
      )}

      {currentScreen === 'world-map' && (
        <WorldMapScreen
          onBack={() => navigateTo('home')}
          onSelectLevel={handlePlayLevel}
          onOpenShop={() => navigateTo('shop')}
          onOpenLevelSelect={() => navigateTo('level-select')}
        />
      )}

      {currentScreen === 'level-select' && (
        <LevelSelectScreen
          onBack={() => navigateTo('home')}
          onSelectLevel={handlePlayLevel}
          onOpenWorldMap={() => navigateTo('world-map')}
          onOpenShop={() => navigateTo('shop')}
        />
      )}

      {currentScreen === 'gameplay' && (
        <GameplayScreen
          levelId={activeLevelId}
          onExitHome={() => navigateTo('home')}
          onOpenWorldMap={() => navigateTo('world-map')}
        />
      )}

      {currentScreen === 'daily-puzzle' && (
        <DailyPuzzleScreen
          onBack={() => navigateTo('home')}
          onPlayDaily={() => handlePlayLevel(5)} // Daily uses challenge level 5
          onOpenShop={() => navigateTo('shop')}
        />
      )}

      {currentScreen === 'themes' && (
        <ThemesScreen
          onBack={() => navigateTo('home')}
          onOpenShop={() => navigateTo('shop')}
        />
      )}

      {currentScreen === 'achievements' && (
        <AchievementsScreen
          onBack={() => navigateTo('home')}
          onOpenShop={() => navigateTo('shop')}
        />
      )}

      {currentScreen === 'shop' && (
        <ShopScreen onBack={() => navigateTo('home')} />
      )}

      {currentScreen === 'how-to-play' && (
        <HowToPlayScreen
          onBack={() => navigateTo('home')}
          onStartPlaying={handlePlayCurrent}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen onBack={() => navigateTo('home')} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061426',
  },
});

export default ArrowKingdomApp;
