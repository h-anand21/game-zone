// ============================================================
// Worms Zone 3D Arena — Main Game Coordinator (Replaces Snake)
// Full-screen 60fps 3D Arena with floating 360° Joystick, Sprint Boost,
// 18 AI Rival Worms, Glowing Feast Drops, Chests, Skins & Boosters.
// ============================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  PanResponder,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createArenaState,
  stepArenaTick,
  computeCameraZoom,
  computeArenaLeaderboard,
} from './logic';
import { BOOSTER_PRICES, WORM_SKINS } from './skins';
import { WormHaptics } from './haptics';
import { WormSound } from './sound';
import { ArenaSvgView } from './components/ArenaSvgView';
import { ArenaHud } from './components/ArenaHud';
import {
  WormHubModal,
  WormGameOverModal,
  WormPauseModal,
} from './components/WormsModals';
import type {
  ArenaMode,
  ArenaState,
  BoosterType,
  PersistentWormSave,
  Vec2,
  WormSkinId,
} from './types';
import type { GameEngine } from '../../engine/GameEngine';

const STORAGE_KEY_SAVE = '@worms_zone_3d_save_v1';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DEFAULT_SAVE: PersistentWormSave = {
  coins: 120,
  bestWeight: 0,
  bestKills: 0,
  selectedSkin: 'violet',
  unlockedSkins: ['violet'],
  boosterInventory: {
    magnet: 2,
    turbo: 2,
    scope: 2,
  },
};

interface SnakeProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const SnakeGame: React.FC<SnakeProps> = ({
  onFinish,
  isPaused = false,
}) => {
  const [saveData, setSaveData] = useState<PersistentWormSave>(DEFAULT_SAVE);
  const [mode, setMode] = useState<ArenaMode>('infinity');
  const [showHub, setShowHub] = useState<boolean>(true);
  const [isLocalPaused, setIsLocalPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);

  const [arenaState, setArenaState] = useState<ArenaState>(() =>
    createArenaState('infinity', 'violet', 'You')
  );

  // Floating Joystick & Sprint State
  const [joyOrigin, setJoyOrigin] = useState<Vec2 | null>(null);
  const [joyKnob, setJoyKnob] = useState<Vec2 | null>(null);
  const [isSprintHeld, setIsSprintHeld] = useState<boolean>(false);

  // Mutable simulation refs accessed ONLY inside effects & event callbacks
  const simRef = useRef<ArenaState>(arenaState);
  const coinsCommittedRef = useRef<number>(0);
  const saveRef = useRef<PersistentWormSave>(saveData);

  useEffect(() => {
    saveRef.current = saveData;
  }, [saveData]);

  // Load Persistent Save on Mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY_SAVE)
      .then((raw) => {
        if (!raw) return;
        const parsed = JSON.parse(raw) as Partial<PersistentWormSave>;
        setSaveData({
          coins: typeof parsed.coins === 'number' ? parsed.coins : DEFAULT_SAVE.coins,
          bestWeight: typeof parsed.bestWeight === 'number' ? parsed.bestWeight : 0,
          bestKills: typeof parsed.bestKills === 'number' ? parsed.bestKills : 0,
          selectedSkin: parsed.selectedSkin || 'violet',
          unlockedSkins:
            Array.isArray(parsed.unlockedSkins) && parsed.unlockedSkins.length > 0
              ? parsed.unlockedSkins
              : ['violet'],
          boosterInventory: parsed.boosterInventory || DEFAULT_SAVE.boosterInventory,
        });
      })
      .catch(() => {});
  }, []);

  const persistSave = useCallback((next: PersistentWormSave) => {
    setSaveData(next);
    saveRef.current = next;
    AsyncStorage.setItem(STORAGE_KEY_SAVE, JSON.stringify(next)).catch(() => {});
  }, []);

  const startNewArenaRun = useCallback(
    (chosenMode: ArenaMode, chosenSkin: WormSkinId) => {
      const fresh = createArenaState(chosenMode, chosenSkin, 'You');
      simRef.current = fresh;
      coinsCommittedRef.current = 0;
      setArenaState(fresh);
      setIsSprintHeld(false);
      setJoyOrigin(null);
      setJoyKnob(null);
      setIsLocalPaused(false);
      setShowHub(false);
    },
    []
  );

  // 60fps Arena Simulation Loop (paused cleanly when modal/hub is open)
  const isLoopActive =
    !showHub && !isPaused && !isLocalPaused && !arenaState.gameOver;

  useEffect(() => {
    if (!isLoopActive) return;

    let rafId = 0;
    let lastTs = 0;

    const frame = (ts: number) => {
      if (!lastTs) lastTs = ts;
      const dtMs = Math.min(48, Math.max(8, ts - lastTs));
      lastTs = ts;

      const stepRes = stepArenaTick(simRef.current, dtMs);
      simRef.current = stepRes.nextState;
      setArenaState(stepRes.nextState);

      // Persist newly earned coins & record milestones dynamically
      const totalEarned = stepRes.nextState.coinsCollectedThisRun;
      if (totalEarned > coinsCommittedRef.current) {
        const delta = totalEarned - coinsCommittedRef.current;
        coinsCommittedRef.current = totalEarned;
        const curSave = saveRef.current;
        persistSave({
          ...curSave,
          coins: curSave.coins + delta,
        });
      }

      if (stepRes.playerAteLoot) {
        WormHaptics.eat(true);
        WormSound.playEat();
      } else if (stepRes.playerAteFood) {
        WormHaptics.eat(false);
      }

      if (stepRes.playerEliminatedBot) {
        WormHaptics.killBot();
        WormSound.playKill();
      }

      if (stepRes.chestUnlocked) {
        WormHaptics.chestUnlock();
        WormSound.playChestReward();
      }

      if (stepRes.nextState.gameOver) {
        WormHaptics.gameOver();
        const finalW = Math.round(stepRes.nextState.player.weight);
        const curSave = saveRef.current;
        if (finalW > curSave.bestWeight || stepRes.nextState.player.kills > curSave.bestKills) {
          persistSave({
            ...curSave,
            bestWeight: Math.max(curSave.bestWeight, finalW),
            bestKills: Math.max(curSave.bestKills, stepRes.nextState.player.kills),
          });
        }
        return;
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [isLoopActive, persistSave]);

  // Floating 360° Analog Joystick Responder (mounted via useEffect for clean hook rules)
  const joyOriginRef = useRef<Vec2 | null>(null);
  const [panHandlers, setPanHandlers] = useState<
    ReturnType<typeof PanResponder.create>['panHandlers']
  >({});

  useEffect(() => {
    const MAX_RADIUS = 42;

    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const origin = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY,
        };
        joyOriginRef.current = origin;
        setJoyOrigin(origin);
        setJoyKnob(origin);
      },
      onPanResponderMove: (evt) => {
        const origin = joyOriginRef.current;
        if (!origin) return;
        const dx = evt.nativeEvent.pageX - origin.x;
        const dy = evt.nativeEvent.pageY - origin.y;
        const dist = Math.hypot(dx, dy);

        if (dist >= 6) {
          const angle = Math.atan2(dy, dx);
          simRef.current.player.targetAngle = angle;

          const clampedDist = Math.min(MAX_RADIUS, dist);
          setJoyKnob({
            x: origin.x + Math.cos(angle) * clampedDist,
            y: origin.y + Math.sin(angle) * clampedDist,
          });
        }
      },
      onPanResponderRelease: () => {
        joyOriginRef.current = null;
        setJoyOrigin(null);
        setJoyKnob(null);
      },
      onPanResponderTerminate: () => {
        joyOriginRef.current = null;
        setJoyOrigin(null);
        setJoyKnob(null);
      },
    });

    setPanHandlers(responder.panHandlers);
  }, []);

  const handleBoostStart = useCallback(() => {
    setIsSprintHeld(true);
    simRef.current.player.isBoosting = true;
  }, []);

  const handleBoostEnd = useCallback(() => {
    setIsSprintHeld(false);
    simRef.current.player.isBoosting = false;
  }, []);

  const handleActivateBooster = useCallback(
    (type: BoosterType) => {
      const curSave = saveRef.current;
      const available = curSave.boosterInventory[type] || 0;
      if (available <= 0) return;

      const durations: Record<BoosterType, keyof ArenaState['boosters']> = {
        magnet: 'magnetMs',
        turbo: 'turboMs',
        scope: 'scopeMs',
      };
      const msMap: Record<BoosterType, number> = {
        magnet: 12000,
        turbo: 10000,
        scope: 15000,
      };

      const propKey = durations[type];
      if (simRef.current.boosters[propKey] > 0) return;

      simRef.current.boosters[propKey] = msMap[type];
      WormHaptics.boosterActivated();
      WormSound.playBooster();

      persistSave({
        ...curSave,
        boosterInventory: {
          ...curSave.boosterInventory,
          [type]: available - 1,
        },
      });
    },
    [persistSave]
  );

  const handleSelectOrUnlockSkin = useCallback(
    (skinId: WormSkinId) => {
      const curSave = saveRef.current;
      if (curSave.unlockedSkins.includes(skinId)) {
        persistSave({ ...curSave, selectedSkin: skinId });
        return;
      }
      const price = WORM_SKINS[skinId].cost;
      if (curSave.coins >= price) {
        persistSave({
          ...curSave,
          coins: curSave.coins - price,
          unlockedSkins: [...curSave.unlockedSkins, skinId],
          selectedSkin: skinId,
        });
        WormHaptics.chestUnlock();
      }
    },
    [persistSave]
  );

  const handleBuyBooster = useCallback(
    (type: BoosterType) => {
      const curSave = saveRef.current;
      const price = BOOSTER_PRICES[type];
      if (curSave.coins < price) return;
      persistSave({
        ...curSave,
        coins: curSave.coins - price,
        boosterInventory: {
          ...curSave.boosterInventory,
          [type]: (curSave.boosterInventory[type] || 0) + 1,
        },
      });
      WormHaptics.boosterActivated();
    },
    [persistSave]
  );

  const handleExit = () => {
    onFinish?.(Math.round(arenaState.player.weight), arenaState.player.weight >= 500, {
      bestWeight: saveData.bestWeight,
      kills: arenaState.player.kills,
      coinsCollected: arenaState.coinsCollectedThisRun,
    });
  };

  const cameraZoom = computeCameraZoom(
    arenaState.player.weight,
    arenaState.boosters.scopeMs > 0
  );

  const leaderboard = useMemo(() => computeArenaLeaderboard(arenaState, 8), [arenaState]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Full-Screen Touch Steering Layer + 3D SVG Arena */}
      <View style={StyleSheet.absoluteFill} {...panHandlers}>
        <ArenaSvgView
          state={arenaState}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          cameraZoom={cameraZoom}
        />
      </View>

      {/* Live Arena HUD Overlay (Leaderboard, Chest Goal, Coins, Minimap, Boosters, Joystick) */}
      {!showHub && (
        <ArenaHud
          state={arenaState}
          totalCoins={saveData.coins}
          totalArenaCount={leaderboard.totalArenaCount}
          topEntries={leaderboard.topEntries}
          playerEntry={leaderboard.playerEntry}
          boosterInventory={saveData.boosterInventory}
          joyOrigin={joyOrigin}
          joyKnob={joyKnob}
          isBoostingPressed={isSprintHeld}
          onActivateBooster={handleActivateBooster}
          onBoostStart={handleBoostStart}
          onBoostEnd={handleBoostEnd}
          onPausePress={() => setIsLocalPaused(true)}
        />
      )}

      {/* Pre-Match Skin Wardrobe, Mode Selector & Booster Shop */}
      <WormHubModal
        visible={showHub}
        mode={mode}
        coins={saveData.coins}
        bestWeight={saveData.bestWeight}
        selectedSkin={saveData.selectedSkin}
        unlockedSkins={saveData.unlockedSkins}
        boosterInventory={saveData.boosterInventory}
        onSelectMode={setMode}
        onSelectOrUnlockSkin={handleSelectOrUnlockSkin}
        onBuyBooster={handleBuyBooster}
        onPlay={() => startNewArenaRun(mode, saveData.selectedSkin)}
        onExit={handleExit}
      />

      {/* Game Over / Match Summary */}
      <WormGameOverModal
        visible={arenaState.gameOver}
        reason={arenaState.deathReason}
        killedByName={arenaState.killedByName}
        finalWeight={arenaState.player.weight}
        bestWeight={saveData.bestWeight}
        kills={arenaState.player.kills}
        coinsEarned={arenaState.coinsCollectedThisRun}
        chestsOpened={arenaState.chestsOpenedThisRun}
        onPlayAgain={() => startNewArenaRun(mode, saveData.selectedSkin)}
        onOpenWardrobe={() => {
          simRef.current = createArenaState(mode, saveData.selectedSkin, 'You');
          setArenaState(simRef.current);
          setShowHub(true);
        }}
        onExit={handleExit}
      />

      {/* Pause & Settings */}
      <WormPauseModal
        visible={isLocalPaused}
        soundEnabled={soundEnabled}
        hapticsEnabled={hapticsEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          WormSound.setEnabled(next);
        }}
        onToggleHaptics={() => {
          const next = !hapticsEnabled;
          setHapticsEnabled(next);
          WormHaptics.setEnabled(next);
        }}
        onResume={() => setIsLocalPaused(false)}
        onRestart={() => startNewArenaRun(mode, saveData.selectedSkin)}
        onOpenWardrobe={() => {
          setIsLocalPaused(false);
          setShowHub(true);
        }}
        onExit={handleExit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0E3668',
  },
});
