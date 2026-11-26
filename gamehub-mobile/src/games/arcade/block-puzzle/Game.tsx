// ============================================================
// Block Blast — Falling Jewel Blast Master Component
// Production Level-Based Architecture: 15 Handcrafted Pre-laid
// Layouts, Level Progression, Stars, Symmetrical Arcade HUD
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
import {
  getLevelConfig,
  createGridForLevel,
  TOTAL_LEVELS,
} from './levels';
import { GameBoard, BOARD_GAP, BOARD_PADDING } from './components/GameBoard';
import { NextPiecePreview } from './components/NextPiecePreview';
import { BlastParticles } from './components/BlastParticles';
import { ComboToast } from './components/ComboToast';
import { GameOverModal } from './components/GameOverModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { WoodBackground } from './components/WoodBackground';
import { WoodPauseModal } from './components/WoodPauseModal';
import { WOOD_PALETTE } from './components/woodTheme';
import {
  BackArrowIcon,
  GearSettingsIcon,
  CrownScoreIcon,
  ComboSparkleIcon,
  TrophyWoodIcon,
  TargetGoalIcon,
  SlideHintIcon,
  RotateHintIcon,
  DropHintIcon,
} from './components/WoodBlockIcons';
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
const STORAGE_KEY_UNLOCKED_LEVEL = '@block_blast_unlocked_level_v1';
const STORAGE_KEY_LEVEL_STARS = '@block_blast_level_stars_v1';

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

  // Level Progression State
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [levelLinesCleared, setLevelLinesCleared] = useState<number>(0);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);

  const levelConfig = getLevelConfig(currentLevel);

  // Precise UI Layout Metric Budget (includes 4px oak tray outer bevel border)
  const BOARD_FRAME = 4;
  const TOP_NAV_HEIGHT = 44;
  const HUD_CARD_HEIGHT = 70;
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
    Math.floor(
      (AVAILABLE_WIDTH - (BOARD_PADDING + BOARD_FRAME) * 2 - BOARD_GAP * (GRID_COLS - 1)) /
        GRID_COLS
    ),
    Math.floor(
      (AVAILABLE_HEIGHT - (BOARD_PADDING + BOARD_FRAME) * 2 - BOARD_GAP * (GRID_ROWS - 1)) /
        GRID_ROWS
    ),
    34
  );

  // Bag instance ref
  const bagRef = useRef<TetrominoBag>(new TetrominoBag());

  // Grid & Active Falling Piece State (initialized with current level's pre-laid layout)
  const [grid, setGrid] = useState<FallingGrid>(() => createGridForLevel(1));
  const [activePiece, setActivePiece] = useState<ActivePiece | null>(() =>
    spawnPiece(bagRef.current.next())
  );
  const [nextType, setNextType] = useState<TetrominoType>(() => bagRef.current.next());

  // Score & Game Progression
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [linesClearedTotal, setLinesClearedTotal] = useState<number>(0);
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
  const isLevelCompleteRef = useRef(isLevelComplete);
  isLevelCompleteRef.current = isLevelComplete;

  // Calculate Ghost Row
  const ghostRow = activePiece
    ? getGhostRow(grid, activePiece.matrix, activePiece.row, activePiece.col)
    : 0;

  // Load High Score & Persistent Level Progression on Mount
  useEffect(() => {
    (async () => {
      try {
        const savedScore = await AsyncStorage.getItem(STORAGE_KEY_HIGH_SCORE);
        if (savedScore) {
          setHighScore(parseInt(savedScore, 10) || 0);
        }

        const savedUnlocked = await AsyncStorage.getItem(STORAGE_KEY_UNLOCKED_LEVEL);
        if (savedUnlocked) {
          const parsed = parseInt(savedUnlocked, 10);
          if (parsed >= 1) setUnlockedLevel(parsed);
        }

        const savedStars = await AsyncStorage.getItem(STORAGE_KEY_LEVEL_STARS);
        if (savedStars) {
          setLevelStars(JSON.parse(savedStars));
        }
      } catch { }
    })();
  }, []);

  /**
   * Initializes or restarts a level with its handcrafted pre-laid block layout
   */
  const loadLevel = useCallback((lvlNumber: number) => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
    isGroundedRef.current = false;
    bagRef.current = new TetrominoBag();
    const newGrid = createGridForLevel(lvlNumber);
    setGrid(newGrid);
    setActivePiece(spawnPiece(bagRef.current.next()));
    setNextType(bagRef.current.next());
    setCurrentLevel(lvlNumber);
    setLevelLinesCleared(0);
    setIsLevelComplete(false);
    setIsGameOver(false);
    setIsLocalPaused(false);
  }, []);

  /**
   * Commits the current piece to the board, triggers line clears, and updates level progress
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

        const scoreInfo = calculateFallingScore(lines, nextStreak, currentLevel);
        const nextScore = score + scoreInfo.points;
        setScore(nextScore);

        const nextTotalLines = linesClearedTotal + lines;
        setLinesClearedTotal(nextTotalLines);

        // Update Level Lines Goal
        const nextLevelLines = levelLinesCleared + lines;
        setLevelLinesCleared(nextLevelLines);

        // High Score
        if (nextScore > highScore) {
          setHighScore(nextScore);
          setIsNewRecord(true);
          AsyncStorage.setItem(STORAGE_KEY_HIGH_SCORE, nextScore.toString()).catch(() => { });
        }

        // Check if Level Goal Reached!
        if (nextLevelLines >= levelConfig.targetLines) {
          setIsLevelComplete(true);
          BlockHaptics.comboStreak(5);
          BlockSound.playComboChime(8);

          // Unlock next level progression
          const nextUnlocked = Math.max(unlockedLevel, currentLevel + 1);
          setUnlockedLevel(nextUnlocked);
          AsyncStorage.setItem(STORAGE_KEY_UNLOCKED_LEVEL, nextUnlocked.toString()).catch(() => { });

          // Calculate & persist star ratings
          const starsEarned = nextStreak >= 3 ? 3 : nextStreak >= 2 ? 2 : 1;
          const bestStars = Math.max(levelStars[currentLevel] || 0, starsEarned);
          const updatedStars = { ...levelStars, [currentLevel]: bestStars };
          setLevelStars(updatedStars);
          AsyncStorage.setItem(STORAGE_KEY_LEVEL_STARS, JSON.stringify(updatedStars)).catch(() => { });
        } else {
          // Haptic & Sound
          BlockHaptics.lineBlast();
          BlockHaptics.comboStreak(nextStreak);
          BlockSound.playComboChime(nextStreak);
        }

        // Flash rows
        setClearingRows(clearResult.clearedRowIndices);
        setTimeout(() => setClearingRows([]), 280);

        // Blast Particles originating accurately from cleared grid slots
        const trayInset = BOARD_PADDING + BOARD_FRAME;
        const boardWidth = CELL_SIZE * GRID_COLS + BOARD_GAP * (GRID_COLS - 1) + trayInset * 2;
        const boardLeft = (SCREEN_WIDTH - boardWidth) / 2 + trayInset;
        const boardTop = insets.top + TOP_NAV_HEIGHT + HUD_CARD_HEIGHT + 24 + trayInset;

        const newParticles: ParticleItem[] = [];
        clearResult.clearedRowIndices.forEach((rowIdx) => {
          for (let col = 0; col < GRID_COLS; col++) {
            const colorKey = lockedGrid[rowIdx]?.[col]?.colorKey || pieceToLock.colorKey;
            const warmWoodHex = JEWEL_COLORS[colorKey]?.main || '#F6CA58';
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
                color: p % 2 === 0 ? '#FFF3B0' : warmWoodHex,
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
      currentLevel,
      levelLinesCleared,
      levelConfig.targetLines,
      unlockedLevel,
      levelStars,
      linesClearedTotal,
      nextType,
      CELL_SIZE,
      insets.top,
    ]
  );

  const lockCurrentPieceRef = useRef(lockCurrentPiece);
  lockCurrentPieceRef.current = lockCurrentPiece;

  // Lock Delay Grace Period (allows sliding/rotating when piece touches ground)
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isGroundedRef = useRef<boolean>(false);

  const clearLockTimer = useCallback(() => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
    isGroundedRef.current = false;
  }, []);

  const resetLockTimerIfGrounded = useCallback(() => {
    if (isGroundedRef.current) {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      lockTimerRef.current = setTimeout(() => {
        lockTimerRef.current = null;
        isGroundedRef.current = false;
        const latest = activePieceRef.current;
        if (latest && !canPlaceAt(gridRef.current, latest.matrix, latest.row + 1, latest.col)) {
          lockCurrentPieceRef.current(latest);
        }
      }, 500);
    }
  }, []);

  /**
   * Safe downward step function with 500ms floor grace period
   */
  const stepDown = useCallback(() => {
    if (isGamePausedRef.current || isGameOverRef.current || isLevelCompleteRef.current) return;
    const current = activePieceRef.current;
    if (!current) return;

    if (canPlaceAt(gridRef.current, current.matrix, current.row + 1, current.col)) {
      clearLockTimer();
      setActivePiece((prev) => (prev ? { ...prev, row: prev.row + 1 } : null));
    } else {
      // Piece is touching the floor or stack
      if (!isGroundedRef.current) {
        isGroundedRef.current = true;
        if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
        lockTimerRef.current = setTimeout(() => {
          lockTimerRef.current = null;
          isGroundedRef.current = false;
          const latest = activePieceRef.current;
          if (latest && !canPlaceAt(gridRef.current, latest.matrix, latest.row + 1, latest.col)) {
            lockCurrentPieceRef.current(latest);
          }
        }, 500);
      } else {
        if (!lockTimerRef.current) {
          lockCurrentPieceRef.current(current);
        }
      }
    }
  }, [clearLockTimer]);

  /**
   * Automatic Fall Tick (Drop speed dynamically governed by Level Config & gentle in-level acceleration)
   */
  useEffect(() => {
    if (isGamePaused || isGameOver || isLevelComplete) return;

    // Relaxed base speed (e.g. 1100ms for Level 1), gently scales by 20ms per cleared line
    const baseSpeed = levelConfig.dropSpeed || 1000;
    const currentInterval = Math.max(220, baseSpeed - levelLinesCleared * 20);

    const timer = setInterval(() => {
      stepDown();
    }, currentInterval);

    return () => clearInterval(timer);
  }, [isGamePaused, isGameOver, isLevelComplete, levelConfig.dropSpeed, levelLinesCleared, stepDown]);

  // ── User Controls ──
  const handleMoveLeft = useCallback(() => {
    if (isGamePausedRef.current || isGameOverRef.current || isLevelCompleteRef.current) return;
    const current = activePieceRef.current;
    if (!current) return;
    if (canPlaceAt(gridRef.current, current.matrix, current.row, current.col - 1)) {
      setActivePiece((prev) => (prev ? { ...prev, col: prev.col - 1 } : null));
      resetLockTimerIfGrounded();
    }
  }, [resetLockTimerIfGrounded]);

  const handleMoveRight = useCallback(() => {
    if (isGamePausedRef.current || isGameOverRef.current || isLevelCompleteRef.current) return;
    const current = activePieceRef.current;
    if (!current) return;
    if (canPlaceAt(gridRef.current, current.matrix, current.row, current.col + 1)) {
      setActivePiece((prev) => (prev ? { ...prev, col: prev.col + 1 } : null));
      resetLockTimerIfGrounded();
    }
  }, [resetLockTimerIfGrounded]);

  const handleRotate = useCallback(() => {
    if (isGamePausedRef.current || isGameOverRef.current || isLevelCompleteRef.current) return;
    const current = activePieceRef.current;
    if (!current) return;
    const rotated = tryRotatePiece(gridRef.current, current, true);
    setActivePiece(rotated);
    resetLockTimerIfGrounded();
  }, [resetLockTimerIfGrounded]);

  const handleSoftDrop = useCallback(() => {
    stepDown();
  }, [stepDown]);

  const handleHardDrop = useCallback(() => {
    if (isGamePausedRef.current || isGameOverRef.current || isLevelCompleteRef.current) return;
    const current = activePieceRef.current;
    if (!current) return;
    clearLockTimer();
    const targetRow = getGhostRow(gridRef.current, current.matrix, current.row, current.col);
    const slammedPiece: ActivePiece = {
      ...current,
      row: targetRow,
    };
    lockCurrentPieceRef.current(slammedPiece);
  }, [clearLockTimer]);

  const handleClearParticles = useCallback(() => {
    setParticles((prev) => (prev.length > 0 ? [] : prev));
  }, []);

  const handleHideComboToast = useCallback(() => {
    setComboToast((prev) => (prev.visible ? { ...prev, visible: false } : prev));
  }, []);

  // Level Progression Actions
  const handleNextLevel = () => {
    const nextLvl = currentLevel + 1;
    if (nextLvl <= TOTAL_LEVELS) {
      loadLevel(nextLvl);
    }
  };

  const handleReplayLevel = () => {
    loadLevel(currentLevel);
  };

  const handleSelectLevel = (lvl: number) => {
    setShowLevelSelect(false);
    loadLevel(lvl);
  };

  const handleExit = () => {
    onFinish?.(score, false, {
      totalLines: linesClearedTotal,
      bestCombo,
      currentLevel,
    });
  };

  // Level goal progress percentage
  const goalProgress = Math.min(1, levelLinesCleared / Math.max(1, levelConfig.targetLines));

  return (
    <WoodBackground>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + 4,
            paddingBottom: Math.max(6, insets.bottom),
          },
        ]}
      >
        {/* 1. TOP WOODEN NAV BAR */}
        <View style={styles.topNav}>
          <Pressable
            onPress={handleExit}
            style={({ pressed }) => [styles.woodIconBtn, pressed && styles.btnPressed]}
            hitSlop={12}
          >
            <LinearGradient
              colors={WOOD_PALETTE.oakButtonGradient}
              style={styles.woodIconBtnInner}
            >
              <BackArrowIcon size={18} color={WOOD_PALETTE.goldCtaText} />
            </LinearGradient>
          </Pressable>

          {/* Level Selector Wooden Pill */}
          <Pressable
            onPress={() => setShowLevelSelect(true)}
            style={({ pressed }) => [styles.levelSelectorBtn, pressed && styles.btnPressed]}
          >
            <TrophyWoodIcon size={17} />
            <View>
              <Text style={styles.levelSelectorText}>
                LVL {currentLevel} • {levelConfig.name} ▾
              </Text>
              <Text style={styles.levelSelectorSub}>
                Goal: {levelLinesCleared}/{levelConfig.targetLines} Lines
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setIsLocalPaused(true)}
            style={({ pressed }) => [styles.woodIconBtn, pressed && styles.btnPressed]}
            hitSlop={12}
          >
            <LinearGradient
              colors={WOOD_PALETTE.oakButtonGradient}
              style={styles.woodIconBtnInner}
            >
              <GearSettingsIcon size={21} />
            </LinearGradient>
          </Pressable>
        </View>

        {/* 2. CLASSIC WOODEN HUD (CROWN SCORE + NEXT POCKET + GLOWING COMBO) */}
        <LinearGradient
          colors={WOOD_PALETTE.hudPanelGradient}
          style={styles.hudCard}
        >
          {/* Left: Crown Score Pill & Best Record */}
          <View style={styles.hudLeft}>
            <View style={styles.scoreHeaderRow}>
              <CrownScoreIcon size={15} />
              <Text style={styles.hudLabel}>SCORE</Text>
            </View>
            <View style={styles.scorePill}>
              <Text style={styles.hudScoreValue}>{score.toLocaleString()}</Text>
            </View>
            <Text style={styles.hudSubInfo}>BEST {highScore.toLocaleString()}</Text>
          </View>

          {/* Center: Dark Espresso Next Piece Pocket */}
          <View style={styles.hudCenter}>
            <NextPiecePreview nextType={nextType} compact={true} />
          </View>

          {/* Right: Glowing Gold Combo Capsule + Goal Progress */}
          <View style={styles.hudRight}>
            <View
              style={[
                styles.comboPill,
                comboStreak > 0 && styles.comboPillActive,
              ]}
            >
              <ComboSparkleIcon size={13} />
              <Text style={styles.comboPillLabel}>
                COMBO {comboStreak > 0 ? `${comboStreak}` : '0'}
              </Text>
            </View>

            <View style={styles.goalRow}>
              <TargetGoalIcon size={12} />
              <Text style={styles.hudGoalValue}>
                {levelLinesCleared}/{levelConfig.targetLines}
              </Text>
            </View>

            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.round(goalProgress * 100)}%` },
                ]}
              />
            </View>
          </View>
        </LinearGradient>

        {/* 3. CENTER: CARVED RECESSED WOODEN TRAY (10x20 GRID) */}
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

        {/* 4. SLEEK WOODEN GESTURE HINT BAR (SVG ICONS) */}
        <View style={styles.gestureHintBar}>
          <View style={styles.hintPair}>
            <SlideHintIcon size={12} />
            <Text style={styles.gestureHintItem}>Slide: Move</Text>
          </View>
          <Text style={styles.gestureHintDot}>•</Text>
          <View style={styles.hintPair}>
            <RotateHintIcon size={12} />
            <Text style={styles.gestureHintItem}>Tap: Rotate</Text>
          </View>
          <Text style={styles.gestureHintDot}>•</Text>
          <View style={styles.hintPair}>
            <DropHintIcon size={12} />
            <Text style={styles.gestureHintItem}>Flick: Drop</Text>
          </View>
        </View>

        {/* Dynamic Carved Wood Combo Toast Banner */}
        <ComboToast
          visible={comboToast.visible}
          title={comboToast.title}
          pointsEarned={comboToast.points}
          streak={comboToast.streak}
          onHide={handleHideComboToast}
        />

        {/* Golden Line-Clear Sparkle Particles */}
        <BlastParticles
          particles={particles}
          onComplete={handleClearParticles}
        />

        {/* Level Complete Celebration Modal */}
        <LevelCompleteModal
          visible={isLevelComplete}
          level={currentLevel}
          levelName={levelConfig.name}
          score={score}
          bestCombo={bestCombo}
          linesCleared={levelLinesCleared}
          hasNextLevel={currentLevel < TOTAL_LEVELS}
          onNextLevel={handleNextLevel}
          onReplay={handleReplayLevel}
          onLevelSelect={() => {
            setIsLevelComplete(false);
            setShowLevelSelect(true);
          }}
          onExit={handleExit}
        />

        {/* Level Selection Modal */}
        <LevelSelectModal
          visible={showLevelSelect}
          currentLevel={currentLevel}
          unlockedLevel={unlockedLevel}
          levelStars={levelStars}
          onSelectLevel={handleSelectLevel}
          onClose={() => setShowLevelSelect(false)}
        />

        {/* Game Over Modal (Level Failed) */}
        <GameOverModal
          visible={isGameOver}
          score={score}
          highScore={highScore}
          isNewRecord={isNewRecord}
          bestCombo={bestCombo}
          linesCleared={levelLinesCleared}
          level={currentLevel}
          levelTarget={levelConfig.targetLines}
          onRestart={handleReplayLevel}
          onLevelSelect={() => {
            setIsGameOver(false);
            setShowLevelSelect(true);
          }}
          onExit={handleExit}
        />

        {/* Carved Wooden Pause & Settings Modal */}
        <WoodPauseModal
          visible={isLocalPaused}
          level={currentLevel}
          levelName={levelConfig.name}
          onResume={() => setIsLocalPaused(false)}
          onRestart={handleReplayLevel}
          onLevels={() => {
            setIsLocalPaused(false);
            setShowLevelSelect(true);
          }}
          onQuit={handleExit}
        />
      </View>
    </WoodBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  // 1. TOP WOODEN NAV
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 44,
    marginBottom: 4,
  },
  woodIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: WOOD_PALETTE.oakButtonBorder,
    overflow: 'hidden',
    shadowColor: '#261003',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 4,
  },
  woodIconBtnInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1.5,
    borderTopColor: WOOD_PALETTE.oakButtonHighlight,
  },
  btnPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.94 }],
  },
  levelSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: WOOD_PALETTE.pillDarkBg,
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: WOOD_PALETTE.pillDarkBorder,
  },
  levelSelectorText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: WOOD_PALETTE.textLight,
    letterSpacing: 0.4,
  },
  levelSelectorSub: {
    fontSize: 9,
    fontWeight: '800',
    color: WOOD_PALETTE.textGold,
    letterSpacing: 0.4,
  },

  // 2. UNIFIED ARCADE HUD CARD
  hudCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 68,
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
  hudGoalValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#00E5FF',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  hudSubInfo: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
  progressBarBg: {
    width: 72,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00E5FF',
    borderRadius: 2,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 109, 0, 0.22)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6D00',
    marginTop: 2,
  },
  streakText: {
    fontSize: 8.5,
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

  // 4. BOTTOM WOOD GESTURE HINT BAR
  gestureHintBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(48, 22, 7, 0.78)',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: WOOD_PALETTE.pillDarkBorder,
    marginTop: 4,
    gap: 7,
  },
  hintPair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gestureHintItem: {
    fontSize: 10.5,
    fontWeight: '800',
    color: WOOD_PALETTE.textCream,
    letterSpacing: 0.2,
  },
  gestureHintDot: {
    fontSize: 10,
    color: WOOD_PALETTE.textGold,
  },
});
