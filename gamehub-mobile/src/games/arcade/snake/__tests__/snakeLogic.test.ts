// ============================================================
// Worms Zone 3D Arena — Pure Physics, AI & Loot Engine Tests
// ============================================================

import {
  DEFAULT_ARENA_RADIUS,
  TARGET_BOT_COUNT,
  createArenaState,
  steerAngleToward,
  advanceWormSpine,
  stepArenaTick,
  convertWormToLoot,
  checkHeadHitsWormBody,
  computeArenaLeaderboard,
} from '../logic';
import { getWeightGoalForTier } from '../skins';

describe('Worms Zone 3D Arena Physics & AI Engine', () => {
  it('initializes arena with player worm, 18 AI bots, natural foods, and milestones', () => {
    const state = createArenaState('infinity', 'violet', 'HeroWorm');
    expect(state.arenaRadius).toBe(DEFAULT_ARENA_RADIUS);
    expect(state.player.alive).toBe(true);
    expect(state.player.segments.length).toBeGreaterThanOrEqual(12);
    expect(state.bots.length).toBe(TARGET_BOT_COUNT);
    expect(state.foods.length).toBeGreaterThanOrEqual(200);
    expect(state.currentGoalWeight).toBe(getWeightGoalForTier(0));
  });

  it('steers angles smoothly across PI / -PI wraparound without snapping', () => {
    const nextAngle = steerAngleToward(Math.PI - 0.1, -Math.PI + 0.1, 0.3);
    // Shortest path goes across +/-PI, so it should cross to negative near -PI
    expect(nextAngle).toBeLessThan(0);
  });

  it('allows crossing self spine safely without self-collision death', () => {
    const state = createArenaState('infinity', 'violet', 'SelfLoopTest');
    // Shape player into a tight loop overlapping its own head
    state.player.segments = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
      { x: 0, y: 0 },
    ];
    state.bots = [];

    const { nextState } = stepArenaTick(state, 16);
    expect(nextState.gameOver).toBe(false);
    expect(nextState.player.alive).toBe(true);
  });

  it('eliminates worm hitting circular outer arena boundary wall', () => {
    const state = createArenaState('infinity', 'crimson', 'WallTest');
    state.player.segments[0] = { x: state.arenaRadius - 5, y: 0 };
    state.player.angle = 0;
    state.player.targetAngle = 0;
    state.bots = [];

    const { nextState } = stepArenaTick(state, 32);
    expect(nextState.gameOver).toBe(true);
    expect(nextState.deathReason).toBe('wall');
  });

  it('eliminates AI enemy crashing into player body, awards KO, and drops sparkling feast', () => {
    const state = createArenaState('infinity', 'violet', 'Hunter');
    state.player.segments = [
      { x: 0, y: 0 },
      { x: -20, y: 0 },
      { x: -40, y: 0 },
      { x: -60, y: 0 },
    ];

    const victimBot = state.bots[0];
    victimBot.segments = [
      { x: -40, y: 2 },
      { x: -40, y: 22 },
      { x: -40, y: 42 },
      { x: -40, y: 62 },
    ];
    victimBot.angle = -Math.PI / 2;
    victimBot.targetAngle = -Math.PI / 2;

    expect(checkHeadHitsWormBody(victimBot, state.player)).toBe(true);

    const lootDrops = convertWormToLoot(victimBot, 'treasure');
    expect(lootDrops.length).toBeGreaterThan(0);
    expect(lootDrops.every((d) => d.isLootDrop)).toBe(true);

    const initialFoodCount = state.foods.length;
    const res = stepArenaTick(state, 16);
    expect(res.playerEliminatedBot).toBe(true);
    expect(res.nextState.player.kills).toBe(1);
    expect(res.nextState.foods.length).toBeGreaterThanOrEqual(initialFoodCount);
  });

  it('pulls nearby food with Magnet booster and applies 2x weight multiplier with Turbo booster', () => {
    const state = createArenaState('infinity', 'emerald', 'BoosterTest');
    state.bots = [];
    state.boosters.magnetMs = 5000;
    state.boosters.turboMs = 5000;

    // Place a known cheese item right in front of player mouth
    state.foods = [
      {
        id: 'test-cheese',
        x: 80,
        y: 0,
        kind: 'cheese',
        weightValue: 25,
        coinValue: 0,
        scale: 1,
        isLootDrop: false,
      },
    ];
    state.player.segments[0] = { x: 0, y: 0 };
    state.player.angle = 0;
    state.player.targetAngle = 0;

    const beforeWeight = state.player.weight;
    let current = state;
    let ate = false;
    for (let i = 0; i < 12; i++) {
      const step = stepArenaTick(current, 32);
      current = step.nextState;
      if (step.playerAteFood) {
        ate = true;
        break;
      }
    }

    expect(ate).toBe(true);
    // 2x multiplier doubles 25 -> +50 without shedding boost mass while Turbo is active
    expect(current.player.weight).toBeGreaterThanOrEqual(beforeWeight + 50);
  });

  it('unlocks Treasure Chest milestone rewards and computes sorted live leaderboard', () => {
    const state = createArenaState('treasure', 'gold', 'ChestKing');
    state.bots = [];
    state.player.weight = 495;
    state.foods = [
      {
        id: 'goal-food',
        x: 5,
        y: 0,
        kind: 'cake',
        weightValue: 50,
        coinValue: 2,
        scale: 1,
        isLootDrop: true,
      },
    ];
    state.player.segments[0] = { x: 0, y: 0 };

    const res = stepArenaTick(state, 16);
    expect(res.chestUnlocked).toBe(true);
    expect(res.nextState.chestsOpenedThisRun).toBe(1);
    expect(res.nextState.goalTierIndex).toBe(1);
    expect(res.nextState.coinsCollectedThisRun).toBeGreaterThanOrEqual(27);

    const lb = computeArenaLeaderboard(res.nextState, 5);
    expect(lb.totalArenaCount).toBeGreaterThanOrEqual(100);
    expect(lb.topEntries.length).toBe(5);
    expect(lb.playerEntry.weight).toBeGreaterThanOrEqual(540);
  });

  it('advances worm segments cleanly maintaining tight spine continuity', () => {
    const state = createArenaState('infinity', 'steampunk', 'SpineCheck');
    const worm = state.player;
    for (let i = 0; i < 15; i++) {
      advanceWormSpine(worm, 0.032, 220);
    }
    const maxSpacing = worm.radius * 0.72;
    for (let i = 1; i < worm.segments.length; i++) {
      const d = Math.hypot(
        worm.segments[i].x - worm.segments[i - 1].x,
        worm.segments[i].y - worm.segments[i - 1].y
      );
      expect(d).toBeLessThanOrEqual(maxSpacing + 1);
    }
  });
});
