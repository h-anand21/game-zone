// ============================================================
// PATH MIND — Screen 16: GameplayScreen
// Master Core Puzzle Engine: Memorize -> Retrace -> Auto Advance
// Live SVG energy polyline, interactive stone tiles, combo multiplier,
// prominent dynamic decreasing timer gauge & seamless level progression
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
import { pmAssets } from '../design-system/uiAssets';
import type { GridPos } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const GameplayScreen: React.FC = () => {
  const {
    setScreen,
    currentLevel,
    nextLevel,
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
  const [wrongPos, setWrongPos] = useState<GridPos | null>(null);
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'success' | 'failed'>('memorize');
  const [totalMemoTime, setTotalMemoTime] = useState<number>(3.5);
  const [timeLeft, setTimeLeft] = useState<number>(3.5);
  const [statusMessage, setStatusMessage] = useState<string>('OBSERVE SACRED RUNES');
  const [localScore, setLocalScore] = useState<number>(score);
  const [localCombo, setLocalCombo] = useState<number>(combo);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);

  // Initialize chamber path
  const initChamber = useCallback(() => {
    const newPath = generatePath(gridSize, targetLength);
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
    setWrongPos(null);
    setIsAdvancing(false);
    setPhase('memorize');

    const memoSeconds =
      selectedDifficulty === 'HARD' ? 2.5 : selectedDifficulty === 'MEDIUM' ? 3.5 : 4.5;
    setTotalMemoTime(memoSeconds);
    setTimeLeft(memoSeconds);
    setStatusMessage('MEMORIZE THE PATH');
  }, [gridSize, targetLength, selectedDifficulty, currentLevel]);

  useEffect(() => {
    initChamber();
  }, [initChamber]);

  // High-frequency smooth decreasing timer for memorization (20 FPS update)
  useEffect(() => {
    if (phase !== 'memorize') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.05) {
          clearInterval(interval);
          setPhase('recall');
          setStatusMessage('RETRACE THE PATH FROM START!');
          if (hapticsEnabled) {
            Vibration.vibrate(50);
          }
          return 0;
        }
        return Math.max(0, parseFloat((prev - 0.05).toFixed(2)));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [phase, hapticsEnabled]);

  // Advance to next chamber immediately without any Next button
  const advanceToNextChamber = useCallback(() => {
    nextLevel();
    const nextLvl = currentLevel + 1;

    const nextTargetLength =
      selectedDifficulty === 'HARD'
        ? Math.min(8 + Math.floor(nextLvl / 2), 12)
        : selectedDifficulty === 'MEDIUM'
        ? Math.min(6 + Math.floor(nextLvl / 3), 9)
        : Math.min(4 + Math.floor(nextLvl / 4), 6);

    const newPath = generatePath(gridSize, nextTargetLength);
    setPath(newPath);
    setPlayerPath([]);
    setWrongPos(null);
    setIsAdvancing(false);

    const memoSeconds =
      selectedDifficulty === 'HARD' ? 2.5 : selectedDifficulty === 'MEDIUM' ? 3.5 : 4.5;
    setTotalMemoTime(memoSeconds);
    setTimeLeft(memoSeconds);
    setPhase('memorize');
    setStatusMessage('MEMORIZE THE PATH');
  }, [currentLevel, gridSize, nextLevel, selectedDifficulty]);

  // Handle tile press or continuous finger drag
  const handleTilePress = (row: number, col: number) => {
    if (phase !== 'recall' || isAdvancing) return;
    if (path.length === 0) return;

    // 1. Backtrack drag: user dragged back to previous step, smoothly undo last step
    if (
      playerPath.length >= 2 &&
      playerPath[playerPath.length - 2].row === row &&
      playerPath[playerPath.length - 2].col === col
    ) {
      setPlayerPath((prev) => prev.slice(0, -1));
      setWrongPos(null);
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
      setWrongPos(null);

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

      // Check if chamber is completely traced
      if (nextPlayerPath.length === path.length) {
        setPhase('success');
        setIsAdvancing(true);
        setStatusMessage(`CHAMBER ${currentLevel} CONQUERED! ★★★`);
        addCoins(25);
        if (hapticsEnabled) {
          Vibration.vibrate([0, 50, 40, 70]);
        }

        // Automatic progression to next level in 750ms!
        setTimeout(() => {
          advanceToNextChamber();
        }, 750);
      } else {
        setStatusMessage(`STEP ${nextPlayerPath.length}/${path.length} • COMBO x${newCombo}`);
      }
    } else {
      // Wrong tile touched/dragged!
      setWrongPos({ row, col });
      loseHeart();
      setLocalCombo(0);
      usePathMindStore.setState({ combo: 0 });
      setStatusMessage('❌ PATH FRACTURE! -1 HEART');
      if (hapticsEnabled) {
        Vibration.vibrate([0, 100, 50, 120]);
      }

      // If out of hearts, expedition failed
      if (hearts <= 1) {
        setPhase('failed');
        setTimeout(() => {
          setStatusMessage('💀 EXPEDITION FAILED!');
          setScreen('result');
        }, 1300);
      } else {
        // Reset player steps after showing wrong red indicator
        setTimeout(() => {
          setWrongPos(null);
          setPlayerPath([]);
          setStatusMessage('RETRACE FROM START TILE');
        }, 650);
      }
    }
  };

  // Give a hint (reveals entire path for 2.0s)
  const handleHint = () => {
    if (coins < 25 || phase === 'success' || isAdvancing) return;
    addCoins(-25);
    setWrongPos(null);
    setPhase('memorize');
    setTimeLeft(2.0);
    setTotalMemoTime(2.0);
    setStatusMessage('HINT ACTIVE! 💡');
  };

  // Calculate normalized time progress for gauge
  const timeProgress = totalMemoTime > 0 ? Math.max(0, Math.min(1, timeLeft / totalMemoTime)) : 0;
  const pathProgress = path.length > 0 ? Math.max(0, Math.min(1, playerPath.length / path.length)) : 0;

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

        {/* ============================================================ */}
        {/* PROMINENT DYNAMIC TIMER & PROGRESS GAUGE                     */}
        {/* ============================================================ */}
        <View style={styles.timerGaugeContainer}>
          {/* Top Label & Countdown Number Row */}
          <View style={styles.gaugeHeaderRow}>
            <View style={styles.gaugeTitleGroup}>
              <Text style={styles.gaugeIcon}>
                {phase === 'memorize'
                  ? '⏳'
                  : phase === 'success'
                  ? '🎉'
                  : wrongPos
                  ? '❌'
                  : '⚡'}
              </Text>
              <Text
                style={[
                  styles.gaugeTitleText,
                  phase === 'memorize' && { color: pmColors.goldBright },
                  phase === 'success' && { color: pmColors.successGreen },
                  wrongPos !== null && { color: pmColors.dangerRed },
                ]}
                numberOfLines={1}
              >
                {phase === 'memorize'
                  ? 'MEMORIZE SACRED PATH'
                  : phase === 'success'
                  ? `CHAMBER ${currentLevel} CONQUERED!`
                  : wrongPos
                  ? 'PATH FRACTURE! -1 HEART'
                  : `RETRACE RUNES (${playerPath.length}/${path.length})`}
              </Text>
            </View>

            {/* Large High-Visibility Time / Step Badge */}
            <View
              style={[
                styles.largeTimerBadge,
                phase === 'memorize' && (
                  timeProgress < 0.25
                    ? styles.badgeDanger
                    : timeProgress < 0.5
                    ? styles.badgeWarning
                    : styles.badgeNormal
                ),
                phase === 'success' && styles.badgeSuccess,
                wrongPos !== null && styles.badgeDanger,
              ]}
            >
              <Text
                style={[
                  styles.largeTimerText,
                  phase === 'memorize' && {
                    color:
                      timeProgress < 0.25
                        ? pmColors.dangerRed
                        : timeProgress < 0.5
                        ? pmColors.goldBright
                        : pmColors.cyanGlow,
                  },
                  phase === 'success' && { color: pmColors.successGreen },
                  wrongPos !== null && { color: pmColors.dangerRed },
                ]}
              >
                {phase === 'memorize'
                  ? `⏱️ ${timeLeft.toFixed(1)}s`
                  : phase === 'success'
                  ? '★ ★ ★'
                  : wrongPos
                  ? 'FRACTURE'
                  : `RUNES ${playerPath.length}/${path.length}`}
              </Text>
            </View>
          </View>

          {/* Thick Dynamic Laser Energy Drain Bar */}
          <View style={styles.gaugeTrack}>
            <View
              style={[
                styles.gaugeFill,
                {
                  width: `${(phase === 'memorize' ? timeProgress : pathProgress) * 100}%`,
                  backgroundColor:
                    phase === 'memorize'
                      ? timeProgress < 0.25
                        ? pmColors.dangerRed
                        : timeProgress < 0.5
                        ? pmColors.goldBright
                        : pmColors.cyanGlow
                      : phase === 'success'
                      ? pmColors.successGreen
                      : wrongPos
                      ? pmColors.dangerRed
                      : pmColors.cyanGlow,
                },
              ]}
            >
              {/* Highlight Glint Beam */}
              <View style={styles.gaugeGlint} />
            </View>
          </View>
        </View>

        {/* Floating Auto-Advance Banner when Chamber is Cleared */}
        {isAdvancing && (
          <View style={styles.advancingBanner}>
            <Text style={styles.advancingText}>
              ✨ CHAMBER {currentLevel} CLEARED! ADVANCING TO CHAMBER {currentLevel + 1}...
            </Text>
          </View>
        )}

        {/* Master Game Board */}
        <View style={styles.boardStage}>
          <GameBoard
            gridSize={gridSize}
            path={path}
            playerPath={playerPath}
            wrongPos={wrongPos}
            phase={phase}
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
            disabled={playerPath.length === 0 || phase !== 'recall' || isAdvancing}
            onPress={() => setPlayerPath([])}
            accessibilityLabel="Reset Steps"
          />

          <GameButton
            label="HINT (25 ◉)"
            variant="cyan"
            size="small"
            width={125}
            height={44}
            disabled={coins < 25 || phase === 'success' || isAdvancing}
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
    paddingBottom: 20,
    alignItems: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
  },
  metricPill: {
    backgroundColor: 'rgba(10, 18, 26, 0.94)',
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

  // Prominent Timer & Progress Gauge
  timerGaugeContainer: {
    width: Math.min(SCREEN_WIDTH - 28, 345),
    backgroundColor: 'rgba(10, 18, 26, 0.95)',
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: pmColors.stoneBorder,
    borderRadius: pmRadii.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 4,
    ...pmShadows.medium,
  },
  gaugeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gaugeTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  gaugeIcon: {
    fontSize: 16,
  },
  gaugeTitleText: {
    fontSize: 12,
    fontWeight: '900',
    color: pmColors.cyanGlow,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  largeTimerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: pmRadii.pill,
    borderWidth: 1.5,
    borderColor: pmColors.cyanGlow,
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeTimerText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  badgeNormal: {
    borderColor: pmColors.cyanGlow,
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    ...pmShadows.glowCyan,
  },
  badgeWarning: {
    borderColor: pmColors.goldBright,
    backgroundColor: 'rgba(255, 215, 0, 0.18)',
    ...pmShadows.glowGold,
  },
  badgeDanger: {
    borderColor: pmColors.dangerRed,
    backgroundColor: 'rgba(255, 71, 87, 0.22)',
    ...pmShadows.glowRed,
  },
  badgeSuccess: {
    borderColor: pmColors.successGreen,
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    ...pmShadows.glowGreen,
  },

  // Gauge Track & Fill
  gaugeTrack: {
    width: '100%',
    height: 14,
    backgroundColor: '#070D12',
    borderRadius: pmRadii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: pmRadii.pill,
    position: 'relative',
  },
  gaugeGlint: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: pmRadii.pill,
  },

  // Auto Advancing Banner
  advancingBanner: {
    position: 'absolute',
    top: 130,
    zIndex: 99,
    backgroundColor: 'rgba(46, 204, 113, 0.95)',
    borderWidth: 2,
    borderColor: '#73FFAC',
    borderRadius: pmRadii.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...pmShadows.glowGreen,
  },
  advancingText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#072412',
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
