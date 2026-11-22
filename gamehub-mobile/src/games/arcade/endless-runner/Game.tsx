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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  canMove,
  executeMove,
  isPuzzleSolved,
  generateLevel,
  findHint,
} from './logic';
import { THEMES } from './colors';
import { GlassTube } from './components/GlassTube';
import { VictoryModal } from './components/VictoryModal';
import { ThemeShopModal } from './components/ThemeShopModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import type {
  Tube,
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

  const theme = THEMES[selectedTheme] || THEMES.midnight;

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
      } catch {}
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
      } catch {}
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
      const lvl = generateLevel(lvlNum);
      setCurrentLevel(lvlNum);
      setTubes(lvl.tubes);
      setInitialTubes(lvl.tubes.map((t) => [...t]));
      setSelectedTube(null);
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
   * Handles user tapping on a tube
   */
  const handleTubePress = (tubeIdx: number) => {
    // 1. If no tube is currently selected: select this tube if it has balls
    if (selectedTube === null) {
      const source = tubes[tubeIdx];
      if (source && source.length > 0) {
        setSelectedTube(tubeIdx);
        setActiveHint(null);
        try {
          Haptics.selectionAsync();
        } catch {}
      }
      return;
    }

    // 2. If user taps the already-selected tube: deselect it
    if (selectedTube === tubeIdx) {
      setSelectedTube(null);
      try {
        Haptics.selectionAsync();
      } catch {}
      return;
    }

    // 3. User taps a destination tube: check if move is legal
    if (canMove(tubes, selectedTube, tubeIdx)) {
      const from = selectedTube;
      const to = tubeIdx;

      const { newTubes, movedBall } = executeMove(tubes, from, to);
      const nextMoves = movesCount + 1;

      setTubes(newTubes);
      setSelectedTube(null);
      setMovesCount(nextMoves);
      setActiveHint(null);

      // Record for Undo
      setUndoStack((prev) => [...prev, { fromTube: from, toTube: to, color: movedBall }]);

      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}

      // Check Win Condition!
      if (isPuzzleSolved(newTubes)) {
        handleLevelComplete(nextMoves, newTubes);
      } else {
        persistState({ tubes: newTubes });
      }
    } else {
      // Illegal move feedback
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch {}
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
    } catch {}

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
   * Booster 1: Undo Move
   */
  const handleUndo = () => {
    if (undoStack.length === 0) return;

    const lastMove = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    // Move ball back from dest to source
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
    } catch {}

    persistState({ tubes: newTubes });
  };

  /**
   * Booster 2: Hint (BFS Solver)
   */
  const handleHint = () => {
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
      } catch {}
    } else {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch {}
    }
  };

  /**
   * Booster 3: Add Extra Tube
   */
  const handleAddTube = () => {
    if (addedExtraTube || tubes.length >= 14) return;

    const newTubes: Tube[] = [...tubes, []];
    setTubes(newTubes);
    setAddedExtraTube(true);

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}

    persistState({ tubes: newTubes });
  };

  /**
   * Restart Current Puzzle
   */
  const handleRestart = () => {
    const reset = initialTubes.map((t) => [...t]);
    setTubes(reset);
    setSelectedTube(null);
    setUndoStack([]);
    setMovesCount(0);
    setActiveHint(null);
    setAddedExtraTube(false);

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    persistState({ tubes: reset });
  };

  // Exit back to game menu
  const handleExit = () => {
    onFinish?.(currentLevel * 100 + coins, false);
  };

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
        <View style={styles.subBar}>
          <View style={styles.movesPill}>
            <Text style={styles.movesLabel}>MOVES</Text>
            <Text style={styles.movesValue}>{movesCount}</Text>
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
          {/* Row 1 Tubes */}
          <View style={styles.tubesRow}>
            {row1Tubes.map((tube, idx) => (
              <GlassTube
                key={`row1-tube-${idx}`}
                tubeIndex={idx}
                tube={tube}
                ballSize={calculatedBallSize}
                isSelected={selectedTube === idx}
                isHintSource={activeHint?.fromTube === idx}
                isHintDest={activeHint?.toTube === idx}
                theme={theme}
                onPress={handleTubePress}
              />
            ))}
          </View>

          {/* Row 2 Tubes (for puzzles with 8+ tubes) */}
          {row2Tubes.length > 0 && (
            <View style={styles.tubesRow}>
              {row2Tubes.map((tube, idx) => {
                const actualIndex = tubesPerRow + idx;
                return (
                  <GlassTube
                    key={`row2-tube-${actualIndex}`}
                    tubeIndex={actualIndex}
                    tube={tube}
                    ballSize={calculatedBallSize}
                    isSelected={selectedTube === actualIndex}
                    isHintSource={activeHint?.fromTube === actualIndex}
                    isHintDest={activeHint?.toTube === actualIndex}
                    theme={theme}
                    onPress={handleTubePress}
                  />
                );
              })}
            </View>
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
            <Text style={styles.toolIcon}>↩️</Text>
            <Text style={styles.toolLabel}>Undo ({undoStack.length})</Text>
          </Pressable>

          {/* Hint */}
          <Pressable
            onPress={handleHint}
            style={({ pressed }) => [styles.toolBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.toolIcon}>💡</Text>
            <Text style={styles.toolLabel}>Hint</Text>
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
            <Text style={styles.toolIcon}>🧪+</Text>
            <Text style={styles.toolLabel}>+Tube</Text>
          </Pressable>

          {/* Themes */}
          <Pressable
            onPress={() => setShowThemeShop(true)}
            style={({ pressed }) => [styles.toolBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.toolIcon}>🎨</Text>
            <Text style={styles.toolLabel}>Themes</Text>
          </Pressable>
        </View>

        {/* Victory Celebration Modal */}
        <VictoryModal
          visible={showVictory}
          level={currentLevel}
          moves={movesCount}
          coinsEarned={50}
          onNextLevel={() => startLevel(currentLevel + 1)}
          onReplay={handleRestart}
          onExit={handleExit}
        />

        {/* Theme Customization Shop */}
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

        {/* Level Select Modal */}
        <LevelSelectModal
          visible={showLevelSelect}
          currentLevel={currentLevel}
          unlockedLevel={unlockedLevel}
          levelStars={levelStars}
          onSelectLevel={(lvl) => startLevel(lvl)}
          onClose={() => setShowLevelSelect(false)}
        />
      </LinearGradient>
    </View>
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
  },
  tubesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
  },

  // 4. BOTTOM ACTION TOOLBAR
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  toolBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  disabledToolBtn: {
    opacity: 0.35,
  },
  toolIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  toolLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
});
