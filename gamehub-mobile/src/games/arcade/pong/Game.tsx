// ============================================================
// Woodland Bubble Shooter — Main Game Screen (Replaces Pong Slot)
// Features bank-shot aiming, swap ring, Match-3 + avalanche physics,
// Fireball / Lightning / Rainbow orbs, unlimited levels & wood UI.
// ============================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  HEX_COLS_EVEN,
  createGridFromLevel,
  computeInitialCameraTopRow,
  updateCameraTopRow,
  computeAimTrajectory,
  resolveShotImpact,
  checkDangerLineOverflow,
  checkLevelVictory,
  computeLevelStars,
  getCellCenter,
  getGridStats,
  pickPlayableBubbleColor,
  sanitizeShotColor,
} from './logic';
import { generateBubbleLevel } from './levels';
import { BubbleHaptics } from './haptics';
import { BubbleSound } from './sound';
import { WoodlandBackground } from './components/WoodlandBackground';
import { BubbleBoard, PILLAR_WIDTH } from './components/BubbleBoard';
import { ShooterCannon } from './components/ShooterCannon';
import { WoodlandLevelMapModal } from './components/WoodlandLevelMapModal';
import {
  WoodlandLevelCompleteModal,
  WoodlandGameOverModal,
  WoodlandPauseModal,
} from './components/WoodlandModals';
import {
  BackArrowIcon,
  GearSettingsIcon,
  TrophyWoodIcon,
  StarGoldIcon,
  CrownScoreIcon,
  FireflyBadgeIcon,
  TargetGoalIcon,
} from './components/WoodlandIcons';
import { BUBBLE_COLOR_THEMES, WOOD_SHOOTER_PALETTE } from './components/woodTheme';
import type {
  ActiveProjectile,
  BubbleColor,
  BubbleKind,
  FallingBubble,
  FloatingPopup,
  HexGrid,
  PopParticle,
  PowerUpType,
  TrajectoryPoint,
} from './types';
import type { GameEngine } from '../../engine/GameEngine';

const KEY_UNLOCKED = '@woodland_bubble_unlocked_v1';
const KEY_STARS = '@woodland_bubble_stars_v1';
const KEY_HIGHSCORE = '@woodland_bubble_highscore_v1';
const KEY_POWERUPS = '@woodland_bubble_powerups_v1';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PongProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

function measurePolylineLength(pts: TrajectoryPoint[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    len += Math.hypot(dx, dy);
  }
  return len;
}

function interpolateAlongPolyline(
  pts: TrajectoryPoint[],
  dist: number
): TrajectoryPoint {
  if (pts.length === 0) return { x: 0, y: 0 };
  if (pts.length === 1 || dist <= 0) return pts[0];

  let traveled = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    const segLen = Math.hypot(dx, dy);
    if (traveled + segLen >= dist && segLen > 0) {
      const ratio = (dist - traveled) / segLen;
      return {
        x: pts[i - 1].x + dx * ratio,
        y: pts[i - 1].y + dy * ratio,
      };
    }
    traveled += segLen;
  }
  return pts[pts.length - 1];
}

export const PongGame: React.FC<PongProps> = ({
  onFinish,
  isPaused = false,
}) => {
  const insets = useSafeAreaInsets();

  // Responsive Woodland Frame & Hex Sizing
  const HEADER_H = 44;
  const SUB_HUD_H = 52;
  const CANNON_DECK_H = 76;
  const VERTICAL_GAPS = 22;
  const boardWidth = Math.min(SCREEN_WIDTH - 12, 430);
  const playWidth = boardWidth - PILLAR_WIDTH * 2;
  const bubbleDiameter = playWidth / HEX_COLS_EVEN;
  const maxBoardH = Math.max(
    330,
    SCREEN_HEIGHT - insets.top - insets.bottom - HEADER_H - SUB_HUD_H - CANNON_DECK_H - VERTICAL_GAPS
  );
  const boardHeight = Math.min(maxBoardH, bubbleDiameter * 13.5);

  // Progression & Persistence State
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [highScore, setHighScore] = useState(0);
  const [powerUps, setPowerUps] = useState<Record<PowerUpType, number>>({
    fireball: 2,
    lightning: 2,
    rainbow: 1,
  });

  // Active Match State
  const [initialSetup] = useState(() => {
    const cfg = generateBubbleLevel(1);
    const startGrid = createGridFromLevel(cfg);
    return {
      cfg,
      startGrid,
      camTop: computeInitialCameraTopRow(startGrid),
      c1: pickPlayableBubbleColor(startGrid),
      c2: pickPlayableBubbleColor(startGrid),
    };
  });

  const levelConfig = useMemo(() => generateBubbleLevel(currentLevel), [currentLevel]);
  const [grid, setGrid] = useState<HexGrid>(initialSetup.startGrid);
  const [cameraTopRow, setCameraTopRow] = useState(initialSetup.camTop);
  const [activeColor, setActiveColor] = useState<BubbleColor>(initialSetup.c1);
  const [nextColor, setNextColor] = useState<BubbleColor>(initialSetup.c2);
  const [shotsLeft, setShotsLeft] = useState(initialSetup.cfg.maxShots);
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUpType | null>(null);
  const [score, setScore] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [streakCharge, setStreakCharge] = useState(0);

  // Interactive Flight, Aiming & VFX State
  const [aimAngle, setAimAngle] = useState<number | null>(null);
  const [activeProjectile, setActiveProjectile] = useState<ActiveProjectile | null>(null);
  const [projectilePos, setProjectilePos] = useState<TrajectoryPoint | null>(null);
  const [particles, setParticles] = useState<PopParticle[]>([]);
  const [fallingBubbles, setFallingBubbles] = useState<FallingBubble[]>([]);
  const [popups, setPopups] = useState<FloatingPopup[]>([]);
  const [lightningBeamY, setLightningBeamY] = useState<number | null>(null);
  const [fireballBurst, setFireballBurst] = useState<TrajectoryPoint | null>(null);

  // Modals & Toggles
  const [showLevelMap, setShowLevelMap] = useState(false);
  const [isLocalPaused, setIsLocalPaused] = useState(false);
  const [winState, setWinState] = useState<{
    visible: boolean;
    stars: number;
    bonusPoints: number;
  }>({ visible: false, stars: 1, bonusPoints: 0 });
  const [gameOverState, setGameOverState] = useState<{
    visible: boolean;
    reason: 'shots' | 'overflow';
  }>({ visible: false, reason: 'shots' });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const initialFireflyTotal = useMemo(
    () => getGridStats(createGridFromLevel(levelConfig)).fireflyCount,
    [levelConfig]
  );
  const currentStats = useMemo(() => getGridStats(grid), [grid]);
  const rescuedFireflies = Math.max(0, initialFireflyTotal - currentStats.fireflyCount);

  // Load saved level stars & high score on mount
  useEffect(() => {
    (async () => {
      try {
        const [uStr, sStr, hStr, pStr] = await Promise.all([
          AsyncStorage.getItem(KEY_UNLOCKED),
          AsyncStorage.getItem(KEY_STARS),
          AsyncStorage.getItem(KEY_HIGHSCORE),
          AsyncStorage.getItem(KEY_POWERUPS),
        ]);
        if (uStr) {
          const parsed = parseInt(uStr, 10);
          if (parsed >= 1) setUnlockedLevel(parsed);
        }
        if (sStr) setLevelStars(JSON.parse(sStr));
        if (hStr) setHighScore(parseInt(hStr, 10) || 0);
        if (pStr) setPowerUps(JSON.parse(pStr));
      } catch {}
    })();
  }, []);

  const persistPowerUps = useCallback((nextMap: Record<PowerUpType, number>) => {
    setPowerUps(nextMap);
    AsyncStorage.setItem(KEY_POWERUPS, JSON.stringify(nextMap)).catch(() => {});
  }, []);

  const rafRef = useRef<number | null>(null);
  const cancelFlight = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setActiveProjectile(null);
    setProjectilePos(null);
  }, []);

  useEffect(() => cancelFlight, [cancelFlight]);

  const loadLevel = useCallback(
    (lvlNum: number) => {
      cancelFlight();
      const cfg = generateBubbleLevel(lvlNum);
      const nextGrid = createGridFromLevel(cfg);

      setCurrentLevel(lvlNum);
      setGrid(nextGrid);
      setCameraTopRow(computeInitialCameraTopRow(nextGrid));
      setActiveColor(pickPlayableBubbleColor(nextGrid));
      setNextColor(pickPlayableBubbleColor(nextGrid));
      setShotsLeft(cfg.maxShots);
      setSelectedPowerUp(null);
      setScore(0);
      setComboStreak(0);
      setStreakCharge(0);
      setAimAngle(null);
      setParticles([]);
      setFallingBubbles([]);
      setPopups([]);
      setLightningBeamY(null);
      setFireballBurst(null);
      setWinState({ visible: false, stars: 1, bonusPoints: 0 });
      setGameOverState({ visible: false, reason: 'shots' });
      setIsLocalPaused(false);
      setShowLevelMap(false);
    },
    [cancelFlight]
  );

  // Live Bank-Shot Aim Ray Preview
  const originX = playWidth / 2;
  const originY = boardHeight - bubbleDiameter * 0.45;
  const aimRay = useMemo(() => {
    if (aimAngle === null || activeProjectile !== null) return null;
    return computeAimTrajectory(
      grid,
      originX,
      originY,
      aimAngle,
      playWidth,
      bubbleDiameter,
      cameraTopRow,
      2
    );
  }, [aimAngle, activeProjectile, grid, originX, originY, playWidth, bubbleDiameter, cameraTopRow]);

  // Ref snapshot used when projectile finishes flying
  const stateSnapshotRef = useRef({
    grid,
    cameraTopRow,
    shotsLeft,
    score,
    comboStreak,
    streakCharge,
    highScore,
    currentLevel,
    unlockedLevel,
    levelStars,
    levelConfig,
    powerUps,
    nextColor,
  });

  useEffect(() => {
    stateSnapshotRef.current = {
      grid,
      cameraTopRow,
      shotsLeft,
      score,
      comboStreak,
      streakCharge,
      highScore,
      currentLevel,
      unlockedLevel,
      levelStars,
      levelConfig,
      powerUps,
      nextColor,
    };
  }, [
    grid,
    cameraTopRow,
    shotsLeft,
    score,
    comboStreak,
    streakCharge,
    highScore,
    currentLevel,
    unlockedLevel,
    levelStars,
    levelConfig,
    powerUps,
    nextColor,
  ]);

  const handleImpact = useCallback(
    (proj: ActiveProjectile) => {
      const snap = stateSnapshotRef.current;
      const result = resolveShotImpact(
        snap.grid,
        proj.targetCoord,
        proj.color,
        proj.kind,
        snap.comboStreak
      );

      // Build Pop Particles, Avalanche Drops & Floating Popups
      const newParticles: PopParticle[] = [];
      const newFalling: FallingBubble[] = [];
      const newPopups: FloatingPopup[] = [];
      const nowStamp = Date.now();

      result.poppedCells.forEach((cell, idx) => {
        const pt = getCellCenter(cell.row, cell.col, bubbleDiameter, snap.cameraTopRow);
        const colHex = BUBBLE_COLOR_THEMES[cell.color]?.light || '#FDE047';
        for (let i = 0; i < 3; i++) {
          const ang = (Math.PI * 2 * (i + idx * 0.4)) / 3;
          const spd = 0.7 + ((idx + i) % 3) * 0.45;
          newParticles.push({
            id: `p-${nowStamp}-${cell.row}-${cell.col}-${i}`,
            x: pt.x,
            y: pt.y,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            size: 5 + (i % 3) * 2,
            color: i === 0 ? '#FEF9C3' : colHex,
          });
        }
      });

      result.droppedCells.forEach((cell, idx) => {
        const pt = getCellCenter(cell.row, cell.col, bubbleDiameter, snap.cameraTopRow);
        newFalling.push({
          id: `fall-${nowStamp}-${cell.row}-${cell.col}`,
          x: pt.x,
          y: pt.y,
          vx: ((cell.col % 5) - 2) * 0.4,
          vy: -0.9 - (idx % 3) * 0.3,
          color: cell.color,
          kind: cell.kind,
          hasFirefly: cell.hasFirefly,
          delayMs: 0,
        });
        if (idx % 2 === 0 && newPopups.length < 4) {
          newPopups.push({
            id: `dp-${nowStamp}-${idx}`,
            x: pt.x,
            y: pt.y,
            text: '+15',
            color: '#FDE047',
          });
        }
      });

      const impactPt = getCellCenter(
        proj.targetCoord.row,
        proj.targetCoord.col,
        bubbleDiameter,
        snap.cameraTopRow
      );

      if (proj.kind === 'lightning') {
        setLightningBeamY(impactPt.y);
        setFireballBurst(null);
      } else if (proj.kind === 'fireball') {
        setFireballBurst(impactPt);
        setLightningBeamY(null);
      } else {
        setLightningBeamY(null);
        setFireballBurst(null);
      }

      if (result.calloutText) {
        newPopups.push({
          id: `call-${nowStamp}`,
          x: impactPt.x,
          y: Math.max(36, impactPt.y - 12),
          text: result.calloutText,
          subText: result.pointsEarned > 0 ? `+${result.pointsEarned}` : undefined,
          color: proj.kind === 'lightning' ? '#BAE6FD' : '#FEF08A',
          isCallout: true,
        });
      }

      // Update Streak & Combo Fever Bar
      const hadClear = result.poppedCells.length > 0;
      const nextStreak = hadClear ? snap.comboStreak + 1 : 0;
      let nextCharge = hadClear ? snap.streakCharge + 1 : snap.streakCharge;

      if (hadClear) {
        if (result.clearedByPowerUp) {
          BubbleHaptics.powerBlast();
          BubbleSound.playPowerBlast();
        } else {
          BubbleHaptics.pop(result.poppedCells.length + result.droppedCells.length);
          BubbleSound.playPopCombo(nextStreak);
        }
      }

      if (nextCharge >= 5) {
        nextCharge = 0;
        const cycle: PowerUpType[] = ['fireball', 'lightning', 'rainbow'];
        const rewardType = cycle[snap.currentLevel % cycle.length];
        persistPowerUps({
          ...snap.powerUps,
          [rewardType]: (snap.powerUps[rewardType] || 0) + 1,
        });
        newPopups.push({
          id: `bonus-${nowStamp}`,
          x: originX,
          y: Math.max(54, impactPt.y + 18),
          text: '+1 POWER ORB!',
          color: '#A7F3D0',
        });
      }

      if (newParticles.length > 0) setParticles(newParticles);
      if (newFalling.length > 0) setFallingBubbles(newFalling);
      if (newPopups.length > 0) setPopups(newPopups);

      const nextScore = snap.score + result.pointsEarned;
      const nextCamTop = updateCameraTopRow(result.nextGrid, snap.cameraTopRow);

      setGrid(result.nextGrid);
      setCameraTopRow(nextCamTop);
      setScore(nextScore);
      setComboStreak(nextStreak);
      setStreakCharge(nextCharge);

      // Sanitize remaining cannon colors
      const safeNextColor = sanitizeShotColor(result.nextGrid, snap.nextColor);
      setActiveColor(safeNextColor);
      setNextColor(pickPlayableBubbleColor(result.nextGrid));

      // 1. Check Victory
      if (checkLevelVictory(result.nextGrid, snap.levelConfig)) {
        const spareBonus = snap.shotsLeft * 150;
        const finalScore = nextScore + spareBonus;
        const stars = computeLevelStars(finalScore, snap.levelConfig.starThresholds);

        setScore(finalScore);
        if (finalScore > snap.highScore) {
          setHighScore(finalScore);
          AsyncStorage.setItem(KEY_HIGHSCORE, finalScore.toString()).catch(() => {});
        }

        const nextUnlocked = Math.max(snap.unlockedLevel, snap.currentLevel + 1);
        setUnlockedLevel(nextUnlocked);
        AsyncStorage.setItem(KEY_UNLOCKED, nextUnlocked.toString()).catch(() => {});

        const updatedStars = {
          ...snap.levelStars,
          [snap.currentLevel]: Math.max(snap.levelStars[snap.currentLevel] || 0, stars),
        };
        setLevelStars(updatedStars);
        AsyncStorage.setItem(KEY_STARS, JSON.stringify(updatedStars)).catch(() => {});

        BubbleHaptics.levelWin();
        BubbleSound.playLevelWin();
        setWinState({ visible: true, stars, bonusPoints: spareBonus });
        return;
      }

      // 2. Check Danger Overflow
      if (checkDangerLineOverflow(result.nextGrid, nextCamTop)) {
        BubbleHaptics.gameOver();
        setGameOverState({ visible: true, reason: 'overflow' });
        return;
      }

      // 3. Check Out of Shots
      if (snap.shotsLeft <= 0) {
        BubbleHaptics.gameOver();
        setGameOverState({ visible: true, reason: 'shots' });
      }
    },
    [bubbleDiameter, originX, persistPowerUps]
  );

  const handleShoot = useCallback(
    (angleRad: number) => {
      if (
        activeProjectile !== null ||
        isPaused ||
        isLocalPaused ||
        winState.visible ||
        gameOverState.visible
      ) {
        return;
      }

      const ray = computeAimTrajectory(
        grid,
        originX,
        originY,
        angleRad,
        playWidth,
        bubbleDiameter,
        cameraTopRow,
        2
      );

      if (!ray.snapCoord || ray.points.length < 2) return;

      const usingPowerUp = selectedPowerUp;
      const projKind: BubbleKind = usingPowerUp || 'normal';
      const projColor = activeColor;

      if (usingPowerUp) {
        const remainingCount = Math.max(0, (powerUps[usingPowerUp] || 0) - 1);
        persistPowerUps({ ...powerUps, [usingPowerUp]: remainingCount });
        setSelectedPowerUp(null);
      } else {
        if (shotsLeft <= 0) return;
        setShotsLeft((s) => Math.max(0, s - 1));
      }

      BubbleHaptics.shoot();
      BubbleSound.playShoot();

      const totalDistance = measurePolylineLength(ray.points);
      const proj: ActiveProjectile = {
        id: `proj-${Date.now()}`,
        color: projColor,
        kind: projKind,
        path: ray.points,
        targetCoord: ray.snapCoord,
        progressDistance: 0,
        totalDistance: Math.max(1, totalDistance),
      };

      setActiveProjectile(proj);
      setProjectilePos(ray.points[0]);

      let prevTs = 0;
      let currentDist = 0;
      const SPEED_PX_PER_SEC = 1400;

      const stepFlight = (ts: number) => {
        if (!prevTs) prevTs = ts;
        const dt = Math.min(0.05, (ts - prevTs) / 1000);
        prevTs = ts;
        currentDist += SPEED_PX_PER_SEC * dt;

        if (currentDist >= proj.totalDistance) {
          rafRef.current = null;
          setActiveProjectile(null);
          setProjectilePos(null);
          handleImpact(proj);
          return;
        }

        setProjectilePos(interpolateAlongPolyline(proj.path, currentDist));
        rafRef.current = requestAnimationFrame(stepFlight);
      };

      rafRef.current = requestAnimationFrame(stepFlight);
    },
    [
      activeProjectile,
      isPaused,
      isLocalPaused,
      winState.visible,
      gameOverState.visible,
      grid,
      originX,
      originY,
      playWidth,
      bubbleDiameter,
      cameraTopRow,
      selectedPowerUp,
      activeColor,
      powerUps,
      persistPowerUps,
      shotsLeft,
      handleImpact,
    ]
  );

  const handleSwapBubbles = () => {
    if (activeProjectile !== null || selectedPowerUp !== null) return;
    BubbleHaptics.swap();
    setActiveColor(nextColor);
    setNextColor(activeColor);
  };

  const handleTogglePowerUp = (type: PowerUpType) => {
    if (activeProjectile !== null) return;
    if (selectedPowerUp === type) {
      setSelectedPowerUp(null);
    } else if ((powerUps[type] || 0) > 0) {
      BubbleHaptics.swap();
      setSelectedPowerUp(type);
    }
  };

  const handleEffectsDone = useCallback(() => {
    setParticles([]);
    setFallingBubbles([]);
    setPopups([]);
    setLightningBeamY(null);
    setFireballBurst(null);
  }, []);

  const handleExit = () => {
    onFinish?.(score, winState.visible, {
      currentLevel,
      unlockedLevel,
    });
  };

  const starRatio = Math.min(1, score / Math.max(1, levelConfig.starThresholds[2]));
  const isRescue = levelConfig.goalType === 'rescue_fireflies';
  const activeCannonKind: BubbleKind = selectedPowerUp || 'normal';
  const isBoardBusy =
    activeProjectile !== null ||
    winState.visible ||
    gameOverState.visible ||
    isLocalPaused ||
    isPaused;

  return (
    <WoodlandBackground>
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
        {/* 1. TOP CARVED WOOD HEADER */}
        <View style={styles.topNav}>
          <Pressable
            onPress={handleExit}
            style={({ pressed }) => [styles.woodSquareBtn, pressed && styles.btnPressed]}
            hitSlop={12}
          >
            <LinearGradient
              colors={WOOD_SHOOTER_PALETTE.oakBtnGradient}
              style={styles.woodSquareInner}
            >
              <BackArrowIcon size={18} color={WOOD_SHOOTER_PALETTE.goldCtaText} />
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => setShowLevelMap(true)}
            style={({ pressed }) => [styles.levelPillBtn, pressed && styles.btnPressed]}
          >
            <TrophyWoodIcon size={16} />
            <View>
              <Text style={styles.levelTitle} numberOfLines={1}>
                LVL {currentLevel} • {levelConfig.name} ▾
              </Text>
              <Text style={styles.levelSub} numberOfLines={1}>
                {levelConfig.worldName} • Unlimited ∞
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setIsLocalPaused(true)}
            style={({ pressed }) => [styles.woodSquareBtn, pressed && styles.btnPressed]}
            hitSlop={12}
          >
            <LinearGradient
              colors={WOOD_SHOOTER_PALETTE.oakBtnGradient}
              style={styles.woodSquareInner}
            >
              <GearSettingsIcon size={20} />
            </LinearGradient>
          </Pressable>
        </View>

        {/* 2. SCORE STAR GAUGE + GOAL PROGRESS BAR */}
        <LinearGradient colors={WOOD_SHOOTER_PALETTE.hudGradient} style={styles.hudStrip}>
          <View style={styles.hudLeft}>
            <View style={styles.scoreTop}>
              <CrownScoreIcon size={13} />
              <Text style={styles.scoreVal}>{score.toLocaleString()}</Text>
            </View>
            <View style={styles.starGaugeWrap}>
              <View style={styles.starGaugeTrack}>
                <View style={[styles.starGaugeFill, { width: `${Math.round(starRatio * 100)}%` }]} />
              </View>
              <View style={styles.starMilestones}>
                {levelConfig.starThresholds.map((th, idx) => (
                  <StarGoldIcon key={idx} size={11} filled={score >= th} />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.goalPill}>
            {isRescue ? <FireflyBadgeIcon size={16} /> : <TargetGoalIcon size={15} />}
            <View>
              <Text style={styles.goalLabel}>{isRescue ? 'RESCUE' : 'CLEAR'}</Text>
              <Text style={styles.goalVal}>
                {isRescue
                  ? `${rescuedFireflies}/${initialFireflyTotal}`
                  : `${currentStats.normalCount} LEFT`}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* 3. INTERACTIVE WOODEN HEX SHOOTER BOARD */}
        <View style={styles.boardCenter}>
          <BubbleBoard
            grid={grid}
            boardWidth={boardWidth}
            boardHeight={boardHeight}
            bubbleDiameter={bubbleDiameter}
            cameraTopRow={cameraTopRow}
            aimRay={aimRay}
            activeProjectile={activeProjectile}
            projectilePos={projectilePos}
            particles={particles}
            fallingBubbles={fallingBubbles}
            popups={popups}
            lightningBeamY={lightningBeamY}
            fireballBurst={fireballBurst}
            isBusy={isBoardBusy}
            onAimChange={setAimAngle}
            onShoot={handleShoot}
            onEffectsDone={handleEffectsDone}
          />
        </View>

        {/* 4. BOTTOM WOODEN SHOOTER CANNON & BOOSTERS */}
        <ShooterCannon
          activeColor={activeColor}
          activeKind={activeCannonKind}
          nextColor={nextColor}
          shotsLeft={shotsLeft}
          powerUps={powerUps}
          selectedPowerUp={selectedPowerUp}
          streakCharge={streakCharge}
          isBusy={isBoardBusy}
          onSwapBubbles={handleSwapBubbles}
          onTogglePowerUp={handleTogglePowerUp}
        />

        {/* 5. WORLD MAP, WIN, LOSS & PAUSE MODALS */}
        <WoodlandLevelMapModal
          visible={showLevelMap}
          currentLevel={currentLevel}
          unlockedLevel={unlockedLevel}
          levelStars={levelStars}
          onSelectLevel={loadLevel}
          onClose={() => setShowLevelMap(false)}
        />

        <WoodlandLevelCompleteModal
          visible={winState.visible}
          level={currentLevel}
          levelName={levelConfig.name}
          score={score}
          bonusPoints={winState.bonusPoints}
          stars={winState.stars}
          onNextLevel={() => loadLevel(currentLevel + 1)}
          onReplay={() => loadLevel(currentLevel)}
          onOpenMap={() => {
            setWinState((w) => ({ ...w, visible: false }));
            setShowLevelMap(true);
          }}
        />

        <WoodlandGameOverModal
          visible={gameOverState.visible}
          reason={gameOverState.reason}
          level={currentLevel}
          score={score}
          highScore={highScore}
          onRetry={() => loadLevel(currentLevel)}
          onOpenMap={() => {
            setGameOverState((g) => ({ ...g, visible: false }));
            setShowLevelMap(true);
          }}
          onExit={handleExit}
        />

        <WoodlandPauseModal
          visible={isLocalPaused}
          level={currentLevel}
          levelName={levelConfig.name}
          soundEnabled={soundEnabled}
          hapticsEnabled={hapticsEnabled}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            BubbleSound.setEnabled(next);
          }}
          onToggleHaptics={() => {
            const next = !hapticsEnabled;
            setHapticsEnabled(next);
            BubbleHaptics.setEnabled(next);
          }}
          onResume={() => setIsLocalPaused(false)}
          onRestart={() => loadLevel(currentLevel)}
          onOpenMap={() => {
            setIsLocalPaused(false);
            setShowLevelMap(true);
          }}
          onQuit={handleExit}
        />
      </View>
    </WoodlandBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 44,
  },
  woodSquareBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: WOOD_SHOOTER_PALETTE.oakBtnBorder,
    overflow: 'hidden',
  },
  woodSquareInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1.5,
    borderTopColor: WOOD_SHOOTER_PALETTE.oakBtnHighlight,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },
  levelPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: WOOD_SHOOTER_PALETTE.pillDarkBorder,
    paddingHorizontal: 12,
    paddingVertical: 5,
    maxWidth: SCREEN_WIDTH - 108,
  },
  levelTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textLight,
  },
  levelSub: {
    fontSize: 9,
    fontWeight: '800',
    color: WOOD_SHOOTER_PALETTE.textGold,
  },
  hudStrip: {
    width: '100%',
    height: 50,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: WOOD_SHOOTER_PALETTE.hudBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  hudLeft: {
    flex: 1,
    gap: 3,
    paddingRight: 12,
  },
  scoreTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  scoreVal: {
    fontSize: 15,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textLight,
  },
  starGaugeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starGaugeTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    borderWidth: 0.8,
    borderColor: WOOD_SHOOTER_PALETTE.pillDarkBorder,
    overflow: 'hidden',
  },
  starGaugeFill: {
    height: '100%',
    backgroundColor: '#FACC15',
    borderRadius: 3,
  },
  starMilestones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: WOOD_SHOOTER_PALETTE.pillDarkBg,
    borderRadius: 11,
    borderWidth: 1.4,
    borderColor: WOOD_SHOOTER_PALETTE.pillDarkBorder,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  goalLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textGold,
    letterSpacing: 0.8,
  },
  goalVal: {
    fontSize: 12.5,
    fontWeight: '900',
    color: WOOD_SHOOTER_PALETTE.textLight,
  },
  boardCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
