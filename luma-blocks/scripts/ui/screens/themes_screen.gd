# ============================================================
# Luma Blocks — Themes Screen Component
# ============================================================
class_name ThemesScreen
extends Control

signal back_requested()
signal theme_changed()

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
	title_lbl.text = "SELECT THEME"
	title_lbl.add_theme_font_size_override("font_size", 22)
	title_lbl.add_theme_color_override("font_color", Color.WHITE)
	header_hbox.add_child(title_lbl)

	var empty_spacer = Control.new()
	empty_spacer.custom_minimum_size = Vector2(90, 44)
	header_hbox.add_child(empty_spacer)

	# ── Themes List ──
	var scroll = ScrollContainer.new()
	scroll.size_flags_vertical = SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	root_vbox.add_child(scroll)

	var list_vbox = VBoxContainer.new()
	list_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	list_vbox.size_flags_horizontal = SIZE_EXPAND_FILL
	list_vbox.add_theme_constant_override("separation", 14)
	scroll.add_child(list_vbox)

	var active_theme_id = SaveManager.get_active_theme()

	for t_id in ThemeManager.THEMES:
		var t_info = ThemeManager.THEMES[t_id]
		var is_selected = (t_id == active_theme_id)

		var card = PanelContainer.new()
		var card_style = StyleBoxFlat.new()
		card_style.bg_color = t_info["bg_color"]
		card_style.corner_radius_top_left = 16
		card_style.corner_radius_top_right = 16
		card_style.corner_radius_bottom_left = 16
		card_style.corner_radius_bottom_right = 16
		card_style.border_width_left = 2
		card_style.border_width_top = 2
		card_style.border_width_right = 2
		card_style.border_width_bottom = 2
		card_style.border_color = Color("#50CFE7") if is_selected else Color("#344764")
		card.add_theme_stylebox_override("panel", card_style)
		card.custom_minimum_size = Vector2(400, 100)
		list_vbox.add_child(card)

		var card_margin = MarginContainer.new()
		card_margin.add_theme_constant_override("margin_left", 16)
		card_margin.add_theme_constant_override("margin_right", 16)
		card_margin.add_theme_constant_override("margin_top", 12)
		card_margin.add_theme_constant_override("margin_bottom", 12)
		card.add_child(card_margin)

		var card_hbox = HBoxContainer.new()
		card_hbox.alignment = BoxContainer.ALIGNMENT_SPACE_BETWEEN
		card_margin.add_child(card_hbox)

		# Left Column: Theme Name & Color Swatches
		var left_vbox = VBoxContainer.new()
		card_hbox.add_child(left_vbox)

		var name_lbl = Label.new()
		name_lbl.text = t_info["name"] + ("  (ACTIVE)" if is_selected else "")
		name_lbl.add_theme_font_size_override("font_size", 16)
		name_lbl.add_theme_color_override("font_color", Color("#50CFE7") if is_selected else Color.WHITE)
		left_vbox.add_child(name_lbl)

		# Swatches Row
		var swatches_row = HBoxContainer.new()
		swatches_row.add_theme_constant_override("separation", 8)
		left_vbox.add_child(swatches_row)

		var pal: Dictionary = t_info["palette"]
		for cid in pal:
			var swatch = ColorRect.new()
			swatch.color = pal[cid]
			swatch.custom_minimum_size = Vector2(24, 24)
			swatches_row.add_child(swatch)

		# Right Action Button
		var btn_select = Button.new()
		btn_select.text = "EQUIPPED" if is_selected else "APPLY"
		btn_select.custom_minimum_size = Vector2(100, 42)
		btn_select.disabled = is_selected

		var captured_id = t_id
		btn_select.pressed.connect(func():
			SoundManager.instance.play_sfx("click")
			SaveManager.set_active_theme(captured_id)
			_build_ui()
			theme_changed.emit()
		)
		card_hbox.add_child(btn_select)
