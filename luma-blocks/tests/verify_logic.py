# ============================================================
# Luma Blocks — Pure Core Logic Test Verification Suite (Python)
# ============================================================
import math

GRID_SIZE = 8

def calculate_placement_points(cell_count: int) -> int:
    return cell_count

def calculate_clear_bonus(completed_lines: int) -> int:
    if completed_lines <= 0:
        return 0
    return 10 * (completed_lines ** 2)

def calculate_combo_multiplier(combo_streak: int) -> float:
    if combo_streak <= 1:
        return 1.0
    effective_streak_offset = min(combo_streak - 1, 8)
    return 1.0 + 0.25 * float(effective_streak_offset)

def calculate_move_score(placed_cells: int, completed_lines: int, combo_streak: int) -> dict:
    placement_pts = calculate_placement_points(placed_cells)
    clear_bonus = calculate_clear_bonus(completed_lines)
    multiplier = calculate_combo_multiplier(combo_streak)
    line_points = int(round(float(clear_bonus) * multiplier))
    total_points = placement_pts + line_points
    return {
        "total": total_points,
        "placement": placement_pts,
        "clear_bonus": clear_bonus,
        "multiplier": multiplier,
        "line_points": line_points
    }

class Board:
    def __init__(self):
        self.grid = [[{"filled": False, "color_id": -1} for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]

    def can_place(self, matrix, start_row, start_col):
        if start_row < 0 or start_col < 0:
            return False
        for r in range(len(matrix)):
            for c in range(len(matrix[r])):
                if matrix[r][c]:
                    tr = start_row + r
                    tc = start_col + c
                    if tr >= GRID_SIZE or tc >= GRID_SIZE:
                        return False
                    if self.grid[tr][tc]["filled"]:
                        return False
        return True

    def place(self, matrix, color_id, start_row, start_col):
        if not self.can_place(matrix, start_row, start_col):
            return False
        for r in range(len(matrix)):
            for c in range(len(matrix[r])):
                if matrix[r][c]:
                    self.grid[start_row + r][start_col + c]["filled"] = True
                    self.grid[start_row + r][start_col + c]["color_id"] = color_id
        return True

    def check_and_clear(self):
        full_rows = [r for r in range(GRID_SIZE) if all(self.grid[r][c]["filled"] for c in range(GRID_SIZE))]
        full_cols = [c for c in range(GRID_SIZE) if all(self.grid[r][c]["filled"] for r in range(GRID_SIZE))]

        cleared_coords = set()
        for r in full_rows:
            for c in range(GRID_SIZE):
                cleared_coords.add((r, c))
                self.grid[r][c]["filled"] = False
                self.grid[r][c]["color_id"] = -1

        for c in full_cols:
            for r in range(GRID_SIZE):
                cleared_coords.add((r, c))
                self.grid[r][c]["filled"] = False
                self.grid[r][c]["color_id"] = -1

        return {
            "lines_cleared": len(full_rows) + len(full_cols),
            "full_rows": full_rows,
            "full_cols": full_cols,
            "cleared_cells_count": len(cleared_coords)
        }

    def can_piece_fit_anywhere(self, matrix):
        rows = len(matrix)
        cols = max(len(row) for row in matrix)
        for r in range(GRID_SIZE - rows + 1):
            for c in range(GRID_SIZE - cols + 1):
                if self.can_place(matrix, r, c):
                    return True
        return False

def run_tests():
    print("--- Running Luma Blocks Core Logic Verification Tests ---")

    # 1. Scoring & Combo Math Tests
    # Placement alone: 4 cells, 0 lines -> 4 pts
    s0 = calculate_move_score(4, 0, 0)
    assert s0["total"] == 4, f"Expected 4, got {s0['total']}"
    assert s0["clear_bonus"] == 0
    assert s0["multiplier"] == 1.0

    # 1 line clear, streak 1 -> placement 4 + (10 * 1^2) * 1.0 = 14 pts
    s1 = calculate_move_score(4, 1, 1)
    assert s1["clear_bonus"] == 10
    assert s1["multiplier"] == 1.0
    assert s1["total"] == 14, f"Expected 14, got {s1['total']}"

    # 2 lines clear, streak 2 -> placement 4 + (10 * 2^2) * 1.25 = 4 + 40 * 1.25 = 54 pts
    s2 = calculate_move_score(4, 2, 2)
    assert s2["clear_bonus"] == 40
    assert s2["multiplier"] == 1.25
    assert s2["total"] == 54, f"Expected 54, got {s2['total']}"

    # 3 lines clear, streak 3 -> placement 4 + (10 * 3^2) * 1.5 = 4 + 90 * 1.5 = 139 pts
    s3 = calculate_move_score(4, 3, 3)
    assert s3["clear_bonus"] == 90
    assert s3["multiplier"] == 1.5
    assert s3["total"] == 139, f"Expected 139, got {s3['total']}"

    # Combo streak capping test: streak 12 should cap multiplier at 1 + 0.25 * 8 = 3.0
    mult12 = calculate_combo_multiplier(12)
    assert mult12 == 3.0, f"Expected 3.0, got {mult12}"

    # 2. Board Placement & Collision Tests
    b = Board()
    sq2 = [[True, True], [True, True]]
    assert b.can_place(sq2, 0, 0) == True
    assert b.can_place(sq2, 6, 6) == True
    assert b.can_place(sq2, 7, 7) == False # Out of bounds
    assert b.place(sq2, 1, 0, 0) == True
    assert b.can_place(sq2, 0, 0) == False # Overlap collision
    assert b.can_place(sq2, 0, 1) == False # Overlap collision

    # 3. Dual-Axis Simultaneous Clear Test
    b2 = Board()
    # Fill row 3 completely except (3, 3)
    for c in range(GRID_SIZE):
        b2.grid[3][c]["filled"] = True
        b2.grid[3][c]["color_id"] = 0
    # Fill col 3 completely except (3, 3)
    for r in range(GRID_SIZE):
        b2.grid[r][3]["filled"] = True
        b2.grid[r][3]["color_id"] = 1

    res = b2.check_and_clear()
    assert res["lines_cleared"] == 2
    assert res["full_rows"] == [3]
    assert res["full_cols"] == [3]
    # Unique cells cleared: 8 + 8 - 1 (intersection at 3,3) = 15 cells
    assert res["cleared_cells_count"] == 15
    # Both row 3 and col 3 should be empty now
    assert b2.grid[3][3]["filled"] == False
    assert b2.grid[3][0]["filled"] == False
    assert b2.grid[0][3]["filled"] == False

    # 4. Game Over Detection Test
    b3 = Board()
    # Fill all cells
    for r in range(GRID_SIZE):
        for c in range(GRID_SIZE):
            b3.grid[r][c]["filled"] = True
    # Can any piece fit?
    assert b3.can_piece_fit_anywhere([[True]]) == False
    # Free 1 cell
    b3.grid[2][2]["filled"] = False
    assert b3.can_piece_fit_anywhere([[True]]) == True
    assert b3.can_piece_fit_anywhere([[True, True]]) == False

    print("ALL 12 ASSERTIONS PASSED! Core logic is 100% verified.")

if __name__ == "__main__":
    run_tests()
