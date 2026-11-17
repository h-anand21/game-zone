# ============================================================
# Luma Blocks — Settings Screen Component
# ============================================================
class_name SettingsScreen
extends Control

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
	root_vbox.add_theme_constant_override("separation", 18)
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
	title_lbl.text = "SETTINGS"
	title_lbl.add_theme_font_size_override("font_size", 22)
	title_lbl.add_theme_color_override("font_color", Color.WHITE)
	header_hbox.add_child(title_lbl)

	var empty_spacer = Control.new()
	empty_spacer.custom_minimum_size = Vector2(90, 44)
	header_hbox.add_child(empty_spacer)

	# ── Settings Items Card ──
	var center = CenterContainer.new()
	center.size_flags_vertical = SIZE_EXPAND_FILL
	root_vbox.add_child(center)

	var panel = PanelContainer.new()
	var p_style = StyleBoxFlat.new()
	p_style.bg_color = Color("#13233D")
	p_style.corner_radius_top_left = 20
	p_style.corner_radius_top_right = 20
	p_style.corner_radius_bottom_left = 20
	p_style.corner_radius_bottom_right = 20
	p_style.border_width_left = 1
	p_style.border_width_top = 1
	p_style.border_width_right = 1
	p_style.border_width_bottom = 1
	p_style.border_color = Color("#344764")
	panel.add_theme_stylebox_override("panel", p_style)
	panel.custom_minimum_size = Vector2(400, 360)
	center.add_child(panel)

	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 24)
	margin.add_theme_constant_override("margin_right", 24)
	margin.add_theme_constant_override("margin_top", 24)
	margin.add_theme_constant_override("margin_bottom", 24)
	panel.add_child(margin)

	var vbox = VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 18)
	margin.add_child(vbox)

	# 1. Sound FX Toggle
	var sound_enabled = SaveManager.get_setting("sound_enabled", true)
	vbox.add_child(_create_toggle_row("🔊 Sound Effects", sound_enabled, func(enabled):
		SaveManager.set_setting("sound_enabled", enabled)
		SoundManager.instance.play_sfx("click")
	))

	# 2. Music Toggle
	var music_enabled = SaveManager.get_setting("music_enabled", true)
	vbox.add_child(_create_toggle_row("🎵 Ambient Music", music_enabled, func(enabled):
		SaveManager.set_setting("music_enabled", enabled)
		SoundManager.instance.update_music_state()
	))

	# 3. Haptics Toggle
	var haptics_enabled = SaveManager.get_setting("haptics_enabled", true)
	vbox.add_child(_create_toggle_row("📳 Haptic Feedback", haptics_enabled, func(enabled):
		SaveManager.set_setting("haptics_enabled", enabled)
		if enabled:
			Haptics.vibrate_light()
	))

	# 4. Reduced Motion Toggle
	var motion_reduced = SaveManager.get_setting("reduced_motion", false)
	vbox.add_child(_create_toggle_row("♿ Reduced Motion", motion_reduced, func(enabled):
		SaveManager.set_setting("reduced_motion", enabled)
	))

	var divider = HSeparator.new()
	vbox.add_child(divider)

	# 5. Reset Progress Button
	var btn_reset = Button.new()
	btn_reset.text = "RESET ALL PROGRESS"
	btn_reset.custom_minimum_size = Vector2(0, 44)
	var r_style = StyleBoxFlat.new()
	r_style.bg_color = Color("#4D1A25")
	r_style.corner_radius_top_left = 12
	r_style.corner_radius_top_right = 12
	r_style.corner_radius_bottom_left = 12
	r_style.corner_radius_bottom_right = 12
	btn_reset.add_theme_stylebox_override("normal", r_style)
	btn_reset.add_theme_stylebox_override("hover", r_style)
	btn_reset.add_theme_stylebox_override("pressed", r_style)
	btn_reset.add_theme_color_override("font_color", Color("#FF729C"))
	btn_reset.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		SaveManager.reset_all_progress()
		_build_ui()
	)
	vbox.add_child(btn_reset)

	# 6. Version label
	var ver = Label.new()
	ver.text = "Luma Blocks v1.0.0 • Godot 4.3 Mobile"
	ver.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	ver.add_theme_font_size_override("font_size", 10)
	ver.add_theme_color_override("font_color", Color("#677D9B"))
	vbox.add_child(ver)

func _create_toggle_row(title: String, initial_val: bool, callback: Callable) -> HBoxContainer:
	var row = HBoxContainer.new()
	row.alignment = BoxContainer.ALIGNMENT_SPACE_BETWEEN

	var lbl = Label.new()
	lbl.text = title
	lbl.add_theme_font_size_override("font_size", 15)
	lbl.add_theme_color_override("font_color", Color.WHITE)
	row.add_child(lbl)

	var check = CheckButton.new()
	check.button_pressed = initial_val
	check.toggled.connect(callback)
	row.add_child(check)

	return row
