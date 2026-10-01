// ============================================================
// REVERSE MIND — Master Application Orchestrator
// ============================================================

import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, BackHandler, StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useReverseMindStore } from './store/reverseMindStore';
import { SplashScreen } from './screens/SplashScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { HowItWorksScreen } from './screens/HowItWorksScreen';
import { AvatarSelectionScreen } from './screens/AvatarSelectionScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModeSelectionScreen } from './screens/ModeSelectionScreen';
import { DifficultyScreen } from './screens/DifficultyScreen';
import { RulePreviewScreen } from './screens/RulePreviewScreen';
import { ReadyScreen } from './screens/ReadyScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { LevelCompleteScreen } from './screens/LevelCompleteScreen';
import { GameResultScreen } from './screens/GameResultScreen';
import { RewardsScreen } from './screens/RewardsScreen';
import { DailyChallengeScreen } from './screens/DailyChallengeScreen';
import { StatsScreen } from './screens/StatsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { ExitConfirmationModal } from './components/ExitConfirmationModal';
import type { GameMode, GameDifficulty, ObjectCategory, AppNavScreen } from './types';

interface ReverseMindAppProps {
  onExit?: () => void;
  onFinishGame?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
}

export const ReverseMindApp: React.FC<ReverseMindAppProps> = ({ onExit }) => {
  const {
    currentScreen,
    setScreen,
    setShowExitModal,
    startNewGame,
    mode,
    difficulty,
    score,
    maxCombo,
    correctTaps,
    totalTaps,
    round,
    lastEarnedRewards,
    settings,
  } = useReverseMindStore();

  const [selectedModeTemp, setSelectedModeTemp] = useState<GameMode>('classic');
  const [selectedDiffTemp, setSelectedDiffTemp] = useState<GameDifficulty>('easy');

  // Safe Hardware Back Button Handling
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
      setShowExitModal(true);
      return true;
    }
    return false;
  }, [currentScreen, setScreen, setShowExitModal]);

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

  const handleNavigate = (screen: AppNavScreen) => {
    triggerHaptic();
    setScreen(screen);
  };

  const handleLaunchModeSelect = (m: GameMode) => {
    setSelectedModeTemp(m);
    setScreen('difficulty');
  };

  const handleConfirmDifficulty = (d: GameDifficulty) => {
    setSelectedDiffTemp(d);
    setScreen('rule-preview');
  };

  const handleConfirmRules = () => {
    setScreen('ready');
  };

  const handleStartGameNow = () => {
    triggerHaptic();
    startNewGame(selectedModeTemp, selectedDiffTemp);
  };

  const handleStartPractice = (diff: GameDifficulty, cat: ObjectCategory) => {
    triggerHaptic();
    startNewGame('practice', diff);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Screen Router Across All 20 Screens & States */}
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={() => setScreen('home')} />
      )}

      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onStart={() => setScreen('home')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'how-it-works' && (
        <HowItWorksScreen
          onBack={() => setScreen('welcome')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'avatar' && (
        <AvatarSelectionScreen
          onBack={() => setScreen('profile')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onStartGame={(m) => handleLaunchModeSelect(m)}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'modes' && (
        <ModeSelectionScreen
          initialMode={selectedModeTemp}
          onLaunchGame={(m, d) => {
            setSelectedModeTemp(m);
            setSelectedDiffTemp(d);
            setScreen('ready');
          }}
          onNavigate={handleNavigate}
          onBack={() => setScreen('home')}
        />
      )}

      {currentScreen === 'difficulty' && (
        <DifficultyScreen
          selectedMode={selectedModeTemp}
          onConfirm={handleConfirmDifficulty}
          onBack={() => setScreen('modes')}
        />
      )}

      {currentScreen === 'rule-preview' && (
        <RulePreviewScreen
          mode={selectedModeTemp}
          difficulty={selectedDiffTemp}
          onConfirm={handleConfirmRules}
          onBack={() => setScreen('difficulty')}
        />
      )}

      {currentScreen === 'ready' && (
        <ReadyScreen
          mode={selectedModeTemp}
          difficulty={selectedDiffTemp}
          onStartGame={handleStartGameNow}
          onBack={() => setScreen('rule-preview')}
        />
      )}

      {currentScreen === 'gameplay' && (
        <GameplayScreen onBack={() => setScreen('home')} />
      )}

      {currentScreen === 'level-complete' && (
        <LevelCompleteScreen
          score={score}
          maxCombo={maxCombo}
          accuracy={Math.round((correctTaps / Math.max(1, totalTaps)) * 100)}
          coinsEarned={lastEarnedRewards.coins || 120}
          gemsEarned={lastEarnedRewards.gems || 2}
          onNextLevel={() => startNewGame(mode, difficulty)}
          onHome={() => setScreen('home')}
        />
      )}

      {currentScreen === 'game-result' && (
        <GameResultScreen
          score={score}
          accuracy={Math.round((correctTaps / Math.max(1, totalTaps)) * 100)}
          bestCombo={maxCombo}
          correctTaps={correctTaps}
          wrongTaps={totalTaps - correctTaps}
          roundsCleared={round}
          onReplay={() => startNewGame(mode, difficulty)}
          onHome={() => setScreen('home')}
        />
      )}

      {currentScreen === 'rewards' && (
        <RewardsScreen
          coins={lastEarnedRewards.coins || 150}
          gems={lastEarnedRewards.gems || 3}
          xp={lastEarnedRewards.xpEarned || 45}
          onClaim={() => setScreen('home')}
        />
      )}

      {currentScreen === 'daily' && (
        <DailyChallengeScreen
          onStartDaily={() => handleLaunchModeSelect('daily-flip')}
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

      {currentScreen === 'practice' && (
        <PracticeScreen
          onStartPractice={handleStartPractice}
          onNavigate={handleNavigate}
          onBack={() => setScreen('home')}
        />
      )}

      {/* Global Exit Confirmation Dialog Modal */}
      <ExitConfirmationModal onConfirmExit={onExit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111F',
  },
});
