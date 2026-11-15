// ============================================================
// Block Blast — Master Game Coordinator & Full UI Component
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import {
  createEmptyGrid,
  canPlacePiece,
  placePieceOnGrid,
  detectAndClearLines,
  calculateMoveScore,
  generateSmartPieceBatch,
  canAnyPieceFitOnGrid,
  calculateGridSnap,
  GRID_DIM,
} from './logic';
import { GameBoard } from './components/GameBoard';
import { PieceTray } from './components/PieceTray';
import { BlastParticles } from './components/BlastParticles';
import { ComboToast } from './components/ComboToast';
import { GameOverModal } from './components/GameOverModal';
import { BlockHaptics } from './haptics';
import { BlockSound } from './sound';
import { JEWEL_COLORS } from './shapes';
import type { BlockGrid, ShapePiece, GhostPreview, ParticleItem } from './types';
import type { GameEngine } from '../../engine/GameEngine';

const STORAGE_KEY_HIGH_SCORE = '@block_blast_high_score_v1';
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
  // Sizing calculations for responsive layout
  const BOARD_WIDTH = Math.min(SCREEN_WIDTH - 24, 370);
  const PADDING = 8;
  const GAP = 3.5;
  const CELL_SIZE = Math.floor((BOARD_WIDTH - PADDING * 2 - GAP * (GRID_DIM - 1)) / GRID_DIM);

  // Core Game State
  const [grid, setGrid] = useState<BlockGrid>(() => createEmptyGrid());
  const [availablePieces, setAvailablePieces] = useState<(ShapePiece | null)[]>(() =>
    generateSmartPieceBatch(createEmptyGrid())
  );
  const [selectedPiece, setSelectedPiece] = useState<ShapePiece | null>(null);
  const [ghostPreview, setGhostPreview] = useState<GhostPreview | null>(null);

  // Score & Combo State
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [bestCombo, setBestCombo] = useState<number>(0);
  const [totalLinesCleared, setTotalLinesCleared] = useState<number>(0);

  // Game Over & UI Visual Effects
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [particles, setParticles] = useState<ParticleItem[]>([]);
  const [clearingRows, setClearingRows] = useState<number[]>([]);
  const [clearingCols, setClearingCols] = useState<number[]>([]);
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

  // Reference for Board screen coordinates
  const boardRef = useRef<View>(null);
  const boardLayoutRef = useRef<{ x: number; y: number; width: number; height: number }>({
    x: (SCREEN_WIDTH - BOARD_WIDTH) / 2,
    y: 180,
    width: BOARD_WIDTH,
    height: BOARD_WIDTH,
  });

  // Load High Score on Mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY_HIGH_SCORE);
        if (saved) {
          setHighScore(parseInt(saved, 10) || 0);
        }
      } catch {}
    })();
  }, []);

  // Measure Board Layout accurately
  const handleLayoutBoard = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    boardRef.current?.measureInWindow((x, y, w, h) => {
      boardLayoutRef.current = {
        x: x || (SCREEN_WIDTH - width) / 2,
        y: y || 180,
        width: w || width,
        height: h || height,
      };
    });
  }, []);

  /**
   * Commits a piece placement and handles all line clears, combos, particles, and spawner logic.
   */
  const commitPlacement = useCallback(
    (piece: ShapePiece, targetRow: number, targetCol: number) => {
      if (isPaused || isGameOver) return;

      if (!canPlacePiece(grid, piece.matrix, targetRow, targetCol)) {
        return;
      }

      // 1. Place piece on grid
      const placedGrid = placePieceOnGrid(grid, piece, targetRow, targetCol);
      BlockHaptics.piecePlaced();

      // 2. Detect & Clear Lines
      const clearResult = detectAndClearLines(placedGrid);
      const lines = clearResult.linesCleared;

      // 3. Combo & Score Calculations
      let currentStreak = comboStreak;
      let nextStreak = lines > 0 ? currentStreak + 1 : 0;
      setComboStreak(nextStreak);
      if (nextStreak > bestCombo) {
        setBestCombo(nextStreak);
      }

      const scoreResult = calculateMoveScore(piece.cellCount, lines, nextStreak);
      const nextScore = score + scoreResult.pointsEarned;
      setScore(nextScore);

      // Check High Score
      if (nextScore > highScore) {
        setHighScore(nextScore);
        setIsNewRecord(true);
        AsyncStorage.setItem(STORAGE_KEY_HIGH_SCORE, nextScore.toString()).catch(() => {});
      }

      // 4. Visual Feedback & Particles
      if (lines > 0) {
        setTotalLinesCleared((prev) => prev + lines);
        BlockHaptics.lineBlast();
        BlockHaptics.comboStreak(nextStreak);
        BlockSound.playComboChime(nextStreak);

        // Flash rows & columns
        setClearingRows(clearResult.clearedRows);
        setClearingCols(clearResult.clearedCols);
        setTimeout(() => {
          setClearingRows([]);
          setClearingCols([]);
        }, 320);

        // Exploding Particles
        const newParticles: ParticleItem[] = [];
        clearResult.clearedCellCoordinates.forEach((cell, idx) => {
          const colorKey = cell.colorKey || piece.colorKey;
          const cellColor = JEWEL_COLORS[colorKey]?.main || '#00E5FF';
          const cellScreenX =
            boardLayoutRef.current.x + PADDING + cell.col * (CELL_SIZE + GAP) + CELL_SIZE / 2;
          const cellScreenY =
            boardLayoutRef.current.y + PADDING + cell.row * (CELL_SIZE + GAP) + CELL_SIZE / 2;

          for (let p = 0; p < 3; p++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 2.2;
            newParticles.push({
              id: `p-${idx}-${p}-${Date.now()}`,
              x: cellScreenX,
              y: cellScreenY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 6 + Math.random() * 8,
              color: cellColor,
            });
          }
        });
        setParticles(newParticles);

        // Combo Toast
        if (scoreResult.comboTitle) {
          setComboToast({
            visible: true,
            title: scoreResult.comboTitle,
            points: scoreResult.pointsEarned,
            streak: nextStreak,
          });
        }
      }

      // Update Grid State
      setGrid(clearResult.newGrid);
      setSelectedPiece(null);
      setGhostPreview(null);

      // 5. Update Available Pieces
      const remainingPieces = availablePieces.map((p) => (p?.id === piece.id ? null : p));
      const activePiecesList = remainingPieces.filter((p): p is ShapePiece => p !== null);

      if (activePiecesList.length === 0) {
        // All 3 pieces placed! Generate fresh smart batch
        const nextBatch = generateSmartPieceBatch(clearResult.newGrid);
        setAvailablePieces(nextBatch);

        // Check if game over immediately on new batch
        if (!canAnyPieceFitOnGrid(clearResult.newGrid, nextBatch)) {
          triggerGameOver(nextScore);
        }
      } else {
        setAvailablePieces(remainingPieces);

        // Check if any remaining piece in tray can fit
        if (!canAnyPieceFitOnGrid(clearResult.newGrid, activePiecesList)) {
          triggerGameOver(nextScore);
        }
      }
    },
    [
      grid,
      availablePieces,
      score,
      highScore,
      comboStreak,
      bestCombo,
      isPaused,
      isGameOver,
      CELL_SIZE,
    ]
  );

  /**
   * Triggers Game Over modal and notifications
   */
  const triggerGameOver = (finalScore: number) => {
    setIsGameOver(true);
    BlockHaptics.gameOver();
    onFinish?.(finalScore, false, {
      bestCombo,
      totalLinesCleared,
    });
  };

  /**
   * Resets and starts a fresh game
   */
  const handleRestart = () => {
    const freshGrid = createEmptyGrid();
    setGrid(freshGrid);
    setAvailablePieces(generateSmartPieceBatch(freshGrid));
    setSelectedPiece(null);
    setGhostPreview(null);
    setScore(0);
    setComboStreak(0);
    setIsNewRecord(false);
    setIsGameOver(false);
  };

  // ── Drag & Drop Event Handlers ──
  const handleDragStart = (piece: ShapePiece) => {
    setSelectedPiece(piece);
  };

  const handleDragMove = (piece: ShapePiece, pageX: number, pageY: number) => {
    const snap = calculateGridSnap(
      pageX,
      pageY,
      boardLayoutRef.current,
      CELL_SIZE + GAP,
      piece.matrix
    );

    if (snap && canPlacePiece(grid, piece.matrix, snap.row, snap.col)) {
      if (!ghostPreview || ghostPreview.row !== snap.row || ghostPreview.col !== snap.col) {
        BlockHaptics.gridSnap();
      }
      setGhostPreview({
        row: snap.row,
        col: snap.col,
        valid: true,
        piece,
      });
    } else {
      setGhostPreview(null);
    }
  };

  const handleDragEnd = (piece: ShapePiece) => {
    if (ghostPreview && ghostPreview.valid) {
      commitPlacement(piece, ghostPreview.row, ghostPreview.col);
    } else {
      setGhostPreview(null);
    }
  };

  // Tap-to-place fallback
  const handleCellTap = (row: number, col: number) => {
    if (!selectedPiece) return;
    if (canPlacePiece(grid, selectedPiece.matrix, row, col)) {
      commitPlacement(selectedPiece, row, col);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Main Game Screen Gradient */}
      <LinearGradient
        colors={['#0A1322', '#040810']}
        style={styles.container}
      >
        {/* Top HUD: Score, Streak, High Score */}
        <View style={styles.hudContainer}>
          {/* Score Box */}
          <LinearGradient
            colors={['#162844', '#0E1A2C']}
            style={styles.scorePill}
          >
            <Text style={styles.hudLabel}>SCORE</Text>
            <Text style={styles.scoreText}>{score.toLocaleString()}</Text>
          </LinearGradient>

          {/* Active Combo Streak Indicator */}
          {comboStreak > 1 ? (
            <View style={styles.streakBadge}>
              <Text style={styles.streakFlame}>🔥</Text>
              <Text style={styles.streakText}>x{comboStreak} COMBO</Text>
            </View>
          ) : (
            <View style={styles.brandTitleBox}>
              <Text style={styles.brandTitle}>BLOCK BLAST</Text>
            </View>
          )}

          {/* High Score Box */}
          <LinearGradient
            colors={['#2A2410', '#181408']}
            style={[styles.scorePill, styles.highScorePill]}
          >
            <View style={styles.highScoreLabelRow}>
              <Text style={styles.crownIcon}>👑</Text>
              <Text style={[styles.hudLabel, { color: '#FFE082' }]}>BEST</Text>
            </View>
            <Text style={[styles.scoreText, { color: '#FFD600' }]}>
              {highScore.toLocaleString()}
            </Text>
          </LinearGradient>
        </View>

        {/* Center: 8x8 Game Board */}
        <View ref={boardRef} style={styles.boardWrapper}>
          <GameBoard
            grid={grid}
            boardWidth={BOARD_WIDTH}
            ghostPreview={ghostPreview}
            onLayoutBoard={handleLayoutBoard}
            onCellTap={handleCellTap}
            clearingRows={clearingRows}
            clearingCols={clearingCols}
          />
        </View>

        {/* Bottom Tray with 3 Draggable Jewel Pieces */}
        <View style={styles.bottomSection}>
          <Text style={styles.trayInstruction}>
            {selectedPiece
              ? 'Drag or tap grid to drop piece'
              : 'Drag pieces onto the grid to clear rows & cols!'}
          </Text>

          <PieceTray
            pieces={availablePieces}
            selectedPieceId={selectedPiece?.id}
            boardCellSize={CELL_SIZE}
            disabled={isPaused || isGameOver}
            onSelectPiece={setSelectedPiece}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          />
        </View>

        {/* Dynamic Floating Combo Toast */}
        <ComboToast
          visible={comboToast.visible}
          title={comboToast.title}
          pointsEarned={comboToast.points}
          streak={comboToast.streak}
          onHide={() => setComboToast((prev) => ({ ...prev, visible: false }))}
        />

        {/* Shatter Blast Particle Effects */}
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
          linesCleared={totalLinesCleared}
          onRestart={handleRestart}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0A1322',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  hudContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  scorePill: {
    minWidth: 104,
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#243C60',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  highScorePill: {
    borderColor: '#614C10',
    shadowColor: '#FFD600',
  },
  highScoreLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  crownIcon: {
    fontSize: 10,
  },
  hudLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8CA0B8',
    letterSpacing: 1.2,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 109, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FF6D00',
    gap: 4,
  },
  streakFlame: {
    fontSize: 16,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FF9100',
    letterSpacing: 1,
  },
  brandTitleBox: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#4DE7FF',
    letterSpacing: 2,
  },
  boardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  trayInstruction: {
    fontSize: 11,
    color: '#8CA0B8',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
});
