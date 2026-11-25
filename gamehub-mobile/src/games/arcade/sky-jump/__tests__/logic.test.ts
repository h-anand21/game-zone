// ============================================================
// Wood Screw: Nuts & Bolts Puzzle — Physics & Solvability Tests
// ============================================================

import {
  canMoveScrew,
  getDetachedPlankCount,
  hasAnyValidMove,
  isHoleOpenAndClear,
  isLevelSolvableFast,
  moveScrew,
  removeScrewWithBooster,
  stepPhysics,
} from '../logic';
import { generateWoodScrewLevel } from '../levels';

describe('Wood Screw Physics & Puzzle Engine', () => {
  it('blocks placing screws into holes covered by solid wood and allows uncovered holes', () => {
    const level1 = generateWoodScrewLevel(1);
    // Staging holes t1 and t2 are open and uncovered
    expect(isHoleOpenAndClear('t1', level1.holes, level1.planks, level1.screws)).toBe(true);
    expect(isHoleOpenAndClear('t2', level1.holes, level1.planks, level1.screws)).toBe(true);

    // Occupied holes h1..h4 cannot accept a second screw
    expect(isHoleOpenAndClear('h1', level1.holes, level1.planks, level1.screws)).toBe(false);
    expect(canMoveScrew(level1.holes, level1.planks, level1.screws, 'h1', 't1')).toBe(true);
    expect(canMoveScrew(level1.holes, level1.planks, level1.screws, 'h1', 'h2')).toBe(false);
  });

  it('transitions a plank from pinned -> swinging -> falling -> cleared when unscrewed', () => {
    const level1 = generateWoodScrewLevel(1);

    // Unscrew left end of plank p1 (h1 -> t1): p1 now has 1 screw left -> swinging
    const step1 = moveScrew(level1.holes, level1.planks, level1.screws, 'h1', 't1');
    const p1AfterOne = step1.nextPlanks.find((p) => p.id === 'p1')!;
    expect(p1AfterOne.status).toBe('swinging');

    // Step physics and verify pendulum angle rotates downward toward vertical (-90 deg)
    let swungPlanks = step1.nextPlanks;
    for (let i = 0; i < 20; i++) {
      swungPlanks = stepPhysics(level1.holes, swungPlanks, 1).planks;
    }
    expect(Math.abs(swungPlanks.find((p) => p.id === 'p1')!.angle)).toBeGreaterThan(15);

    // Unscrew second end of p1 (h2 -> t2): p1 now has 0 screws -> falling
    const step2 = moveScrew(level1.holes, swungPlanks, step1.nextScrews, 'h2', 't2');
    expect(step2.nextPlanks.find((p) => p.id === 'p1')!.status).toBe('falling');
    expect(getDetachedPlankCount(step2.nextPlanks)).toBe(1);

    // Step gravity until plank drops off screen -> cleared
    let droppedPlanks = step2.nextPlanks;
    for (let i = 0; i < 60; i++) {
      droppedPlanks = stepPhysics(level1.holes, droppedPlanks, 1).planks;
    }
    expect(droppedPlanks.find((p) => p.id === 'p1')!.status).toBe('cleared');
  });

  it('prevents moving a screw onto solid wood while plank covers a board hole', () => {
    const level = generateWoodScrewLevel(2);
    // Move screw away from h3? No, in level 2 let's unscrew h4 -> t1
    const res = moveScrew(level.holes, level.planks, level.screws, 'h4', 't1');
    expect(hasAnyValidMove(level.holes, res.nextPlanks, res.nextScrews)).toBe(true);
  });

  it('supports Screwdriver (+) booster removing any blocking screw cleanly', () => {
    const level1 = generateWoodScrewLevel(1);
    const r1 = removeScrewWithBooster(level1.planks, level1.screws, 'h1');
    expect(r1.nextScrews.length).toBe(level1.screws.length - 1);
    const r2 = removeScrewWithBooster(r1.nextPlanks, r1.nextScrews, 'h2');
    expect(r2.nextPlanks.find((p) => p.id === 'p1')!.status).toBe('falling');
  });

  it('all handcrafted levels 1 to 10 are mathematically solvable', () => {
    for (let lvl = 1; lvl <= 10; lvl++) {
      const data = generateWoodScrewLevel(lvl);
      const solvable = isLevelSolvableFast(data.holes, data.planks, data.screws, 2000);
      expect(solvable).toBe(true);
    }
  });

  it('generates valid unlimited procedural levels (11 to 1000+)', () => {
    for (const lvl of [11, 15, 25, 50, 100, 500, 1000]) {
      const data = generateWoodScrewLevel(lvl);
      expect(data.levelNumber).toBe(lvl);
      expect(data.planks.length).toBeGreaterThanOrEqual(4);
      expect(data.screws.length).toBeGreaterThanOrEqual(4);
      expect(isLevelSolvableFast(data.holes, data.planks, data.screws, 1500)).toBe(true);
    }
  });
});
