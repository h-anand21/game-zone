# ============================================================
# Luma Blocks — Pause Screen Modal
# ============================================================
class_name PauseScreen
extends Control

signal resume_requested()
signal restart_requested()
signal settings_requested()
signal home_requested()

func _ready() -> void:
	anchors_preset = PRESET_FULL_RECT
	_build_ui()

func _build_ui() -> void:
	for child in get_children():
		child.queue_free()

	# Dimmed backdrop
	var dim = ColorRect.new()
	dim.color = Color(0.04, 0.07, 0.12, 0.85)
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
	style.border_color = Color("#344764")
	style.shadow_color = Color(0, 0, 0, 0.5)
	style.shadow_size = 18
	card.add_theme_stylebox_override("panel", style)
	card.custom_minimum_size = Vector2(380, 420)
	center.add_child(card)

	var vbox = VBoxContainer.new()
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	vbox.add_theme_constant_override("separation", 18)
	card.add_child(vbox)

	var title = Label.new()
	title.text = "GAME PAUSED"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 28)
	title.add_theme_color_override("font_color", Color("#50CFE7"))
	vbox.add_child(title)

	var sp = Control.new()
	sp.custom_minimum_size = Vector2(0, 10)
	vbox.add_child(sp)

	# Buttons
	var btn_resume = _create_btn("RESUME", Color("#50CFE7"), Color("#07111F"))
	btn_resume.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		resume_requested.emit()
	)
	vbox.add_child(btn_resume)

	var btn_restart = _create_btn("RESTART", Color("#FFB94F"), Color("#07111F"))
	btn_restart.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		restart_requested.emit()
	)
	vbox.add_child(btn_restart)

	var btn_settings = _create_btn("SETTINGS", Color("#344764"), Color.WHITE)
	btn_settings.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		settings_requested.emit()
	)
	vbox.add_child(btn_settings)

	var btn_home = _create_btn("QUIT TO HOME", Color("#203456"), Color("#8CA0B8"))
	btn_home.pressed.connect(func():
		SoundManager.instance.play_sfx("click")
		home_requested.emit()
	)
	vbox.add_child(btn_home)

func _create_btn(text: String, bg_col: Color, text_col: Color) -> Button:
	var btn = Button.new()
	btn.text = text
	btn.custom_minimum_size = Vector2(300, 50)

	var style = StyleBoxFlat.new()
	style.bg_color = bg_col
	style.corner_radius_top_left = 25
	style.corner_radius_top_right = 25
	style.corner_radius_bottom_left = 25
	style.corner_radius_bottom_right = 25

	btn.add_theme_stylebox_override("normal", style)
	btn.add_theme_stylebox_override("hover", style)
	btn.add_theme_stylebox_override("pressed", style)
	btn.add_theme_font_size_override("font_size", 15)
	btn.add_theme_color_override("font_color", text_col)
	return btn
