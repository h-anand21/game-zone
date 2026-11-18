// ============================================================
// Block Blast — Falling Jewel Blast Master Component
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import {
  createEmptyGrid,
  canPlaceAt,
  getGhostRow,
  spawnPiece,
  tryRotatePiece,
  lockPiece,
  clearFullLines,
  calculateFallingScore,
  TetrominoBag,
  GRID_COLS,
  GRID_ROWS,
} from './logic';
import { GameBoard } from './components/GameBoard';
import { ControlPad } from './components/ControlPad';
import { NextPiecePreview } from './components/NextPiecePreview';
import { BlastParticles } from './components/BlastParticles';
import { ComboToast } from './components/ComboToast';
import { GameOverModal } from './components/GameOverModal';
import { BlockHaptics } from './haptics';
import { BlockSound } from './sound';
import { JEWEL_COLORS } from './shapes';
import type {
  FallingGrid,
  ActivePiece,
  TetrominoType,
  ParticleItem,
} from './types';
import type { GameEngine } from '../../engine/GameEngine';

const STORAGE_KEY_HIGH_SCORE = '@falling_jewel_blast_high_score_v1';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BlockPuzzleProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const BlockPuzzleGame: React.FC<BlockPuzzleProps> = ({
  onFinish,
  isPaused = false,
}) => {
  // Compact cell size calculation (fits 20 rows comfortably on phone screen)
  const CELL_SIZE = Math.floor(
    Math.min((SCREEN_HEIGHT - 330) / GRID_ROWS, (SCREEN_WIDTH - 60) / GRID_COLS, 18)
  );

  // Bag instance ref
  const bagRef = useRef<TetrominoBag>(new TetrominoBag());

  // Grid & Active Falling Piece State
  const [grid, setGrid] = useState<FallingGrid>(() => createEmptyGrid());
  const [activePiece, setActivePiece] = useState<ActivePiece | null>(() =>
    spawnPiece(bagRef.current.next())
  );
  const [nextType, setNextType] = useState<TetrominoType>(() => bagRef.current.next());

  // Score & Game Progression
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [linesClearedTotal, setLinesClearedTotal] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [bestCombo, setBestCombo] = useState<number>(0);

  // Visual Effects & Game Over
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [clearingRows, setClearingRows] = useState<number[]>([]);
  const [particles, setParticles] = useState<ParticleItem[]>([]);
  const [comboToast, setComboToast] = useState<{
    visible: boolean;
    title: string;
    points: number;
    streak: number;
  }>({
    visible: false,
    title: '',
    points: 0,
    streak: 0,
  });

  // Calculate Ghost Row
  const ghostRow = activePiece
    ? getGhostRow(grid, activePiece.matrix, activePiece.row, activePiece.col)
    : 0;

  // Load High Score on Mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY_HIGH_SCORE);
        if (saved) {
          setHighScore(parseInt(saved, 10) || 0);
        }
      } catch { }
    })();
  }, []);

  /**
   * Commits the current piece to the board, triggers line clears, and spawns next piece
   */
      const lockCurrentPiece = useCallback(
        (pieceToLock: ActivePiece) => {
          const lockedGrid = lockPiece(grid, pieceToLock);
          BlockHaptics.piecePlaced();

          // Check Line Clears
          const clearResult = clearFullLines(lockedGrid);
          const lines = clearResult.linesCleared;

          let nextStreak = comboStreak;
          if (lines > 0) {
            nextStreak += 1;
            setComboStreak(nextStreak);
            if (nextStreak > bestCombo) setBestCombo(nextStreak);

            const scoreInfo = calculateFallingScore(lines, nextStreak, level);
            const nextScore = score + scoreInfo.points;
            setScore(nextScore);

            const nextTotalLines = linesClearedTotal + lines;
            setLinesClearedTotal(nextTotalLines);
            setLevel(Math.floor(nextTotalLines / 8) + 1);

              // High Score
              if (nextScore > highScore) {
                setHighScore(nextScore);
                setIsNewRecord(true);
                AsyncStorage.setItem(STORAGE_KEY_HIGH_SCORE, nextScore.toString()).catch(() => { });
              }

              // Haptic & Sound
              BlockHaptics.lineBlast();
              BlockHaptics.comboStreak(nextStreak);
              BlockSound.playComboChime(nextStreak);

              // Flash rows
              setClearingRows(clearResult.clearedRowIndices);
              setTimeout(() => setClearingRows([]), 300);

              // Blast Particles
              const newParticles: ParticleItem[] = [];
                  clearResult.clearedRowIndices.forEach((rowIdx) => {
                    for (let col = 0; col < GRID_COLS; col++) {
                      const colorKey = lockedGrid[rowIdx]?.[col]?.colorKey || pieceToLock.colorKey;
                      const colorHex = JEWEL_COLORS[colorKey]?.main || '#00E5FF';
                      for (let p = 0; p < 2; p++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 0.8 + Math.random() * 2.2;
                        newParticles.push({
                          id: `p-${rowIdx}-${col}-${p}-${Date.now()}`,
                          x: SCREEN_WIDTH / 2 + (col - 5) * CELL_SIZE,
                          y: 160 + rowIdx * CELL_SIZE,
                          vx: Math.cos(angle) * speed,
                          vy: Math.sin(angle) * speed,
                          size: 5 + Math.random() * 6,
                          color: colorHex,
                        });
                      }
                    }
                  });
                  setParticles(newParticles);

                  // Combo Toast
                    if (scoreInfo.title) {
                      setComboToast({
                        visible: true,
                        title: scoreInfo.title,
                        points: scoreInfo.points,
                        streak: nextStreak,
                      });
                    }
                  } else {
                    setComboStreak(0);
                  }

                  setGrid(clearResult.newGrid);

                  // Spawn Next Piece
                  const newActive = spawnPiece(nextType);
                  const upcoming = bagRef.current.next();
                  setNextType(upcoming);

                    // Game Over Check: Cannot spawn at top
                    if (!canPlaceAt(clearResult.newGrid, newActive.matrix, newActive.row, newActive.col)) {
                      setIsGameOver(true);
                      BlockHaptics.gameOver();
                      onFinish?.(score, false, {
                        totalLines: linesClearedTotal,
                        bestCombo,
                      });
                      setActivePiece(null);
                    } else {
                      setActivePiece(newActive);
                    }
                  },
                  [
                    grid,
                    score,
                    highScore,
                    comboStreak,
                    bestCombo,
                    level,
                    linesClearedTotal,
                    nextType,
                    CELL_SIZE,
                    onFinish,
                  ]
  );

              /**
               * Automatic Fall Tick (Timer Interval)
               */
              useEffect(() => {
                if (isPaused || isGameOver || !activePiece) return;

                // Drop speed scales with level (starts at 560ms, speeds up to 160ms)
                const dropInterval = Math.max(160, 560 - (level - 1) * 38);

                const timer = setInterval(() => {
                  setActivePiece((current) => {
                    if (!current) return null;
                    if (canPlaceAt(grid, current.matrix, current.row + 1, current.col)) {
                      return { ...current, row: current.row + 1 };
                    } else {
                      // Lock at floor
                      lockCurrentPiece(current);
                      return null;
                    }
                  });
                }, dropInterval);

                  return () => clearInterval(timer);
                }, [grid, isPaused, isGameOver, activePiece, level, lockCurrentPiece]);

                // ── User Controls ──
                const handleMoveLeft = useCallback(() => {
                  if (!activePiece || isPaused || isGameOver) return;
                  if (canPlaceAt(grid, activePiece.matrix, activePiece.row, activePiece.col - 1)) {
                    setActivePiece((prev) => (prev ? { ...prev, col: prev.col - 1 } : null));
                  }
              }, [activePiece, grid, isPaused, isGameOver]);

          const handleMoveRight = useCallback(() => {
            if (!activePiece || isPaused || isGameOver) return;
            if (canPlaceAt(grid, activePiece.matrix, activePiece.row, activePiece.col + 1)) {
              setActivePiece((prev) => (prev ? { ...prev, col: prev.col + 1 } : null));
            }
          }, [activePiece, grid, isPaused, isGameOver]);

          const handleRotate = useCallback(() => {
            if (!activePiece || isPaused || isGameOver) return;
            const rotated = tryRotatePiece(grid, activePiece, true);
            setActivePiece(rotated);
          }, [activePiece, grid, isPaused, isGameOver]);

          const handleSoftDrop = useCallback(() => {
            if (!activePiece || isPaused || isGameOver) return;
            if (canPlaceAt(grid, activePiece.matrix, activePiece.row + 1, activePiece.col)) {
              setActivePiece((prev) => (prev ? { ...prev, row: prev.row + 1 } : null));
            } else {
              lockCurrentPiece(activePiece);
            }
        }, [activePiece, grid, isPaused, isGameOver, lockCurrentPiece]);

    const handleHardDrop = useCallback(() => {
      if (!activePiece || isPaused || isGameOver) return;
      const targetRow = getGhostRow(grid, activePiece.matrix, activePiece.row, activePiece.col);
      const slammedPiece: ActivePiece = {
        ...activePiece,
        row: targetRow,
      };
      lockCurrentPiece(slammedPiece);
    }, [activePiece, grid, isPaused, isGameOver, lockCurrentPiece]);

    const handleRestart = () => {
      bagRef.current = new TetrominoBag();
      setGrid(createEmptyGrid());
      setActivePiece(spawnPiece(bagRef.current.next()));
      setNextType(bagRef.current.next());
      setScore(0);
      setLevel(1);
      setLinesClearedTotal(0);
      setComboStreak(0);
      setIsNewRecord(false);
      setIsGameOver(false);
    };

    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <LinearGradient
          colors={['#081220', '#040810']}
          style={styles.container}
        >
            {/* Top HUD: Score, Streak, Level, Next Piece */}
            <View style={styles.hudRow}>
              {/* Score Box */}
              <LinearGradient
                colors={['#162844', '#0E1A2C']}
                style={styles.hudPill}
              >
                <Text style={styles.hudLabel}>SCORE</Text>
                <Text style={styles.hudValue}>{score.toLocaleString()}</Text>
              </LinearGradient>

              {/* Level / Streak Box */}
              <View style={styles.middleHudCol}>
                {comboStreak > 1 ? (
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakFlame}>🔥</Text>
                    <Text style={styles.streakText}>x{comboStreak} COMBO</Text>
                  </View>
                ) : (
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>LVL {level}</Text>
                    <Text style={styles.linesText}>{linesClearedTotal} Lines</Text>
                  </View>
                )}
              </View>

              {/* Next Piece Preview */}
              <NextPiecePreview nextType={nextType} />

              {/* High Score Box */}
              <LinearGradient
                colors={['#2A2410', '#181408']}
                style={[styles.hudPill, styles.highScorePill]}
              >
                  <Text style={[styles.hudLabel, { color: '#FFE082' }]}>👑 BEST</Text>
                  <Text style={[styles.hudValue, { color: '#FFD600' }]}>
                    {highScore.toLocaleString()}
                  </Text>
              </LinearGradient>
            </View>

              {/* Center: 10x20 Compact Falling Board */}
              <View style={styles.boardContainer}>
                <GameBoard
                  grid={grid}
                  activePiece={activePiece}
                  ghostRow={ghostRow}
                  cellSize={CELL_SIZE}
                  clearingRows={clearingRows}
                  onSwipeLeft={handleMoveLeft}
                  onSwipeRight={handleMoveRight}
                  onTapRotate={handleRotate}
                  onSwipeDown={handleHardDrop}
                />
              </View>

                {/* Bottom Arcade Control Pad */}
                <ControlPad
                  onMoveLeft={handleMoveLeft}
                  onMoveRight={handleMoveRight}
                  onRotate={handleRotate}
                  onSoftDrop={handleSoftDrop}
                  onHardDrop={handleHardDrop}
                  disabled={isPaused || isGameOver}
                />

              {/* Dynamic Combo Toast Banner */}
              <ComboToast
                visible={comboToast.visible}
                title={comboToast.title}
                pointsEarned={comboToast.points}
                streak={comboToast.streak}
                onHide={() => setComboToast((prev) => ({ ...prev, visible: false }))}
              />

              {/* Explosive Line Blast Particles */}
              <BlastParticles
                particles={particles}
                onComplete={() => setParticles([])}
              />

              {/* Game Over Modal */}
              <GameOverModal
                visible={isGameOver}
                score={score}
                highScore={highScore}
                isNewRecord={isNewRecord}
                bestCombo={bestCombo}
                linesCleared={linesClearedTotal}
                onRestart={handleRestart}
              />
            </LinearGradient>
          </SafeAreaView>
          );
};

          const styles = StyleSheet.create({
            safeContainer: {
            flex: 1,
          backgroundColor: '#081220',
  },
          container: {
            flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 8,
  },
            hudRow: {
            flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingHorizontal: 16,
          marginVertical: 4,
          gap: 6,
  },
          hudPill: {
            flex: 1,
          maxWidth: 96,
          height: 48,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.5,
          borderColor: '#243C60',
          shadowColor: '#00E5FF',
          shadowOffset: {width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
  },
          highScorePill: {
            borderColor: '#614C10',
          shadowColor: '#FFD600',
  },
          hudLabel: {
          fontSize: 9,
          fontWeight: '900',
          color: '#8CA0B8',
          letterSpacing: 1,
  },
          hudValue: {
            fontSize: 15,
          fontWeight: '900',
          color: '#FFFFFF',
          letterSpacing: 0.5,
  },
          middleHudCol: {
            alignItems: 'center',
          justifyContent: 'center',
          minWidth: 80,
  },
          streakBadge: {
            flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 109, 0, 0.2)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: '#FF6D00',
          gap: 3,
  },
          streakFlame: {
          fontSize: 13,
  },
          streakText: {
          fontSize: 10,
          fontWeight: '900',
          color: '#FF9100',
          letterSpacing: 0.8,
  },
            levelBadge: {
            alignItems: 'center',
  },
          levelText: {
            fontSize: 12,
          fontWeight: '900',
          color: '#4DE7FF',
          letterSpacing: 1.2,
  },
            linesText: {
            fontSize: 10,
          fontWeight: '700',
          color: '#8CA0B8',
  },
          boardContainer: {
            alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 4,
  },
});
