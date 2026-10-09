// ============================================================
// REACTION FIRE — Master Game Coordinator & Screen Router
// Seamlessly connects all 12 native screens, state lifecycle,
// and local persistence into one unified reflex game experience.
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { RfColors } from './theme';
import type {
  ScreenState,
  GameModeId,
  ReactionStats,
  ReactionSettings,
  DailyChallengeState,
  MissionItem,
  AchievementItem,
  RunResult,
} from './types';
import {
  ReactionStorage,
  DEFAULT_STATS,
  DEFAULT_SETTINGS,
} from './storage/reactionStorage';
import { createInitialDailyState, DEFAULT_DAILY_CHALLENGE } from './logic/dailyChallenge';
import { INITIAL_MISSIONS, INITIAL_ACHIEVEMENTS, evaluateMissionsAndAchievements } from './logic/missions';
import { RfAudio } from './audio/audioManager';
import { RfHaptics } from './haptics/hapticManager';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { IntroScreen } from './screens/IntroScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModeSelectScreen } from './screens/ModeSelectScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { PracticeArenaScreen } from './screens/PracticeArenaScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { ResultScreen } from './screens/ResultScreen';
import { DailyChallengeScreen } from './screens/DailyChallengeScreen';
import { MissionsRewardsScreen } from './screens/MissionsRewardsScreen';
import { StatisticsScreen } from './screens/StatisticsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

interface ReactionFireMasterGameProps {
  onExit: () => void;
}

export const ReactionFireMasterGame: React.FC<ReactionFireMasterGameProps> = ({ onExit }) => {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [activeMode, setActiveMode] = useState<GameModeId>('classic');
  const [isDailyRun, setIsDailyRun] = useState<boolean>(false);
  const [isReplayingIntro, setIsReplayingIntro] = useState<boolean>(false);

  // Gameplay Run State
  const [lastResult, setLastResult] = useState<RunResult | null>(null);

  // Persistence State
  const [stats, setStats] = useState<ReactionStats>(DEFAULT_STATS);
  const [settings, setSettings] = useState<ReactionSettings>(DEFAULT_SETTINGS);
  const [dailyState, setDailyState] = useState<DailyChallengeState>(createInitialDailyState());
  const [missions, setMissions] = useState<MissionItem[]>(INITIAL_MISSIONS);
  const [achievements, setAchievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);

  // Initial Data Hydration
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const [loadedStats, loadedSettings, loadedDaily, loadedMissions, loadedAchievements] =
        await Promise.all([
          ReactionStorage.getStats(),
          ReactionStorage.getSettings(),
          ReactionStorage.getDailyState(),
          ReactionStorage.getMissions(),
          ReactionStorage.getAchievements(),
        ]);

      if (isMounted) {
        setStats(loadedStats);
        setSettings(loadedSettings);
        setDailyState(loadedDaily);
        setMissions(loadedMissions);
        setAchievements(loadedAchievements);

        // Sync Audio & Haptic engines
        RfAudio.setSoundEnabled(loadedSettings.soundEnabled);
        RfAudio.setMusicEnabled(loadedSettings.musicEnabled);
        RfHaptics.setEnabled(loadedSettings.hapticsEnabled);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync settings changes to audio and haptic managers
  const handleUpdateSettings = useCallback(async (newSettings: ReactionSettings) => {
    setSettings(newSettings);
    RfAudio.setSoundEnabled(newSettings.soundEnabled);
    RfAudio.setMusicEnabled(newSettings.musicEnabled);
    RfHaptics.setEnabled(newSettings.hapticsEnabled);
    await ReactionStorage.saveSettings(newSettings);
  }, []);

  // Quick sound toggle from Home
  const handleToggleSound = useCallback(async () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    await handleUpdateSettings(updated);
  }, [settings, handleUpdateSettings]);

  // Transition from Splash Screen
  const handleSplashComplete = useCallback(async () => {
    const onboarded = await ReactionStorage.hasCompletedOnboarding();
    if (onboarded) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('intro');
    }
  }, []);

  // Transition from Intro Screen
  const handleIntroComplete = useCallback(async () => {
    await ReactionStorage.setCompletedOnboarding(true);
    if (isReplayingIntro) {
      setIsReplayingIntro(false);
      setCurrentScreen('settings');
    } else {
      setCurrentScreen('home');
    }
  }, [isReplayingIntro]);

  // Start a specific Game Mode
  const handlePlayMode = useCallback((mode: GameModeId) => {
    setActiveMode(mode);
    setIsDailyRun(false);
    setCurrentScreen('gameplay');
  }, []);

  // Start Daily Challenge run
  const handleStartDaily = useCallback(() => {
    if (dailyState.attemptsLeft <= 0 || dailyState.completed) return;
    setActiveMode('classic');
    setIsDailyRun(true);
    setCurrentScreen('gameplay');
  }, [dailyState]);

  // Handle run completion from Gameplay Screen
  const handleGameOver = useCallback(
    async (result: RunResult) => {
      setLastResult(result);

      let currentDaily = dailyState;
      let newStats = stats;

      // Handle Daily Challenge attempt
      if (isDailyRun) {
        const attemptsLeft = Math.max(0, currentDaily.attemptsLeft - 1);
        let bestMs = currentDaily.bestTimeMs;
        let isCompleted = currentDaily.completed;

        if (result.reactionTimeMs !== null) {
          if (bestMs === null || result.reactionTimeMs < bestMs) {
            bestMs = result.reactionTimeMs;
          }
          if (result.reactionTimeMs < DEFAULT_DAILY_CHALLENGE.targetMs && !isCompleted) {
            isCompleted = true;
          }
        }

        currentDaily = {
          ...currentDaily,
          attemptsLeft,
          bestTimeMs: bestMs,
          completed: isCompleted,
        };

        setDailyState(currentDaily);
        await ReactionStorage.saveDailyState(currentDaily);

        // Daily victory bonus XP
        if (isCompleted && !dailyState.completed) {
          RfAudio.playNewRecord();
          RfHaptics.newRecord();
        }
      }

      // Record to permanent stats unless practice mode
      if (result.mode !== 'practice') {
        newStats = await ReactionStorage.recordRun(result);
        if (isDailyRun && currentDaily.completed && !dailyState.completed) {
          newStats.xp += DEFAULT_DAILY_CHALLENGE.rewardXp;
          newStats.level = Math.floor(newStats.xp / 500) + 1;
          await ReactionStorage.saveStats(newStats);
        }
        setStats(newStats);

        // Evaluate Missions & Achievements
        const { updatedMissions, updatedAchievements } = evaluateMissionsAndAchievements(
          missions,
          achievements,
          newStats,
          result,
          currentDaily.completed
        );

        setMissions(updatedMissions);
        setAchievements(updatedAchievements);

        await Promise.all([
          ReactionStorage.saveMissions(updatedMissions),
          ReactionStorage.saveAchievements(updatedAchievements),
        ]);
      }

      setCurrentScreen('results');
    },
    [isDailyRun, dailyState, stats, missions, achievements]
  );

  // Claim Mission reward
  const handleClaimMissionReward = useCallback(
    async (missionId: string) => {
      const mission = missions.find((m) => m.id === missionId);
      if (!mission || !mission.completed || mission.claimed) return;

      const updatedMissions = missions.map((m) =>
        m.id === missionId ? { ...m, claimed: true } : m
      );

      const updatedStats = {
        ...stats,
        xp: stats.xp + mission.rewardXp,
        level: Math.floor((stats.xp + mission.rewardXp) / 500) + 1,
      };

      setMissions(updatedMissions);
      setStats(updatedStats);

      RfAudio.playNewRecord();
      RfHaptics.newRecord();

      await Promise.all([
        ReactionStorage.saveMissions(updatedMissions),
        ReactionStorage.saveStats(updatedStats),
      ]);
    },
    [missions, stats]
  );

  // Reset all local progress
  const handleResetData = useCallback(async () => {
    await ReactionStorage.resetAll();
    setStats(DEFAULT_STATS);
    setMissions(INITIAL_MISSIONS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    const freshDaily = createInitialDailyState();
    setDailyState(freshDaily);
  }, []);

  // Previous best time for the active mode
  const getActiveModePreviousBest = (): number | null => {
    switch (activeMode) {
      case 'classic':
        return stats.classicBestMs;
      case 'five-round':
        return stats.fiveRoundBestMs;
      case 'fakeout':
        return stats.fakeoutBestMs;
      default:
        return stats.bestTimeMs;
    }
  };

  // Screen View Switcher
  return (
    <View style={styles.root}>
      {/* 01: SPLASH SCREEN */}
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {/* 02: FIRST LAUNCH / INTRO */}
      {currentScreen === 'intro' && (
        <IntroScreen onComplete={handleIntroComplete} />
      )}

      {/* 03: HOME */}
      {currentScreen === 'home' && (
        <HomeScreen
          stats={stats}
          soundEnabled={settings.soundEnabled}
          onToggleSound={handleToggleSound}
          onPlayMode={handlePlayMode}
          onOpenModeSelect={() => setCurrentScreen('mode-select')}
          onOpenDaily={() => setCurrentScreen('daily-challenge')}
          onOpenHowToPlay={() => setCurrentScreen('how-to-play')}
          onOpenPractice={() => setCurrentScreen('practice-arena')}
          onOpenMissions={() => setCurrentScreen('missions')}
          onOpenStats={() => setCurrentScreen('statistics')}
          onOpenSettings={() => setCurrentScreen('settings')}
          onExitToHub={onExit}
        />
      )}

      {/* 04: MODE SELECT */}
      {currentScreen === 'mode-select' && (
        <ModeSelectScreen
          onBack={() => setCurrentScreen('home')}
          onSelectMode={handlePlayMode}
          onOpenPractice={() => setCurrentScreen('practice-arena')}
        />
      )}

      {/* 05: HOW TO PLAY */}
      {currentScreen === 'how-to-play' && (
        <HowToPlayScreen
          onBack={() => setCurrentScreen('home')}
          onOpenPractice={() => setCurrentScreen('practice-arena')}
          onStartClassic={() => handlePlayMode('classic')}
        />
      )}

      {/* 06: PRACTICE ARENA */}
      {currentScreen === 'practice-arena' && (
        <PracticeArenaScreen
          onBack={() => setCurrentScreen('home')}
          onLaunchClassic={() => handlePlayMode('classic')}
        />
      )}

      {/* 07: GAMEPLAY ARENA */}
      {currentScreen === 'gameplay' && (
        <GameplayScreen
          mode={activeMode}
          previousBestMs={getActiveModePreviousBest()}
          onGameOver={handleGameOver}
          onExitToHome={() => setCurrentScreen('home')}
        />
      )}

      {/* 08: RESULTS SCREEN */}
      {currentScreen === 'results' && lastResult && (
        <ResultScreen
          result={lastResult}
          previousBestMs={getActiveModePreviousBest()}
          onPlayAgain={() => setCurrentScreen('gameplay')}
          onModeSelect={() => setCurrentScreen('mode-select')}
          onBackToHome={() => setCurrentScreen('home')}
        />
      )}

      {/* 09: DAILY CHALLENGE */}
      {currentScreen === 'daily-challenge' && (
        <DailyChallengeScreen
          dailyState={dailyState}
          onBack={() => setCurrentScreen('home')}
          onStartDaily={handleStartDaily}
        />
      )}

      {/* 10: MISSIONS & REWARDS */}
      {currentScreen === 'missions' && (
        <MissionsRewardsScreen
          stats={stats}
          missions={missions}
          achievements={achievements}
          onClaimReward={handleClaimMissionReward}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {/* 11: STATISTICS & PROGRESS */}
      {currentScreen === 'statistics' && (
        <StatisticsScreen
          stats={stats}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {/* 12: SETTINGS */}
      {currentScreen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onReplayIntro={() => {
            setIsReplayingIntro(true);
            setCurrentScreen('intro');
          }}
          onResetData={handleResetData}
          onBack={() => setCurrentScreen('home')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: RfColors.background,
  },
});
