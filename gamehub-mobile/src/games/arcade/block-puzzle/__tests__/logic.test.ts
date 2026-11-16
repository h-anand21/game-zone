// ============================================================
// Falling Jewel Blast — Logic Engine Unit Tests
// ============================================================

import {
  createEmptyGrid,
  canPlaceAt,
  getGhostRow,
  spawnPiece,
  tryRotatePiece,
  lockPiece,
  clearFullLines,
  calculateFallingScore,
  TetrominoBag,
  GRID_COLS,
  GRID_ROWS,
} from '../logic';

    describe('Falling Jewel Blast Logic Engine', () => {
      it('creates an empty 10x20 grid', () => {
        const grid = createEmptyGrid();
        expect(grid.length).toBe(GRID_ROWS);
        expect(grid[0].length).toBe(GRID_COLS);
        expect(grid.every((row) => row.every((c) => !c.filled))).toBe(true);
      });

        it('correctly calculates ghost landing row', () => {
          const grid = createEmptyGrid();
          const piece = spawnPiece('O'); // 2x2 square
          // With an empty grid, 2x2 square should drop all the way to row 18
          const ghostRow = getGhostRow(grid, piece.matrix, piece.row, piece.col);
          expect(ghostRow).toBe(GRID_ROWS - 2); // 18
        });

        it('rotates a piece with wall kicks near the boundary', () => {
          const grid = createEmptyGrid();
          const piece = spawnPiece('I');
          piece.col = GRID_COLS - 2; // Near right wall

          const rotated = tryRotatePiece(grid, piece, true);
          expect(rotated.rotationIndex).toBe(1);
          expect(canPlaceAt(grid, rotated.matrix, rotated.row, rotated.col)).toBe(true);
        });

          it('locks a piece onto the grid and clears full rows with gravity collapse', () => {
            let grid = createEmptyGrid();

              // Fill row 19 completely except columns 4 and 5
              for (let c = 0; c < GRID_COLS; c++) {
                if (c !== 4 && c !== 5) {
                  grid[19][c] = { filled: true, colorKey: 'amber' };
                }
              }

              // Spawn 2x2 square and drop it onto row 18 at col 4
              const piece = spawnPiece('O');
              piece.row = 18;
              piece.col = 4;

              // Lock piece
              grid = lockPiece(grid, piece);

              // Row 19 should now be completely full (all 10 cells)
              expect(grid[19].every((c) => c.filled)).toBe(true);

              // Clear lines
              const result = clearFullLines(grid);
              expect(result.linesCleared).toBe(1);
              expect(result.clearedRowIndices).toContain(19);

              // After clearing row 19, upper row (cells from row 18) should drop down to row 19!
              expect(result.newGrid[19][4].filled).toBe(true);
              expect(result.newGrid[19][5].filled).toBe(true);
              // Row 0 at the top should be empty
              expect(result.newGrid[0].every((c) => !c.filled)).toBe(true);
            });

            it('calculates score for single, double, triple, and tetris clears', () => {
              const single = calculateFallingScore(1, 1, 1);
              expect(single.points).toBe(100);

              const double = calculateFallingScore(2, 2, 1);
              expect(double.points).toBeGreaterThan(300);

              const tetris = calculateFallingScore(4, 1, 1);
              expect(tetris.points).toBe(1200);
              expect(tetris.title).toContain('TETRIS');
            });

              it('7-bag randomizer returns all 7 types in each cycle', () => {
                const bag = new TetrominoBag();
                const drawn = new Set<string>();
                for (let i = 0; i < 7; i++) {
                  drawn.add(bag.next());
                }
                expect(drawn.size).toBe(7);
              });
            });
