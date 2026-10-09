// ============================================================
// DON'T TAP WRONG — Master Game Container
// Orchestrates all screens, storage persistence, and the complete arcade replay loop
// ============================================================

import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModeSelectScreen } from './screens/ModeSelectScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { CountdownScreen } from './screens/CountdownScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { ResultScreen } from './screens/ResultScreen';
import { DailyChallengeScreen } from './screens/DailyChallengeScreen';
import { StatsScreen } from './screens/StatsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { DtwStorage } from './storage/storageService';
import { DtwAudio } from './audio/audioManager';
import { DtwHaptics } from './haptics/hapticManager';
import { DtwColors } from './theme/colors';
import type {
  ScreenState,
  GameModeId,
  UserProfile,
  GameSettings,
  RunTelemetry,
} from './types';

interface DontTapWrongMasterGameProps {
  onExit?: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  classicHighScore: 0,
  rushHighScore: 0,
  survivalHighScore: 0,
  dailyHighScore: 0,
  bestStreak: 0,
  totalRuns: 0,
  totalSafeTaps: 0,
  totalDangerTaps: 0,
  totalTimePlayedSeconds: 0,
  dailyRunsCompleted: 0,
  lastDailyDate: '',
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
  graphicsQuality: 'high',
};

export const DontTapWrongMasterGame: React.FC<DontTapWrongMasterGameProps> = ({ onExit }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [activeMode, setActiveMode] = useState<GameModeId>('classic');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [lastTelemetry, setLastTelemetry] = useState<RunTelemetry | null>(null);
  const [previousBestForRun, setPreviousBestForRun] = useState<number>(0);

  // Load Saved Storage on Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedProfile = await DtwStorage.getProfile();
        setProfile(savedProfile);

        const savedSettings = await DtwStorage.getSettings();
        setSettings(savedSettings);
        DtwAudio.setSoundEnabled(savedSettings.soundEnabled);
        DtwAudio.setMusicEnabled(savedSettings.musicEnabled);
        DtwHaptics.setEnabled(savedSettings.hapticsEnabled);
      } catch (err) {
        console.warn('Failed to load DTW storage', err);
      }
    };
    loadData();
  }, []);

  // Update Settings Handler
  const handleUpdateSettings = async (newSettings: GameSettings) => {
    setSettings(newSettings);
    DtwAudio.setSoundEnabled(newSettings.soundEnabled);
    DtwAudio.setMusicEnabled(newSettings.musicEnabled);
    DtwHaptics.setEnabled(newSettings.hapticsEnabled);
    await DtwStorage.saveSettings(newSettings);
  };

  // Toggle Sound Shortcut
  const handleToggleSound = async () => {
    const next = { ...settings, soundEnabled: !settings.soundEnabled };
    await handleUpdateSettings(next);
  };

  // Reset Records Handler
  const handleResetData = async () => {
    await DtwStorage.resetAll();
    setProfile(DEFAULT_PROFILE);
    setSettings(DEFAULT_SETTINGS);
  };

  // Launch Mode into Countdown
  const handleLaunchMode = (mode: GameModeId) => {
    setActiveMode(mode);
    const prevBest =
      mode === 'classic'
        ? profile.classicHighScore
        : mode === 'rush'
        ? profile.rushHighScore
        : mode === 'survival'
        ? profile.survivalHighScore
        : profile.dailyHighScore;
    setPreviousBestForRun(prevBest);
    setCurrentScreen('countdown');
  };

  // Game Over Handler
  const handleGameOver = async (telemetry: RunTelemetry) => {
    setLastTelemetry(telemetry);
    try {
      const { profile: updatedProfile } = await DtwStorage.recordRun(telemetry);
      setProfile(updatedProfile);
    } catch (err) {
      console.warn('Failed to record run', err);
    }
    setCurrentScreen('result');
  };

  // Play Again (Instant Replay)
  const handlePlayAgain = () => {
    handleLaunchMode(activeMode);
  };

  return (
    <View style={styles.container}>
      {/* 01. Splash Screen */}
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={() => setCurrentScreen('home')} />
      )}

      {/* 02. Home Screen */}
      {currentScreen === 'home' && (
        <HomeScreen
          profile={profile}
          soundEnabled={settings.soundEnabled}
          onToggleSound={handleToggleSound}
          onPlayMode={handleLaunchMode}
          onOpenModeSelect={() => setCurrentScreen('mode_select')}
          onOpenDailyChallenge={() => setCurrentScreen('daily_challenge')}
          onOpenHowToPlay={() => setCurrentScreen('how_to_play')}
          onOpenPractice={() => setCurrentScreen('practice')}
          onOpenStats={() => setCurrentScreen('stats')}
          onOpenSettings={() => setCurrentScreen('settings')}
          onExitToHub={() => onExit?.()}
        />
      )}

      {/* 03. Mode Select Screen */}
      {currentScreen === 'mode_select' && (
        <ModeSelectScreen
          onBack={() => setCurrentScreen('home')}
          onSelectMode={handleLaunchMode}
        />
      )}

      {/* 04. How to Play Screen */}
      {currentScreen === 'how_to_play' && (
        <HowToPlayScreen
          onBack={() => setCurrentScreen('home')}
          onOpenPractice={() => setCurrentScreen('practice')}
          onStartClassic={() => handleLaunchMode('classic')}
        />
      )}

      {/* 05. Practice Demo Screen */}
      {currentScreen === 'practice' && (
        <PracticeScreen
          onBack={() => setCurrentScreen('home')}
          onStartRealGame={() => handleLaunchMode('classic')}
        />
      )}

      {/* 06. Countdown Screen */}
      {currentScreen === 'countdown' && (
        <CountdownScreen
          modeId={activeMode}
          onCountdownComplete={() => setCurrentScreen('playing')}
        />
      )}

      {/* 07. Active Gameplay Screen */}
      {currentScreen === 'playing' && (
        <GameplayScreen
          modeId={activeMode}
          previousHighScore={previousBestForRun}
          onGameOver={handleGameOver}
          onExitToHome={() => setCurrentScreen('home')}
        />
      )}

      {/* 08. Result & Record Celebration Screen */}
      {currentScreen === 'result' && lastTelemetry && (
        <ResultScreen
          telemetry={lastTelemetry}
          previousHighScore={previousBestForRun}
          onPlayAgain={handlePlayAgain}
          onBackToHome={() => setCurrentScreen('home')}
        />
      )}

      {/* 09. Daily Challenge Screen */}
      {currentScreen === 'daily_challenge' && (
        <DailyChallengeScreen
          dailyHighScore={profile.dailyHighScore}
          runsCompleted={profile.dailyRunsCompleted}
          onBack={() => setCurrentScreen('home')}
          onStartDaily={() => handleLaunchMode('daily')}
        />
      )}

      {/* 10. Statistics Screen */}
      {currentScreen === 'stats' && (
        <StatsScreen profile={profile} onBack={() => setCurrentScreen('home')} />
      )}

      {/* 11. Settings Screen */}
      {currentScreen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetData={handleResetData}
          onBack={() => setCurrentScreen('home')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DtwColors.bgMain,
  },
});

export default DontTapWrongMasterGame;
