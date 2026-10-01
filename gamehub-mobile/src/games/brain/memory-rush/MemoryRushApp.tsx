import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, BackHandler } from 'react-native';
import { MRIcon } from './components/MRIcon';
import { colors } from './constants/colors';
import { typography } from './constants/typography';
import { GlassCard } from './components/GlassCard';
import { PrimaryButton } from './components/PrimaryButton';
import { SecondaryButton } from './components/SecondaryButton';
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
  const [showExitModal, setShowExitModal] = useState(false);

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
  } = useMemoryRushStore();

  // Android hardware back handler
  useEffect(() => {
    const onBackPress = () => {
      if (currentScreen === 'gameplay') {
        setShowExitModal(true);
        return true;
      }
      if (currentScreen === 'home') {
        if (onExitGame) {
          onExitGame();
          return true;
        }
      }
      if (['mode_select', 'difficulty', 'tutorial', 'stats', 'daily', 'settings'].includes(currentScreen)) {
        setCurrentScreen('home');
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [currentScreen, onExitGame]);

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
    setCurrentScreen('gameplay');
  }, []);

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
    setCurrentScreen('home');
  }, []);

  return (
    <View style={styles.appContainer}>
      {/* SCREEN ROUTER */}
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onStartGame={handlePlayNow}
          onNavigate={(scr) => {
            if (scr === 'home') setCurrentScreen('home');
            else if (scr === 'daily') setCurrentScreen('daily');
            else if (scr === 'stats') setCurrentScreen('stats');
            else if (scr === 'settings') setCurrentScreen('settings');
          }}
        />
      )}

      {currentScreen === 'mode_select' && (
        <ModeSelectionScreen
          onSelectMode={handleSelectMode}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'difficulty' && (
        <DifficultyScreen
          selectedMode={selectedMode}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={handleSelectDifficulty}
          onStartGame={handleStartGameFlow}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'tutorial' && (
        <HowToPlayScreen onFinish={handleTutorialFinish} />
      )}

      {currentScreen === 'countdown' && (
        <CountdownOverlay
          modeTitle={selectedMode.toUpperCase()}
          difficultyTitle={selectedDifficulty.toUpperCase()}
          onFinish={handleCountdownFinish}
        />
      )}

      {currentScreen === 'gameplay' && (
        <GameplayScreen
          onRequestExit={handleGameplayRequestExit}
          onRoundComplete={handleRoundComplete}
        />
      )}

      {currentScreen === 'round_result' && (
        <RoundResultScreen
          roundNumber={currentRound}
          totalRounds={totalRounds}
          roundPoints={lastRoundResult?.points || 240}
          accuracy={lastRoundResult?.accuracy || 100}
          reactionTime={lastRoundResult?.reactionTime || 0.81}
          comboStreak={lastRoundResult?.combo || 5}
          timeBonus={lastRoundResult?.timeBonus || 4}
          isPerfect={lastRoundResult?.isPerfect ?? true}
          onNextRound={handleContinueNextRound}
        />
      )}

      {currentScreen === 'final_result' && (
        <FinalResultScreen
          score={finalRunResult?.totalScore || 3840}
          accuracy={finalRunResult?.accuracy || 94}
          bestCombo={finalRunResult?.bestCombo || 8}
          avgReactionTime={finalRunResult?.avgReactionTime || 0.76}
          memoryLevel={finalRunResult?.memoryLevel || 12}
          performanceTitle={finalRunResult?.performanceTitle || "FOCUSED"}
          roundScores={finalRunResult?.roundScores || [400, 600, 350, 800, 500]}
          onPlayAgain={handlePlayAgain}
          onChangeMode={handleChangeMode}
          onBackHome={() => setCurrentScreen('home')}
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

      {/* QUIT / EXIT CONFIRMATION MODAL */}
      <Modal visible={showExitModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.exitCard}>
            <View style={styles.warningIconBox}>
              <MRIcon name="alert-triangle" size={28} color={colors.warning} />
            </View>
            <Text style={styles.exitTitle}>EXIT GAME?</Text>
            <Text style={styles.exitSub}>
              Your current round progress and combo streak will be lost.
            </Text>

            <View style={styles.modalButtonRow}>
              <SecondaryButton
                title="KEEP PLAYING"
                onPress={() => setShowExitModal(false)}
                style={{ flex: 1 }}
              />
              <PrimaryButton
                title="EXIT"
                onPress={handleConfirmExit}
                style={{ flex: 1, backgroundColor: colors.danger }}
              />
            </View>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 10, 13, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  exitCard: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  warningIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  exitTitle: {
    fontSize: 20,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  exitSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});
