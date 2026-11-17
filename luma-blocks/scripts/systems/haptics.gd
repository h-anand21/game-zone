# ============================================================
# Luma Blocks — Mobile Haptic Feedback Wrapper
# ============================================================
class_name Haptics
extends RefCounted

static func vibrate_light() -> void:
	_vibrate(20)

static func vibrate_medium() -> void:
	_vibrate(45)

static func vibrate_heavy() -> void:
	_vibrate(75)

static func vibrate_success() -> void:
	_vibrate(100)

static func _vibrate(duration_ms: int) -> void:
	if not SaveManager.get_setting("haptics_enabled", true):
		return
	# Only execute on handhelds/devices that support vibration
	if OS.has_feature("mobile") or OS.has_feature("android") or OS.has_feature("ios"):
		Input.vibrate_handheld(duration_ms)
