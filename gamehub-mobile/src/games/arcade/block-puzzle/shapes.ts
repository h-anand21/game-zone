// ============================================================
// GameHub — Falling Jewel Blast Tetromino Shapes & Palettes
// ============================================================

import type { BlockColor, ColorTheme, TetrominoShape, TetrominoType } from './types';

const createWoodTone = (
  name: BlockColor,
  main: string,
  topHex: string,
  bottomHex: string,
  shadow: string
): ColorTheme => ({
  name,
  main,
  gradient: [topHex, bottomHex],
  shadow,
  highlight: 'rgba(255, 245, 190, 0.85)',
  glow: 'rgba(253, 224, 71, 0.6)',
});

/**
 * Cohesive Honey-Gold Oak woodblock palette mapped onto existing BlockColor keys
 * so levels, saves, and logic stay 100% compatible while every tile renders as carved gold wood.
 */
export const JEWEL_COLORS: Record<BlockColor, ColorTheme> = {
  cyan: createWoodTone('cyan', '#F4C652', '#FCE386', '#E4A62C', '#9E6110'),
  amber: createWoodTone('amber', '#F6CA58', '#FFF0A0', '#E8AE30', '#A46612'),
  ruby: createWoodTone('ruby', '#EEBA46', '#FAD975', '#DC9922', '#95580D'),
  green: createWoodTone('green', '#F3C754', '#FCE58A', '#E2A42B', '#9A5F10'),
  purple: createWoodTone('purple', '#F0BE4A', '#FBDE7A', '#DF9D24', '#985B0E'),
  orange: createWoodTone('orange', '#F5C44E', '#FDE180', '#E5A228', '#9D6010'),
  blue: createWoodTone('blue', '#F2C350', '#FCE082', '#E1A029', '#995C0E'),
};

export const TETROMINOES: Record<TetrominoType, TetrominoShape> = {
    // ── 1. I-Bar (Cyan) ──
    I: {
      type: 'I',
      name: 'I-Bar',
      colorKey: 'cyan',
      rotations: [
        [
          [false, false, false, false],
          [true, true, true, true],
          [false, false, false, false],
          [false, false, false, false],
        ],
        [
          [false, false, true, false],
          [false, false, true, false],
          [false, false, true, false],
          [false, false, true, false],
        ],
        [
          [false, false, false, false],
          [false, false, false, false],
          [true, true, true, true],
          [false, false, false, false],
        ],
        [
          [false, true, false, false],
          [false, true, false, false],
          [false, true, false, false],
          [false, true, false, false],
        ],
      ],
    },

      // ── 2. O-Square (Amber) ──
      O: {
        type: 'O',
        name: 'Square',
        colorKey: 'amber',
        rotations: [
          [
            [true, true],
            [true, true],
          ],
          [
            [true, true],
            [true, true],
          ],
          [
            [true, true],
            [true, true],
          ],
          [
            [true, true],
            [true, true],
          ],
        ],
      },

          // ── 3. T-Shape (Purple) ──
          T: {
            type: 'T',
            name: 'T-Shape',
            colorKey: 'purple',
            rotations: [
              [
                [false, true, false],
                [true, true, true],
                [false, false, false],
              ],
              [
                [false, true, false],
                [false, true, true],
                [false, true, false],
              ],
              [
                [false, false, false],
                [true, true, true],
                [false, true, false],
              ],
              [
                [false, true, false],
                [true, true, false],
                [false, true, false],
              ],
            ],
          },

              // ── 4. S-Shape (Green) ──
              S: {
                type: 'S',
                name: 'S-Shape',
                colorKey: 'green',
                rotations: [
                  [
                    [false, true, true],
                    [true, true, false],
                    [false, false, false],
                  ],
                  [
                    [false, true, false],
                    [false, true, true],
                    [false, false, true],
                  ],
                  [
                    [false, false, false],
                    [false, true, true],
                    [true, true, false],
                  ],
                  [
                    [true, false, false],
                    [true, true, false],
                    [false, true, false],
                  ],
                ],
              },

                  // ── 5. Z-Shape (Ruby) ──
                  Z: {
                    type: 'Z',
                    name: 'Z-Shape',
                    colorKey: 'ruby',
                    rotations: [
                      [
                        [true, true, false],
                        [false, true, true],
                        [false, false, false],
                      ],
                      [
                        [false, false, true],
                        [false, true, true],
                        [false, true, false],
                      ],
                      [
                        [false, false, false],
                        [true, true, false],
                        [false, true, true],
                      ],
                      [
                        [false, true, false],
                        [true, true, false],
                        [true, false, false],
                      ],
                    ],
                  },

                      // ── 6. J-Shape (Blue) ──
                      J: {
                        type: 'J',
                        name: 'J-Shape',
                        colorKey: 'blue',
                        rotations: [
                          [
                            [true, false, false],
                            [true, true, true],
                            [false, false, false],
                          ],
                          [
                            [false, true, true],
                            [false, true, false],
                            [false, true, false],
                          ],
                          [
                            [false, false, false],
                            [true, true, true],
                            [false, false, true],
                          ],
                          [
                            [false, true, false],
                            [false, true, false],
                            [true, true, false],
                          ],
                        ],
                      },

                          // ── 7. L-Shape (Orange) ──
                          L: {
                            type: 'L',
                            name: 'L-Shape',
                            colorKey: 'orange',
                            rotations: [
                              [
                                [false, false, true],
                                [true, true, true],
                                [false, false, false],
                              ],
                              [
                                [false, true, false],
                                [false, true, false],
                                [false, true, true],
                              ],
                              [
                                [false, false, false],
                                [true, true, true],
                                [true, false, false],
                              ],
                              [
                                [true, true, false],
                                [false, true, false],
                                [false, true, false],
                              ],
                            ],
                          },
                      };

export const ALL_TETROMINO_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
