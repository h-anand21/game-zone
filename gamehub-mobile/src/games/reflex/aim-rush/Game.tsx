// ============================================================
// AIM RUSH — TARGET CHAIN: Master Game Controller
// Orchestrates full-screen arcade state machine, telemetry, & persistence
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { GameState, GameModeConfig, AimRushRunResult, AimRushUserProfile, AimRushSettings } from './types';
import { GAME_MODES } from './config';
import { AimRushStorage } from './storage/aimRushStorage';
import { AimRushHaptics } from './haptics/hapticManager';
import { AimRushAudio } from './audio/audioManager';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { IntroScreen } from './screens/IntroScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModeSelectScreen } from './screens/ModeSelectScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { CountdownScreen } from './screens/CountdownScreen';
import { GameplayArena } from './screens/GameplayArena';
import { ResultScreen } from './screens/ResultScreen';
import { MissionsScreen } from './screens/MissionsScreen';
import { StatsScreen } from './screens/StatsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

// Modals
import { PauseModal } from './components/modals/PauseModal';
import { ExitModal } from './components/modals/ExitModal';

interface AimRushProps {
  engine?: any;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const AimRushGame: React.FC<AimRushProps> = ({ onFinish }) => {
  const [gameState, setGameState] = useState<GameState>('splash');
  const [selectedMode, setSelectedMode] = useState<GameModeConfig>(GAME_MODES.classic);
  const [profile, setProfile] = useState<AimRushUserProfile>({
    personalBestScore: 0,
    bestChain: 0,
    totalRuns: 0,
    totalTargetsHit: 0,
    totalPerfects: 0,
    totalMisses: 0,
    totalPlayTimeSeconds: 0,
    tutorialCompleted: false,
  });
  const [settings, setSettings] = useState<AimRushSettings>({
    soundEnabled: true,
    musicEnabled: true,
    hapticsEnabled: true,
    reducedFx: false,
    graphicsQuality: 'high',
  });

  const [lastRunResult, setLastRunResult] = useState<AimRushRunResult | null>(null);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // Initialize storage & audio on load
  useEffect(() => {
    AimRushAudio.init();
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const prof = await AimRushStorage.getProfile();
    const sett = await AimRushStorage.getSettings();
    setProfile(prof);
    setSettings(sett);
    AimRushHaptics.setEnabled(sett.hapticsEnabled);
    AimRushAudio.setSoundEnabled(sett.soundEnabled);
    AimRushAudio.setMusicEnabled(sett.musicEnabled);
  };

  // Hardware Android Back button handler
  useEffect(() => {
    const onBackPress = () => {
      if (gameState === 'playing') {
        setIsPauseModalOpen(true);
        return true;
      }
      if (gameState === 'home') {
        setIsExitModalOpen(true);
        return true;
      }
      if (['mode_select', 'how_to_play', 'missions', 'stats', 'settings'].includes(gameState)) {
        setGameState('home');
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [gameState]);

  // Transition after splash
  const handleSplashFinish = () => {
    if (!profile.tutorialCompleted) {
      setGameState('intro');
    } else {
      setGameState('home');
    }
  };

  const handleCompleteIntro = async () => {
    const updated = { ...profile, tutorialCompleted: true };
    setProfile(updated);
    await AimRushStorage.saveProfile(updated);
    setGameState('home');
  };

  // Play Again: Direct fast loop (Countdown -> Gameplay)
  const handlePlayAgain = () => {
    setGameState('countdown');
  };

  // Handle run completion
  const handleFinishRun = async (result: AimRushRunResult) => {
    const { isNewBest, profile: updatedProfile } = await AimRushStorage.recordRun(result);
    setProfile(updatedProfile);

    const enrichedResult = { ...result, isNewPersonalBest: isNewBest };
    setLastRunResult(enrichedResult);

    if (isNewBest) {
      AimRushHaptics.newBest();
    }

    setGameState('result');
  };

  const handleExitToGameHub = () => {
    setIsExitModalOpen(false);
    setIsPauseModalOpen(false);
    if (onFinish) {
      onFinish(0, false, { exit: true });
    }
  };

  const handleResetData = async () => {
    await AimRushStorage.resetAll();
    await loadInitialData();
  };

  return (
    <View style={styles.root}>
      {/* 01. Splash Screen */}
      {gameState === 'splash' && <SplashScreen onFinish={handleSplashFinish} />}

      {/* 02. Intro Screen */}
      {gameState === 'intro' && (
        <IntroScreen onContinue={handleCompleteIntro} onSkip={handleCompleteIntro} />
      )}

      {/* 03. Home Screen */}
      {gameState === 'home' && (
        <HomeScreen
          profile={profile}
          selectedMode={selectedMode}
          onSelectMode={(mode) => setSelectedMode(mode)}
          onStartGame={() => setGameState('countdown')}
          onOpenModes={() => setGameState('mode_select')}
          onOpenHowToPlay={() => setGameState('how_to_play')}
          onOpenMissions={() => setGameState('missions')}
          onOpenStats={() => setGameState('stats')}
          onOpenSettings={() => setGameState('settings')}
          onExitToHub={() => setIsExitModalOpen(true)}
        />
      )}

      {/* 04. Mode Select Screen */}
      {gameState === 'mode_select' && (
        <ModeSelectScreen
          currentMode={selectedMode}
          onSelectMode={(mode) => {
            setSelectedMode(mode);
            setGameState('home');
          }}
          onBack={() => setGameState('home')}
        />
      )}

      {/* 05. How To Play Screen */}
      {gameState === 'how_to_play' && (
        <HowToPlayScreen
          onStartPractice={() => setGameState('practice')}
          onBack={() => setGameState('home')}
        />
      )}

      {/* 06. Practice Arena */}
      {gameState === 'practice' && (
        <PracticeScreen onComplete={() => setGameState('countdown')} />
      )}

      {/* 07. Countdown Screen */}
      {gameState === 'countdown' && (
        <CountdownScreen onCountdownComplete={() => setGameState('playing')} />
      )}

      {/* 08. Active Gameplay Arena */}
      {gameState === 'playing' && (
        <GameplayArena
          mode={selectedMode}
          onFinishRun={handleFinishRun}
          onPause={() => setIsPauseModalOpen(true)}
          onExit={() => setIsExitModalOpen(true)}
          isPaused={isPauseModalOpen}
        />
      )}

      {/* 09. Result Screen */}
      {gameState === 'result' && lastRunResult && (
        <ResultScreen
          result={lastRunResult}
          onPlayAgain={handlePlayAgain}
          onHome={() => setGameState('home')}
        />
      )}

      {/* 10. Missions Screen */}
      {gameState === 'missions' && <MissionsScreen onBack={() => setGameState('home')} />}

      {/* 11. Career Stats Screen */}
      {gameState === 'stats' && <StatsScreen profile={profile} onBack={() => setGameState('home')} />}

      {/* 12. Settings Screen */}
      {gameState === 'settings' && (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={setSettings}
          onResetProgress={handleResetData}
          onBack={() => setGameState('home')}
        />
      )}

      {/* Pause Modal Overlay */}
      <PauseModal
        visible={isPauseModalOpen}
        onResume={() => setIsPauseModalOpen(false)}
        onRestart={() => {
          setIsPauseModalOpen(false);
          setGameState('countdown');
        }}
        onSettings={() => {
          setIsPauseModalOpen(false);
          setGameState('settings');
        }}
        onExit={() => {
          setIsPauseModalOpen(false);
          setGameState('home');
        }}
      />

      {/* Exit Confirmation Modal */}
      <ExitModal
        visible={isExitModalOpen}
        onCancel={() => setIsExitModalOpen(false)}
        onConfirm={handleExitToGameHub}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#07090C',
  },
});
