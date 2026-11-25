// ============================================================
// Wood Screw: Nuts & Bolts Puzzle — Master Game Component
// Replaces Sky Jump with tactile wood board puzzle, 60fps 2D pendulum
// & gravity drop physics, wooden UI matching reference screenshots,
// Pause/Restart/Undo/Screwdriver+/Freeze boosters, and unlimited levels
// ============================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import type { GameEngine } from '../../engine/GameEngine';
import { WOOD_UI_COLORS } from './colors';
import { generateWoodScrewLevel } from './levels';
import {
  canMoveScrew,
  clonePlanks,
  cloneScrews,
  getDetachedPlankCount,
  hasAnyValidMove,
  isAllPlanksDetached,
  isHoleOpenAndClear,
  moveScrew,
  removeScrewWithBooster,
  stepPhysics,
} from './logic';
import {
  BOARD_H,
  BOARD_W,
  type GameStatus,
  type ScrewItem,
  type UndoSnapshot,
  type WoodLevelData,
  type WoodPlank,
} from './types';
import { WallWoodBackground, WoodBoardSvg } from './components/WoodPlanksSvg';
import {
  ArrowRightWoodIcon,
  FreezeClockIcon,
  PauseButtonIcon,
  PlusGreenIcon,
  RestartHeartIcon,
  ScrewdriverBoostIcon,
  UndoWoodIcon,
} from './components/WoodIcons';
import {
  WoodLevelSelectModal,
  WoodOutModal,
  WoodPauseModal,
  WoodVictoryModal,
} from './components/WoodModals';

const STORAGE_KEY_WOOD = '@wood_screw_puzzle_save_v1';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WoodScrewGameProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const SkyJumpGame: React.FC<WoodScrewGameProps> = ({
  onFinish,
  isPaused: externalPaused = false,
}) => {
  const insets = useSafeAreaInsets();

  // Persistent Meta State
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [hearts, setHearts] = useState<number>(5);
  const [freezeCount, setFreezeCount] = useState<number>(2);
  const [screwdriverCount, setScrewdriverCount] = useState<number>(2);

  // Active Level Puzzle State
  const [levelData, setLevelData] = useState<WoodLevelData>(() => generateWoodScrewLevel(1));
  const [planks, setPlanks] = useState<WoodPlank[]>(() => clonePlanks(levelData.planks));
  const [screws, setScrews] = useState<ScrewItem[]>(() => cloneScrews(levelData.screws));
  const [selectedScrewHoleId, setSelectedScrewHoleId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<UndoSnapshot[]>([]);
  const [movesCount, setMovesCount] = useState<number>(0);

  // Timers & Boosters
  const [timeLeft, setTimeLeft] = useState<number>(levelData.timeLimitSeconds);
  const [freezeSecondsLeft, setFreezeSecondsLeft] = useState<number>(0);
  const [screwdriverMode, setScrewdriverMode] = useState<boolean>(false);

  // Game Status & Modals
  const [status, setStatus] = useState<GameStatus>('playing');
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);

  // Feedback Animation (safe factory state, zero ref read in render)
  const [boardShakeX] = useState(() => new Animated.Value(0));

  // Mutable Simulation Refs (used only inside effects/handlers)
  const planksRef = useRef<WoodPlank[]>(planks);
  const screwsRef = useRef<ScrewItem[]>(screws);
  const hasWonRef = useRef<boolean>(false);
  const jamCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const winTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep simulation refs synchronized cleanly inside effect
  useEffect(() => {
    planksRef.current = planks;
    screwsRef.current = screws;
  }, [planks, screws]);

  // Persist Helper
  const saveProgress = useCallback(
    async (overrides?: {
      currentLevel?: number;
      unlockedLevel?: number;
      levelStars?: Record<number, number>;
      hearts?: number;
      freezeCount?: number;
      screwdriverCount?: number;
    }) => {
      try {
        const payload = {
          currentLevel: overrides?.currentLevel ?? currentLevel,
          unlockedLevel: overrides?.unlockedLevel ?? unlockedLevel,
          levelStars: overrides?.levelStars ?? levelStars,
          hearts: overrides?.hearts ?? hearts,
          freezeCount: overrides?.freezeCount ?? freezeCount,
          screwdriverCount: overrides?.screwdriverCount ?? screwdriverCount,
        };
        await AsyncStorage.setItem(STORAGE_KEY_WOOD, JSON.stringify(payload));
      } catch { }
    },
    [currentLevel, unlockedLevel, levelStars, hearts, freezeCount, screwdriverCount]
  );

  // Load Level Helper
  const loadLevel = useCallback(
    (lvlNum: number, persistCurrent = true) => {
      if (jamCheckTimeoutRef.current) clearTimeout(jamCheckTimeoutRef.current);
      if (winTimeoutRef.current) clearTimeout(winTimeoutRef.current);

      const nextLvl = generateWoodScrewLevel(lvlNum);
      const nextPlanks = clonePlanks(nextLvl.planks);
      const nextScrews = cloneScrews(nextLvl.screws);

      hasWonRef.current = false;
      planksRef.current = nextPlanks;
      screwsRef.current = nextScrews;

      setCurrentLevel(nextLvl.levelNumber);
      setLevelData(nextLvl);
      setPlanks(nextPlanks);
      setScrews(nextScrews);
      setSelectedScrewHoleId(null);
      setUndoStack([]);
      setMovesCount(0);
      setTimeLeft(nextLvl.timeLimitSeconds);
      setFreezeSecondsLeft(0);
      setScrewdriverMode(false);
      setStatus('playing');
      setShowVictoryModal(false);
      setShowLevelSelect(false);

      if (persistCurrent) {
        saveProgress({ currentLevel: nextLvl.levelNumber });
      }
    },
    [saveProgress]
  );

  // Load Saved Progress on Mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_WOOD);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.unlockedLevel) setUnlockedLevel(parsed.unlockedLevel);
          if (parsed.levelStars) setLevelStars(parsed.levelStars);
          if (typeof parsed.hearts === 'number') setHearts(Math.max(1, parsed.hearts));
          if (typeof parsed.freezeCount === 'number') setFreezeCount(parsed.freezeCount);
          if (typeof parsed.screwdriverCount === 'number') {
            setScrewdriverCount(parsed.screwdriverCount);
          }
          if (parsed.currentLevel) {
            loadLevel(parsed.currentLevel, false);
          }
        }
      } catch { }
    })();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger Victory Sequence
  const handleVictory = useCallback(() => {
    if (hasWonRef.current) return;
    hasWonRef.current = true;

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch { }

    winTimeoutRef.current = setTimeout(() => {
      const ratioLeft = timeLeft / Math.max(1, levelData.timeLimitSeconds);
      const earnedStars = ratioLeft >= 0.45 ? 3 : ratioLeft >= 0.2 ? 2 : 1;
      const nextUnlocked = Math.max(unlockedLevel, currentLevel + 1);
      const nextStars = {
        ...levelStars,
        [currentLevel]: Math.max(levelStars[currentLevel] || 0, earnedStars),
      };

      setUnlockedLevel(nextUnlocked);
      setLevelStars(nextStars);
      setStatus('won');
      setShowVictoryModal(true);

      saveProgress({
        unlockedLevel: nextUnlocked,
        levelStars: nextStars,
      });
    }, 450);
  }, [currentLevel, levelData.timeLimitSeconds, levelStars, saveProgress, timeLeft, unlockedLevel]);

  // 60FPS Rigid-Body / Pendulum / Drop Physics Loop
  useEffect(() => {
    if (status !== 'playing' || externalPaused) return;

    let rafId = 0;
    let lastTimestamp = Date.now();

    const loop = () => {
      const now = Date.now();
      const dtMs = now - lastTimestamp;
      lastTimestamp = now;
      const dtFactor = Math.max(0.5, Math.min(2.0, dtMs / 16.67));

      const simResult = stepPhysics(levelData.holes, planksRef.current, dtFactor);
      if (simResult.changed) {
        planksRef.current = simResult.planks;
        setPlanks(simResult.planks);
      }

      if (!hasWonRef.current && isAllPlanksDetached(simResult.planks)) {
        handleVictory();
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [status, externalPaused, levelData.holes, handleVictory]);

  // Countdown Timer & Freeze Timer Effect
  useEffect(() => {
    if (status !== 'playing' || externalPaused || hasWonRef.current || showLevelSelect) {
      return;
    }

    const interval = setInterval(() => {
      if (freezeSecondsLeft > 0) {
        setFreezeSecondsLeft((prev) => Math.max(0, prev - 1));
        return;
      }

      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus('lost_time');
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          } catch { }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, externalPaused, freezeSecondsLeft, showLevelSelect]);

  // Check for Screw Jam after moves settle
  useEffect(() => {
    if (jamCheckTimeoutRef.current) clearTimeout(jamCheckTimeoutRef.current);
    if (status !== 'playing' || hasWonRef.current) return;

    jamCheckTimeoutRef.current = setTimeout(() => {
      if (hasWonRef.current) return;
      const currentPlanks = planksRef.current;
      const currentScrews = screwsRef.current;
      if (isAllPlanksDetached(currentPlanks)) return;

      if (!hasAnyValidMove(levelData.holes, currentPlanks, currentScrews)) {
        setStatus('lost_jam');
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } catch { }
      }
    }, 520);

    return () => {
      if (jamCheckTimeoutRef.current) clearTimeout(jamCheckTimeoutRef.current);
    };
  }, [screws, status, levelData.holes]);

  // Blocked Hole Shake Animation
  const triggerBlockedShake = useCallback(() => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch { }

    Animated.sequence([
      Animated.timing(boardShakeX, { toValue: -6, duration: 40, useNativeDriver: true }),
      Animated.timing(boardShakeX, { toValue: 6, duration: 45, useNativeDriver: true }),
      Animated.timing(boardShakeX, { toValue: -4, duration: 40, useNativeDriver: true }),
      Animated.timing(boardShakeX, { toValue: 4, duration: 40, useNativeDriver: true }),
      Animated.timing(boardShakeX, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  }, [boardShakeX]);

  // Handle Tapping Any Hole or Screw
  const handleHolePress = useCallback(
    (holeId: string) => {
      if (status !== 'playing' || hasWonRef.current) return;

      const screwHere = screwsRef.current.find((s) => s.holeId === holeId);

      // 1. Screwdriver (+) Removal Mode
      if (screwdriverMode) {
        if (screwHere) {
          setUndoStack((prev) => [
            ...prev,
            {
              planks: clonePlanks(planksRef.current),
              screws: cloneScrews(screwsRef.current),
            },
          ]);

          const { nextPlanks, nextScrews } = removeScrewWithBooster(
            planksRef.current,
            screwsRef.current,
            holeId
          );

          planksRef.current = nextPlanks;
          screwsRef.current = nextScrews;
          setPlanks(nextPlanks);
          setScrews(nextScrews);
          setMovesCount((m) => m + 1);
          setSelectedScrewHoleId(null);
          setScrewdriverMode(false);

          const nextDriverCount = Math.max(0, screwdriverCount - 1);
          setScrewdriverCount(nextDriverCount);
          saveProgress({ screwdriverCount: nextDriverCount });

          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch { }
        } else {
          // Cancel screwdriver mode when tapping non-screw space
          setScrewdriverMode(false);
        }
        return;
      }

      // 2. Tapping a Screw -> Select or Switch Selection
      if (screwHere) {
        if (selectedScrewHoleId === holeId) {
          setSelectedScrewHoleId(null);
        } else {
          setSelectedScrewHoleId(holeId);
        }
        try {
          Haptics.selectionAsync();
        } catch { }
        return;
      }

      // 3. Tapping an Empty Hole while a Screw is Selected
      if (selectedScrewHoleId !== null) {
        if (
          canMoveScrew(
            levelData.holes,
            planksRef.current,
            screwsRef.current,
            selectedScrewHoleId,
            holeId
          )
        ) {
          setUndoStack((prev) => [
            ...prev,
            {
              planks: clonePlanks(planksRef.current),
              screws: cloneScrews(screwsRef.current),
            },
          ]);

          const { nextPlanks, nextScrews } = moveScrew(
            levelData.holes,
            planksRef.current,
            screwsRef.current,
            selectedScrewHoleId,
            holeId
          );

          planksRef.current = nextPlanks;
          screwsRef.current = nextScrews;
          setPlanks(nextPlanks);
          setScrews(nextScrews);
          setSelectedScrewHoleId(null);
          setMovesCount((m) => m + 1);

          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch { }
        } else {
          // Blocked by solid wood!
          triggerBlockedShake();
        }
      }
    },
    [
      levelData.holes,
      saveProgress,
      screwdriverCount,
      screwdriverMode,
      selectedScrewHoleId,
      status,
      triggerBlockedShake,
    ]
  );

  // Undo Booster Handler
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    const restoredPlanks = clonePlanks(last.planks);
    const restoredScrews = cloneScrews(last.screws);

    planksRef.current = restoredPlanks;
    screwsRef.current = restoredScrews;

    setPlanks(restoredPlanks);
    setScrews(restoredScrews);
    setUndoStack((prev) => prev.slice(0, -1));
    setSelectedScrewHoleId(null);
    setScrewdriverMode(false);
    setStatus('playing');

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch { }
  };

  // Screwdriver (+) Booster Toggle
  const handleToggleScrewdriver = () => {
    if (status === 'lost_jam') {
      setStatus('playing');
    }
    if (screwdriverCount <= 0) {
      // Auto-refill 1 free booster if out so player can always progress offline
      setScrewdriverCount(1);
      saveProgress({ screwdriverCount: 1 });
    }
    setScrewdriverMode((prev) => !prev);
    setSelectedScrewHoleId(null);
    try {
      Haptics.selectionAsync();
    } catch { }
  };

  // Freeze Timer Booster
  const handleFreezeTimer = () => {
    if (status !== 'playing') return;
    if (freezeCount <= 0) return;

    const nextFreeze = freezeCount - 1;
    setFreezeCount(nextFreeze);
    setFreezeSecondsLeft((prev) => prev + 30);
    saveProgress({ freezeCount: nextFreeze });

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch { }
  };

  // Top-Right Restart Handler (deducts 1 heart visual cleanly, refills back to 5 when 0)
  const handleRestart = () => {
    const nextHearts = hearts > 1 ? hearts - 1 : 5;
    setHearts(nextHearts);
    saveProgress({ hearts: nextHearts });
    loadLevel(currentLevel, false);
  };

  const handleExit = () => {
    onFinish?.(currentLevel * 100 + movesCount, hasWonRef.current);
  };

  // Responsive Board Scaling (Fits cleanly between top HUD and bottom dock)
  const availW = SCREEN_WIDTH - 28;
  const availH = SCREEN_HEIGHT - insets.top - insets.bottom - 205;
  const boardScale = Math.min(availW / BOARD_W, Math.max(0.68, availH / BOARD_H), 1.25);
  const boardPixelW = Math.round(BOARD_W * boardScale);
  const boardPixelH = Math.round(BOARD_H * boardScale);

  // Precompute which holes are open & unobstructed when a screw is lifted
  const openValidHoleIds = useMemo(() => {
    const set = new Set<string>();
    if (!selectedScrewHoleId) return set;
    for (const h of levelData.holes) {
      if (isHoleOpenAndClear(h.id, levelData.holes, planks, screws)) {
        set.add(h.id);
      }
    }
    return set;
  }, [levelData.holes, planks, screws, selectedScrewHoleId]);

  const detachedCount = getDetachedPlankCount(planks);
  const totalPlanks = Math.max(1, planks.length);
  const progressPercent = Math.min(100, Math.round((detachedCount / totalPlanks) * 100));

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formattedTime = `${mins}:${secs.toString().padStart(2, '0')}`;

  const hitTargetSize = Math.max(36, Math.round(32 * boardScale));
  const earnedStarsLatest =
    timeLeft / Math.max(1, levelData.timeLimitSeconds) >= 0.45
      ? 3
      : timeLeft / Math.max(1, levelData.timeLimitSeconds) >= 0.2
      ? 2
      : 1;

  return (
    <View style={styles.outerRoot}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Warm Vertical Wooden Plank Wall Backdrop */}
      <WallWoodBackground />

      <View
        style={[
          styles.safeWrapper,
          {
            paddingTop: insets.top + 8,
            paddingBottom: Math.max(14, insets.bottom + 8),
          },
        ]}
      >
        {/* 1. TOP HUD BAR (Exact match to Reference Screenshots) */}
        <View style={styles.topHud}>
          {/* Top-Left Amber Pause Button */}
          <Pressable
            onPress={() => status === 'playing' && setStatus('paused')}
            style={({ pressed }) => [styles.cornerBtnOuter, pressed && styles.btnPressed]}
            hitSlop={8}
          >
            <LinearGradient
              colors={[WOOD_UI_COLORS.amberBtnTop, WOOD_UI_COLORS.amberBtnBottom]}
              style={styles.cornerBtnFace}
            >
              <PauseButtonIcon size={28} />
            </LinearGradient>
          </Pressable>

          {/* Center Stack: Level X + 2-Segment Green/Brown Progress + Brown Timer Pill */}
          <View style={styles.centerHudStack}>
            <Pressable onPress={() => setShowLevelSelect(true)} hitSlop={8}>
              <Text style={styles.levelTitleText}>Level {currentLevel}</Text>
            </Pressable>

            {/* Dual-Segment Capsule Progress Bar */}
            <View style={styles.progressOuterCapsule}>
              <View
                style={[
                  styles.progressFillGreen,
                  { width: `${progressPercent}%` },
                ]}
              >
                <View style={styles.progressGlossHighlight} />
              </View>
              {/* Center Segment Pinch Divider */}
              <View style={styles.progressMidDivider} />
            </View>

            {/* Countdown Timer Pill */}
            <View
              style={[
                styles.timerPill,
                freezeSecondsLeft > 0 && styles.timerPillFrozen,
              ]}
            >
              <Text
                style={[
                  styles.timerText,
                  freezeSecondsLeft > 0 && styles.timerTextFrozen,
                ]}
              >
                {freezeSecondsLeft > 0 ? `ICE ${formattedTime}` : formattedTime}
              </Text>
            </View>
          </View>

          {/* Top-Right Amber Restart (-1 Heart) Button */}
          <Pressable
            onPress={handleRestart}
            style={({ pressed }) => [styles.cornerBtnOuter, pressed && styles.btnPressed]}
            hitSlop={8}
          >
            <LinearGradient
              colors={[WOOD_UI_COLORS.amberBtnTop, WOOD_UI_COLORS.amberBtnBottom]}
              style={styles.cornerBtnFace}
            >
              <RestartHeartIcon size={30} />
            </LinearGradient>
          </Pressable>
        </View>

        {/* Active Booster Status Pill (if Screwdriver removal mode is on) */}
        {screwdriverMode && (
          <Pressable
            onPress={() => setScrewdriverMode(false)}
            style={styles.modeNoticePill}
          >
            <Text style={styles.modeNoticeText}>
              Tap any screw to unscrew & remove it! (Tap here to cancel)
            </Text>
          </Pressable>
        )}

        {/* 2. CENTRAL LIGHT-OAK WOODEN BOARD + PLANKS + SCREWS */}
        <View style={styles.boardStage}>
          <Animated.View
            style={[
              styles.boardContainer,
              {
                width: boardPixelW,
                height: boardPixelH,
                transform: [{ translateX: boardShakeX }],
              },
            ]}
          >
            <WoodBoardSvg
              width={boardPixelW}
              height={boardPixelH}
              holes={levelData.holes}
              planks={planks}
              screws={screws}
              selectedScrewHoleId={selectedScrewHoleId}
              openValidHoleIds={openValidHoleIds}
              screwdriverMode={screwdriverMode}
            />

            {/* Precision Touch Hit Targets Centered Over Every Hole */}
            {levelData.holes.map((hole) => (
              <Pressable
                key={`hit-${hole.id}`}
                onPress={() => handleHolePress(hole.id)}
                style={[
                  styles.holeHitZone,
                  {
                    width: hitTargetSize,
                    height: hitTargetSize,
                    borderRadius: hitTargetSize / 2,
                    left: hole.x * boardScale - hitTargetSize / 2,
                    top: hole.y * boardScale - hitTargetSize / 2,
                  },
                ]}
              />
            ))}
          </Animated.View>
        </View>

        {/* 3. BOTTOM 3-BUTTON BOOSTER BAR (Undo / Screwdriver+ / Ice Clock) */}
        {status === 'won' && !showVictoryModal ? (
          <View style={styles.bottomBar}>
            <Pressable
              onPress={() => loadLevel(currentLevel + 1)}
              style={({ pressed }) => [styles.nextWideOuter, pressed && styles.btnPressed]}
            >
              <LinearGradient
                colors={[WOOD_UI_COLORS.amberBtnTop, WOOD_UI_COLORS.amberBtnBottom]}
                style={styles.nextWideFace}
              >
                <Text style={styles.nextWideText}>NEXT LEVEL {currentLevel + 1}</Text>
                <ArrowRightWoodIcon size={20} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <View style={styles.bottomBar}>
            {/* Left: Silver Undo Button */}
            <Pressable
              onPress={handleUndo}
              disabled={undoStack.length === 0}
              style={({ pressed }) => [
                styles.boosterOuterSilver,
                undoStack.length === 0 && styles.boosterDisabled,
                pressed && styles.btnPressed,
              ]}
            >
              <LinearGradient
                colors={[WOOD_UI_COLORS.silverBtnTop, WOOD_UI_COLORS.silverBtnBottom]}
                style={styles.boosterFace}
              >
                <UndoWoodIcon size={34} />
              </LinearGradient>
            </Pressable>

            {/* Center: Amber Screwdriver (+) Booster */}
            <Pressable
              onPress={handleToggleScrewdriver}
              style={({ pressed }) => [
                styles.boosterOuterAmber,
                screwdriverMode && styles.boosterActiveGlow,
                pressed && styles.btnPressed,
              ]}
            >
              <LinearGradient
                colors={[WOOD_UI_COLORS.amberBtnTop, WOOD_UI_COLORS.amberBtnBottom]}
                style={styles.boosterFace}
              >
                <ScrewdriverBoostIcon size={36} />
              </LinearGradient>
              {/* Top-Right Bright Green + Badge */}
              <View style={styles.plusCornerBadge}>
                <PlusGreenIcon size={18} />
              </View>
              {screwdriverCount > 0 && (
                <View style={styles.countBadgeLeft}>
                  <Text style={styles.countBadgeText}>{screwdriverCount}</Text>
                </View>
              )}
            </Pressable>

            {/* Right: Amber Freeze Timer Ice Clock Booster */}
            <Pressable
              onPress={handleFreezeTimer}
              disabled={freezeCount <= 0}
              style={({ pressed }) => [
                styles.boosterOuterAmber,
                freezeCount <= 0 && styles.boosterDisabled,
                pressed && styles.btnPressed,
              ]}
            >
              <LinearGradient
                colors={[WOOD_UI_COLORS.amberBtnTop, WOOD_UI_COLORS.amberBtnBottom]}
                style={styles.boosterFace}
              >
                <FreezeClockIcon size={38} />
              </LinearGradient>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{freezeCount}</Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>

      {/* MODALS */}
      <WoodPauseModal
        visible={status === 'paused' && !showLevelSelect}
        level={currentLevel}
        hearts={hearts}
        onResume={() => setStatus('playing')}
        onRestart={handleRestart}
        onOpenLevels={() => setShowLevelSelect(true)}
        onExit={handleExit}
      />

      <WoodVictoryModal
        visible={status === 'won' && showVictoryModal}
        level={currentLevel}
        stars={earnedStarsLatest}
        moves={movesCount}
        timeRemaining={timeLeft}
        onNextLevel={() => loadLevel(currentLevel + 1)}
        onReplay={() => loadLevel(currentLevel, false)}
        onOpenLevels={() => {
          setShowVictoryModal(false);
          setShowLevelSelect(true);
        }}
        onClose={() => setShowVictoryModal(false)}
      />

      <WoodOutModal
        visible={status === 'lost_time' || status === 'lost_jam'}
        status={status}
        canUndo={undoStack.length > 0}
        hasScrewdriver={screwdriverCount > 0}
        onUndo={handleUndo}
        onUseScrewdriver={handleToggleScrewdriver}
        onRestart={() => loadLevel(currentLevel, false)}
        onExit={handleExit}
      />

      <WoodLevelSelectModal
        visible={showLevelSelect}
        currentLevel={currentLevel}
        unlockedLevel={unlockedLevel}
        levelStars={levelStars}
        onSelectLevel={(lvl) => loadLevel(lvl)}
        onClose={() => setShowLevelSelect(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerRoot: {
    flex: 1,
    backgroundColor: WOOD_UI_COLORS.wallBg,
  },
  safeWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },

  // 1. TOP HUD BAR
  topHud: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  cornerBtnOuter: {
    width: 52,
    height: 52,
    borderRadius: 15,
    borderWidth: 2.5,
    borderColor: WOOD_UI_COLORS.btnOutline,
    backgroundColor: WOOD_UI_COLORS.amberBtnLip,
    paddingBottom: 4,
    overflow: 'hidden',
    shadowColor: '#3B1A06',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  cornerBtnFace: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHudStack: {
    alignItems: 'center',
    gap: 5,
    marginTop: -2,
  },
  levelTitleText: {
    fontSize: 19,
    fontWeight: '900',
    color: WOOD_UI_COLORS.hudText,
    textShadowColor: WOOD_UI_COLORS.hudTextStroke,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
    letterSpacing: 0.4,
  },
  progressOuterCapsule: {
    width: 112,
    height: 14,
    borderRadius: 7,
    backgroundColor: WOOD_UI_COLORS.progressTrack,
    borderWidth: 2,
    borderColor: WOOD_UI_COLORS.hudPillBorder,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  progressFillGreen: {
    height: '100%',
    backgroundColor: WOOD_UI_COLORS.progressGreen,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressGlossHighlight: {
    width: '100%',
    height: 4,
    backgroundColor: WOOD_UI_COLORS.progressGreenGloss,
    opacity: 0.85,
  },
  progressMidDivider: {
    position: 'absolute',
    left: '48%',
    width: 3,
    height: '100%',
    backgroundColor: WOOD_UI_COLORS.hudPillBorder,
  },
  timerPill: {
    backgroundColor: WOOD_UI_COLORS.hudPillBg,
    borderWidth: 2,
    borderColor: WOOD_UI_COLORS.hudPillBorder,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 1,
    shadowColor: '#2B1203',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 4,
  },
  timerPillFrozen: {
    backgroundColor: '#0C4A6E',
    borderColor: WOOD_UI_COLORS.freezeCyan,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '900',
    color: WOOD_UI_COLORS.hudText,
    textShadowColor: '#2B1203',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 1.5,
    letterSpacing: 0.8,
  },
  timerTextFrozen: {
    color: WOOD_UI_COLORS.freezeIce,
  },

  modeNoticePill: {
    backgroundColor: '#4E270D',
    borderWidth: 2,
    borderColor: WOOD_UI_COLORS.amberBtnTop,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 4,
  },
  modeNoticeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FDE68A',
  },

  // 2. CENTRAL BOARD PLAYFIELD
  boardStage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardContainer: {
    position: 'relative',
  },
  holeHitZone: {
    position: 'absolute',
    zIndex: 10,
  },

  // 3. BOTTOM 3-BUTTON BOOSTER DOCK
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 6,
    gap: 12,
  },
  boosterOuterSilver: {
    flex: 1,
    maxWidth: 106,
    height: 62,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: WOOD_UI_COLORS.btnOutline,
    backgroundColor: WOOD_UI_COLORS.silverBtnLip,
    paddingBottom: 5,
    overflow: 'visible',
    shadowColor: '#2D1405',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  boosterOuterAmber: {
    flex: 1,
    maxWidth: 106,
    height: 62,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: WOOD_UI_COLORS.btnOutline,
    backgroundColor: WOOD_UI_COLORS.amberBtnLip,
    paddingBottom: 5,
    overflow: 'visible',
    shadowColor: '#2D1405',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  boosterActiveGlow: {
    borderColor: WOOD_UI_COLORS.freezeCyan,
    shadowColor: WOOD_UI_COLORS.freezeCyan,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  boosterDisabled: {
    opacity: 0.55,
  },
  boosterFace: {
    flex: 1,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusCornerBadge: {
    position: 'absolute',
    top: -6,
    right: -4,
    zIndex: 5,
  },
  countBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: WOOD_UI_COLORS.btnOutline,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },
  countBadgeLeft: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: WOOD_UI_COLORS.btnOutline,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1E293B',
  },
  nextWideOuter: {
    flex: 1,
    height: 58,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: WOOD_UI_COLORS.btnOutline,
    backgroundColor: WOOD_UI_COLORS.amberBtnLip,
    paddingBottom: 5,
    overflow: 'hidden',
  },
  nextWideFace: {
    flex: 1,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  nextWideText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#421F07',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  btnPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});
