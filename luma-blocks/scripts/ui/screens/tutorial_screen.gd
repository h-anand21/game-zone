# ============================================================
# Luma Blocks — How To Play Tutorial Screen Component
# ============================================================
class_name TutorialScreen
extends Control

signal back_requested()

var _current_slide: int = 0

const SLIDES: Array[Dictionary] = [
	{
		"title": "1. DRAG & DROP BLOCKS",
		"icon": "🧩",
		"desc": "Drag block shapes from the bottom tray onto the 8x8 grid.\n\nBlocks float above your finger for easy placement. Blocks cannot rotate in Classic Mode, and cannot overlap existing blocks."
	},
	{
		"title": "2. DUAL-AXIS LINE CLEARS",
		"icon": "💥",
		"desc": "Fill complete horizontal rows or vertical columns to blast them away!\n\nClearing rows and columns simultaneously triggers huge Double and Triple blast bonuses!"
	},
	{
		"title": "3. CONSECUTIVE COMBOS",
		"icon": "🔥",
		"desc": "Clear at least one line on consecutive placements to trigger COMBO STREAKS!\n\nYour score multiplier climbs up to 3.0x (+25% per consecutive streak level)!"
	},
	{
		"title": "4. GAME OVER STRATEGY",
		"icon": "👑",
		"desc": "Always leave space for larger 3x3 or 5-bar shapes!\n\nThe game ends when none of the remaining blocks in your tray can fit anywhere on the board."
	}
]

var _title_lbl: Label
var _icon_lbl: Label
var _desc_lbl: Label
var _page_lbl: Label
var _btn_prev: Button
var _btn_next: Button

func _ready() -> void:
	anchors_preset = PRESET_FULL_RECT
	_build_ui()
	_update_slide()

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

	var top_title = Label.new()
	top_title.text = "HOW TO PLAY"
	top_title.add_theme_font_size_override("font_size", 22)
	top_title.add_theme_color_override("font_color", Color.WHITE)
	header_hbox.add_child(top_title)

	var empty_spacer = Control.new()
	empty_spacer.custom_minimum_size = Vector2(90, 44)
	header_hbox.add_child(empty_spacer)

	# ── Slide Card ──
	var center = CenterContainer.new()
	center.size_flags_vertical = SIZE_EXPAND_FILL
	root_vbox.add_child(center)

	var card = PanelContainer.new()
	var c_style = StyleBoxFlat.new()
	c_style.bg_color = Color("#13233D")
	c_style.corner_radius_top_left = 22
	c_style.corner_radius_top_right = 22
	c_style.corner_radius_bottom_left = 22
	c_style.corner_radius_bottom_right = 22
	c_style.border_width_left = 1
	c_style.border_width_top = 1
	c_style.border_width_right = 1
	c_style.border_width_bottom = 1
	c_style.border_color = Color("#344764")
	card.add_theme_stylebox_override("panel", c_style)
	card.custom_minimum_size = Vector2(400, 380)
	center.add_child(card)

	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 24)
	margin.add_theme_constant_override("margin_right", 24)
	margin.add_theme_constant_override("margin_top", 24)
	margin.add_theme_constant_override("margin_bottom", 24)
	card.add_child(margin)

	var vbox = VBoxContainer.new()
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	vbox.add_theme_constant_override("separation", 16)
	margin.add_child(vbox)

	_icon_lbl = Label.new()
	_icon_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_icon_lbl.add_theme_font_size_override("font_size", 48)
	vbox.add_child(_icon_lbl)

	_title_lbl = Label.new()
	_title_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_title_lbl.add_theme_font_size_override("font_size", 18)
	_title_lbl.add_theme_color_override("font_color", Color("#50CFE7"))
	vbox.add_child(_title_lbl)

	_desc_lbl = Label.new()
	_desc_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_desc_lbl.add_theme_font_size_override("font_size", 14)
	_desc_lbl.add_theme_color_override("font_color", Color("#8CA0B8"))
	vbox.add_child(_desc_lbl)

	_page_lbl = Label.new()
	_page_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_page_lbl.add_theme_font_size_override("font_size", 12)
	_page_lbl.add_theme_color_override("font_color", Color("#50CFE7"))
	vbox.add_child(_page_lbl)

	# ── Bottom Navigation Row ──
	var nav_margin = MarginContainer.new()
	nav_margin.add_theme_constant_override("margin_left", 30)
	nav_margin.add_theme_constant_override("margin_right", 30)
	nav_margin.add_theme_constant_override("margin_bottom", 36)
	root_vbox.add_child(nav_margin)

	var nav_hbox = HBoxContainer.new()
	nav_hbox.alignment = BoxContainer.ALIGNMENT_SPACE_BETWEEN
	nav_margin.add_child(nav_hbox)

	_btn_prev = Button.new()
	_btn_prev.text = "PREVIOUS"
	_btn_prev.custom_minimum_size = Vector2(140, 50)
	_btn_prev.pressed.connect(_on_prev_pressed)
	nav_hbox.add_child(_btn_prev)

	_btn_next = Button.new()
	_btn_next.text = "NEXT"
	_btn_next.custom_minimum_size = Vector2(140, 50)
	_btn_next.pressed.connect(_on_next_pressed)
	nav_hbox.add_child(_btn_next)

func _update_slide() -> void:
	var slide = SLIDES[_current_slide]
	_icon_lbl.text = slide["icon"]
	_title_lbl.text = slide["title"]
	_desc_lbl.text = slide["desc"]
	_page_lbl.text = "Step " + str(_current_slide + 1) + " of " + str(SLIDES.size())

	_btn_prev.disabled = (_current_slide == 0)
	_btn_next.text = "GOT IT!" if (_current_slide == SLIDES.size() - 1) else "NEXT"

func _on_prev_pressed() -> void:
	if _current_slide > 0:
		_current_slide -= 1
		SoundManager.instance.play_sfx("click")
		_update_slide()

func _on_next_pressed() -> void:
	if _current_slide < SLIDES.size() - 1:
		_current_slide += 1
		SoundManager.instance.play_sfx("click")
		_update_slide()
	else:
		SoundManager.instance.play_sfx("click")
		back_requested.emit()
