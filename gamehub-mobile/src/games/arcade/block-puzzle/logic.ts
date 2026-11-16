// ============================================================
// GameHub — Falling Jewel Blast Pure Logic Engine
// ============================================================

import type {
  FallingGrid,
  TetrominoType,
  ActivePiece,
  LineClearResult,
} from './types';
import { TETROMINOES, ALL_TETROMINO_TYPES } from './shapes';

export const GRID_COLS = 10;
export const GRID_ROWS = 20;

/**
 * Creates an empty 10x20 FallingGrid
 */
      export function createEmptyGrid(): FallingGrid {
      return Array.from({ length: GRID_ROWS }, () =>
        Array.from({ length: GRID_COLS }, () => ({
          filled: false,
        }))
      );
    }

/**
 * Validates if a piece matrix can be placed at (row, col)
 */
        export function canPlaceAt(
          grid: FallingGrid,
          matrix: boolean[][],
          targetRow: number,
          targetCol: number
        ): boolean {
          for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
              if (matrix[r][c]) {
                const boardRow = targetRow + r;
                const boardCol = targetCol + c;

                // Wall boundary checks
                if (boardCol < 0 || boardCol >= GRID_COLS) return false;
                // Floor check
                if (boardRow >= GRID_ROWS) return false;
                // Above board is allowed during initial spawn, but not below
                if (boardRow >= 0 && grid[boardRow]?.[boardCol]?.filled) {
                  return false;
                }
              }
            }
          }
          return true;
        }

        /**
         * Calculates ghost landing row (where the piece will land if dropped straight down)
         */
          export function getGhostRow(
            grid: FallingGrid,
            matrix: boolean[][],
            startRow: number,
            col: number
): number {
              let ghostRow = startRow;
              while (canPlaceAt(grid, matrix, ghostRow + 1, col)) {
                ghostRow++;
              }
              return ghostRow;
            }

            /**
             * Spawns an ActivePiece of given type at top center
             */
              export function spawnPiece(type: TetrominoType): ActivePiece {
                const shape = TETROMINOES[type];
                const matrix = shape.rotations[0];
                const matrixCols = matrix[0].length;
                const col = Math.floor((GRID_COLS - matrixCols) / 2);
                const row = 0;

                return {
                  type,
                  rotationIndex: 0,
                  matrix,
                  colorKey: shape.colorKey,
                  row,
                  col,
                };
              }

              /**
               * Tries rotating the active piece with wall kicks
               */
                    export function tryRotatePiece(
                      grid: FallingGrid,
                      piece: ActivePiece,
                      clockwise = true
                    ): ActivePiece {
                      const shape = TETROMINOES[piece.type];
                      const totalRotations = shape.rotations.length;
                      const nextRotIndex = clockwise
                        ? (piece.rotationIndex + 1) % totalRotations
                        : (piece.rotationIndex - 1 + totalRotations) % totalRotations;

                      const nextMatrix = shape.rotations[nextRotIndex];

                      // Wall kicks to test: [0, -1, +1, -2, +2]
                      const wallKicks = [0, -1, 1, -2, 2];

                      for (const kick of wallKicks) {
                        const testCol = piece.col + kick;
                        if (canPlaceAt(grid, nextMatrix, piece.row, testCol)) {
                          return {
                            ...piece,
                            rotationIndex: nextRotIndex,
                            matrix: nextMatrix,
                            col: testCol,
                          };
                        }
                      }

                      // If all kicks fail, rotation fails
                      return piece;
                    }

                    /**
                     * Locks an active piece onto the 10x20 grid
                     */
                      export function lockPiece(grid: FallingGrid, piece: ActivePiece): FallingGrid {
                        const newGrid: FallingGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

                        for (let r = 0; r < piece.matrix.length; r++) {
                          for (let c = 0; c < piece.matrix[r].length; c++) {
                            if (piece.matrix[r][c]) {
                                  const boardRow = piece.row + r;
                                  const boardCol = piece.col + c;
                                  if(boardRow >= 0 && boardRow < GRID_ROWS && boardCol >= 0 && boardCol < GRID_COLS) {
                                  newGrid[boardRow][boardCol] = {
                                    filled: true,
                                    colorKey: piece.colorKey,
                                  };
                                }
                              }
                            }
                          }

                          return newGrid;
                        }

                        /**
                         * Detects full horizontal rows (10 cells), clears them, and gravitationally collapses upper rows down!
                         */
                          export function clearFullLines(grid: FallingGrid): LineClearResult {
                            const clearedRowIndices: number[] = [];

                                // Identify full rows
                                for (let r = 0; r < GRID_ROWS; r++) {
                                  if (grid[r].every((cell) => cell.filled)) {
                                    clearedRowIndices.push(r);
                                  }
                                }

                                  if (clearedRowIndices.length === 0) {
                                    return {
                                      newGrid: grid,
                                      linesCleared: 0,
                                      clearedRowIndices: [],
                                    };
                                  }

                                  // Filter out cleared rows
                                  const remainingRows = grid.filter((_, r) => !clearedRowIndices.includes(r));

                                  // Add new empty rows at the top (gravity drop)
                                  const emptyRowsToAdd = clearedRowIndices.length;
                                  const newEmptyRows: FallingGrid = Array.from({ length: emptyRowsToAdd }, () =>
                                    Array.from({ length: GRID_COLS }, () => ({ filled: false }))
                                  );

                                  const newGrid: FallingGrid = [...newEmptyRows, ...remainingRows];

                                  return {
                                    newGrid,
                                    linesCleared: clearedRowIndices.length,
                                    clearedRowIndices,
                                  };
                                }

                                /**
                                 * Calculates score for lines cleared, including multi-line blast and combo streaks
                                 */
                                  export function calculateFallingScore(
                                    linesCleared: number,
                                  comboStreak: number,
                                    level: number
): { points: number; title ?: string } {
                                    if (linesCleared === 0) {
                                      return { points: 0 };
                                    }

                                    // Standard scaling: 1 = 100, 2 = 300, 3 = 600, 4 = 1200
                                    let basePoints = 100;
                                    let title = 'LINE BLAST!';

                                      if (linesCleared === 1) {
                                        basePoints = 100 * level;
                                        title = comboStreak > 1 ? `COMBO x${comboStreak}!` : 'LINE BLAST!';
                                      } else if (linesCleared === 2) {
                                        basePoints = 300 * level;
                                        title = comboStreak > 1 ? `COMBO x${comboStreak}! DOUBLE BLAST!` : 'DOUBLE BLAST!';
                                      } else if (linesCleared === 3) {
                                        basePoints = 600 * level;
                                        title = comboStreak > 1 ? `COMBO x${comboStreak}! TRIPLE SHATTER!` : 'TRIPLE SHATTER!';
                                      } else if (linesCleared >= 4) {
                                        basePoints = 1200 * level;
                                        title = '💥 TETRIS MEGA BLAST! 💥';
                                      }

                                      const streakBonus = comboStreak > 1 ? Math.round(basePoints * (comboStreak * 0.4)) : 0;
                                      const total = basePoints + streakBonus;

                                      return {
                                        points: total,
                                        title,
                                      };
                                    }

                                    /**
                                     * 7-Bag Randomizer: Guarantees even distribution of all 7 Tetromino shapes
                                     */
                                      export class TetrominoBag {
                                        private bag: TetrominoType[] = [];

  private refill() {
                                          const pieces = [...ALL_TETROMINO_TYPES];
                                          // Fisher-Yates shuffle
                                          for (let i = pieces.length - 1; i > 0; i--) {
                                            const j = Math.floor(Math.random() * (i + 1));
                                            [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
                                          }
                                          this.bag = pieces;
                                        }

                                            next(): TetrominoType {
                                              if (this.bag.length === 0) {
                                                this.refill();
                                              }
                                              return this.bag.pop()!;
                                            }
                                          }
