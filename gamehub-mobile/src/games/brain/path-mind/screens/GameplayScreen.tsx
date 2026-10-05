// ============================================================
// PATH MIND — Screen 16: GameplayScreen
// Master Core Puzzle Engine: Memorize -> Retrace -> Conquer
// Live SVG energy polyline, interactive stone tiles, combo multiplier, sound & haptics
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Vibration } from 'react-native';
import { GameBackground } from '../components/ui/GameBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { GameBoard } from '../components/game/GameBoard';
import { GameButton } from '../components/ui/GameButton';
import { usePathMindStore } from '../store/pathMindStore';
import { generatePath } from '../logic';
import { pmColors } from '../design-system/colors';
import { pmTypography } from '../design-system/typography';
import { pmRadii } from '../design-system/radii';
import { pmShadows } from '../design-system/shadows';
import type { GridPos } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const GameplayScreen: React.FC = () => {
  const {
    setScreen,
    currentLevel,
    hearts,
    loseHeart,
    coins,
    addCoins,
    score,
    combo,
    selectedDifficulty,
    hapticsEnabled,
  } = usePathMindStore();

  // Grid dimensions & path setup
  const gridSize = selectedDifficulty === 'HARD' ? 6 : selectedDifficulty === 'MEDIUM' ? 5 : 4;
  const targetLength =
    selectedDifficulty === 'HARD'
      ? Math.min(8 + Math.floor(currentLevel / 2), 12)
      : selectedDifficulty === 'MEDIUM'
      ? Math.min(6 + Math.floor(currentLevel / 3), 9)
      : Math.min(4 + Math.floor(currentLevel / 4), 6);

  const [path, setPath] = useState<GridPos[]>([]);
  const [playerPath, setPlayerPath] = useState<GridPos[]>([]);
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'success' | 'failed'>('memorize');
  const [countdown, setCountdown] = useState<number>(3);
  const [statusMessage, setStatusMessage] = useState<string>('OBSERVE SACRED RUNES');
  const [localScore, setLocalScore] = useState<number>(score);
  const [localCombo, setLocalCombo] = useState<number>(combo);

  // Initialize chamber path
  const initChamber = useCallback(() => {
    const newPath = generatePath(gridSize, targetLength);
    // Fallback if path generation was short
    if (newPath.length < 3) {
      setPath([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: 2, col: 1 },
      ]);
    } else {
      setPath(newPath);
    }

    setPlayerPath([]);
    setPhase('memorize');
    const memoSeconds = selectedDifficulty === 'HARD' ? 2 : selectedDifficulty === 'MEDIUM' ? 3 : 4;
    setCountdown(memoSeconds);
    setStatusMessage('MEMORIZE THE PATH');
  }, [gridSize, targetLength, selectedDifficulty]);

  useEffect(() => {
    initChamber();
  }, [initChamber]);

  // Countdown timer for memorization
  useEffect(() => {
    if (phase !== 'memorize') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Switch to player recall phase
      setPhase('recall');
      setStatusMessage('RETRACE THE PATH FROM START!');
      if (hapticsEnabled) {
        Vibration.vibrate(40);
      }
    }
  }, [phase, countdown, hapticsEnabled]);

  // Handle tile press or continuous finger drag
  const handleTilePress = (row: number, col: number) => {
    if (phase !== 'recall') return;
    if (path.length === 0) return;

    // 1. Backtrack drag: user dragged back to previous step, smoothly undo last step
    if (
      playerPath.length >= 2 &&
      playerPath[playerPath.length - 2].row === row &&
      playerPath[playerPath.length - 2].col === col
    ) {
      setPlayerPath((prev) => prev.slice(0, -1));
      setLocalCombo((c) => Math.max(0, c - 1));
      if (hapticsEnabled) {
        Vibration.vibrate(20);
      }
      return;
    }

    // 2. Ignore if finger is still hovering inside current last step
    const currentLast = playerPath[playerPath.length - 1];
    if (currentLast && currentLast.row === row && currentLast.col === col) {
      return;
    }

    const nextIndex = playerPath.length;
    const expected = path[nextIndex];

    // 3. Check if this step is correct
    if (expected && expected.row === row && expected.col === col) {
      const nextPlayerPath = [...playerPath, { row, col }];
      setPlayerPath(nextPlayerPath);

      const newCombo = localCombo + 1;
      setLocalCombo(newCombo);
      const stepPoints = 100 * newCombo;
      setLocalScore((s) => s + stepPoints);
      usePathMindStore.setState({
        score: localScore + stepPoints,
        combo: newCombo,
      });

      if (hapticsEnabled) {
        Vibration.vibrate(25);
      }

      // Check if complete
      if (nextPlayerPath.length === path.length) {
        setPhase('success');
        setStatusMessage('CHAMBER CONQUERED! ★★★');
        addCoins(25);
        if (hapticsEnabled) {
          Vibration.vibrate([0, 60, 40, 80]);
        }
        setTimeout(() => {
          setScreen('result');
        }, 1200);
      } else {
        setStatusMessage(`STEP ${nextPlayerPath.length}/${path.length} • DRAGGING COMBO x${newCombo}`);
      }
    } else {
      // Wrong tile touched/dragged
      loseHeart();
      setLocalCombo(0);
      usePathMindStore.setState({ combo: 0 });
      setStatusMessage('PATH FRACTURE! -1 HEART');
      if (hapticsEnabled) {
        Vibration.vibrate(180);
      }

      // If out of hearts, reset or prompt
      if (hearts <= 1) {
        setTimeout(() => {
          setStatusMessage('EXPEDITION FAILED — RETRYING');
          initChamber();
        }, 1200);
      } else {
        // Reset player steps to start
        setTimeout(() => {
          setPlayerPath([]);
          setStatusMessage('DRAG FROM FIRST RUNE TO TRACE');
        }, 600);
      }
    }
  };

  // Give a hint (reveals entire path for 1.5s)
  const handleHint = () => {
    if (coins < 25) return;
    addCoins(-25);
    setPhase('memorize');
    setCountdown(2);
    setStatusMessage('HINT ACTIVE! 💡');
  };

  return (
    <GameBackground variant="universal" overlayDarkness={0.25}>
      <GameHeader
        onBack={() => setScreen('modes')}
        onSettings={() => setScreen('settings')}
        hearts={hearts}
        coins={coins}
      />

      <View style={styles.container}>
        {/* Top Status & Metrics Bar */}
        <View style={styles.metricRow}>
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>CHAMBER</Text>
            <Text style={styles.metricValue}>{currentLevel}</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>SCORE</Text>
            <Text style={[styles.metricValue, { color: pmColors.goldBright }]}>{localScore}</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>COMBO</Text>
            <Text style={[styles.metricValue, { color: pmColors.cyanGlow }]}>x{localCombo}</Text>
          </View>
        </View>

        {/* Phase Status Banner */}
        <View
          style={[
            styles.statusBanner,
            phase === 'memorize' && styles.statusBannerMemo,
            phase === 'success' && styles.statusBannerSuccess,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              phase === 'memorize' && { color: pmColors.goldBright },
              phase === 'success' && { color: pmColors.successGreen },
            ]}
          >
            {phase === 'memorize' ? `⏱️ ${statusMessage} (${countdown}s)` : statusMessage}
          </Text>
        </View>

        {/* Master Game Board */}
        <View style={styles.boardStage}>
          <GameBoard
            gridSize={gridSize}
            path={path}
            playerPath={playerPath}
            phase={phase === 'memorize' ? 'memorize' : 'recall'}
            onTilePress={handleTilePress}
            maxWidth={Math.min(SCREEN_WIDTH - 32, 340)}
          />
        </View>

        {/* Bottom Utility Controls */}
        <View style={styles.controlRow}>
          <GameButton
            imageSource={pmAssets.buttons.undoWood}
            label="UNDO"
            size="small"
            width={98}
            height={44}
            onPress={() => setPlayerPath([])}
            accessibilityLabel="Reset Steps"
          />

          <GameButton
            label="HINT (25 ◉)"
            variant="cyan"
            size="small"
            width={125}
            height={44}
            disabled={coins < 25}
            onPress={handleHint}
            accessibilityLabel="Hint"
          />

          <GameButton
            imageSource={pmAssets.buttons.worldMapGreen}
            label="WORLD MAP"
            size="small"
            width={106}
            height={44}
            onPress={() => setScreen('world_map')}
            accessibilityLabel="World Map"
          />
        </View>
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 24,
    alignItems: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metricPill: {
    backgroundColor: 'rgba(10, 18, 26, 0.92)',
    borderWidth: 1.5,
    borderColor: pmColors.stoneBorder,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 14,
    paddingVertical: 5,
    alignItems: 'center',
    ...pmShadows.soft,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: pmColors.textMuted,
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '900',
    color: pmColors.textPrimary,
  },
  statusBanner: {
    backgroundColor: 'rgba(14, 24, 34, 0.92)',
    borderWidth: 1.5,
    borderColor: pmColors.cyanGlow,
    borderRadius: pmRadii.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 10,
    ...pmShadows.glowCyan,
  },
  statusBannerMemo: {
    borderColor: pmColors.goldBright,
    ...pmShadows.glowGold,
  },
  statusBannerSuccess: {
    borderColor: pmColors.successGreen,
    ...pmShadows.glowGreen,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
    color: pmColors.cyanGlow,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  boardStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
