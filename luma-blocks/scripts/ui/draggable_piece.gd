# ============================================================
# Luma Blocks — Draggable Piece Component (Touch & Mouse with Finger Offset)
# ============================================================
class_name DraggablePiece
extends Control

signal drag_started(piece: DraggablePiece)
signal drag_moved(piece: DraggablePiece, sample_point: Vector2)
signal drag_ended(piece: DraggablePiece, sample_point: Vector2)

var piece_data: Dictionary = {}
var tray_index: int = 0
var tray_cell_size: float = 24.0
var board_cell_size: float = 68.0

var _is_dragging: bool = false
var _origin_position: Vector2
var _drag_touch_offset: Vector2 = Vector2.ZERO

# Finger vertical offset: piece floats above finger so thumb does not occlude the grid!
const FINGER_VERTICAL_OFFSET: float = 88.0

func setup(data: Dictionary, index: int, t_cell_size: float, b_cell_size: float) -> void:
	piece_data = data
	tray_index = index
	tray_cell_size = t_cell_size
	board_cell_size = b_cell_size

	var matrix: Array = piece_data.get("matrix", [])
	var rows = matrix.size()
	var cols = 0
	for r in range(rows):
		cols = max(cols, matrix[r].size())

	custom_minimum_size = Vector2(cols * tray_cell_size, rows * tray_cell_size)
	pivot_offset = custom_minimum_size * 0.5
	mouse_filter = MOUSE_FILTER_PASS
	queue_redraw()

func set_origin_pos(pos: Vector2) -> void:
	_origin_position = pos
	position = pos

func _gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				_start_drag(event.global_position)
			elif _is_dragging:
				_end_drag(event.global_position)
	elif event is InputEventMouseMotion and _is_dragging:
		_move_drag(event.global_position)
	elif event is InputEventScreenTouch:
		if event.pressed:
			_start_drag(event.position)
		elif _is_dragging:
			_end_drag(event.position)
	elif event is InputEventScreenDrag and _is_dragging:
		_move_drag(event.position)

func _start_drag(global_touch_pos: Vector2) -> void:
	_is_dragging = true
	z_index = 100

	# Calculate offset from center of piece to touch position
	var piece_center_global = global_position + (size * 0.5)
	_drag_touch_offset = piece_center_global - global_touch_pos

	# Tween scale up to board cell scale
	var target_scale = Vector2(board_cell_size / tray_cell_size, board_cell_size / tray_cell_size)
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "scale", target_scale, 0.12).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)

	SoundManager.instance.play_sfx("pickup")
	Haptics.vibrate_light()

	drag_started.emit(self)
	_move_drag(global_touch_pos)

func _move_drag(global_touch_pos: Vector2) -> void:
	if not _is_dragging:
		return

	# Float piece above finger by FINGER_VERTICAL_OFFSET
	var floating_target = global_touch_pos + _drag_touch_offset - Vector2(0, FINGER_VERTICAL_OFFSET)
	global_position = floating_target - (size * 0.5 * scale)

	# The anchor sample point is the top-left of the piece bounding box at board scale
	var sample_point = global_position
	drag_moved.emit(self, sample_point)

func _end_drag(global_touch_pos: Vector2) -> void:
	if not _is_dragging:
		return

	_is_dragging = false
	var sample_point = global_position
	drag_ended.emit(self, sample_point)

func return_to_origin() -> void:
	z_index = 0
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "position", _origin_position, 0.28).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "scale", Vector2.ONE, 0.24).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)

func _draw() -> void:
	var matrix: Array = piece_data.get("matrix", [])
	var color_id: int = piece_data.get("color_id", 0)

	var base_col: Color = ThemeManager.get_palette_color(color_id)
	var shadow_col: Color = base_col.darkened(0.35)
	var highlight_col: Color = base_col.lightened(0.4)

	var radius: float = max(3.0, tray_cell_size * 0.18)
	var gap: float = 2.0
	var cell_draw_size: float = tray_cell_size - gap

	for r in range(matrix.size()):
		var row: Array = matrix[r]
		for c in range(row.size()):
			if row[c]:
				var cell_rect = Rect2(c * tray_cell_size, r * tray_cell_size, cell_draw_size, cell_draw_size)

				# 2.5D bottom shadow lip
				var shadow_rect = Rect2(cell_rect.position.x, cell_rect.position.y + 2, cell_draw_size, cell_draw_size)
				draw_rect(shadow_rect, shadow_col, true, -1.0)

				# Main block body
				draw_rect(cell_rect, base_col, true, -1.0)

				# Specular top-left highlight shine
				var shine_rect = Rect2(cell_rect.position.x + 2, cell_rect.position.y + 2, cell_draw_size * 0.45, cell_draw_size * 0.24)
				draw_rect(shine_rect, highlight_col, true, -1.0)

				# Soft outer border
				draw_rect(cell_rect, Color(1, 1, 1, 0.18), false, 1.0)
