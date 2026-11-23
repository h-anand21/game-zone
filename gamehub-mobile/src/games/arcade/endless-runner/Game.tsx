// ============================================================
// Color Bloom Sort — Master Game Component
// Production-Quality Ball Sort Puzzle Game
// 500+ Solvable Levels, 3D Glossy Balls, Transparent Glass Tubes,
// Multi-Step Undo, Hint Solver, Extra Tube Booster & Custom Themes
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  Animated,
  Easing,
  LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  canMove,
  executeMove,
  isPuzzleSolved,
  isTubeSolved,
  generateLevel,
  findHint,
} from './logic';
import { THEMES } from './colors';
import { GlassTube } from './components/GlassTube';
import { GlossyBall } from './components/GlossyBall';
import { VictoryModal } from './components/VictoryModal';
import { ThemeShopModal } from './components/ThemeShopModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import type {
  Tube,
  BallColor,
  MoveRecord,
  ThemeId,
  HintMove,
} from './types';
import type { GameEngine } from '../../engine/GameEngine';

const STORAGE_KEY_SAVE = '@color_bloom_sort_state_v1';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ColorBloomSortProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const EndlessRunnerGame: React.FC<ColorBloomSortProps> = ({
  onFinish,
}) => {
  const insets = useSafeAreaInsets();

  // Progression & Game State
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [coins, setCoins] = useState<number>(100);

  // Puzzle State
  const [tubes, setTubes] = useState<Tube[]>(() => generateLevel(1).tubes);
  const [initialTubes, setInitialTubes] = useState<Tube[]>(() => generateLevel(1).tubes);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [undoStack, setUndoStack] = useState<MoveRecord[]>([]);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [addedExtraTube, setAddedExtraTube] = useState<boolean>(false);

  // Active Hint State
  const [activeHint, setActiveHint] = useState<HintMove | null>(null);

  // Themes
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('midnight');
  const [unlockedThemes, setUnlockedThemes] = useState<ThemeId[]>(['midnight']);

  // Modals
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [showThemeShop, setShowThemeShop] = useState<boolean>(false);
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);

  // Animation State for Traveling & Dropping Ball
  const [animatingMove, setAnimatingMove] = useState<{
    from: number;
    to: number;
    ballColor: BallColor;
  } | null>(null);
  const animBallX = useRef(new Animated.Value(0)).current;
  const animBallY = useRef(new Animated.Value(0)).current;
  const animBallScaleX = useRef(new Animated.Value(1)).current;
  const animBallScaleY = useRef(new Animated.Value(1)).current;
  const isAnimatingRef = useRef(false);

  // Illegal Move Shake Feedback
  const [shakingTube, setShakingTube] = useState<number | null>(null);

  // Layout Registry for Precision Ball Drop Positioning
  const rowLayouts = useRef<{ [key: number]: { x: number; y: number; width: number; height: number } }>({});
  const tubeLayouts = useRef<{ [key: number]: { x: number; y: number; width: number; height: number } }>({});

  const theme = THEMES[selectedTheme] || THEMES.midnight;

  // Responsive tube size & multi-row calculation
  const totalTubes = tubes.length;
  const isLargeSet = totalTubes >= 8;
  const tubesPerRow = isLargeSet ? Math.ceil(totalTubes / 2) : totalTubes;

  const availablePlayWidth = SCREEN_WIDTH - 28;
  const calculatedBallSize = Math.max(
    28,
    Math.min(48, Math.floor((availablePlayWidth - tubesPerRow * 16) / tubesPerRow))
  );

  const row1Tubes = isLargeSet ? tubes.slice(0, tubesPerRow) : tubes;
  const row2Tubes = isLargeSet ? tubes.slice(tubesPerRow) : [];

  const solvedTubesCount = tubes.filter((t) => isTubeSolved(t)).length;
  const totalColorCount = Math.max(1, new Set(tubes.flat()).size);
  const solvePercent = Math.min(100, Math.round((solvedTubesCount / totalColorCount) * 100));

  // Load persistent save data on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_SAVE);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.currentLevel) setCurrentLevel(parsed.currentLevel);
          if (parsed.unlockedLevel) setUnlockedLevel(parsed.unlockedLevel);
          if (parsed.levelStars) setLevelStars(parsed.levelStars);
          if (parsed.coins !== undefined) setCoins(parsed.coins);
          if (parsed.selectedTheme) setSelectedTheme(parsed.selectedTheme);
          if (parsed.unlockedThemes) setUnlockedThemes(parsed.unlockedThemes);

          // Restore active puzzle if level matches
          if (parsed.tubes && parsed.tubes.length > 0) {
            setTubes(parsed.tubes);
            setInitialTubes(parsed.initialTubes || parsed.tubes);
            setMovesCount(parsed.movesCount || 0);
          } else {
            const lvl = generateLevel(parsed.currentLevel || 1);
            setTubes(lvl.tubes);
            setInitialTubes(lvl.tubes.map((t) => [...t]));
          }
        }
      } catch { }
    })();
  }, []);

  // Save progress helper
  const persistState = useCallback(
    async (override?: {
      tubes?: Tube[];
      level?: number;
      coins?: number;
      unlocked?: number;
      stars?: Record<number, number>;
      theme?: ThemeId;
      themes?: ThemeId[];
    }) => {
      try {
        const data = {
          currentLevel: override?.level ?? currentLevel,
          unlockedLevel: override?.unlocked ?? unlockedLevel,
          levelStars: override?.stars ?? levelStars,
          coins: override?.coins ?? coins,
          tubes: override?.tubes ?? tubes,
          initialTubes,
          movesCount,
          selectedTheme: override?.theme ?? selectedTheme,
          unlockedThemes: override?.themes ?? unlockedThemes,
        };
        await AsyncStorage.setItem(STORAGE_KEY_SAVE, JSON.stringify(data));
      } catch { }
    },
    [
      currentLevel,
      unlockedLevel,
      levelStars,
      coins,
      tubes,
      initialTubes,
      movesCount,
      selectedTheme,
      unlockedThemes,
    ]
  );

  /**
   * Starts or loads a level
   */
  const startLevel = useCallback(
    (lvlNum: number) => {
      if (isAnimatingRef.current) return;

      const lvl = generateLevel(lvlNum);
      setCurrentLevel(lvlNum);
      setTubes(lvl.tubes);
      setInitialTubes(lvl.tubes.map((t) => [...t]));
      setSelectedTube(null);
      setAnimatingMove(null);
      setUndoStack([]);
      setMovesCount(0);
      setAddedExtraTube(false);
      setActiveHint(null);
      setShowVictory(false);
      setShowLevelSelect(false);

      persistState({ level: lvlNum, tubes: lvl.tubes });
    },
    [persistState]
  );

  /**
   * Calculates exact (x, y) coordinates of a ball inside or lifted above a tube
   */
  const getBallCoordinates = useCallback(
    (tubeIndex: number, slotIndex: number, isLifted: boolean) => {
      const rowIndex = isLargeSet && tubeIndex >= tubesPerRow ? 1 : 0;
      const rowLayout = rowLayouts.current[rowIndex];
      const tubeLayout = tubeLayouts.current[tubeIndex];

      if (!rowLayout || !tubeLayout) {
        return null;
      }

      // Horizontal center inside tube
      const tubeX = rowLayout.x + tubeLayout.x;
      const ballX = tubeX + (tubeLayout.width - calculatedBallSize) / 2;

      // Vertical position
      const tubeY = rowLayout.y + tubeLayout.y;
      if (isLifted) {
        // Lifted slightly above the tube opening
        return { x: ballX, y: tubeY + 4 };
      } else {
        // Inside tube at slot (0 = bottom, 1, 2, 3 = top)
        const tubeBottom = tubeY + tubeLayout.height - 6;
        const ballY = tubeBottom - calculatedBallSize - slotIndex * (calculatedBallSize + 2);
        return { x: ballX, y: ballY };
      }
    },
    [isLargeSet, tubesPerRow, calculatedBallSize]
  );

  /**
   * Orchestrates the 2-phase ball flight and realistic drop animation
   */
  const animateMove = useCallback(
    (from: number, to: number, onComplete: () => void) => {
      const sourceTube = tubes[from];
      if (!sourceTube || sourceTube.length === 0) {
        onComplete();
        return;
      }
      const movedBall = sourceTube[sourceTube.length - 1];

      const startPos = getBallCoordinates(from, sourceTube.length - 1, true);
      const destRimPos = getBallCoordinates(to, 0, true);
      const destDropPos = getBallCoordinates(to, tubes[to]?.length ?? 0, false);

      if (!startPos || !destRimPos || !destDropPos) {
        onComplete();
        return;
      }

      isAnimatingRef.current = true;
      setAnimatingMove({ from, to, ballColor: movedBall });
      setSelectedTube(null);

      animBallX.setValue(startPos.x);
      animBallY.setValue(startPos.y);
      animBallScaleX.setValue(1);
      animBallScaleY.setValue(1);

      const dx = Math.abs(destRimPos.x - startPos.x);
      const arcApexY = Math.min(startPos.y, destRimPos.y) - Math.min(36, Math.max(16, dx * 0.15));
      const travelDuration = Math.min(240, Math.max(160, Math.round(dx * 0.45) + 110));

      // Phase 1: Arc Glide to destination tube opening
      const arcX = Animated.timing(animBallX, {
        toValue: destRimPos.x,
        duration: travelDuration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      });

      const arcY = Animated.sequence([
        Animated.timing(animBallY, {
          toValue: arcApexY,
          duration: travelDuration * 0.45,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animBallY, {
          toValue: destRimPos.y,
          duration: travelDuration * 0.55,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]);

      // Phase 2: DROP ANIMATION into the tube with gravity acceleration
      const dropDistance = Math.max(20, destDropPos.y - destRimPos.y);
      const dropDuration = Math.min(220, Math.max(130, Math.round(dropDistance * 1.1)));

      const dropPlunge = Animated.timing(animBallY, {
        toValue: destDropPos.y,
        duration: dropDuration,
        easing: Easing.in(Easing.quad), // Accelerate down like gravity
        useNativeDriver: true,
      });

      // Phase 3: Impact bounce and settle
      const impactBounce = Animated.sequence([
        // Squash on contact
        Animated.parallel([
          Animated.timing(animBallScaleX, {
            toValue: 1.12,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(animBallScaleY, {
            toValue: 0.88,
            duration: 40,
            useNativeDriver: true,
          }),
        ]),
        // Micro rebound
        Animated.parallel([
          Animated.timing(animBallY, {
            toValue: destDropPos.y - 6,
            duration: 50,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(animBallScaleX, {
            toValue: 0.96,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(animBallScaleY, {
            toValue: 1.04,
            duration: 50,
            useNativeDriver: true,
          }),
        ]),
        // Settle
        Animated.parallel([
          Animated.timing(animBallY, {
            toValue: destDropPos.y,
            duration: 50,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(animBallScaleX, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(animBallScaleY, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
        ]),
      ]);

      Animated.sequence([
        Animated.parallel([arcX, arcY]),
        dropPlunge,
        impactBounce,
      ]).start(() => {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch { }

        setAnimatingMove(null);
        isAnimatingRef.current = false;
        onComplete();
      });
    },
    [
      tubes,
      getBallCoordinates,
      animBallX,
      animBallY,
      animBallScaleX,
      animBallScaleY,
    ]
  );

  /**
   * Handles user tapping on a tube
   */
  const handleTubePress = (tubeIdx: number) => {
    if (isAnimatingRef.current) return;

    // 1. If no tube is currently selected: select this tube if it has balls
    if (selectedTube === null) {
      const source = tubes[tubeIdx];
      if (source && source.length > 0) {
        setSelectedTube(tubeIdx);
        setActiveHint(null);
        try {
          Haptics.selectionAsync();
        } catch { }
      }
      return;
    }

    // 2. If user taps the already-selected tube: deselect it
    if (selectedTube === tubeIdx) {
      setSelectedTube(null);
      try {
        Haptics.selectionAsync();
      } catch { }
      return;
    }

    // 3. User taps a destination tube: check if move is legal
    if (canMove(tubes, selectedTube, tubeIdx)) {
      const from = selectedTube;
      const to = tubeIdx;

      animateMove(from, to, () => {
        const { newTubes, movedBall } = executeMove(tubes, from, to);
        const nextMoves = movesCount + 1;

        setTubes(newTubes);
        setMovesCount(nextMoves);
        setActiveHint(null);

        // Record for Undo
        setUndoStack((prev) => [...prev, { fromTube: from, toTube: to, color: movedBall }]);

        // Check Win Condition!
        if (isPuzzleSolved(newTubes)) {
          handleLevelComplete(nextMoves, newTubes);
        } else {
          persistState({ tubes: newTubes });
        }
      });
    } else {
      // Illegal move feedback
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch { }

      setShakingTube(tubeIdx);
      setTimeout(() => setShakingTube(null), 320);

      // Keep selection or switch if destination tube also has balls
      const dest = tubes[tubeIdx];
      if (dest && dest.length > 0) {
        setSelectedTube(tubeIdx);
      } else {
        setSelectedTube(null);
      }
    }
  };

  /**
   * Handles level completion victory sequence
   */
  const handleLevelComplete = (finalMoves: number, solvedTubes: Tube[]) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch { }

    const rewardCoins = 50;
    const nextCoins = coins + rewardCoins;
    const nextUnlocked = Math.max(unlockedLevel, currentLevel + 1);

    // Calculate stars (3 stars for <= 12 moves, 2 for <= 20, 1 otherwise)
    const starsEarned = finalMoves <= 12 ? 3 : finalMoves <= 20 ? 2 : 1;
    const prevBestStars = levelStars[currentLevel] || 0;
    const nextStars = { ...levelStars, [currentLevel]: Math.max(prevBestStars, starsEarned) };

    setCoins(nextCoins);
    setUnlockedLevel(nextUnlocked);
    setLevelStars(nextStars);
    setShowVictory(true);

    persistState({
      tubes: solvedTubes,
      coins: nextCoins,
      unlocked: nextUnlocked,
      stars: nextStars,
    });
  };

  /**
   * Booster 1: Undo Move with Animated Return Flight & Drop
   */
  const handleUndo = () => {
    if (isAnimatingRef.current || undoStack.length === 0) return;

    const lastMove = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    animateMove(lastMove.toTube, lastMove.fromTube, () => {
      const newTubes = tubes.map((t) => [...t]);
      const ball = newTubes[lastMove.toTube].pop();
      if (ball) {
        newTubes[lastMove.fromTube].push(ball);
      }

      setTubes(newTubes);
      setUndoStack(newUndoStack);
      setSelectedTube(null);
      setActiveHint(null);

      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch { }

      persistState({ tubes: newTubes });
    });
  };

  /**
   * Booster 2: Hint (BFS Solver)
   */
  const handleHint = () => {
    if (isAnimatingRef.current) return;

    if (activeHint) {
      // Execute the active hint
      handleTubePress(activeHint.fromTube);
      setTimeout(() => handleTubePress(activeHint.toTube), 250);
      return;
    }

    const hint = findHint(tubes);
    if (hint) {
      setActiveHint(hint);
      setSelectedTube(hint.fromTube);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch { }
    } else {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch { }
    }
  };

  /**
   * Booster 3: Add Extra Tube
   */
  const handleAddTube = () => {
    if (isAnimatingRef.current || addedExtraTube || tubes.length >= 14) return;

    const newTubes: Tube[] = [...tubes, []];
    setTubes(newTubes);
    setAddedExtraTube(true);

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch { }

    persistState({ tubes: newTubes });
  };

  /**
   * Restart Current Puzzle
   */
  const handleRestart = () => {
    if (isAnimatingRef.current) return;

    const reset = initialTubes.map((t) => [...t]);
    setTubes(reset);
    setSelectedTube(null);
    setAnimatingMove(null);
    setUndoStack([]);
    setMovesCount(0);
    setActiveHint(null);
    setAddedExtraTube(false);

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch { }

    persistState({ tubes: reset });
  };

  // Exit back to game menu
  const handleExit = () => {
    onFinish?.(currentLevel * 100 + coins, false);
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={theme.bgGradient}
        style={[
          styles.container,
          {
            paddingTop: insets.top + 6,
            paddingBottom: Math.max(12, insets.bottom + 6),
          },
        ]}
      >
        {/* 1. TOP HEADER */}
        <View style={styles.header}>
          <Pressable
            onPress={handleExit}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.btnPressed]}
            hitSlop={12}
          >
            <Text style={styles.iconBtnText}>←</Text>
          </Pressable>

          {/* Level Selector Button */}
          <Pressable
            onPress={() => setShowLevelSelect(true)}
            style={({ pressed }) => [styles.levelBadge, pressed && styles.btnPressed]}
          >
            <Text style={styles.levelBadgeEmoji}>🧪</Text>
            <Text style={styles.levelBadgeText}>LEVEL {currentLevel} ▾</Text>
          </Pressable>

          {/* Coin Counter */}
          <View style={styles.coinBadge}>
            <Text style={styles.coinEmoji}>🪙</Text>
            <Text style={styles.coinText}>{coins}</Text>
          </View>

          {/* Restart Button */}
          <Pressable
            onPress={handleRestart}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.btnPressed]}
            hitSlop={12}
          >
            <Text style={styles.iconBtnText}>🔄</Text>
          </Pressable>
        </View>

        {/* 2. SUB-BAR: MOVE COUNTER & ACTIVE HINT NOTICE */}
        {/* 2. SUB-BAR: MOVE COUNTER, PROGRESS & HINT NOTICE */}
        <View style={styles.subBar}>
          <View style={styles.movesPill}>
            <Text style={styles.movesLabel}>MOVES</Text>
            <Text style={styles.movesValue}>{movesCount}</Text>
          </View>

          {/* Solved Tubes Progress */}
          <View style={styles.progressPill}>
            <Text style={styles.progressLabel}>PROGRESS</Text>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${solvePercent}%` },
                ]}
              />
            </View>
            <Text style={styles.progressValue}>
              {solvedTubesCount}/{totalColorCount}
            </Text>
          </View>

          {activeHint && (
            <View style={styles.hintNoticePill}>
              <Text style={styles.hintNoticeText}>
                💡 Tap highlighted tube!
              </Text>
            </View>
          )}
        </View>

        {/* 3. MAIN GAMEPLAY PLAYFIELD: GLASS TEST TUBES */}
        <View style={styles.playfield}>
          {/* Ambient Lighting Glow Behind Tubes */}
          <View style={styles.ambientGlowCyan} pointerEvents="none" />
          <View style={styles.ambientGlowBlue} pointerEvents="none" />

          {/* Row 1 Tubes & Base Shelf */}
          <View style={styles.rowWrapper}>
            <View
              style={styles.tubesRow}
              onLayout={(e) => {
                rowLayouts.current[0] = e.nativeEvent.layout;
              }}
            >
              {row1Tubes.map((tube, idx) => (
                <GlassTube
                  key={`row1-tube-${idx}`}
                  tubeIndex={idx}
                  tube={tube}
                  ballSize={calculatedBallSize}
                  isSelected={selectedTube === idx && !animatingMove}
                  hiddenTopBall={animatingMove?.from === idx}
                  isHintSource={activeHint?.fromTube === idx}
                  isHintDest={activeHint?.toTube === idx}
                  isShaking={shakingTube === idx}
                  theme={theme}
                  onPress={handleTubePress}
                  onLayout={(e) => {
                    tubeLayouts.current[idx] = e.nativeEvent.layout;
                  }}
                />
              ))}
            </View>
            {/* Laboratory Rack Stand Shelf */}
            <View style={styles.rackShelf}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.rackShelfBar}
              />
            </View>
          </View>

          {/* Row 2 Tubes & Base Shelf (for puzzles with 8+ tubes) */}
          {row2Tubes.length > 0 && (
            <View style={[styles.rowWrapper, { marginTop: 14 }]}>
              <View
                style={styles.tubesRow}
                onLayout={(e) => {
                  rowLayouts.current[1] = e.nativeEvent.layout;
                }}
              >
                {row2Tubes.map((tube, idx) => {
                  const actualIndex = tubesPerRow + idx;
                  return (
                    <GlassTube
                      key={`row2-tube-${actualIndex}`}
                      tubeIndex={actualIndex}
                      tube={tube}
                      ballSize={calculatedBallSize}
                      isSelected={selectedTube === actualIndex && !animatingMove}
                      hiddenTopBall={animatingMove?.from === actualIndex}
                      isHintSource={activeHint?.fromTube === actualIndex}
                      isHintDest={activeHint?.toTube === actualIndex}
                      isShaking={shakingTube === actualIndex}
                      theme={theme}
                      onPress={handleTubePress}
                      onLayout={(e) => {
                        tubeLayouts.current[actualIndex] = e.nativeEvent.layout;
                      }}
                    />
                  );
                })}
              </View>
              {/* Row 2 Rack Stand Shelf */}
              <View style={styles.rackShelf}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 0.05)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.rackShelfBar}
                />
              </View>
            </View>
          )}

          {/* Animated Transferring & Dropping Ball Overlay */}
          {animatingMove && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.floatingBall,
                {
                  width: calculatedBallSize,
                  height: calculatedBallSize,
                  transform: [
                    { translateX: animBallX },
                    { translateY: animBallY },
                    { scaleX: animBallScaleX },
                    { scaleY: animBallScaleY },
                  ],
                },
              ]}
            >
              <GlossyBall
                color={animatingMove.ballColor}
                size={calculatedBallSize}
                isSelected={false}
              />
            </Animated.View>
          )}
        </View>

        {/* 4. BOTTOM ACTION TOOLBAR */}
        <View style={styles.toolbar}>
          {/* Undo */}
          <Pressable
            onPress={handleUndo}
            disabled={undoStack.length === 0}
            style={({ pressed }) => [
              styles.toolBtn,
              undoStack.length === 0 && styles.disabledToolBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <View style={styles.toolIconWrap}>
              <Text style={styles.toolIcon}>↩️</Text>
              {undoStack.length > 0 && (
                <View style={styles.undoBadge}>
                  <Text style={styles.undoBadgeText}>{undoStack.length}</Text>
                </View>
              )}
            </View>
            <Text style={styles.toolLabel}>UNDO</Text>
          </Pressable>

          {/* Hint */}
          <Pressable
            onPress={handleHint}
            style={({ pressed }) => [styles.toolBtn, pressed && styles.btnPressed]}
          >
            <View style={[styles.toolIconWrap, activeHint && styles.toolIconWrapActive]}>
              <Text style={styles.toolIcon}>💡</Text>
            </View>
            <Text style={[styles.toolLabel, activeHint && styles.toolLabelActive]}>HINT</Text>
          </Pressable>

          {/* Extra Tube */}
          <Pressable
            onPress={handleAddTube}
            disabled={addedExtraTube || tubes.length >= 14}
            style={({ pressed }) => [
              styles.toolBtn,
              (addedExtraTube || tubes.length >= 14) && styles.disabledToolBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <View style={styles.toolIconWrap}>
              <Text style={styles.toolIcon}>🧪</Text>
              <View style={styles.plusBadge}>
                <Text style={styles.plusBadgeText}>+</Text>
              </View>
            </View>
            <Text style={styles.toolLabel}>+TUBE</Text>
          </Pressable>

          {/* Themes */}
          <Pressable
            onPress={() => setShowThemeShop(true)}
            style={({ pressed }) => [styles.toolBtn, pressed && styles.btnPressed]}
          >
            <View style={styles.toolIconWrap}>
              <Text style={styles.toolIcon}>🎨</Text>
            </View>
            <Text style={styles.toolLabel}>THEMES</Text>
          </Pressable>
        </View>

        {/* Victory Celebration Modal */ }
  <VictoryModal
    visible={showVictory}
    level={currentLevel}
    moves={movesCount}
    coinsEarned={50}
    onNextLevel={() => startLevel(currentLevel + 1)}
    onReplay={handleRestart}
    onExit={handleExit}
  />

  {/* Theme Customization Shop */ }
  <ThemeShopModal
    visible={showThemeShop}
    selectedTheme={selectedTheme}
    unlockedThemes={unlockedThemes}
    coins={coins}
    onSelectTheme={(tId) => {
      setSelectedTheme(tId);
      persistState({ theme: tId });
    }}
    onBuyTheme={(tId, cost) => {
      const nextCoins = coins - cost;
      const nextThemes: ThemeId[] = [...unlockedThemes, tId];
      setCoins(nextCoins);
      setUnlockedThemes(nextThemes);
      setSelectedTheme(tId);
      persistState({ coins: nextCoins, themes: nextThemes, theme: tId });
    }}
    onClose={() => setShowThemeShop(false)}
  />

  {/* Level Select Modal */ }
  <LevelSelectModal
    visible={showLevelSelect}
    currentLevel={currentLevel}
    unlockedLevel={unlockedLevel}
    levelStars={levelStars}
    onSelectLevel={(lvl) => startLevel(lvl)}
    onClose={() => setShowLevelSelect(false)}
  />
      </LinearGradient >
    </View >
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0A0E1F',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  // 1. TOP HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 44,
  },
  iconBtn: {
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
  iconBtnText: {
    fontSize: 18,
    color: '#E2E8F0',
    fontWeight: '700',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 207, 255, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 207, 255, 0.35)',
    gap: 6,
  },
  levelBadgeEmoji: {
    fontSize: 16,
  },
  levelBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#00CFFF',
    letterSpacing: 0.8,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.35)',
    gap: 5,
  },
  coinEmoji: {
    fontSize: 14,
  },
  coinText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FBBF24',
  },

  // 2. SUB-BAR
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 6,
    marginVertical: 4,
  },
  movesPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
  },
  movesLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  movesValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  progressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 6,
  },
  progressLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  progressBarTrack: {
    width: 46,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 3,
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '900',
    color: '#34D399',
  },
  hintNoticePill: {
    backgroundColor: 'rgba(0, 207, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00CFFF',
  },
  hintNoticeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00CFFF',
  },

  // 3. MAIN PLAYFIELD
  playfield: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  ambientGlowCyan: {
    position: 'absolute',
    top: '20%',
    left: '8%',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(0, 207, 255, 0.07)',
  },
  ambientGlowBlue: {
    position: 'absolute',
    bottom: '22%',
    right: '8%',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
  },
  rowWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rackShelf: {
    height: 6,
    width: '100%',
    marginTop: -2,
    alignItems: 'center',
    zIndex: 1,
  },
  rackShelfBar: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingBall: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
    elevation: 20,
  },
  tubesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    zIndex: 2,
  },

  // 4. BOTTOM ACTION TOOLBAR
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  toolBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  toolIconWrap: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  toolIconWrapActive: {
    backgroundColor: 'rgba(0, 207, 255, 0.2)',
    borderColor: '#00CFFF',
    shadowColor: '#00CFFF',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  disabledToolBtn: {
    opacity: 0.35,
  },
  toolIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  toolLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  toolLabelActive: {
    color: '#00CFFF',
  },
  undoBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#0284C7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  undoBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  plusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#34D399',
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0A0E1F',
  },
});
