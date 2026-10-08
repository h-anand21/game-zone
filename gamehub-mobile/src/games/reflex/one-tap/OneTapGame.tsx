// ============================================================
// ONE TAP: PRECISION GAME — Master Container
// Orchestrates All Screens, Telemetry, Storage & Replay Loop
// ============================================================

import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModeSelectScreen } from './screens/ModeSelectScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { TouchDemoScreen } from './screens/TouchDemoScreen';
import { CountdownScreen } from './screens/CountdownScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { ResultScreen } from './screens/ResultScreen';
import { StatsScreen } from './screens/StatsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import {
  GameModeId,
  OneTapScreen,
  OneTapSettings,
  OneTapUserProfile,
  OneTapRunResult,
} from './types';
import { DEFAULT_SETTINGS, DEFAULT_USER_PROFILE } from './config';
import { OneTapAudio } from './audio/audioManager';
import { OneTapHaptics } from './haptics/hapticManager';

const STORAGE_KEYS = {
  PROFILE: '@one_tap_profile',
  SETTINGS: '@one_tap_settings',
};

interface OneTapGameProps {
  onExit?: () => void;
}

export const OneTapGame: React.FC<OneTapGameProps> = ({ onExit }) => {
  const [currentScreen, setCurrentScreen] = useState<OneTapScreen>('splash');
  const [activeMode, setActiveMode] = useState<GameModeId>('classic');
  const [profile, setProfile] = useState<OneTapUserProfile>(DEFAULT_USER_PROFILE);
  const [settings, setSettings] = useState<OneTapSettings>(DEFAULT_SETTINGS);
  const [lastResult, setLastResult] = useState<OneTapRunResult | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  // Load Persisted Storage on Mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }

        const savedSettings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
          OneTapAudio.setSoundEnabled(parsed.soundEnabled);
          OneTapAudio.setMusicEnabled(parsed.musicEnabled);
          OneTapHaptics.setEnabled(parsed.hapticsEnabled);
        }
      } catch (err) {
        console.warn('One Tap: Failed to load storage', err);
      }
    };

    loadSavedData();
  }, []);

  // Save Profile Helper
  const saveProfile = async (newProfile: OneTapUserProfile) => {
    setProfile(newProfile);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    } catch (err) {
      console.warn('One Tap: Failed to save profile', err);
    }
  };

  // Save Settings Helper
  const handleUpdateSettings = async (newSettings: OneTapSettings) => {
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    } catch (err) {
      console.warn('One Tap: Failed to save settings', err);
    }
  };

  // Reset Records Helper
  const handleResetData = async () => {
    await saveProfile(DEFAULT_USER_PROFILE);
  };

  // Mode Launcher (transits into Countdown)
  const handleLaunchMode = (mode: GameModeId) => {
    setActiveMode(mode);
    setCurrentScreen('countdown');
  };

  // Run Game Over Handler
  const handleGameOver = async (result: OneTapRunResult) => {
    setLastResult(result);
    const newBest = result.finalScore > profile.personalBestScore;
    setIsNewBest(newBest);

    // Compute updated profile
    const nextTotalGames = profile.totalGamesPlayed + 1;
    const nextMaxCombo = Math.max(profile.maxComboRecorded, result.maxCombo);
    const nextBestScore = Math.max(profile.personalBestScore, result.finalScore);
    const nextFastestReaction =
      profile.fastestReactionMs === 0
        ? result.averageReactionTimeMs
        : Math.min(profile.fastestReactionMs, result.averageReactionTimeMs);
    const nextCoins = profile.coins + result.earnedCoins;
    const nextXp = profile.xp + result.earnedXp;
    const nextPerfects = profile.totalPerfectHits + result.perfectCount;

    // Running lifetime accuracy
    const prevWeight = profile.lifetimeAccuracy * (nextTotalGames - 1);
    const nextAccuracy =
      Math.round(((prevWeight + result.accuracyPercentage) / nextTotalGames) * 10) / 10;

    const updatedProfile: OneTapUserProfile = {
      ...profile,
      personalBestScore: nextBestScore,
      totalGamesPlayed: nextTotalGames,
      maxComboRecorded: nextMaxCombo,
      lifetimeAccuracy: nextAccuracy,
      fastestReactionMs: nextFastestReaction,
      coins: nextCoins,
      xp: nextXp,
      totalPerfectHits: nextPerfects,
    };

    await saveProfile(updatedProfile);
    setCurrentScreen('result');
  };

  // Play Again (Fast replay into countdown)
  const handlePlayAgain = () => {
    setCurrentScreen('countdown');
  };

  return (
    <View style={styles.container}>
      {/* 1. Splash Screen */}
      {currentScreen === 'splash' && (
        <SplashScreen onFinishLoading={() => setCurrentScreen('home')} />
      )}

      {/* 2. Home Screen */}
      {currentScreen === 'home' && (
        <HomeScreen
          profile={profile}
          onPlayMode={handleLaunchMode}
          onOpenModeSelect={() => setCurrentScreen('mode_select')}
          onOpenHowToPlay={() => setCurrentScreen('how_to_play')}
          onOpenTouchDemo={() => setCurrentScreen('touch_demo')}
          onOpenStats={() => setCurrentScreen('stats')}
          onOpenSettings={() => setCurrentScreen('settings')}
        />
      )}

      {/* 3. Mode Select Screen */}
      {currentScreen === 'mode_select' && (
        <ModeSelectScreen
          onBack={() => setCurrentScreen('home')}
          onSelectMode={handleLaunchMode}
        />
      )}

      {/* 4. How To Play Screen */}
      {currentScreen === 'how_to_play' && (
        <HowToPlayScreen
          onBack={() => setCurrentScreen('home')}
          onStartGame={() => handleLaunchMode('classic')}
        />
      )}

      {/* 5. Touch Demo Screen */}
      {currentScreen === 'touch_demo' && (
        <TouchDemoScreen
          onBack={() => setCurrentScreen('home')}
          onStartRealGame={() => handleLaunchMode('classic')}
        />
      )}

      {/* 6. Countdown Screen */}
      {currentScreen === 'countdown' && (
        <CountdownScreen
          modeId={activeMode}
          bestScore={profile.personalBestScore}
          onBack={() => setCurrentScreen('home')}
          onCountdownComplete={() => setCurrentScreen('gameplay')}
        />
      )}

      {/* 7. Active Gameplay Screen */}
      {currentScreen === 'gameplay' && (
        <GameplayScreen
          modeId={activeMode}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onGameOver={handleGameOver}
          onExitToHome={() => setCurrentScreen('home')}
        />
      )}

      {/* 8. Result Summary Screen */}
      {currentScreen === 'result' && lastResult && (
        <ResultScreen
          result={lastResult}
          isNewBest={isNewBest}
          onPlayAgain={handlePlayAgain}
          onHome={() => setCurrentScreen('home')}
        />
      )}

      {/* 9. Career Stats Screen */}
      {currentScreen === 'stats' && (
        <StatsScreen profile={profile} onBack={() => setCurrentScreen('home')} />
      )}

      {/* 10. Settings Screen */}
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
    backgroundColor: '#05070A',
  },
});
