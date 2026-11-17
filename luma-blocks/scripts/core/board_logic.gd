# ============================================================
# Luma Blocks — 8x8 Board Logic (Deterministic Pure Engine)
# ============================================================
class_name BoardLogic
extends RefCounted

const GRID_SIZE: int = 8

# 8x8 matrix of cells: each cell is {"filled": bool, "color_id": int}
var grid: Array[Array] = []

func _init() -> void:
	reset_grid()

func reset_grid() -> void:
	grid.clear()
	for r in range(GRID_SIZE):
		var row: Array = []
		for c in range(GRID_SIZE):
			row.append({
				"filled": false,
				"color_id": -1
			})
		grid.append(row)

func get_cell(row: int, col: int) -> Dictionary:
	if is_in_bounds(row, col):
		return grid[row][col]
	return {"filled": false, "color_id": -1}

func is_in_bounds(row: int, col: int) -> bool:
	return row >= 0 and row < GRID_SIZE and col >= 0 and col < GRID_SIZE

func calculate_occupancy() -> float:
	var filled_count: int = 0
	var total: int = GRID_SIZE * GRID_SIZE
	for r in range(GRID_SIZE):
		for c in range(GRID_SIZE):
			if grid[r][c]["filled"]:
				filled_count += 1
	return float(filled_count) / float(total)

# Check if piece matrix can be placed with top-left anchor at (start_row, start_col)
func can_place_piece(matrix: Array, start_row: int, start_col: int) -> bool:
	if start_row < 0 or start_col < 0:
		return false

	var rows: int = matrix.size()
	for r in range(rows):
		var row_arr: Array = matrix[r]
		for c in range(row_arr.size()):
			if row_arr[c]:
				var target_r: int = start_row + r
				var target_c: int = start_col + c

				if target_r >= GRID_SIZE or target_c >= GRID_SIZE:
					return false
				if grid[target_r][target_c]["filled"]:
					return false
	return true

# Commit piece onto grid
func place_piece(matrix: Array, color_id: int, start_row: int, start_col: int) -> bool:
	if not can_place_piece(matrix, start_row, start_col):
		return false

	var rows: int = matrix.size()
	for r in range(rows):
		var row_arr: Array = matrix[r]
		for c in range(row_arr.size()):
			if row_arr[c]:
				var target_r: int = start_row + r
				var target_c: int = start_col + c
				grid[target_r][target_c]["filled"] = true
				grid[target_r][target_c]["color_id"] = color_id
	return true

# Detect complete rows and columns, clear them simultaneously, return metadata
func check_and_clear_lines() -> Dictionary:
	var full_rows: Array[int] = []
	var full_cols: Array[int] = []

	# Check horizontal rows
	for r in range(GRID_SIZE):
		var row_full: bool = true
		for c in range(GRID_SIZE):
			if not grid[r][c]["filled"]:
				row_full = false
				break
		if row_full:
			full_rows.append(r)

	# Check vertical columns
	for c in range(GRID_SIZE):
		var col_full: bool = true
		for r in range(GRID_SIZE):
			if not grid[r][c]["filled"]:
				col_full = false
				break
		if col_full:
			full_cols.append(c)

	# Collect unique cleared cells for particle animations
	var cleared_cells_set: Dictionary = {}
	var cleared_cells_list: Array[Dictionary] = []

	for r in full_rows:
		for c in range(GRID_SIZE):
			var key: String = str(r) + "_" + str(c)
			if not cleared_cells_set.has(key):
				cleared_cells_set[key] = true
				cleared_cells_list.append({
					"row": r,
					"col": c,
					"color_id": grid[r][c]["color_id"]
				})
			grid[r][c]["filled"] = false
			grid[r][c]["color_id"] = -1

	for c in full_cols:
		for r in range(GRID_SIZE):
			var key: String = str(r) + "_" + str(c)
			if not cleared_cells_set.has(key):
				cleared_cells_set[key] = true
				cleared_cells_list.append({
					"row": r,
					"col": c,
					"color_id": grid[r][c]["color_id"]
				})
			grid[r][c]["filled"] = false
			grid[r][c]["color_id"] = -1

	var total_lines: int = full_rows.size() + full_cols.size()

	return {
		"lines_cleared": total_lines,
		"cleared_rows": full_rows,
		"cleared_cols": full_cols,
		"cleared_cells": cleared_cells_list
	}

# Test if a piece matrix can fit anywhere on the current 8x8 grid
func can_piece_fit_anywhere(matrix: Array) -> bool:
	var rows: int = matrix.size()
	var cols: int = 0
	for r in range(rows):
		cols = max(cols, matrix[r].size())

	for r in range(GRID_SIZE - rows + 1):
		for c in range(GRID_SIZE - cols + 1):
			if can_place_piece(matrix, r, c):
				return true
	return false

# Check if ANY of the remaining pieces in the tray can fit anywhere
func can_any_piece_fit(pieces: Array) -> bool:
	if pieces.is_empty():
		return true

	for p in pieces:
		if p != null and p is Dictionary and p.has("matrix"):
			if can_piece_fit_anywhere(p["matrix"]):
				return true
	return false

# Clone state for Undo history
func get_state() -> Array:
	var state: Array = []
	for r in range(GRID_SIZE):
		var row: Array = []
		for c in range(GRID_SIZE):
			row.append({
				"filled": grid[r][c]["filled"],
				"color_id": grid[r][c]["color_id"]
			})
		state.append(row)
	return state

# Restore state from snapshot
func restore_state(state: Array) -> void:
	if state.size() != GRID_SIZE:
		return
	grid.clear()
	for r in range(GRID_SIZE):
		var row: Array = []
		for c in range(GRID_SIZE):
			row.append({
				"filled": state[r][c]["filled"],
				"color_id": state[r][c]["color_id"]
			})
		grid.append(row)
