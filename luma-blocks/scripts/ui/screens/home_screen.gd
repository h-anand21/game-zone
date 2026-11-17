# ============================================================
# Luma Blocks — Home Screen Component
# ============================================================
class_name HomeScreen
extends Control

signal play_classic_requested()
signal daily_challenge_requested()
signal themes_requested()
signal settings_requested()
signal tutorial_requested()

func _ready() -> void:
	anchors_preset = PRESET_FULL_RECT
	_build_ui()

func refresh_data() -> void:
	_build_ui()

func _build_ui() -> void:
	for child in get_children():
		child.queue_free()

	var theme = ThemeManager.get_current_theme()

	# Background gradient
	var bg = ColorRect.new()
	bg.color = theme["bg_color"]
	bg.set_anchors_and_offsets_preset(PRESET_FULL_RECT)
	add_child(bg)

	var main_vbox = VBoxContainer.new()
	main_vbox.set_anchors_and_offsets_preset(PRESET_FULL_RECT)
	main_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	main_vbox.add_theme_constant_override("separation", 22)
	add_child(main_vbox)

	# ── Logo Header ──
	var title_lbl = Label.new()
	title_lbl.text = "LUMA BLOCKS"
	title_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title_lbl.add_theme_font_size_override("font_size", 42)
	title_lbl.add_theme_color_override("font_color", Color("#50CFE7"))
	main_vbox.add_child(title_lbl)

	var subtitle_lbl = Label.new()
	subtitle_lbl.text = "PREMIUM 8x8 COGNITIVE PUZZLE"
	subtitle_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	subtitle_lbl.add_theme_font_size_override("font_size", 13)
	subtitle_lbl.add_theme_color_override("font_color", Color("#8CA0B8"))
	main_vbox.add_child(subtitle_lbl)

	# Spacer
	var sp1 = Control.new()
	sp1.custom_minimum_size = Vector2(0, 20)
	main_vbox.add_child(sp1)

	# ── High Score Banner ──
	var hs_panel = PanelContainer.new()
	var hs_style = StyleBoxFlat.new()
	hs_style.bg_color = Color("#162844")
	hs_style.corner_radius_top_left = 16
	hs_style.corner_radius_top_right = 16
	hs_style.corner_radius_bottom_left = 16
	hs_style.corner_radius_bottom_right = 16
	hs_style.border_width_left = 1
	hs_style.border_width_top = 1
	hs_style.border_width_right = 1
	hs_style.border_width_bottom = 1
	hs_style.border_color = Color("#FFB94F")
	hs_panel.add_theme_stylebox_override("panel", hs_style)
	hs_panel.custom_minimum_size = Vector2(340, 70)
	main_vbox.add_child(hs_panel)

	var hs_vbox = VBoxContainer.new()
	hs_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	hs_panel.add_child(hs_vbox)

	var hs_title = Label.new()
	hs_title.text = "👑 BEST SCORE"
	hs_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hs_title.add_theme_font_size_override("font_size", 12)
	hs_title.add_theme_color_override("font_color", Color("#FFB94F"))
	hs_vbox.add_child(hs_title)

	var hs_val = Label.new()
	hs_val.text = str(SaveManager.get_high_score())
	hs_val.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hs_val.add_theme_font_size_override("font_size", 24)
	hs_val.add_theme_color_override("font_color", Color.WHITE)
	hs_vbox.add_child(hs_val)

	# Spacer
	var sp2 = Control.new()
	sp2.custom_minimum_size = Vector2(0, 15)
	main_vbox.add_child(sp2)

	# ── Menu Action Buttons ──
	var btn_play = _create_action_button("▶  PLAY CLASSIC", Color("#FFB94F"), Color("#07111F"))
	btn_play.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		Haptics.vibrate_medium()
		play_classic_requested.emit()
	)
	main_vbox.add_child(btn_play)

	var daily_status = SaveManager.get_daily_status()
	var daily_text = "📅  DAILY CHALLENGE"
	if daily_status["completed"]:
		daily_text += " (✓ DONE)"
	var btn_daily = _create_action_button(daily_text, Color("#50CFE7"), Color("#07111F"))
	btn_daily.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		daily_challenge_requested.emit()
	)
	main_vbox.add_child(btn_daily)

	var btn_themes = _create_action_button("🎨  THEMES", Color("#9677F5"), Color.WHITE)
	btn_themes.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		themes_requested.emit()
	)
	main_vbox.add_child(btn_themes)

	var btn_tutorial = _create_action_button("📖  HOW TO PLAY", Color("#51DFA9"), Color("#07111F"))
	btn_tutorial.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		tutorial_requested.emit()
	)
	main_vbox.add_child(btn_tutorial)

	var btn_settings = _create_action_button("⚙️  SETTINGS", Color("#344764"), Color.WHITE)
	btn_settings.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		settings_requested.emit()
	)
	main_vbox.add_child(btn_settings)

func _create_action_button(title: String, bg_color: Color, text_color: Color) -> Button:
	var btn = Button.new()
	btn.text = title
	btn.custom_minimum_size = Vector2(340, 54)

	var style = StyleBoxFlat.new()
	style.bg_color = bg_color
	style.corner_radius_top_left = 27
	style.corner_radius_top_right = 27
	style.corner_radius_bottom_left = 27
	style.corner_radius_bottom_right = 27
	style.shadow_color = Color(0, 0, 0, 0.3)
	style.shadow_size = 6

	btn.add_theme_stylebox_override("normal", style)
	btn.add_theme_stylebox_override("hover", style)
	btn.add_theme_stylebox_override("pressed", style)
	btn.add_theme_font_size_override("font_size", 16)
	btn.add_theme_color_override("font_color", text_color)

	return btn
