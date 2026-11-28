// ============================================================
// Worms Zone 3D Arena — Pure 360° Physics, AI & Loot Engine
// Handles free-angle steering, arc-length spine trailing,
// head-vs-enemy collision (self-overlap safe), glowing feast drops,
// magnet attraction, turbo x2 multiplier & weight chest milestones.
// ============================================================

import {
  ALL_SKIN_IDS,
  LOOT_FEAST_POOL,
  NATURAL_FOOD_POOL,
  getWeightGoalForTier,
} from './skins';
import type {
  ArenaMode,
  ArenaState,
  FoodItem,
  LeaderboardEntry,
  Vec2,
  WormEntity,
  WormSkinId,
} from './types';

export const DEFAULT_ARENA_RADIUS = 1550;
export const TARGET_FOOD_COUNT = 240;
export const TARGET_BOT_COUNT = 18;
export const TIME_RUSH_DURATION_MS = 150000; // 2:30

const BOT_NAMES = [
  'MegaSnake',
  'ShadowFang',
  'Alexander',
  'Guest_7821',
  'HoneyKing',
  'CyberViper',
  'ShyMammoth',
  'DragonCoil',
  'Joe O’Ryan',
  'PerplexX',
  'NeonByte',
  'PixelWorm',
  'StealthFox',
  'TurboBite',
  'GoldRush',
  'SlitherPro',
  'Vortex99',
  'IronJaw',
  'WildSpike',
  'CometTail',
  'AquaDrake',
  'AppleMunch',
];

let idSeq = 1;
const nextId = (prefix: string) => `${prefix}-${idSeq++}`;

/**
 * Shortest signed angular difference wrapped cleanly into [-PI, PI]
 */
export function normalizeAngle(a: number): number {
  let angle = a % (Math.PI * 2);
  if (angle > Math.PI) angle -= Math.PI * 2;
  if (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

/**
 * Smoothly rotates angle toward targetAngle bounded by maxDeltaRad
 */
export function steerAngleToward(
  current: number,
  target: number,
  maxDeltaRad: number
): number {
  const diff = normalizeAngle(target - current);
  if (Math.abs(diff) <= maxDeltaRad) return normalizeAngle(target);
  return normalizeAngle(current + Math.sign(diff) * maxDeltaRad);
}

/**
 * Computes worm thickness radius cleanly from current weight
 */
export function computeWormRadius(weight: number): number {
  return Math.min(36, 13.5 + Math.pow(Math.max(10, weight), 0.27) * 1.35);
}

/**
 * Computes desired spine segment count capped nicely for smooth 60fps rendering
 */
export function computeSegmentCount(weight: number): number {
  return Math.min(140, Math.max(12, Math.floor(10 + Math.pow(Math.max(10, weight), 0.42) * 1.4)));
}

/**
 * Computes smooth follow-camera zoom scale factoring worm size + Scope booster
 */
export function computeCameraZoom(weight: number, scopeActive: boolean): number {
  const sizeZoom = Math.max(0.68, 1.04 - Math.pow(Math.max(10, weight), 0.22) * 0.042);
  return scopeActive ? sizeZoom * 0.72 : sizeZoom;
}

/**
 * Creates straight initial spine segments trailing backward along initialAngle
 */
export function createSpineSegments(
  headPos: Vec2,
  initialAngle: number,
  count: number,
  spacing: number
): Vec2[] {
  const segments: Vec2[] = [];
  const backDx = -Math.cos(initialAngle);
  const backDy = -Math.sin(initialAngle);
  for (let i = 0; i < count; i++) {
    segments.push({
      x: headPos.x + backDx * i * spacing,
      y: headPos.y + backDy * i * spacing,
    });
  }
  return segments;
}

/**
 * Picks a random coordinate strictly inside circular arena margin
 */
function randomArenaPoint(
  arenaRadius: number,
  margin = 140,
  rng: () => number = Math.random
): Vec2 {
  const maxR = Math.max(80, arenaRadius - margin);
  const r = Math.sqrt(rng()) * maxR;
  const theta = rng() * Math.PI * 2;
  return { x: Math.cos(theta) * r, y: Math.sin(theta) * r };
}

/**
 * Creates a natural food item or bonus gold coin cleanly inside arena
 */
export function spawnRandomFood(
  arenaRadius: number,
  mode: ArenaMode,
  rng: () => number = Math.random
): FoodItem {
  const pt = randomArenaPoint(arenaRadius, 90, rng);
  const coinChance = mode === 'treasure' ? 0.14 : 0.045;

  if (rng() < coinChance) {
    return {
      id: nextId('coin'),
      x: pt.x,
      y: pt.y,
      kind: 'coin',
      weightValue: mode === 'treasure' ? 140 : 100,
      coinValue: mode === 'treasure' ? 3 : 1,
      scale: 1.15,
      isLootDrop: false,
    };
  }

  const meta =
    NATURAL_FOOD_POOL[Math.floor(rng() * NATURAL_FOOD_POOL.length) % NATURAL_FOOD_POOL.length];
  return {
    id: nextId('food'),
    x: pt.x,
    y: pt.y,
    kind: meta.kind,
    weightValue: meta.weightValue,
    coinValue: meta.coinValue,
    scale: meta.scale,
    isLootDrop: false,
  };
}

/**
 * Creates a live AI contender safely separated from center/avoidPoint
 */
export function spawnAiWorm(
  botIndex: number,
  arenaRadius: number,
  avoidPoint: Vec2,
  rng: () => number = Math.random
): WormEntity {
  let spawnPt = randomArenaPoint(arenaRadius, 240, rng);
  for (let attempt = 0; attempt < 6; attempt++) {
    if (Math.hypot(spawnPt.x - avoidPoint.x, spawnPt.y - avoidPoint.y) >= 340) break;
    spawnPt = randomArenaPoint(arenaRadius, 240, rng);
  }

  const angle = rng() * Math.PI * 2 - Math.PI;
  const weight = 25 + Math.floor(Math.pow(rng(), 2) * 1400);
  const radius = computeWormRadius(weight);
  const segCount = computeSegmentCount(weight);
  const skinId = ALL_SKIN_IDS[(botIndex + 1) % ALL_SKIN_IDS.length];

  return {
    id: nextId('bot'),
    name: BOT_NAMES[botIndex % BOT_NAMES.length],
    isPlayer: false,
    skinId,
    segments: createSpineSegments(spawnPt, angle, segCount, radius * 0.56),
    angle,
    targetAngle: angle,
    weight,
    radius,
    isBoosting: false,
    isEatingUntil: 0,
    kills: 0,
    alive: true,
    aiTurnCooldown: 0,
    aiDesiredAngle: angle,
  };
}

/**
 * Initializes full Worms Zone 3D Arena simulation state
 */
export function createArenaState(
  mode: ArenaMode = 'infinity',
  playerSkin: WormSkinId = 'violet',
  playerName = 'You',
  rng: () => number = Math.random
): ArenaState {
  const arenaRadius = DEFAULT_ARENA_RADIUS;
  const startWeight = 18;
  const startRadius = computeWormRadius(startWeight);
  const startAngle = -Math.PI / 4;

  const player: WormEntity = {
    id: 'player',
    name: playerName,
    isPlayer: true,
    skinId: playerSkin,
    segments: createSpineSegments(
      { x: 0, y: 0 },
      startAngle,
      computeSegmentCount(startWeight),
      startRadius * 0.56
    ),
    angle: startAngle,
    targetAngle: startAngle,
    weight: startWeight,
    radius: startRadius,
    isBoosting: false,
    isEatingUntil: 0,
    kills: 0,
    alive: true,
    aiTurnCooldown: 0,
    aiDesiredAngle: startAngle,
  };

  const bots: WormEntity[] = [];
  for (let i = 0; i < TARGET_BOT_COUNT; i++) {
    bots.push(spawnAiWorm(i, arenaRadius, { x: 0, y: 0 }, rng));
  }

  const foods: FoodItem[] = [];
  for (let i = 0; i < TARGET_FOOD_COUNT; i++) {
    foods.push(spawnRandomFood(arenaRadius, mode, rng));
  }

  const ambientRivals = Array.from({ length: 102 }, (_, idx) => {
    const tierScale = idx < 10 ? 120000 - idx * 9500 : Math.max(40, 8500 - idx * 75);
    return {
      id: `amb-${idx}`,
      name: `${BOT_NAMES[idx % BOT_NAMES.length]}_${100 + idx}`,
      baseWeight: Math.max(30, Math.round(tierScale * (0.85 + rng() * 0.35))),
      growthRate: idx < 15 ? 3.2 : 0.4,
    };
  });

  return {
    mode,
    arenaRadius,
    elapsedMs: 0,
    timeRemainingMs: mode === 'time_rush' ? TIME_RUSH_DURATION_MS : 0,
    player,
    bots,
    foods,
    popups: [],
    boosters: {
      magnetMs: 0,
      turboMs: 0,
      scopeMs: 0,
    },
    coinsCollectedThisRun: 0,
    currentGoalWeight: getWeightGoalForTier(0),
    goalTierIndex: 0,
    chestsOpenedThisRun: 0,
    ambientRivals,
    gameOver: false,
    deathReason: null,
  };
}

/**
 * Advances worm spine smoothly preserving constant arc-length segment spacing
 */
export function advanceWormSpine(
  worm: WormEntity,
  dtSec: number,
  speedPxPerSec: number,
  turnRateRadPerSec = 5.4
): void {
  if (!worm.alive || worm.segments.length === 0) return;

  worm.angle = steerAngleToward(worm.angle, worm.targetAngle, turnRateRadPerSec * dtSec);

  const head = worm.segments[0];
  const nextHead: Vec2 = {
    x: head.x + Math.cos(worm.angle) * speedPxPerSec * dtSec,
    y: head.y + Math.sin(worm.angle) * speedPxPerSec * dtSec,
  };

  worm.radius = computeWormRadius(worm.weight);
  const desiredCount = computeSegmentCount(worm.weight);
  const spacing = worm.radius * 0.56;

  worm.segments[0] = nextHead;
  for (let i = 1; i < worm.segments.length; i++) {
    const prev = worm.segments[i - 1];
    const curr = worm.segments[i];
    const dx = prev.x - curr.x;
    const dy = prev.y - curr.y;
    const dist = Math.hypot(dx, dy);
    if (dist > spacing && dist > 0.0001) {
      const pull = (dist - spacing) / dist;
      curr.x += dx * pull;
      curr.y += dy * pull;
    }
  }

  while (worm.segments.length < desiredCount) {
    const tail = worm.segments[worm.segments.length - 1];
    worm.segments.push({ x: tail.x, y: tail.y });
  }
  while (worm.segments.length > desiredCount && worm.segments.length > 10) {
    worm.segments.pop();
  }
}

/**
 * Converts a defeated worm into a high-value sparkling gourmet loot feast & Gold Coins
 */
export function convertWormToLoot(
  victim: WormEntity,
  mode: ArenaMode,
  rng: () => number = Math.random
): FoodItem[] {
  const drops: FoodItem[] = [];
  const step = Math.max(1, Math.floor(victim.segments.length / 26));
  const coinDropChance = mode === 'treasure' ? 0.28 : 0.14;

  for (let i = 0; i < victim.segments.length; i += step) {
    const seg = victim.segments[i];
    const jitterAngle = rng() * Math.PI * 2;
    const jitterR = rng() * victim.radius * 0.75;
    const fx = seg.x + Math.cos(jitterAngle) * jitterR;
    const fy = seg.y + Math.sin(jitterAngle) * jitterR;

    if (rng() < coinDropChance) {
      drops.push({
        id: nextId('lootcoin'),
        x: fx,
        y: fy,
        kind: 'coin',
        weightValue: 180,
        coinValue: mode === 'treasure' ? 5 : 3,
        scale: 1.25,
        isLootDrop: true,
      });
    } else {
      const meta =
        LOOT_FEAST_POOL[Math.floor(rng() * LOOT_FEAST_POOL.length) % LOOT_FEAST_POOL.length];
      drops.push({
        id: nextId('loot'),
        x: fx,
        y: fy,
        kind: meta.kind,
        weightValue: meta.weightValue + Math.min(80, Math.floor(victim.weight * 0.02)),
        coinValue: 0,
        scale: meta.scale,
        isLootDrop: true,
      });
    }
  }

  return drops;
}

/**
 * Checks whether head of wormA crashes into any segment of wormB
 */
export function checkHeadHitsWormBody(wormA: WormEntity, wormB: WormEntity): boolean {
  if (!wormA.alive || !wormB.alive || wormA.id === wormB.id) return false;
  const head = wormA.segments[0];
  if (!head) return false;

  const hitThreshold = wormA.radius * 0.68 + wormB.radius * 0.74;
  const hitThresholdSq = hitThreshold * hitThreshold;

  for (let i = 0; i < wormB.segments.length; i++) {
    const seg = wormB.segments[i];
    const dx = head.x - seg.x;
    const dy = head.y - seg.y;
    if (dx * dx + dy * dy <= hitThresholdSq) {
      return true;
    }
  }
  return false;
}

/**
 * Computes steering direction for an AI contender: dodges walls & bodies while seeking feasts
 */
export function updateBotSteering(
  bot: WormEntity,
  allWorms: WormEntity[],
  foods: FoodItem[],
  arenaRadius: number,
  dtMs: number,
  rng: () => number = Math.random
): void {
  if (!bot.alive || bot.segments.length === 0) return;
  const head = bot.segments[0];

  // 1. High-priority outer boundary avoidance
  const distCenter = Math.hypot(head.x, head.y);
  if (distCenter > arenaRadius - 210) {
    bot.targetAngle = Math.atan2(-head.y, -head.x);
    bot.isBoosting = false;
    return;
  }

  // 2. Forward probe check against other worms' bodies
  const lookAheadDist = 140 + bot.radius * 2;
  const probeX = head.x + Math.cos(bot.angle) * lookAheadDist;
  const probeY = head.y + Math.sin(bot.angle) * lookAheadDist;

  for (const other of allWorms) {
    if (!other.alive || other.id === bot.id) continue;
    for (let i = 0; i < other.segments.length; i += 2) {
      const seg = other.segments[i];
      const d = Math.hypot(probeX - seg.x, probeY - seg.y);
      if (d < other.radius + bot.radius + 70) {
        const awayAngle = Math.atan2(head.y - seg.y, head.x - seg.x);
        bot.targetAngle = awayAngle + (rng() > 0.5 ? 0.35 : -0.35);
        bot.isBoosting = distCenter < arenaRadius - 300 && rng() < 0.25;
        return;
      }
    }
  }

  // 3. Periodically pick best nearby fallen feast or food cluster
  bot.aiTurnCooldown -= dtMs;
  if (bot.aiTurnCooldown <= 0) {
    bot.aiTurnCooldown = 260 + rng() * 340;
    let bestFood: FoodItem | null = null;
    let bestScore = -1;

    for (let i = 0; i < foods.length; i += 2) {
      const f = foods[i];
      const d = Math.hypot(f.x - head.x, f.y - head.y);
      if (d > 420) continue;
      const priority = (f.isLootDrop ? 3.2 : 1) * f.weightValue / Math.max(40, d);
      if (priority > bestScore) {
        bestScore = priority;
        bestFood = f;
      }
    }

    if (bestFood) {
      bot.aiDesiredAngle = Math.atan2(bestFood.y - head.y, bestFood.x - head.x);
      bot.isBoosting = bestFood.isLootDrop && bot.weight > 45 && rng() < 0.45;
    } else {
      bot.aiDesiredAngle = normalizeAngle(bot.angle + (rng() - 0.5) * 1.1);
      bot.isBoosting = false;
    }
  }

  bot.targetAngle = bot.aiDesiredAngle;
}

/**
 * Advances the entire 3D Worms Arena simulation by dtMs
 */
export function stepArenaTick(
  prev: ArenaState,
  dtMs: number,
  rng: () => number = Math.random
): {
  nextState: ArenaState;
  playerAteFood: boolean;
  playerAteLoot: boolean;
  playerEliminatedBot: boolean;
  chestUnlocked: boolean;
} {
  if (prev.gameOver) {
    return {
      nextState: prev,
      playerAteFood: false,
      playerAteLoot: false,
      playerEliminatedBot: false,
      chestUnlocked: false,
    };
  }

  const dtSec = Math.min(0.05, dtMs / 1000);
  const nextState: ArenaState = {
    ...prev,
    elapsedMs: prev.elapsedMs + dtMs,
    timeRemainingMs:
      prev.mode === 'time_rush' ? Math.max(0, prev.timeRemainingMs - dtMs) : prev.timeRemainingMs,
    player: { ...prev.player, segments: prev.player.segments.map((s) => ({ ...s })) },
    bots: prev.bots.map((b) => ({ ...b, segments: b.segments.map((s) => ({ ...s })) })),
    foods: [...prev.foods],
    popups: prev.popups
      .map((p) => ({ ...p, ageMs: p.ageMs + dtMs }))
      .filter((p) => p.ageMs < 750),
    boosters: {
      magnetMs: Math.max(0, prev.boosters.magnetMs - dtMs),
      turboMs: Math.max(0, prev.boosters.turboMs - dtMs),
      scopeMs: Math.max(0, prev.boosters.scopeMs - dtMs),
    },
  };

  if (nextState.mode === 'time_rush' && nextState.timeRemainingMs <= 0) {
    nextState.gameOver = true;
    nextState.deathReason = 'time_up';
    return {
      nextState,
      playerAteFood: false,
      playerAteLoot: false,
      playerEliminatedBot: false,
      chestUnlocked: false,
    };
  }

  let playerAteFood = false;
  let playerAteLoot = false;
  let playerEliminatedBot = false;
  let chestUnlocked = false;

  const allWorms = [nextState.player, ...nextState.bots];

  // 1. Steer Bots & Advance All Worms
  for (const bot of nextState.bots) {
    updateBotSteering(bot, allWorms, nextState.foods, nextState.arenaRadius, dtMs, rng);
  }

  for (const worm of allWorms) {
    if (!worm.alive) continue;
    const turboActive = worm.isPlayer && nextState.boosters.turboMs > 0;
    const boostingNow = (worm.isBoosting && worm.weight > 24) || turboActive;
    const speed = boostingNow ? 325 : 182;

    advanceWormSpine(worm, dtSec, speed);

    // Normal sprint burns small amount of weight and sheds tiny trail food behind tail
    if (worm.isBoosting && !turboActive && worm.weight > 24) {
      const drain = 10 * dtSec;
      worm.weight = Math.max(20, worm.weight - drain);
      if (rng() < 0.08 && worm.segments.length > 0) {
        const tail = worm.segments[worm.segments.length - 1];
        nextState.foods.push({
          id: nextId('drop'),
          x: tail.x,
          y: tail.y,
          kind: 'cherry',
          weightValue: 6,
          coinValue: 0,
          scale: 0.72,
          isLootDrop: false,
        });
      }
    }
  }

  // 2. Magnet Attraction around Player Head
  const playerHead = nextState.player.segments[0];
  if (nextState.boosters.magnetMs > 0 && playerHead) {
    const magnetRadius = 265;
    for (let i = 0; i < nextState.foods.length; i++) {
      const f = nextState.foods[i];
      const dx = playerHead.x - f.x;
      const dy = playerHead.y - f.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 1 && dist <= magnetRadius) {
        const pullStep = Math.min(dist, 390 * dtSec);
        nextState.foods[i] = {
          ...f,
          x: f.x + (dx / dist) * pullStep,
          y: f.y + (dy / dist) * pullStep,
        };
      }
    }
  }

  // 3. Eat Food Items
  const remainingFoods: FoodItem[] = [];
  for (const f of nextState.foods) {
    let eatenBy: WormEntity | null = null;
    for (const worm of allWorms) {
      if (!worm.alive || worm.segments.length === 0) continue;
      const h = worm.segments[0];
      const eatDist = worm.radius + 19 * f.scale;
      const dx = f.x - h.x;
      const dy = f.y - h.y;
      if (dx * dx + dy * dy <= eatDist * eatDist) {
        eatenBy = worm;
        break;
      }
    }

    if (eatenBy) {
      const turboMult = eatenBy.isPlayer && nextState.boosters.turboMs > 0 ? 2 : 1;
      const modeMult = nextState.mode === 'time_rush' ? 1.5 : 1;
      const gain = Math.round(f.weightValue * turboMult * modeMult);
      eatenBy.weight += gain;
      eatenBy.isEatingUntil = nextState.elapsedMs + 220;

      if (eatenBy.isPlayer) {
        playerAteFood = true;
        if (f.isLootDrop || f.kind === 'coin') playerAteLoot = true;
        nextState.coinsCollectedThisRun += f.coinValue;

        if (nextState.popups.length < 14) {
          nextState.popups.push({
            id: nextId('pop'),
            x: f.x,
            y: f.y - 10,
            text: f.coinValue > 0 ? `+${gain} (+${f.coinValue}c)` : `+${gain}`,
            color: f.kind === 'coin' ? '#FDE047' : f.isLootDrop ? '#93C5FD' : '#FFFFFF',
            ageMs: 0,
          });
        }
      }
    } else {
      remainingFoods.push(f);
    }
  }
  nextState.foods = remainingFoods;

  // 4. Wall & Worm-vs-Worm Elimination Checks (Self-crossing does NOT kill!)
  for (const worm of allWorms) {
    if (!worm.alive || worm.segments.length === 0) continue;
    const h = worm.segments[0];
    if (Math.hypot(h.x, h.y) + worm.radius * 0.72 >= nextState.arenaRadius) {
      worm.alive = false;
      if (worm.isPlayer) {
        nextState.gameOver = true;
        nextState.deathReason = 'wall';
      } else {
        nextState.foods.push(...convertWormToLoot(worm, nextState.mode, rng));
      }
    }
  }

  for (let i = 0; i < allWorms.length; i++) {
    const attacker = allWorms[i];
    if (!attacker.alive) continue;
    for (let j = 0; j < allWorms.length; j++) {
      if (i === j) continue;
      const target = allWorms[j];
      if (!target.alive) continue;

      if (checkHeadHitsWormBody(attacker, target)) {
        attacker.alive = false;
        target.kills += 1;

        if (attacker.isPlayer) {
          nextState.gameOver = true;
          nextState.deathReason = 'enemy';
          nextState.killedByName = target.name;
        } else {
          const loot = convertWormToLoot(attacker, nextState.mode, rng);
          nextState.foods.push(...loot);
          if (target.isPlayer) {
            playerEliminatedBot = true;
            nextState.coinsCollectedThisRun += 5;
            nextState.popups.push({
              id: nextId('kill'),
              x: attacker.segments[0].x,
              y: attacker.segments[0].y - 16,
              text: `+1000 KO!`,
              color: '#FDE047',
              ageMs: 0,
            });
          }
        }
        break;
      }
    }
  }

  // 5. Respawn Fallen Bots & Replenish Natural Arena Food
  nextState.bots = nextState.bots.map((bot, idx) =>
    bot.alive
      ? bot
      : spawnAiWorm(idx, nextState.arenaRadius, nextState.player.segments[0] || { x: 0, y: 0 }, rng)
  );

  // Cap total dropped items gently if giant brawl spawns excessive loot
  if (nextState.foods.length > 420) {
    nextState.foods = nextState.foods.slice(nextState.foods.length - 420);
  }
  while (nextState.foods.length < TARGET_FOOD_COUNT) {
    nextState.foods.push(spawnRandomFood(nextState.arenaRadius, nextState.mode, rng));
  }

  // 6. Check Treasure Chest Weight Milestones
  while (nextState.player.weight >= nextState.currentGoalWeight) {
    nextState.goalTierIndex += 1;
    nextState.currentGoalWeight = getWeightGoalForTier(nextState.goalTierIndex);
    nextState.chestsOpenedThisRun += 1;
    nextState.coinsCollectedThisRun += 25;
    chestUnlocked = true;
    const pHead = nextState.player.segments[0];
    if (pHead) {
      nextState.popups.push({
        id: nextId('chest'),
        x: pHead.x,
        y: pHead.y - 36,
        text: 'CHEST +25 COINS!',
        color: '#86EFAC',
        ageMs: 0,
      });
    }
  }

  return {
    nextState,
    playerAteFood,
    playerAteLoot,
    playerEliminatedBot,
    chestUnlocked,
  };
}

/**
 * Computes live sorted arena leaderboard featuring top contenders + player's live rank
 */
export function computeArenaLeaderboard(
  state: ArenaState,
  limit = 9
): {
  totalArenaCount: number;
  topEntries: LeaderboardEntry[];
  playerEntry: LeaderboardEntry;
} {
  const sec = state.elapsedMs / 1000;
  const combined: { id: string; name: string; weight: number; isPlayer: boolean }[] = [
    {
      id: state.player.id,
      name: state.player.name,
      weight: Math.round(state.player.weight),
      isPlayer: true,
    },
    ...state.bots.map((b) => ({
      id: b.id,
      name: b.name,
      weight: Math.round(b.weight),
      isPlayer: false,
    })),
    ...state.ambientRivals.map((r) => ({
      id: r.id,
      name: r.name,
      weight: Math.round(r.baseWeight + r.growthRate * sec),
      isPlayer: false,
    })),
  ];

  combined.sort((a, b) => b.weight - a.weight);

  const playerIdx = combined.findIndex((c) => c.isPlayer);
  const playerEntry: LeaderboardEntry = {
    id: state.player.id,
    rank: playerIdx >= 0 ? playerIdx + 1 : combined.length,
    name: state.player.name,
    weight: Math.round(state.player.weight),
    isPlayer: true,
  };

  const topEntries: LeaderboardEntry[] = combined.slice(0, limit).map((item, idx) => ({
    id: item.id,
    rank: idx + 1,
    name: item.name,
    weight: item.weight,
    isPlayer: item.isPlayer,
  }));

  return {
    totalArenaCount: combined.length,
    topEntries,
    playerEntry,
  };
}
