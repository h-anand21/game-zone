# ============================================================
# Luma Blocks — Exact Scoring Rules & Combo Math
# ============================================================
class_name Scoring
extends RefCounted

# Placement = number of placed cells
static func calculate_placement_points(cell_count: int) -> int:
	return cell_count

# Clear bonus = 10 * completed_lines^2
static func calculate_clear_bonus(completed_lines: int) -> int:
	if completed_lines <= 0:
		return 0
	return 10 * completed_lines * completed_lines

# Combo multiplier = 1 + 0.25 * min(combo_streak - 1, 8)
# When combo_streak == 1 (first clear in streak): multiplier is 1.0
# When combo_streak == 2: multiplier is 1.25
# Max multiplier at streak >= 9: 1 + 0.25 * 8 = 3.0
static func calculate_combo_multiplier(combo_streak: int) -> float:
	if combo_streak <= 1:
		return 1.0
	var effective_streak_offset: int = mini(combo_streak - 1, 8)
	return 1.0 + 0.25 * float(effective_streak_offset)

# Calculate total move score:
# Integer score = placement + round(clear_bonus * multiplier)
static func calculate_move_score(placed_cells: int, completed_lines: int, combo_streak: int) -> Dictionary:
	var placement_pts: int = calculate_placement_points(placed_cells)
	var clear_bonus: int = calculate_clear_bonus(completed_lines)
	var multiplier: float = calculate_combo_multiplier(combo_streak)
	var line_points: int = int(round(float(clear_bonus) * multiplier))
	var total_points: int = placement_pts + line_points

	var title: String = ""
	if completed_lines > 0:
		if combo_streak > 1:
			title = "COMBO x" + str(combo_streak) + "!"
		elif completed_lines == 1:
			title = "LINE CLEAR!"
		elif completed_lines == 2:
			title = "DOUBLE BLAST!"
		elif completed_lines == 3:
			title = "TRIPLE BLAST!"
		elif completed_lines >= 4:
			title = "LUMA QUAD BLAST!"

	return {
		"total_points": total_points,
		"placement_points": placement_pts,
		"clear_bonus": clear_bonus,
		"multiplier": multiplier,
		"line_points": line_points,
		"title": title
	}
