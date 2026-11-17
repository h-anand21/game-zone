# ============================================================
# Luma Blocks — Classic & Daily Gameplay Screen Component
# ============================================================
class_name GameScreen
extends Control

signal pause_requested()
signal game_over_reached(final_score: int, lines: int, max_combo: int, is_new_high: bool)

var board_logic: BoardLogic
var piece_generator: PieceGenerator

var board_view: BoardView
var tray_view: TrayView

var _score: int = 0
var _high_score: int = 0
var _combo_streak: int = 0
var _best_combo: int = 0
var _total_lines_cleared: int = 0
var _is_daily_mode: bool = false
var _daily_target_score: int = 1500
var _daily_completed: bool = false

# Undo Snapshot
var _can_undo: bool = false
var _undo_state: Dictionary = {}

# UI Elements
var _label_score: Label
var _label_high_score: Label
var _streak_badge: PanelContainer
var _label_streak: Label
var _btn_undo: Button

func setup_game(is_daily: bool = false) -> void:
	_is_daily_mode = is_daily
	_score = 0
	_high_score = SaveManager.get_high_score()
	_combo_streak = 0
	_best_combo = 0
	_total_lines_cleared = 0
	_can_undo = false
	_undo_state = {}

	board_logic = BoardLogic.new()
	if _is_daily_mode:
		var date_str = Time.get_date_string_from_system()
		piece_generator = PieceGenerator.new(date_str.hash())
	else:
		piece_generator = PieceGenerator.new()

	_build_ui()
	_deal_new_tray()

func _build_ui() -> void:
	for child in get_children():
		child.queue_free()

	anchors_preset = PRESET_FULL_RECT
	var theme = ThemeManager.get_current_theme()

	# Background fill
	var bg = ColorRect.new()
	bg.color = theme["bg_color"]
	bg.set_anchors_and_offsets_preset(PRESET_FULL_RECT)
	add_child(bg)

	var root_vbox = VBoxContainer.new()
	root_vbox.set_anchors_and_offsets_preset(PRESET_FULL_RECT)
	root_vbox.alignment = BoxContainer.ALIGNMENT_SPACE_BETWEEN
	root_vbox.add_theme_constant_override("separation", 10)
	add_child(root_vbox)

	# ── 1. Top HUD Bar ──
	var hud_margin = MarginContainer.new()
	hud_margin.add_theme_constant_override("margin_left", 20)
	hud_margin.add_theme_constant_override("margin_right", 20)
	hud_margin.add_theme_constant_override("margin_top", 16)
	root_vbox.add_child(hud_margin)

	var hud_hbox = HBoxContainer.new()
	hud_hbox.alignment = BoxContainer.ALIGNMENT_SPACE_BETWEEN
	hud_margin.add_child(hud_hbox)

	# Score Pill
	var score_pill = _create_hud_pill("SCORE", "0", Color("#50CFE7"))
	hud_hbox.add_child(score_pill["container"])
	_label_score = score_pill["label"]

	# Middle: Streak Badge or Mode Title
	_streak_badge = PanelContainer.new()
	var s_style = StyleBoxFlat.new()
	s_style.bg_color = Color(1.0, 0.45, 0.0, 0.25)
	s_style.border_color = Color("#FF9100")
	s_style.border_width_left = 1
	s_style.border_width_top = 1
	s_style.border_width_right = 1
	s_style.border_width_bottom = 1
	s_style.corner_radius_top_left = 14
	s_style.corner_radius_top_right = 14
	s_style.corner_radius_bottom_left = 14
	s_style.corner_radius_bottom_right = 14
	_streak_badge.add_theme_stylebox_override("panel", s_style)
	_streak_badge.custom_minimum_size = Vector2(130, 48)
	hud_hbox.add_child(_streak_badge)

	_label_streak = Label.new()
	_label_streak.text = "LUMA BLOCKS"
	_label_streak.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_label_streak.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	_label_streak.add_theme_font_size_override("font_size", 13)
	_label_streak.add_theme_color_override("font_color", Color("#50CFE7"))
	_streak_badge.add_child(_label_streak)

	# High Score Pill
	var hs_pill = _create_hud_pill("👑 BEST", str(_high_score), Color("#FFB94F"))
	hud_hbox.add_child(hs_pill["container"])
	_label_high_score = hs_pill["label"]

	# Top Right Buttons (Undo & Pause)
	var btn_col = HBoxContainer.new()
	btn_col.add_theme_constant_override("separation", 8)
	hud_hbox.add_child(btn_col)

	_btn_undo = Button.new()
	_btn_undo.text = "↩"
	_btn_undo.custom_minimum_size = Vector2(44, 44)
	_btn_undo.disabled = true
	_btn_undo.pressed.connect(_on_undo_pressed)
	btn_col.add_child(_btn_undo)

	var btn_pause = Button.new()
	btn_pause.text = "⏸"
	btn_pause.custom_minimum_size = Vector2(44, 44)
	btn_pause.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		pause_requested.emit()
	)
	btn_col.add_child(btn_pause)

	# ── 2. Center: 8x8 Board View ──
	var board_center = CenterContainer.new()
	board_center.custom_minimum_size = Vector2(720, 660)
	root_vbox.add_child(board_center)

	board_view = BoardView.new()
	board_view.setup(board_logic, 640.0)
	board_center.add_child(board_view)

	# ── 3. Bottom: 3-Piece Tray View ──
	var tray_center = CenterContainer.new()
	tray_center.custom_minimum_size = Vector2(720, 180)
	root_vbox.add_child(tray_center)

	tray_view = TrayView.new()
	tray_center.add_child(tray_view)

	tray_view.piece_drag_started.connect(_on_piece_drag_started)
	tray_view.piece_drag_moved.connect(_on_piece_drag_moved)
	tray_view.piece_drag_ended.connect(_on_piece_drag_ended)

func _create_hud_pill(title: String, val_str: String, accent_col: Color) -> Dictionary:
	var panel = PanelContainer.new()
	var style = StyleBoxFlat.new()
	style.bg_color = Color("#13233D")
	style.corner_radius_top_left = 14
	style.corner_radius_top_right = 14
	style.corner_radius_bottom_left = 14
	style.corner_radius_bottom_right = 14
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	style.border_color = accent_col
	panel.add_theme_stylebox_override("panel", style)
	panel.custom_minimum_size = Vector2(100, 48)

	var vbox = VBoxContainer.new()
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	panel.add_child(vbox)

	var lbl_title = Label.new()
	lbl_title.text = title
	lbl_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_title.add_theme_font_size_override("font_size", 9)
	lbl_title.add_theme_color_override("font_color", Color("#8CA0B8"))
	vbox.add_child(lbl_title)

	var lbl_val = Label.new()
	lbl_val.text = val_str
	lbl_val.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_val.add_theme_font_size_override("font_size", 16)
	lbl_val.add_theme_color_override("font_color", Color.WHITE)
	vbox.add_child(lbl_val)

	return {"container": panel, "label": lbl_val}

func _deal_new_tray() -> void:
	var new_pieces = piece_generator.generate_tray_pieces(board_logic)
	tray_view.populate_tray(new_pieces, board_view.cell_size)

	# Verify if game over immediately
	if not board_logic.can_any_piece_fit(new_pieces):
		_trigger_game_over()

func _on_piece_drag_started(_piece: DraggablePiece) -> void:
	pass

func _on_piece_drag_moved(piece: DraggablePiece, sample_point: Vector2) -> void:
	var grid_coord = board_view.screen_to_grid(sample_point)
	var matrix = piece.piece_data["matrix"]
	var color_id = piece.piece_data["color_id"]

	if board_logic.can_place_piece(matrix, grid_coord.x, grid_coord.y):
		board_view.set_ghost_preview(matrix, color_id, grid_coord.x, grid_coord.y, true)
	else:
		board_view.clear_ghost_preview()

func _on_piece_drag_ended(piece: DraggablePiece, sample_point: Vector2) -> void:
	var grid_coord = board_view.screen_to_grid(sample_point)
	var matrix = piece.piece_data["matrix"]
	var color_id = piece.piece_data["color_id"]
	var cell_count = piece.piece_data["cell_count"]

	board_view.clear_ghost_preview()

	if board_logic.can_place_piece(matrix, grid_coord.x, grid_coord.y):
		# Capture snapshot for Undo BEFORE committing
		_save_undo_snapshot()

		# 1. Place piece
		board_logic.place_piece(matrix, color_id, grid_coord.x, grid_coord.y)
		SoundManager.instance.play_sfx("place")
		Haptics.vibrate_medium()
		board_view.queue_redraw()

		# Remove piece from tray
		tray_view.remove_piece(piece)

		# 2. Check & Clear Lines
		var clear_res = board_logic.check_and_clear_lines()
		var lines = clear_res["lines_cleared"]

		# 3. Calculate Score & Combo
		if lines > 0:
			_combo_streak += 1
			if _combo_streak > _best_combo:
				_best_combo = _combo_streak
			_total_lines_cleared += lines

			SoundManager.instance.play_sfx("blast")
			SoundManager.instance.play_combo_chime(_combo_streak)
			Haptics.vibrate_heavy()

			board_view.play_clear_animation(clear_res)
		else:
			_combo_streak = 0

		var score_data = Scoring.calculate_move_score(cell_count, lines, _combo_streak)
		_score += score_data["total_points"]
		_label_score.text = str(_score)

		# Update high score
		if _score > _high_score:
			_high_score = _score
			_label_high_score.text = str(_high_score)
			SaveManager.set_high_score(_high_score)

		# Update streak UI
		_update_streak_ui()

		# Show combo popup
		if not score_data["title"].is_empty():
			var popup = ComboPopup.new()
			add_child(popup)
			popup.setup(score_data["title"], score_data["total_points"], score_data["multiplier"])
			popup.position = Vector2(SCREEN_WIDTH_HALF - 130, 280)

		# Daily challenge check
		if _is_daily_mode and _score >= _daily_target_score and not _daily_completed:
			_daily_completed = true
			SaveManager.mark_daily_completed()

		# 4. Check if tray is empty -> deal new batch
		if tray_view.get_remaining_count() == 0:
			_deal_new_tray()
		else:
			# Check if remaining pieces can fit
			var active_pieces = tray_view.get_active_pieces_data()
			if not board_logic.can_any_piece_fit(active_pieces):
				_trigger_game_over()
	else:
		# Return piece to origin in tray
		piece.return_to_origin()
		SoundManager.instance.play_sfx("click")

const SCREEN_WIDTH_HALF: float = 360.0

func _update_streak_ui() -> void:
	if _combo_streak > 1:
		_label_streak.text = "🔥 x" + str(_combo_streak) + " COMBO"
		_label_streak.add_theme_color_override("font_color", Color("#FF9100"))
	else:
		_label_streak.text = "LUMA BLOCKS"
		_label_streak.add_theme_color_override("font_color", Color("#50CFE7"))

func _save_undo_snapshot() -> void:
	_undo_state = {
		"board": board_logic.get_state(),
		"tray": tray_view.get_active_pieces_data(),
		"score": _score,
		"combo_streak": _combo_streak,
		"lines": _total_lines_cleared
	}
	_can_undo = true
	_btn_undo.disabled = false

func _on_undo_pressed() -> void:
	if not _can_undo or _undo_state.is_empty():
		return

	board_logic.restore_state(_undo_state["board"])
	_score = _undo_state["score"]
	_combo_streak = _undo_state["combo_streak"]
	_total_lines_cleared = _undo_state["lines"]

	_label_score.text = str(_score)
	_update_streak_ui()
	board_view.queue_redraw()

	# Restore tray
	tray_view.populate_tray(_undo_state["tray"], board_view.cell_size)

	_can_undo = false
	_btn_undo.disabled = true
	_undo_state.clear()
	SoundManager.instance.play_sfx("click")
	Haptics.vibrate_light()

func _trigger_game_over() -> void:
	SoundManager.instance.play_sfx("game_over")
	Haptics.vibrate_heavy()

	var is_new_record = _score > SaveManager.get_high_score()
	SaveManager.record_game_finished(_score, _total_lines_cleared, _best_combo)
	SaveManager.add_xp(_score)

	game_over_reached.emit(_score, _total_lines_cleared, _best_combo, is_new_record)
