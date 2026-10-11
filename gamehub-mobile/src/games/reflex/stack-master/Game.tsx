// ============================================================
// STACK MASTER — Master Game Coordinator & Screen Navigator
// Implements full 16-screen flow, persistence & GameHub lifecycle
// ============================================================

import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStackStore } from './store/stackStore';
import { SplashScreen } from './screens/SplashScreen';
import { IntroScreen } from './screens/IntroScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModeSelectScreen } from './screens/ModeSelectScreen';
import { TutorialScreen } from './screens/TutorialScreen';
import { TowerThemesScreen } from './screens/TowerThemesScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { PersonalBestScreen } from './screens/PersonalBestScreen';
import { StatsScreen } from './screens/StatsScreen';
import { DailyChallengeScreen } from './screens/DailyChallengeScreen';
import { CollectionScreen } from './screens/CollectionScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { RunBreakdownScreen } from './screens/RunBreakdownScreen';
import type { ScreenId, GameMode, RunRecord } from './types';
import type { GameEngine } from '../../engine/GameEngine';

interface StackMasterGameProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const StackMasterGame: React.FC<StackMasterGameProps> = ({ onFinish }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const [activeRunRecord, setActiveRunRecord] = useState<RunRecord | null>(null);

  const loadState = useStackStore((state) => state.loadState);
  const introCompleted = useStackStore((state) => state.introCompleted);
  const completeIntro = useStackStore((state) => state.completeIntro);

  // Load persistent progress on mount
  useEffect(() => {
    loadState();
  }, [loadState]);

  const navigateTo = (screen: ScreenId) => {
    setCurrentScreen(screen);
  };

  const handleSplashFinish = () => {
    if (!introCompleted) {
      setCurrentScreen('intro');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleIntroComplete = () => {
    completeIntro();
    setCurrentScreen('home');
  };

  const handleStartMode = (mode: GameMode) => {
    setSelectedMode(mode);
    setCurrentScreen('gameplay');
  };

  const handleFinishRun = (run: RunRecord, isNewBest: boolean) => {
    setActiveRunRecord(run);
    if (isNewBest) {
      setCurrentScreen('personal-best');
    } else {
      setCurrentScreen('results');
    }
  };

  return (
    <View style={styles.container}>
      {/* 01: Splash Screen */}
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}

      {/* 02: First Launch Intro */}
      {currentScreen === 'intro' && (
        <IntroScreen onComplete={handleIntroComplete} />
      )}

      {/* 03: Game Home */}
      {currentScreen === 'home' && (
        <HomeScreen
          onNavigate={navigateTo}
          onPlayClassic={() => handleStartMode('classic')}
          onExitGame={() => {
            if (onFinish) {
              onFinish(0, false);
            }
          }}
        />
      )}

      {/* 04: Mode Select */}
      {currentScreen === 'mode-select' && (
        <ModeSelectScreen
          onBack={() => navigateTo('home')}
          onSelectMode={handleStartMode}
        />
      )}

      {/* 05: Tutorial */}
      {currentScreen === 'tutorial' && (
        <TutorialScreen
          onBack={() => navigateTo('home')}
          onStartPlaying={() => handleStartMode('classic')}
        />
      )}

      {/* 06: Tower Themes */}
      {currentScreen === 'tower-themes' && (
        <TowerThemesScreen onBack={() => navigateTo('home')} />
      )}

      {/* 07: Active Gameplay Arena (includes 08: Pause Modal) */}
      {currentScreen === 'gameplay' && (
        <GameplayScreen
          mode={selectedMode}
          onFinishRun={handleFinishRun}
          onExitHome={() => navigateTo('home')}
          onOpenSettings={() => navigateTo('settings')}
        />
      )}

      {/* 09: Results Screen */}
      {currentScreen === 'results' && activeRunRecord && (
        <ResultsScreen
          run={activeRunRecord}
          onPlayAgain={() => handleStartMode(selectedMode)}
          onViewBreakdown={() => navigateTo('run-breakdown')}
          onHome={() => navigateTo('home')}
        />
      )}

      {/* 10: New Personal Best Screen */}
      {currentScreen === 'personal-best' && activeRunRecord && (
        <PersonalBestScreen
          run={activeRunRecord}
          onPlayAgain={() => handleStartMode(selectedMode)}
          onViewBreakdown={() => navigateTo('run-breakdown')}
          onHome={() => navigateTo('home')}
        />
      )}

      {/* 11: Stats & Performance */}
      {currentScreen === 'stats' && (
        <StatsScreen onBack={() => navigateTo('home')} />
      )}

      {/* 12: Daily Challenge & Missions */}
      {currentScreen === 'daily-challenge' && (
        <DailyChallengeScreen
          onBack={() => navigateTo('home')}
          onPlayDaily={() => handleStartMode('daily')}
        />
      )}

      {/* 13: Block Collection */}
      {currentScreen === 'collection' && (
        <CollectionScreen onBack={() => navigateTo('home')} />
      )}

      {/* 14: Player Profile & Achievements */}
      {currentScreen === 'profile' && (
        <ProfileScreen onBack={() => navigateTo('home')} />
      )}

      {/* 15: Settings */}
      {currentScreen === 'settings' && (
        <SettingsScreen onBack={() => navigateTo('home')} />
      )}

      {/* 16: Run Breakdown */}
      {currentScreen === 'run-breakdown' && activeRunRecord && (
        <RunBreakdownScreen
          run={activeRunRecord}
          onPlayAgain={() => handleStartMode(selectedMode)}
          onBackToResults={() => navigateTo('results')}
          onHome={() => navigateTo('home')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071329',
  },
});

export default StackMasterGame;
