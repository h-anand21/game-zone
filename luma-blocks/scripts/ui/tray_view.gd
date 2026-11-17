# ============================================================
# Luma Blocks — 3-Piece Bottom Tray View
# ============================================================
class_name TrayView
extends Control

signal piece_drag_started(piece: DraggablePiece)
signal piece_drag_moved(piece: DraggablePiece, sample_point: Vector2)
signal piece_drag_ended(piece: DraggablePiece, sample_point: Vector2)

var _slots: Array[Control] = []
var _pieces: Array[DraggablePiece] = []

var tray_cell_size: float = 24.0
var board_cell_size: float = 68.0

func _ready() -> void:
	custom_minimum_size = Vector2(680, 160)
	_setup_slots()

func _setup_slots() -> void:
	for child in get_children():
		child.queue_free()
	_slots.clear()
	_pieces.resize(3)

	var slot_width: float = 210.0
	var slot_height: float = 140.0
	var spacing: float = 15.0

	for i in range(3):
		var slot = Control.new()
		slot.custom_minimum_size = Vector2(slot_width, slot_height)
		slot.size = Vector2(slot_width, slot_height)
		slot.position = Vector2(i * (slot_width + spacing), 10)
		slot.mouse_filter = MOUSE_FILTER_IGNORE
		add_child(slot)
		_slots.append(slot)

func populate_tray(piece_data_list: Array[Dictionary], b_cell_size: float) -> void:
	board_cell_size = b_cell_size
	clear_tray()

	for i in range(mini(3, piece_data_list.size())):
		var p_data = piece_data_list[i]
		if p_data.is_empty():
			continue

		var piece = DraggablePiece.new()
		piece.setup(p_data, i, tray_cell_size, board_cell_size)
		add_child(piece)
		_pieces[i] = piece

		# Center piece within its slot
		var slot = _slots[i]
		var centered_pos = slot.position + (slot.size - piece.custom_minimum_size) * 0.5
		piece.set_origin_pos(centered_pos)

		# Deal slide-in animation
		piece.modulate.a = 0.0
		piece.scale = Vector2(0.2, 0.2)
		var tween = create_tween().set_parallel(true)
		var delay = i * 0.08
		tween.tween_property(piece, "modulate:a", 1.0, 0.25).set_delay(delay)
		tween.tween_property(piece, "scale", Vector2.ONE, 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT).set_delay(delay)

		piece.drag_started.connect(func(p): piece_drag_started.emit(p))
		piece.drag_moved.connect(func(p, pt): piece_drag_moved.emit(p, pt))
		piece.drag_ended.connect(func(p, pt): piece_drag_ended.emit(p, pt))

func remove_piece(piece: DraggablePiece) -> void:
	var idx = _pieces.find(piece)
	if idx != -1:
		_pieces[idx] = null
	piece.queue_free()

func clear_tray() -> void:
	for p in _pieces:
		if is_instance_valid(p):
			p.queue_free()
	_pieces = [null, null, null]

func get_active_pieces_data() -> Array[Dictionary]:
	var list: Array[Dictionary] = []
	for p in _pieces:
		if is_instance_valid(p):
			list.append(p.piece_data)
		else:
			list.append({})
	return list

func get_remaining_count() -> int:
	var c = 0
	for p in _pieces:
		if is_instance_valid(p):
			c += 1
	return c
