// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — 15 Progressive Levels
// Handcrafted puzzle layouts with gradual difficulty teaching curve
// ============================================================

import type { GameLevel } from '../game/types';
import { COLORS } from '../constants/colors';

export const LEVELS: GameLevel[] = [
  // ── WORLD 1: Whispering Forest ──────────────────────────────
  {
    id: 1,
    worldId: 1,
    worldName: 'Whispering Forest',
    name: 'First Step',
    rows: 6,
    cols: 6,
    threeStarMoves: 2,
    twoStarMoves: 4,
    reward: { coins: 50, gems: 5 },
    tutorialText: 'Slide each arrow in the direction it points! ➜',
    pieces: [
      {
        id: 'p1',
        color: COLORS.pink,
        direction: 'right',
        cells: [
          { row: 1, col: 1 },
          { row: 1, col: 2 },
          { row: 1, col: 3 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.blue,
        direction: 'down',
        cells: [
          { row: 3, col: 4 },
          { row: 4, col: 4 },
        ],
      },
    ],
  },
  {
    id: 2,
    worldId: 1,
    worldName: 'Whispering Forest',
    name: 'Forest Path',
    rows: 6,
    cols: 6,
    threeStarMoves: 3,
    twoStarMoves: 5,
    reward: { coins: 60, gems: 5 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.green,
        direction: 'up',
        cells: [
          { row: 2, col: 1 },
          { row: 1, col: 1 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.blue,
        direction: 'right',
        cells: [
          { row: 3, col: 2 },
          { row: 3, col: 3 },
          { row: 3, col: 4 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.orange,
        direction: 'down',
        cells: [
          { row: 4, col: 1 },
          { row: 5, col: 1 },
        ],
      },
    ],
  },
  {
    id: 3,
    worldId: 1,
    worldName: 'Whispering Forest',
    name: 'The Crossroad Block',
    rows: 6,
    cols: 6,
    threeStarMoves: 3,
    twoStarMoves: 5,
    reward: { coins: 70, gems: 5 },
    tutorialText: 'Blocked! Clear the blue arrow down before sliding pink right.',
    pieces: [
      {
        id: 'p1',
        color: COLORS.pink,
        direction: 'right',
        cells: [
          { row: 2, col: 1 },
          { row: 2, col: 2 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.blue,
        direction: 'down',
        cells: [
          { row: 1, col: 3 },
          { row: 2, col: 3 },
          { row: 3, col: 3 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.yellow,
        direction: 'left',
        cells: [
          { row: 4, col: 4 },
          { row: 4, col: 3 },
          { row: 4, col: 2 },
        ],
      },
    ],
  },
  {
    id: 4,
    worldId: 1,
    worldName: 'Whispering Forest',
    name: 'Bent Thicket',
    rows: 7,
    cols: 7,
    threeStarMoves: 4,
    twoStarMoves: 6,
    reward: { coins: 80, gems: 8 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.purple,
        direction: 'right',
        cells: [
          { row: 1, col: 1 },
          { row: 2, col: 1 },
          { row: 2, col: 2 },
          { row: 2, col: 3 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.green,
        direction: 'down',
        cells: [
          { row: 3, col: 4 },
          { row: 4, col: 4 },
          { row: 5, col: 4 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.yellow,
        direction: 'left',
        cells: [
          { row: 3, col: 2 },
          { row: 3, col: 1 },
        ],
      },
      {
        id: 'p4',
        color: COLORS.blue,
        direction: 'up',
        cells: [
          { row: 5, col: 2 },
          { row: 4, col: 2 },
        ],
      },
    ],
  },
  {
    id: 5,
    worldId: 1,
    worldName: 'Whispering Forest',
    name: 'Five Knots',
    rows: 7,
    cols: 7,
    threeStarMoves: 5,
    twoStarMoves: 8,
    reward: { coins: 100, gems: 10 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.pink,
        direction: 'up',
        cells: [
          { row: 3, col: 1 },
          { row: 2, col: 1 },
          { row: 1, col: 1 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.blue,
        direction: 'right',
        cells: [
          { row: 2, col: 2 },
          { row: 2, col: 3 },
          { row: 2, col: 4 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.orange,
        direction: 'down',
        cells: [
          { row: 3, col: 5 },
          { row: 4, col: 5 },
        ],
      },
      {
        id: 'p4',
        color: COLORS.green,
        direction: 'left',
        cells: [
          { row: 4, col: 3 },
          { row: 4, col: 2 },
        ],
      },
      {
        id: 'p5',
        color: COLORS.purple,
        direction: 'down',
        cells: [
          { row: 3, col: 3 },
          { row: 5, col: 3 },
        ],
      },
    ],
  },
  {
    id: 6,
    worldId: 1,
    worldName: 'Whispering Forest',
    name: 'Ancient Gate',
    rows: 8,
    cols: 8,
    threeStarMoves: 6,
    twoStarMoves: 9,
    reward: { coins: 120, gems: 10 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.blue,
        direction: 'up',
        cells: [
          { row: 3, col: 1 },
          { row: 2, col: 1 },
          { row: 1, col: 1 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.pink,
        direction: 'right',
        cells: [
          { row: 2, col: 2 },
          { row: 2, col: 3 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.yellow,
        direction: 'down',
        cells: [
          { row: 1, col: 4 },
          { row: 2, col: 4 },
          { row: 3, col: 4 },
        ],
      },
      {
        id: 'p4',
        color: COLORS.green,
        direction: 'left',
        cells: [
          { row: 4, col: 3 },
          { row: 4, col: 2 },
          { row: 4, col: 1 },
        ],
      },
      {
        id: 'p5',
        color: COLORS.orange,
        direction: 'right',
        cells: [
          { row: 5, col: 3 },
          { row: 5, col: 4 },
          { row: 5, col: 5 },
        ],
      },
      {
        id: 'p6',
        color: COLORS.purple,
        direction: 'up',
        cells: [
          { row: 5, col: 2 },
          { row: 3, col: 2 },
        ],
      },
    ],
  },
  {
    id: 7,
    worldId: 1,
    worldName: 'Whispering Forest',
    name: 'Overgrown Maze',
    rows: 8,
    cols: 8,
    threeStarMoves: 7,
    twoStarMoves: 10,
    reward: { coins: 140, gems: 12 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.green,
        direction: 'left',
        cells: [
          { row: 1, col: 3 },
          { row: 1, col: 2 },
          { row: 1, col: 1 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.pink,
        direction: 'up',
        cells: [
          { row: 4, col: 2 },
          { row: 3, col: 2 },
          { row: 2, col: 2 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.blue,
        direction: 'right',
        cells: [
          { row: 2, col: 4 },
          { row: 2, col: 5 },
          { row: 2, col: 6 },
        ],
      },
      {
        id: 'p4',
        color: COLORS.orange,
        direction: 'down',
        cells: [
          { row: 3, col: 5 },
          { row: 4, col: 5 },
          { row: 5, col: 5 },
        ],
      },
      {
        id: 'p5',
        color: COLORS.yellow,
        direction: 'left',
        cells: [
          { row: 6, col: 4 },
          { row: 6, col: 3 },
        ],
      },
      {
        id: 'p6',
        color: COLORS.purple,
        direction: 'down',
        cells: [
          { row: 5, col: 1 },
          { row: 6, col: 1 },
        ],
      },
      {
        id: 'p7',
        color: COLORS.red,
        direction: 'up',
        cells: [
          { row: 5, col: 3 },
          { row: 4, col: 3 },
          { row: 3, col: 3 },
        ],
      },
    ],
  },
  {
    id: 8,
    worldId: 1,
    worldName: 'Whispering Forest',
    name: 'Forest Citadel (Boss)',
    rows: 8,
    cols: 8,
    threeStarMoves: 8,
    twoStarMoves: 12,
    reward: { coins: 200, gems: 20 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.pink,
        direction: 'right',
        cells: [
          { row: 1, col: 4 },
          { row: 1, col: 5 },
          { row: 1, col: 6 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.blue,
        direction: 'up',
        cells: [
          { row: 3, col: 4 },
          { row: 2, col: 4 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.green,
        direction: 'left',
        cells: [
          { row: 2, col: 3 },
          { row: 2, col: 2 },
          { row: 2, col: 1 },
        ],
      },
      {
        id: 'p4',
        color: COLORS.yellow,
        direction: 'down',
        cells: [
          { row: 3, col: 2 },
          { row: 4, col: 2 },
        ],
      },
      {
        id: 'p5',
        color: COLORS.purple,
        direction: 'right',
        cells: [
          { row: 5, col: 2 },
          { row: 5, col: 3 },
          { row: 5, col: 4 },
        ],
      },
      {
        id: 'p6',
        color: COLORS.orange,
        direction: 'down',
        cells: [
          { row: 5, col: 5 },
          { row: 6, col: 5 },
        ],
      },
      {
        id: 'p7',
        color: COLORS.red,
        direction: 'left',
        cells: [
          { row: 6, col: 3 },
          { row: 6, col: 2 },
        ],
      },
      {
        id: 'p8',
        color: COLORS.blue,
        direction: 'up',
        cells: [
          { row: 6, col: 6 },
          { row: 4, col: 6 },
        ],
      },
    ],
  },

  // ── WORLD 2: Crystal Coast ──────────────────────────────────
  {
    id: 9,
    worldId: 2,
    worldName: 'Crystal Coast',
    name: 'Tidal Shallows',
    rows: 8,
    cols: 8,
    threeStarMoves: 6,
    twoStarMoves: 9,
    reward: { coins: 150, gems: 10 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.blue,
        direction: 'right',
        cells: [
          { row: 2, col: 2 },
          { row: 2, col: 3 },
          { row: 2, col: 4 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.pink,
        direction: 'down',
        cells: [
          { row: 3, col: 4 },
          { row: 4, col: 4 },
          { row: 5, col: 4 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.green,
        direction: 'left',
        cells: [
          { row: 4, col: 3 },
          { row: 4, col: 2 },
          { row: 4, col: 1 },
        ],
      },
      {
        id: 'p4',
        color: COLORS.yellow,
        direction: 'up',
        cells: [
          { row: 3, col: 2 },
          { row: 1, col: 2 },
        ],
      },
      {
        id: 'p5',
        color: COLORS.purple,
        direction: 'right',
        cells: [
          { row: 5, col: 1 },
          { row: 5, col: 2 },
        ],
      },
      {
        id: 'p6',
        color: COLORS.orange,
        direction: 'up',
        cells: [
          { row: 5, col: 5 },
          { row: 4, col: 5 },
        ],
      },
    ],
  },
  {
    id: 10,
    worldId: 2,
    worldName: 'Crystal Coast',
    name: 'Sapphire Reef',
    rows: 8,
    cols: 8,
    threeStarMoves: 7,
    twoStarMoves: 10,
    reward: { coins: 160, gems: 12 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.pink,
        direction: 'up',
        cells: [
          { row: 3, col: 1 },
          { row: 2, col: 1 },
          { row: 1, col: 1 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.blue,
        direction: 'right',
        cells: [
          { row: 2, col: 2 },
          { row: 2, col: 3 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.green,
        direction: 'down',
        cells: [
          { row: 1, col: 5 },
          { row: 2, col: 5 },
          { row: 3, col: 5 },
        ],
      },
      {
        id: 'p4',
        color: COLORS.purple,
        direction: 'left',
        cells: [
          { row: 4, col: 4 },
          { row: 4, col: 3 },
          { row: 4, col: 2 },
        ],
      },
      {
        id: 'p5',
        color: COLORS.yellow,
        direction: 'down',
        cells: [
          { row: 4, col: 1 },
          { row: 5, col: 1 },
          { row: 6, col: 1 },
        ],
      },
      {
        id: 'p6',
        color: COLORS.orange,
        direction: 'right',
        cells: [
          { row: 6, col: 3 },
          { row: 6, col: 4 },
          { row: 6, col: 5 },
        ],
      },
      {
        id: 'p7',
        color: COLORS.red,
        direction: 'up',
        cells: [
          { row: 5, col: 3 },
          { row: 3, col: 3 },
        ],
      },
    ],
  },
  {
    id: 11,
    worldId: 2,
    worldName: 'Crystal Coast',
    name: 'Mermaid Grotto',
    rows: 8,
    cols: 8,
    threeStarMoves: 8,
    twoStarMoves: 11,
    reward: { coins: 180, gems: 14 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.blue,
        direction: 'right',
        cells: [
          { row: 1, col: 2 },
          { row: 1, col: 3 },
          { row: 1, col: 4 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.green,
        direction: 'down',
        cells: [
          { row: 1, col: 5 },
          { row: 2, col: 5 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.pink,
        direction: 'left',
        cells: [
          { row: 3, col: 4 },
          { row: 3, col: 3 },
          { row: 3, col: 2 },
        ],
      },
      {
        id: 'p4',
        color: COLORS.yellow,
        direction: 'up',
        cells: [
          { row: 4, col: 1 },
          { row: 3, col: 1 },
          { row: 2, col: 1 },
        ],
      },
      {
        id: 'p5',
        color: COLORS.purple,
        direction: 'right',
        cells: [
          { row: 4, col: 3 },
          { row: 4, col: 4 },
          { row: 4, col: 5 },
        ],
      },
      {
        id: 'p6',
        color: COLORS.orange,
        direction: 'down',
        cells: [
          { row: 5, col: 4 },
          { row: 6, col: 4 },
        ],
      },
      {
        id: 'p7',
        color: COLORS.red,
        direction: 'left',
        cells: [
          { row: 6, col: 3 },
          { row: 6, col: 2 },
        ],
      },
      {
        id: 'p8',
        color: COLORS.blue,
        direction: 'up',
        cells: [
          { row: 5, col: 2 },
          { row: 4, col: 2 },
        ],
      },
    ],
  },
  {
    id: 12,
    worldId: 2,
    worldName: 'Crystal Coast',
    name: 'Coral Fortress',
    rows: 8,
    cols: 8,
    threeStarMoves: 8,
    twoStarMoves: 12,
    reward: { coins: 200, gems: 15 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.green,
        direction: 'left',
        cells: [
          { row: 1, col: 3 },
          { row: 1, col: 2 },
          { row: 1, col: 1 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.yellow,
        direction: 'down',
        cells: [
          { row: 2, col: 3 },
          { row: 3, col: 3 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.pink,
        direction: 'right',
        cells: [
          { row: 3, col: 4 },
          { row: 3, col: 5 },
          { row: 3, col: 6 },
        ],
      },
      {
        id: 'p4',
        color: COLORS.blue,
        direction: 'up',
        cells: [
          { row: 5, col: 5 },
          { row: 4, col: 5 },
        ],
      },
      {
        id: 'p5',
        color: COLORS.purple,
        direction: 'left',
        cells: [
          { row: 5, col: 4 },
          { row: 5, col: 3 },
          { row: 5, col: 2 },
        ],
      },
      {
        id: 'p6',
        color: COLORS.orange,
        direction: 'down',
        cells: [
          { row: 5, col: 1 },
          { row: 6, col: 1 },
        ],
      },
      {
        id: 'p7',
        color: COLORS.red,
        direction: 'right',
        cells: [
          { row: 6, col: 2 },
          { row: 6, col: 3 },
        ],
      },
      {
        id: 'p8',
        color: COLORS.green,
        direction: 'up',
        cells: [
          { row: 4, col: 2 },
          { row: 3, col: 2 },
          { row: 2, col: 2 },
        ],
      },
    ],
  },
  {
    id: 13,
    worldId: 2,
    worldName: 'Crystal Coast',
    name: 'Whirlpool Straits',
    rows: 8,
    cols: 8,
    threeStarMoves: 9,
    twoStarMoves: 13,
    reward: { coins: 220, gems: 16 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.pink,
        direction: 'up',
        cells: [
          { row: 2, col: 1 },
          { row: 1, col: 1 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.blue,
        direction: 'right',
        cells: [
          { row: 1, col: 2 },
          { row: 1, col: 3 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.green,
        direction: 'down',
        cells: [
          { row: 1, col: 5 },
          { row: 2, col: 5 },
          { row: 3, col: 5 },
        ],
      },
      {
        id: 'p4',
        color: COLORS.yellow,
        direction: 'left',
        cells: [
          { row: 3, col: 4 },
          { row: 3, col: 3 },
        ],
      },
      {
        id: 'p5',
        color: COLORS.purple,
        direction: 'up',
        cells: [
          { row: 4, col: 2 },
          { row: 3, col: 2 },
        ],
      },
      {
        id: 'p6',
        color: COLORS.orange,
        direction: 'right',
        cells: [
          { row: 4, col: 4 },
          { row: 4, col: 5 },
        ],
      },
      {
        id: 'p7',
        color: COLORS.red,
        direction: 'down',
        cells: [
          { row: 5, col: 3 },
          { row: 6, col: 3 },
        ],
      },
      {
        id: 'p8',
        color: COLORS.blue,
        direction: 'left',
        cells: [
          { row: 6, col: 2 },
          { row: 6, col: 1 },
        ],
      },
      {
        id: 'p9',
        color: COLORS.green,
        direction: 'up',
        cells: [
          { row: 5, col: 1 },
          { row: 4, col: 1 },
          { row: 3, col: 1 },
        ],
      },
    ],
  },
  {
    id: 14,
    worldId: 2,
    worldName: 'Crystal Coast',
    name: 'Sunken Galleon',
    rows: 8,
    cols: 8,
    threeStarMoves: 10,
    twoStarMoves: 14,
    reward: { coins: 250, gems: 18 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.yellow,
        direction: 'right',
        cells: [
          { row: 1, col: 3 },
          { row: 1, col: 4 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.pink,
        direction: 'up',
        cells: [
          { row: 3, col: 2 },
          { row: 2, col: 2 },
          { row: 1, col: 2 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.blue,
        direction: 'left',
        cells: [
          { row: 2, col: 5 },
          { row: 2, col: 4 },
          { row: 2, col: 3 },
        ],
      },
      {
        id: 'p4',
        color: COLORS.green,
        direction: 'down',
        cells: [
          { row: 2, col: 6 },
          { row: 3, col: 6 },
        ],
      },
      {
        id: 'p5',
        color: COLORS.purple,
        direction: 'left',
        cells: [
          { row: 4, col: 5 },
          { row: 4, col: 4 },
          { row: 4, col: 3 },
        ],
      },
      {
        id: 'p6',
        color: COLORS.orange,
        direction: 'up',
        cells: [
          { row: 5, col: 1 },
          { row: 4, col: 1 },
        ],
      },
      {
        id: 'p7',
        color: COLORS.red,
        direction: 'right',
        cells: [
          { row: 5, col: 3 },
          { row: 5, col: 4 },
          { row: 5, col: 5 },
        ],
      },
      {
        id: 'p8',
        color: COLORS.yellow,
        direction: 'down',
        cells: [
          { row: 5, col: 2 },
          { row: 6, col: 2 },
        ],
      },
      {
        id: 'p9',
        color: COLORS.pink,
        direction: 'left',
        cells: [
          { row: 6, col: 5 },
          { row: 6, col: 4 },
          { row: 6, col: 3 },
        ],
      },
      {
        id: 'p10',
        color: COLORS.blue,
        direction: 'up',
        cells: [
          { row: 5, col: 6 },
          { row: 4, col: 6 },
        ],
      },
    ],
  },
  {
    id: 15,
    worldId: 2,
    worldName: 'Crystal Coast',
    name: 'Poseidon Keep (Boss)',
    rows: 8,
    cols: 8,
    threeStarMoves: 11,
    twoStarMoves: 15,
    reward: { coins: 350, gems: 30 },
    pieces: [
      {
        id: 'p1',
        color: COLORS.blue,
        direction: 'left',
        cells: [
          { row: 1, col: 3 },
          { row: 1, col: 2 },
          { row: 1, col: 1 },
        ],
      },
      {
        id: 'p2',
        color: COLORS.pink,
        direction: 'up',
        cells: [
          { row: 3, col: 4 },
          { row: 2, col: 4 },
          { row: 1, col: 4 },
        ],
      },
      {
        id: 'p3',
        color: COLORS.green,
        direction: 'right',
        cells: [
          { row: 2, col: 5 },
          { row: 2, col: 6 },
        ],
      },
      {
        id: 'p4',
        color: COLORS.yellow,
        direction: 'down',
        cells: [
          { row: 3, col: 6 },
          { row: 4, col: 6 },
        ],
      },
      {
        id: 'p5',
        color: COLORS.purple,
        direction: 'left',
        cells: [
          { row: 3, col: 3 },
          { row: 3, col: 2 },
        ],
      },
      {
        id: 'p6',
        color: COLORS.orange,
        direction: 'up',
        cells: [
          { row: 5, col: 2 },
          { row: 4, col: 2 },
        ],
      },
      {
        id: 'p7',
        color: COLORS.red,
        direction: 'right',
        cells: [
          { row: 4, col: 3 },
          { row: 4, col: 4 },
          { row: 4, col: 5 },
        ],
      },
      {
        id: 'p8',
        color: COLORS.pink,
        direction: 'down',
        cells: [
          { row: 5, col: 4 },
          { row: 6, col: 4 },
        ],
      },
      {
        id: 'p9',
        color: COLORS.yellow,
        direction: 'left',
        cells: [
          { row: 6, col: 3 },
          { row: 6, col: 2 },
          { row: 6, col: 1 },
        ],
      },
      {
        id: 'p10',
        color: COLORS.blue,
        direction: 'right',
        cells: [
          { row: 6, col: 5 },
          { row: 6, col: 6 },
        ],
      },
      {
        id: 'p11',
        color: COLORS.green,
        direction: 'up',
        cells: [
          { row: 5, col: 3 },
          { row: 4, col: 3 },
        ],
      },
    ],
  },
];
