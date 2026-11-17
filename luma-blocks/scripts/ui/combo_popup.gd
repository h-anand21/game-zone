# ============================================================
# Luma Blocks — Floating Combo & Score Toast Popup
# ============================================================
class_name ComboPopup
extends Control

var _label_title: Label
var _label_points: Label
var _panel: PanelContainer

func _init() -> void:
	mouse_filter = MOUSE_FILTER_IGNORE

func setup(title: String, points: int, multiplier: float) -> void:
	custom_minimum_size = Vector2(260, 72)
	anchors_preset = PRESET_CENTER

	var style = StyleBoxFlat.new()
	style.corner_radius_top_left = 20
	style.corner_radius_top_right = 20
	style.corner_radius_bottom_left = 20
	style.corner_radius_bottom_right = 20
	style.bg_color = Color("#13233D")
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.border_color = Color("#50CFE7") if multiplier <= 1.5 else Color("#FFB94F")
	style.shadow_color = Color(0, 0, 0, 0.4)
	style.shadow_size = 12

	_panel = PanelContainer.new()
	_panel.add_theme_stylebox_override("panel", style)
	_panel.mouse_filter = MOUSE_FILTER_IGNORE
	add_child(_panel)

	var vbox = VBoxContainer.new()
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	vbox.mouse_filter = MOUSE_FILTER_IGNORE
	_panel.add_child(vbox)

	_label_title = Label.new()
	_label_title.text = title
	_label_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_label_title.add_theme_color_override("font_color", Color("#50CFE7") if multiplier <= 1.5 else Color("#FFB94F"))
	_label_title.add_theme_font_size_override("font_size", 18)
	vbox.add_child(_label_title)

	_label_points = Label.new()
	var pts_text = "+" + str(points) + " PTS"
	if multiplier > 1.0:
		pts_text += " (x" + str(snappedf(multiplier, 0.01)) + ")"
	_label_points.text = pts_text
	_label_points.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_label_points.add_theme_color_override("font_color", Color.WHITE)
	_label_points.add_theme_font_size_override("font_size", 14)
	vbox.add_child(_label_points)

	# Animation sequence
	scale = Vector2(0.3, 0.3)
	modulate.a = 0.0
	pivot_offset = Vector2(130, 36)

	var tween = create_tween().set_parallel(false)
	# Pop in
	var t_in = tween.parallel()
	t_in.tween_property(self, "scale", Vector2(1.0, 1.0), 0.22).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	t_in.tween_property(self, "modulate:a", 1.0, 0.15)

	# Float up slightly
	tween.tween_interval(0.65)

	# Fade out
	var t_out = tween.parallel()
	t_out.tween_property(self, "position:y", position.y - 35, 0.35).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN)
	t_out.tween_property(self, "modulate:a", 0.0, 0.35)

	tween.tween_callback(queue_free)
