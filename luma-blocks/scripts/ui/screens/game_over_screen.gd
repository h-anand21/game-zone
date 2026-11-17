# ============================================================
# Luma Blocks — Game Over Screen Modal
# ============================================================
class_name GameOverScreen
extends Control

signal replay_requested()
signal home_requested()

func setup(final_score: int, lines: int, max_combo: int, is_new_high: bool) -> void:
	anchors_preset = PRESET_FULL_RECT
	for child in get_children():
		child.queue_free()

	# Dark backdrop
	var dim = ColorRect.new()
	dim.color = Color(0.04, 0.07, 0.12, 0.88)
	dim.set_anchors_and_offsets_preset(PRESET_FULL_RECT)
	add_child(dim)

	var center = CenterContainer.new()
	center.set_anchors_and_offsets_preset(PRESET_FULL_RECT)
	add_child(center)

	var card = PanelContainer.new()
	var style = StyleBoxFlat.new()
	style.bg_color = Color("#13233D")
	style.corner_radius_top_left = 24
	style.corner_radius_top_right = 24
	style.corner_radius_bottom_left = 24
	style.corner_radius_bottom_right = 24
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.border_color = Color("#FF729C") if not is_new_high else Color("#FFB94F")
	style.shadow_color = Color(0, 0, 0, 0.6)
	style.shadow_size = 20
	card.add_theme_stylebox_override("panel", style)
	card.custom_minimum_size = Vector2(400, 480)
	center.add_child(card)

	var vbox = VBoxContainer.new()
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	vbox.add_theme_constant_override("separation", 14)
	card.add_child(vbox)

	var title = Label.new()
	title.text = "NO MORE MOVES"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 28)
	title.add_theme_color_override("font_color", Color("#FF729C"))
	vbox.add_child(title)

	if is_new_high:
		var badge = Label.new()
		badge.text = "👑 NEW BEST SCORE! 👑"
		badge.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		badge.add_theme_font_size_override("font_size", 14)
		badge.add_theme_color_override("font_color", Color("#FFB94F"))
		vbox.add_child(badge)

	# Score display
	var score_box = VBoxContainer.new()
	score_box.alignment = BoxContainer.ALIGNMENT_CENTER
	vbox.add_child(score_box)

	var score_lbl = Label.new()
	score_lbl.text = "FINAL SCORE"
	score_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	score_lbl.add_theme_font_size_override("font_size", 11)
	score_lbl.add_theme_color_override("font_color", Color("#8CA0B8"))
	score_box.add_child(score_lbl)

	var score_val = Label.new()
	score_val.text = str(final_score)
	score_val.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	score_val.add_theme_font_size_override("font_size", 44)
	score_val.add_theme_color_override("font_color", Color.WHITE)
	score_box.add_child(score_val)

	# Stats breakdown row
	var stats_hbox = HBoxContainer.new()
	stats_hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	stats_hbox.add_theme_constant_override("separation", 24)
	vbox.add_child(stats_hbox)

	stats_hbox.add_child(_create_stat_item("LINES", str(lines), Color("#50CFE7")))
	stats_hbox.add_child(_create_stat_item("MAX COMBO", "x" + str(max_combo), Color("#FF9100")))
	stats_hbox.add_child(_create_stat_item("BEST", str(SaveManager.get_high_score()), Color("#FFB94F")))

	var sp = Control.new()
	sp.custom_minimum_size = Vector2(0, 10)
	vbox.add_child(sp)

	# Action buttons
	var btn_replay = Button.new()
	btn_replay.text = "PLAY AGAIN"
	btn_replay.custom_minimum_size = Vector2(320, 52)
	var b_style = StyleBoxFlat.new()
	b_style.bg_color = Color("#FFB94F")
	b_style.corner_radius_top_left = 26
	b_style.corner_radius_top_right = 26
	b_style.corner_radius_bottom_left = 26
	b_style.corner_radius_bottom_right = 26
	btn_replay.add_theme_stylebox_override("normal", b_style)
	btn_replay.add_theme_stylebox_override("hover", b_style)
	btn_replay.add_theme_stylebox_override("pressed", b_style)
	btn_replay.add_theme_font_size_override("font_size", 16)
	btn_replay.add_theme_color_override("font_color", Color("#07111F"))
	btn_replay.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		replay_requested.emit()
	)
	vbox.add_child(btn_replay)

	var btn_home = Button.new()
	btn_home.text = "HOME"
	btn_home.custom_minimum_size = Vector2(320, 48)
	var h_style = StyleBoxFlat.new()
	h_style.bg_color = Color("#203456")
	h_style.corner_radius_top_left = 24
	h_style.corner_radius_top_right = 24
	h_style.corner_radius_bottom_left = 24
	h_style.corner_radius_bottom_right = 24
	btn_home.add_theme_stylebox_override("normal", h_style)
	btn_home.add_theme_stylebox_override("hover", h_style)
	btn_home.add_theme_stylebox_override("pressed", h_style)
	btn_home.add_theme_font_size_override("font_size", 15)
	btn_home.add_theme_color_override("font_color", Color.WHITE)
	btn_home.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		home_requested.emit()
	)
	vbox.add_child(btn_home)

func _create_stat_item(label: String, val: String, col: Color) -> VBoxContainer:
	var vb = VBoxContainer.new()
	vb.alignment = BoxContainer.ALIGNMENT_CENTER
	var l = Label.new()
	l.text = label
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.add_theme_font_size_override("font_size", 10)
	l.add_theme_color_override("font_color", Color("#8CA0B8"))
	vb.add_child(l)

	var v = Label.new()
	v.text = val
	v.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_theme_font_size_override("font_size", 18)
	v.add_theme_color_override("font_color", col)
	vb.add_child(v)
	return vb
