import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { colors } from './constants/colors';
import { useMemoryRushStore } from './store/memoryRushStore';
import { GameModeId, DifficultyId } from './types';
import { TabType } from './components/BottomTabBar';

// Import all 13 Screens
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModeSelectionScreen } from './screens/ModeSelectionScreen';
import { DifficultyScreen } from './screens/DifficultyScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { CountdownOverlay } from './components/CountdownOverlay';
import { GameplayScreen } from './screens/GameplayScreen';
import { RoundResultScreen } from './screens/RoundResultScreen';
import { FinalResultScreen } from './screens/FinalResultScreen';
import { StatsScreen } from './screens/StatsScreen';
import { DailyChallengeScreen } from './screens/DailyChallengeScreen';
import { SettingsScreen } from './screens/SettingsScreen';

import { ExitConfirmationModal } from './components/ExitConfirmationModal';

export type ScreenState =
  | 'splash'
  | 'home'
  | 'mode_select'
  | 'difficulty'
  | 'tutorial'
  | 'countdown'
  | 'gameplay'
  | 'round_result'
  | 'final_result'
  | 'stats'
  | 'daily'
  | 'settings';

interface MemoryRushAppProps {
  onExitGame?: () => void;
}

export const MemoryRushApp: React.FC<MemoryRushAppProps> = ({ onExitGame }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');

  const {
    selectedMode,
    selectedDifficulty,
    setSelectedMode,
    setSelectedDifficulty,
    startNewGame,
    settings,
    hasCompletedTutorial,
    completeTutorial,
    currentRound,
    lastRoundResult,
    totalRounds,
    finalRunResult,
    dailyChallenge,
    advanceToNextRound,
    showExitModal,
    setShowExitModal,
  } = useMemoryRushStore();

  // Android hardware back handler
  useEffect(() => {
    const onBackPress = () => {
      if (showExitModal) {
        setShowExitModal(false);
        return true;
      }
      if (currentScreen === 'gameplay' || currentScreen === 'countdown') {
        setShowExitModal(true);
        return true;
      }
      if (currentScreen === 'home') {
        setShowExitModal(true);
        return true;
      }
      if (['mode_select', 'difficulty', 'tutorial', 'stats', 'daily', 'settings'].includes(currentScreen)) {
        setCurrentScreen('home');
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [currentScreen, onExitGame, showExitModal, setShowExitModal]);

  // Handle Splash complete
  const handleSplashFinish = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  // Handle Home Play Now button -> go to mode select or difficulty select
  const handlePlayNow = useCallback(() => {
    setCurrentScreen('difficulty');
  }, []);

  // Handle Mode Change request
  const handleSelectMode = useCallback((modeId: GameModeId) => {
    setSelectedMode(modeId);
    setCurrentScreen('difficulty');
  }, [setSelectedMode]);

  // Handle Difficulty Selection -> check tutorial
  const handleSelectDifficulty = useCallback((diffId: DifficultyId) => {
    setSelectedDifficulty(diffId);
  }, [setSelectedDifficulty]);

  const handleStartGameFlow = useCallback(() => {
    if (!hasCompletedTutorial) {
      setCurrentScreen('tutorial');
    } else {
      startNewGame();
      setCurrentScreen('countdown');
    }
  }, [hasCompletedTutorial, startNewGame]);

  // Handle Tutorial Finish
  const handleTutorialFinish = useCallback(() => {
    completeTutorial();
    startNewGame();
    setCurrentScreen('countdown');
  }, [completeTutorial, startNewGame]);

  // Handle Countdown Finish -> enter Gameplay
  const handleCountdownFinish = useCallback(() => {
    setCurrentScreen('gameplay');
  }, []);

  // Handle Gameplay Exit request
  const handleGameplayRequestExit = useCallback(() => {
    setShowExitModal(true);
  }, []);

  // Handle Gameplay Round Complete -> show Round Result or Final Result
  const handleRoundComplete = useCallback(() => {
    if (currentRound >= totalRounds) {
      setCurrentScreen('final_result');
    } else {
      setCurrentScreen('round_result');
    }
  }, [currentRound, totalRounds]);

  // Handle Round Result Continue
  const handleContinueNextRound = useCallback(() => {
    const hasMore = advanceToNextRound();
    if (hasMore) {
      setCurrentScreen('gameplay');
    } else {
      setCurrentScreen('final_result');
    }
  }, [advanceToNextRound]);

  // Handle Play Again from Final Result
  const handlePlayAgain = useCallback(() => {
    startNewGame();
    setCurrentScreen('countdown');
  }, [startNewGame]);

  // Handle Change Mode from Final Result
  const handleChangeMode = useCallback(() => {
    setCurrentScreen('mode_select');
  }, []);

  // Handle Daily Challenge Start
  const handleStartDaily = useCallback(() => {
    setSelectedMode('fusionRush');
    setSelectedDifficulty('medium');
    startNewGame();
    setCurrentScreen('countdown');
  }, [setSelectedMode, setSelectedDifficulty, startNewGame]);

  // Bottom Navigation handler
  const handleNavigateTab = useCallback((tab: TabType) => {
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'challenge':
        setCurrentScreen('daily');
        break;
      case 'stats':
        setCurrentScreen('stats');
        break;
      case 'settings':
        setCurrentScreen('settings');
        break;
    }
  }, []);

  // Confirm Exit
  const handleConfirmExit = useCallback(() => {
    setShowExitModal(false);
    if (currentScreen === 'gameplay' || currentScreen === 'countdown') {
      setCurrentScreen('home');
    } else {
      if (onExitGame) onExitGame();
    }
  }, [currentScreen, onExitGame, setShowExitModal]);

  return (
    <View style={styles.appContainer}>
      {/* SCREEN ROUTER */}
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onStartGame={handlePlayNow}
          onNavigate={(scr) => setCurrentScreen(scr as ScreenState)}
        />
      )}

      {currentScreen === 'mode_select' && (
        <ModeSelectionScreen
          onSelectMode={handleSelectMode}
          onNavigate={(scr) => setCurrentScreen(scr as ScreenState)}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'difficulty' && (
        <DifficultyScreen
          mode={selectedMode}
          onConfirm={(diff) => {
            handleSelectDifficulty(diff);
            handleStartGameFlow();
          }}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'tutorial' && (
        <HowToPlayScreen onGotIt={handleTutorialFinish} />
      )}

      {currentScreen === 'countdown' && (
        <CountdownOverlay
          mode={selectedMode}
          difficulty={selectedDifficulty}
          onFinish={handleCountdownFinish}
        />
      )}

      {currentScreen === 'gameplay' && (
        <GameplayScreen
          onBack={handleGameplayRequestExit}
          onRoundComplete={handleRoundComplete}
          onFinalResult={() => setCurrentScreen('final_result')}
        />
      )}

      {currentScreen === 'round_result' && (
        <RoundResultScreen
          onNextRound={handleContinueNextRound}
        />
      )}

      {currentScreen === 'final_result' && (
        <FinalResultScreen
          onPlayAgain={handlePlayAgain}
          onChangeMode={handleChangeMode}
          onHome={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'stats' && (
        <StatsScreen onNavigateTab={handleNavigateTab} />
      )}

      {currentScreen === 'daily' && (
        <DailyChallengeScreen
          onStartDaily={handleStartDaily}
          onNavigateTab={handleNavigateTab}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen onNavigateTab={handleNavigateTab} />
      )}

      {/* DEDICATED 2.5D ARCADE EXIT CONFIRMATION MODAL */}
      <ExitConfirmationModal onConfirmExit={handleConfirmExit} />
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
});
