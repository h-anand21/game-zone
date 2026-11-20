// ============================================================
// Block Blast — Falling Jewel Blast Master Component
// Production Architecture: Pure Full-Screen UI, Symmetrical HUD,
// Intuitive Touch Gestures & Dynamic Display Scaling
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { GameBoard, BOARD_GAP, BOARD_PADDING } from './components/GameBoard';
import { NextPiecePreview } from './components/NextPiecePreview';
import { BlastParticles } from './components/BlastParticles';
import { ComboToast } from './components/ComboToast';
import { GameOverModal } from './components/GameOverModal';
import { PauseOverlay } from '../../common/PauseOverlay';
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
  const insets = useSafeAreaInsets();
  const [isLocalPaused, setIsLocalPaused] = useState(false);
  const isGamePaused = isPaused || isLocalPaused;

  // Precise UI Layout Metric Budget
  const TOP_NAV_HEIGHT = 42;
  const HUD_CARD_HEIGHT = 66;
  const GESTURE_HINT_HEIGHT = 28;
  const SPACING_TOTAL = 26; // internal margins & gaps
  const NON_BOARD_HEIGHT =
    insets.top +
    insets.bottom +
    TOP_NAV_HEIGHT +
    HUD_CARD_HEIGHT +
    GESTURE_HINT_HEIGHT +
    SPACING_TOTAL;

  const AVAILABLE_HEIGHT = Math.max(380, SCREEN_HEIGHT - NON_BOARD_HEIGHT);
  const AVAILABLE_WIDTH = SCREEN_WIDTH - 24;

  const CELL_SIZE = Math.min(
    Math.floor((AVAILABLE_WIDTH - BOARD_PADDING * 2 - BOARD_GAP * (GRID_COLS - 1)) / GRID_COLS),
    Math.floor((AVAILABLE_HEIGHT - BOARD_PADDING * 2 - BOARD_GAP * (GRID_ROWS - 1)) / GRID_ROWS),
    34
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

  // Mutable refs for rock-solid timer execution without re-render cascades
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const activePieceRef = useRef(activePiece);
  activePieceRef.current = activePiece;
  const isGamePausedRef = useRef(isGamePaused);
  isGamePausedRef.current = isGamePaused;
  const isGameOverRef = useRef(isGameOver);
  isGameOverRef.current = isGameOver;

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
      } catch {}
    })();
  }, []);

  /**
   * Commits the current piece to the board, triggers line clears, and spawns next piece
   */
  const lockCurrentPiece = useCallback(
    (pieceToLock: ActivePiece) => {
      const lockedGrid = lockPiece(gridRef.current, pieceToLock);
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
          AsyncStorage.setItem(STORAGE_KEY_HIGH_SCORE, nextScore.toString()).catch(() => {});
        }

        // Haptic & Sound
        BlockHaptics.lineBlast();
        BlockHaptics.comboStreak(nextStreak);
        BlockSound.playComboChime(nextStreak);

        // Flash rows
        setClearingRows(clearResult.clearedRowIndices);
        setTimeout(() => setClearingRows([]), 280);

        // Blast Particles originating accurately from cleared grid slots
        const boardWidth = CELL_SIZE * GRID_COLS + BOARD_GAP * (GRID_COLS - 1) + BOARD_PADDING * 2;
        const boardLeft = (SCREEN_WIDTH - boardWidth) / 2 + BOARD_PADDING;
        const boardTop = insets.top + TOP_NAV_HEIGHT + HUD_CARD_HEIGHT + 24 + BOARD_PADDING;

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
                x: boardLeft + col * (CELL_SIZE + BOARD_GAP) + CELL_SIZE / 2,
                y: boardTop + rowIdx * (CELL_SIZE + BOARD_GAP) + CELL_SIZE / 2,
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
        setActivePiece(null);
      } else {
        setActivePiece(newActive);
      }
    },
    [
      score,
      highScore,
      comboStreak,
      bestCombo,
      level,
      linesClearedTotal,
      nextType,
      CELL_SIZE,
      insets.top,
    ]
  );

  const lockCurrentPieceRef = useRef(lockCurrentPiece);
  lockCurrentPieceRef.current = lockCurrentPiece;

  /**
   * Safe downward step function invoked by interval
   */
  const stepDown = useCallback(() => {
    if (isGamePausedRef.current || isGameOverRef.current) return;
    const current = activePieceRef.current;
    if (!current) return;

    if (canPlaceAt(gridRef.current, current.matrix, current.row + 1, current.col)) {
      setActivePiece((prev) => (prev ? { ...prev, row: prev.row + 1 } : null));
    } else {
      lockCurrentPieceRef.current(current);
    }
  }, []);

  /**
   * Automatic Fall Tick (Steady timer interval, independent of per-step renders)
   */
  useEffect(() => {
    if (isGamePaused || isGameOver) return;

    // Drop speed scales with level (starts at 560ms, speeds up to 160ms)
    const dropInterval = Math.max(160, 560 - (level - 1) * 38);

    const timer = setInterval(() => {
      stepDown();
    }, dropInterval);

    return () => clearInterval(timer);
  }, [isGamePaused, isGameOver, level, stepDown]);

  // ── User Controls ──
  const handleMoveLeft = useCallback(() => {
    if (isGamePausedRef.current || isGameOverRef.current) return;
    const current = activePieceRef.current;
    if (!current) return;
    if (canPlaceAt(gridRef.current, current.matrix, current.row, current.col - 1)) {
      setActivePiece((prev) => (prev ? { ...prev, col: prev.col - 1 } : null));
    }
  }, []);

  const handleMoveRight = useCallback(() => {
    if (isGamePausedRef.current || isGameOverRef.current) return;
    const current = activePieceRef.current;
    if (!current) return;
    if (canPlaceAt(gridRef.current, current.matrix, current.row, current.col + 1)) {
      setActivePiece((prev) => (prev ? { ...prev, col: prev.col + 1 } : null));
    }
  }, []);

  const handleRotate = useCallback(() => {
    if (isGamePausedRef.current || isGameOverRef.current) return;
    const current = activePieceRef.current;
    if (!current) return;
    const rotated = tryRotatePiece(gridRef.current, current, true);
    setActivePiece(rotated);
  }, []);

  const handleSoftDrop = useCallback(() => {
    stepDown();
  }, [stepDown]);

  const handleHardDrop = useCallback(() => {
    if (isGamePausedRef.current || isGameOverRef.current) return;
    const current = activePieceRef.current;
    if (!current) return;
    const targetRow = getGhostRow(gridRef.current, current.matrix, current.row, current.col);
    const slammedPiece: ActivePiece = {
      ...current,
      row: targetRow,
    };
    lockCurrentPieceRef.current(slammedPiece);
  }, []);

  const handleClearParticles = useCallback(() => {
    setParticles((prev) => (prev.length > 0 ? [] : prev));
  }, []);

  const handleHideComboToast = useCallback(() => {
    setComboToast((prev) => (prev.visible ? { ...prev, visible: false } : prev));
  }, []);

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
    setIsLocalPaused(false);
  };

  const handleExit = () => {
    onFinish?.(score, false, {
      totalLines: linesClearedTotal,
      bestCombo,
    });
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['#07111E', '#030810']}
        style={[
          styles.container,
          {
            paddingTop: insets.top + 4,
            paddingBottom: Math.max(6, insets.bottom),
          },
        ]}
      >
        {/* 1. TOP NAV BAR */}
        <View style={styles.topNav}>
          <Pressable
            onPress={handleExit}
            style={({ pressed }) => [styles.navBtn, pressed && styles.btnPressed]}
            hitSlop={12}
          >
            <Text style={styles.navBtnText}>←</Text>
          </Pressable>

          <View style={styles.titleBadge}>
            <Text style={styles.titleEmoji}>💎</Text>
            <View>
              <Text style={styles.titleText}>BLOCK BLAST</Text>
              <Text style={styles.titleSub}>JEWEL PUZZLE</Text>
            </View>
          </View>

          <Pressable
            onPress={() => setIsLocalPaused(true)}
            style={({ pressed }) => [styles.navBtn, pressed && styles.btnPressed]}
            hitSlop={12}
          >
            <Text style={styles.navBtnText}>⏸</Text>
          </Pressable>
        </View>

        {/* 2. UNIFIED ARCADE DASHBOARD (SYMMETRICAL HUD CARD) */}
        <LinearGradient
          colors={['#10223A', '#0B1728']}
          style={styles.hudCard}
        >
          {/* Left: Score & Level */}
          <View style={styles.hudLeft}>
            <Text style={styles.hudLabel}>SCORE</Text>
            <Text style={styles.hudScoreValue}>{score.toLocaleString()}</Text>
            <Text style={styles.hudSubInfo}>LVL {level} • {linesClearedTotal} Lines</Text>
          </View>

          {/* Center: Next Piece Capsule */}
          <View style={styles.hudCenter}>
            <NextPiecePreview nextType={nextType} compact={true} />
          </View>

          {/* Right: Best Record & Streak */}
          <View style={styles.hudRight}>
            <Text style={[styles.hudLabel, { color: '#FCD34D' }]}>BEST 👑</Text>
            <Text style={styles.hudBestValue}>{highScore.toLocaleString()}</Text>
            {comboStreak > 1 ? (
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥 x{comboStreak} COMBO</Text>
              </View>
            ) : (
              <Text style={styles.hudSubInfo}>TOP SCORE</Text>
            )}
          </View>
        </LinearGradient>

        {/* 3. CENTER: IMMERSIVE GAME BOARD */}
        <View style={styles.boardContainer}>
          <GameBoard
            grid={grid}
            activePiece={activePiece}
            ghostRow={ghostRow}
            cellSize={CELL_SIZE}
            clearingRows={clearingRows}
            onMoveLeft={handleMoveLeft}
            onMoveRight={handleMoveRight}
            onRotate={handleRotate}
            onSoftDrop={handleSoftDrop}
            onHardDrop={handleHardDrop}
          />
        </View>

        {/* 4. SLEEK GESTURE HINT BAR */}
        <View style={styles.gestureHintBar}>
          <Text style={styles.gestureHintItem}>◀  Slide : Move</Text>
          <Text style={styles.gestureHintDot}>•</Text>
          <Text style={styles.gestureHintItem}>↺  Tap : Rotate</Text>
          <Text style={styles.gestureHintDot}>•</Text>
          <Text style={styles.gestureHintItem}>▼  Flick : Drop</Text>
        </View>

        {/* Dynamic Combo Toast Banner */}
        <ComboToast
          visible={comboToast.visible}
          title={comboToast.title}
          pointsEarned={comboToast.points}
          streak={comboToast.streak}
          onHide={handleHideComboToast}
        />

        {/* Explosive Line Blast Particles */}
        <BlastParticles
          particles={particles}
          onComplete={handleClearParticles}
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
          onExit={handleExit}
        />

        {/* Pause Overlay */}
        {isLocalPaused && (
          <PauseOverlay
            onResume={() => setIsLocalPaused(false)}
            onRestart={handleRestart}
            onQuit={handleExit}
          />
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#07111E',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  // 1. TOP NAV
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 42,
    marginBottom: 6,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
  navBtnText: {
    fontSize: 18,
    color: '#E2E8F0',
    fontWeight: '700',
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleEmoji: {
    fontSize: 22,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F0F9FF',
    letterSpacing: 1.2,
  },
  titleSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1.5,
  },

  // 2. UNIFIED ARCADE HUD CARD
  hudCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 66,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1E3B64',
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 6,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  hudLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  hudCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  hudRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  hudLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 1,
    marginBottom: 1,
  },
  hudScoreValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  hudBestValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FCD34D',
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  hudSubInfo: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 109, 0, 0.22)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6D00',
    marginTop: 1,
  },
  streakText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FF9100',
    letterSpacing: 0.5,
  },

  // 3. BOARD CONTAINER
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  // 4. BOTTOM GESTURE HINT BAR
  gestureHintBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 4,
    gap: 8,
  },
  gestureHintItem: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
  gestureHintDot: {
    fontSize: 10,
    color: '#38BDF8',
  },
});
