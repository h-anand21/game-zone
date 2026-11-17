# ============================================================
# Luma Blocks — 8x8 Board View Component
# ============================================================
class_name BoardView
extends Control

signal line_clear_completed()

var board_logic: BoardLogic

# Visual sizing
var board_size: float = 640.0
var cell_size: float = 74.0
var gap: float = 6.0
var padding: float = 16.0

# Ghost preview state
var _ghost_row: int = -1
var _ghost_col: int = -1
var _ghost_matrix: Array = []
var _ghost_color_id: int = -1
var _is_ghost_valid: bool = false

# Flashing rows & columns for clear animation
var _clearing_rows: Array[int] = []
var _clearing_cols: Array[int] = []
var _clear_flash_alpha: float = 0.0

func _init() -> void:
	mouse_filter = MOUSE_FILTER_IGNORE

func setup(logic: BoardLogic, view_size: float = 640.0) -> void:
	board_logic = logic
	board_size = view_size
	custom_minimum_size = Vector2(board_size, board_size)
	size = custom_minimum_size

	padding = 16.0
	gap = 5.0
	var inner_size = board_size - (padding * 2.0)
	cell_size = (inner_size - (gap * float(BoardLogic.GRID_SIZE - 1))) / float(BoardLogic.GRID_SIZE)
	queue_redraw()

func set_ghost_preview(matrix: Array, color_id: int, row: int, col: int, is_valid: bool) -> void:
	_ghost_matrix = matrix
	_ghost_color_id = color_id
	_ghost_row = row
	_ghost_col = col
	_is_ghost_valid = is_valid
	queue_redraw()

func clear_ghost_preview() -> void:
	_ghost_row = -1
	_ghost_col = -1
	_ghost_matrix.clear()
	_is_ghost_valid = false
	queue_redraw()

# Screen position to grid (row, col) converter
func screen_to_grid(screen_point: Vector2) -> Vector2i:
	var local_pt = screen_point - global_position - Vector2(padding, padding)
	var step = cell_size + gap

	# Find closest top-left cell
	var c: int = int(round(local_pt.x / step))
	var r: int = int(round(local_pt.y / step))

	return Vector2i(r, c)

func get_cell_center_global(row: int, col: int) -> Vector2:
	var local_x = padding + float(col) * (cell_size + gap) + (cell_size * 0.5)
	var local_y = padding + float(row) * (cell_size + gap) + (cell_size * 0.5)
	return global_position + Vector2(local_x, local_y)

# Triggers clear animation with particle explosion
func play_clear_animation(cleared_data: Dictionary) -> void:
	_clearing_rows = cleared_data.get("cleared_rows", [])
	_clearing_cols = cleared_data.get("cleared_cols", [])

	var cleared_cells = cleared_data.get("cleared_cells", [])
	var cell_positions: Array[Vector2] = []
	var colors: Array[Color] = []

	for c_info in cleared_cells:
		var pos = get_cell_center_global(c_info["row"], c_info["col"])
		cell_positions.append(pos)
		var cid = c_info.get("color_id", 0)
		colors.append(ThemeManager.get_palette_color(cid))

	# Spawn particles
	if not cell_positions.is_empty():
		var burst = ParticleBurst.new()
		get_tree().root.add_child(burst)
		burst.emit_burst(cell_positions, colors, 5)

	# Flash tween
	_clear_flash_alpha = 1.0
	var tween = create_tween()
	tween.tween_property(self, "_clear_flash_alpha", 0.0, 0.28).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_callback(func():
		_clearing_rows.clear()
		_clearing_cols.clear()
		queue_redraw()
		line_clear_completed.emit()
	)

func _process(_delta: float) -> void:
	if _clear_flash_alpha > 0.0:
		queue_redraw()

func _draw() -> void:
	var theme = ThemeManager.get_current_theme()
	var outer_rect = Rect2(Vector2.ZERO, size)

	# Outer Board Frame
	draw_rect(outer_rect, theme["grid_bg"], true, -1.0)
	draw_rect(outer_rect, Color(1, 1, 1, 0.12), false, 2.0)

	# Inner background fill
	var inner_rect = Rect2(padding * 0.5, padding * 0.5, size.x - padding, size.y - padding)
	draw_rect(inner_rect, theme["bg_color"], true, -1.0)

	# 1. Draw 64 Empty Grooved Cells
	for r in range(BoardLogic.GRID_SIZE):
		for c in range(BoardLogic.GRID_SIZE):
			var cell_rect = _get_cell_rect(r, c)
			draw_rect(cell_rect, theme["empty_cell"], true, -1.0)
			draw_rect(cell_rect, theme["empty_cell_border"], false, 1.2)

	# 2. Draw Locked Placed Blocks
	if board_logic:
		for r in range(BoardLogic.GRID_SIZE):
			for c in range(BoardLogic.GRID_SIZE):
				var cell = board_logic.get_cell(r, c)
				if cell["filled"]:
					var color_id = cell["color_id"]
					var base_col = ThemeManager.get_palette_color(color_id)
					var shadow_col = base_col.darkened(0.35)
					var highlight_col = base_col.lightened(0.4)

					var cell_rect = _get_cell_rect(r, c)

					# 2.5D bottom shadow lip
					var shadow_rect = Rect2(cell_rect.position.x, cell_rect.position.y + 3, cell_rect.size.x, cell_rect.size.y)
					draw_rect(shadow_rect, shadow_col, true, -1.0)

					# Main block body
					draw_rect(cell_rect, base_col, true, -1.0)

					# Specular gloss highlight at top-left
					var shine_rect = Rect2(cell_rect.position.x + 3, cell_rect.position.y + 3, cell_rect.size.x * 0.45, cell_rect.size.y * 0.22)
					draw_rect(shine_rect, highlight_col, true, -1.0)

					# Border outline
					draw_rect(cell_rect, Color(1, 1, 1, 0.25), false, 1.0)

	# 3. Draw Ghost Preview Highlight
	if _ghost_row >= 0 and _ghost_col >= 0 and not _ghost_matrix.is_empty():
		var ghost_col = ThemeManager.get_palette_color(_ghost_color_id)
		var ghost_fill = Color(ghost_col.r, ghost_col.g, ghost_col.b, 0.35 if _is_ghost_valid else 0.15)
		var ghost_border = Color(ghost_col.r, ghost_col.g, ghost_col.b, 0.85 if _is_ghost_valid else 0.3)

		for r in range(_ghost_matrix.size()):
			var row_arr: Array = _ghost_matrix[r]
			for c in range(row_arr.size()):
				if row_arr[c]:
					var tr = _ghost_row + r
					var tc = _ghost_col + c
					if tr < BoardLogic.GRID_SIZE and tc < BoardLogic.GRID_SIZE:
						var cell_rect = _get_cell_rect(tr, tc)
						draw_rect(cell_rect, ghost_fill, true, -1.0)
						draw_rect(cell_rect, ghost_border, false, 2.0)

	# 4. Draw Line Clear White Flash
	if _clear_flash_alpha > 0.0:
		var flash_color = Color(1.0, 1.0, 1.0, _clear_flash_alpha * 0.8)

		for r in _clearing_rows:
			for c in range(BoardLogic.GRID_SIZE):
				var cell_rect = _get_cell_rect(r, c)
				draw_rect(cell_rect, flash_color, true, -1.0)

		for c in _clearing_cols:
			for r in range(BoardLogic.GRID_SIZE):
				var cell_rect = _get_cell_rect(r, c)
				draw_rect(cell_rect, flash_color, true, -1.0)

func _get_cell_rect(row: int, col: int) -> Rect2:
	var x = padding + float(col) * (cell_size + gap)
	var y = padding + float(row) * (cell_size + gap)
	return Rect2(x, y, cell_size, cell_size)
