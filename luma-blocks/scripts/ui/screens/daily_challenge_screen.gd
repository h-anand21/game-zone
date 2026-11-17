# ============================================================
# Luma Blocks — Daily Challenge Screen
# ============================================================
class_name DailyChallengeScreen
extends Control

signal start_daily_requested()
signal back_requested()

func _ready() -> void:
	anchors_preset = PRESET_FULL_RECT
	_build_ui()

func _build_ui() -> void:
	for child in get_children():
		child.queue_free()

	var theme = ThemeManager.get_current_theme()
	var bg = ColorRect.new()
	bg.color = theme["bg_color"]
	bg.set_anchors_and_offsets_preset(PRESET_FULL_RECT)
	add_child(bg)

	var root_vbox = VBoxContainer.new()
	root_vbox.set_anchors_and_offsets_preset(PRESET_FULL_RECT)
	root_vbox.alignment = BoxContainer.ALIGNMENT_SPACE_BETWEEN
	root_vbox.add_theme_constant_override("separation", 16)
	add_child(root_vbox)

	# ── Header ──
	var header_margin = MarginContainer.new()
	header_margin.add_theme_constant_override("margin_left", 20)
	header_margin.add_theme_constant_override("margin_right", 20)
	header_margin.add_theme_constant_override("margin_top", 20)
	root_vbox.add_child(header_margin)

	var header_hbox = HBoxContainer.new()
	header_hbox.alignment = BoxContainer.ALIGNMENT_SPACE_BETWEEN
	header_margin.add_child(header_hbox)

	var btn_back = Button.new()
	btn_back.text = "← BACK"
	btn_back.custom_minimum_size = Vector2(90, 44)
	btn_back.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		back_requested.emit()
	)
	header_hbox.add_child(btn_back)

	var title_lbl = Label.new()
	title_lbl.text = "DAILY CHALLENGE"
	title_lbl.add_theme_font_size_override("font_size", 22)
	title_lbl.add_theme_color_override("font_color", Color.WHITE)
	header_hbox.add_child(title_lbl)

	var empty_spacer = Control.new()
	empty_spacer.custom_minimum_size = Vector2(90, 44)
	header_hbox.add_child(empty_spacer)

	# ── Content Center ──
	var center_vbox = VBoxContainer.new()
	center_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	center_vbox.add_theme_constant_override("separation", 20)
	root_vbox.add_child(center_vbox)

	var status = SaveManager.get_daily_status()

	# Streak Card
	var streak_card = PanelContainer.new()
	var sc_style = StyleBoxFlat.new()
	sc_style.bg_color = Color("#182A45")
	sc_style.corner_radius_top_left = 18
	sc_style.corner_radius_top_right = 18
	sc_style.corner_radius_bottom_left = 18
	sc_style.corner_radius_bottom_right = 18
	sc_style.border_width_left = 1
	sc_style.border_width_top = 1
	sc_style.border_width_right = 1
	sc_style.border_width_bottom = 1
	sc_style.border_color = Color("#FF9100")
	streak_card.add_theme_stylebox_override("panel", sc_style)
	streak_card.custom_minimum_size = Vector2(400, 110)
	center_vbox.add_child(streak_card)

	var sc_vbox = VBoxContainer.new()
	sc_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	streak_card.add_child(sc_vbox)

	var streak_title = Label.new()
	streak_title.text = "🔥 " + str(status["streak"]) + " DAYS STREAK"
	streak_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	streak_title.add_theme_font_size_override("font_size", 20)
	streak_title.add_theme_color_override("font_color", Color("#FFB94F"))
	sc_vbox.add_child(streak_title)

	var streak_sub = Label.new()
	streak_sub.text = "Keep your cognitive momentum alive every day!"
	streak_sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	streak_sub.add_theme_font_size_override("font_size", 12)
	streak_sub.add_theme_color_override("font_color", Color("#8CA0B8"))
	sc_vbox.add_child(streak_sub)

	# Mission Objective Card
	var mission_card = PanelContainer.new()
	var mc_style = StyleBoxFlat.new()
	mc_style.bg_color = Color("#13233D")
	mc_style.corner_radius_top_left = 18
	mc_style.corner_radius_top_right = 18
	mc_style.corner_radius_bottom_left = 18
	mc_style.corner_radius_bottom_right = 18
	mc_style.border_width_left = 1
	mc_style.border_width_top = 1
	mc_style.border_width_right = 1
	mc_style.border_width_bottom = 1
	mc_style.border_color = Color("#50CFE7")
	mission_card.add_theme_stylebox_override("panel", mc_style)
	mission_card.custom_minimum_size = Vector2(400, 170)
	center_vbox.add_child(mission_card)

	var mc_vbox = VBoxContainer.new()
	mc_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	mc_vbox.add_theme_constant_override("separation", 8)
	mission_card.add_child(mc_vbox)

	var date_lbl = Label.new()
	date_lbl.text = "TODAY'S MISSION (" + status["today_date"] + ")"
	date_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	date_lbl.add_theme_font_size_override("font_size", 12)
	date_lbl.add_theme_color_override("font_color", Color("#50CFE7"))
	mc_vbox.add_child(date_lbl)

	var goal_lbl = Label.new()
	goal_lbl.text = "TARGET: 1,500 POINTS"
	goal_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	goal_lbl.add_theme_font_size_override("font_size", 22)
	goal_lbl.add_theme_color_override("font_color", Color.WHITE)
	mc_vbox.add_child(goal_lbl)

	var desc_lbl = Label.new()
	desc_lbl.text = "Reach 1,500 points in today's seeded layout\nto maintain your streak & claim 2x XP!"
	desc_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	desc_lbl.add_theme_font_size_override("font_size", 13)
	desc_lbl.add_theme_color_override("font_color", Color("#8CA0B8"))
	mc_vbox.add_child(desc_lbl)

	if status["completed"]:
		var done_lbl = Label.new()
		done_lbl.text = "✓ COMPLETED TODAY!"
		done_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		done_lbl.add_theme_font_size_override("font_size", 15)
		done_lbl.add_theme_color_override("font_color", Color("#51DFA9"))
		mc_vbox.add_child(done_lbl)

	# ── Bottom Action Button ──
	var bottom_margin = MarginContainer.new()
	bottom_margin.add_theme_constant_override("margin_bottom", 36)
	bottom_margin.add_theme_constant_override("margin_left", 30)
	bottom_margin.add_theme_constant_override("margin_right", 30)
	root_vbox.add_child(bottom_margin)

	var btn_start = Button.new()
	btn_start.text = "START TODAY'S CHALLENGE" if not status["completed"] else "PLAY AGAIN (FOR FUN)"
	btn_start.custom_minimum_size = Vector2(0, 56)

	var b_style = StyleBoxFlat.new()
	b_style.bg_color = Color("#50CFE7")
	b_style.corner_radius_top_left = 28
	b_style.corner_radius_top_right = 28
	b_style.corner_radius_bottom_left = 28
	b_style.corner_radius_bottom_right = 28
	btn_start.add_theme_stylebox_override("normal", b_style)
	btn_start.add_theme_stylebox_override("hover", b_style)
	btn_start.add_theme_stylebox_override("pressed", b_style)
	btn_start.add_theme_font_size_override("font_size", 16)
	btn_start.add_theme_color_override("font_color", Color("#07111F"))
	btn_start.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		Haptics.vibrate_medium()
		start_daily_requested.emit()
	)
	bottom_margin.add_child(btn_start)
