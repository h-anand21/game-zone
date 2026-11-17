# ============================================================
# Luma Blocks — Save Manager & Persistent Storage
# ============================================================
class_name SaveManager
extends RefCounted

const SAVE_PATH: String = "user://luma_blocks_save.json"

static var _data: Dictionary = {
	"high_score": 0,
	"best_combo": 0,
	"total_games": 0,
	"total_lines_cleared": 0,
	"player_level": 1,
	"player_xp": 0,
	"active_theme": "classic",
	"unlocked_themes": ["classic", "neon", "pastel", "cyberpunk"],
	"settings": {
		"sound_enabled": true,
		"music_enabled": true,
		"haptics_enabled": true,
		"reduced_motion": false
	},
	"daily_challenge": {
		"last_played_date": "",
		"current_streak": 0,
		"highest_streak": 0,
		"today_completed": false
	},
	"achievements": {
		"first_clear": false,
		"double_blast": false,
		"quad_blast": false,
		"combo_3": false,
		"combo_5": false,
		"score_1000": false,
		"score_5000": false
	}
}

static var _loaded: bool = false

static func get_data() -> Dictionary:
	if not _loaded:
		load_game()
	return _data

static func get_high_score() -> int:
	return int(get_data().get("high_score", 0))

static func set_high_score(val: int) -> void:
	if val > get_high_score():
		get_data()["high_score"] = val
		save_game()

static func get_best_combo() -> int:
	return int(get_data().get("best_combo", 0))

static func update_best_combo(combo: int) -> void:
	if combo > get_best_combo():
		get_data()["best_combo"] = combo
		save_game()

static func get_setting(key: String, default_val: bool = true) -> bool:
	var settings: Dictionary = get_data().get("settings", {})
	return settings.get(key, default_val)

static func set_setting(key: String, val: bool) -> void:
	var settings: Dictionary = get_data().get("settings", {})
	settings[key] = val
	get_data()["settings"] = settings
	save_game()

static func get_active_theme() -> String:
	return str(get_data().get("active_theme", "classic"))

static func set_active_theme(theme_id: String) -> void:
	get_data()["active_theme"] = theme_id
	save_game()

static func add_xp(points: int) -> Dictionary:
	var d = get_data()
	var xp_earned = int(points / 5)
	d["player_xp"] = int(d.get("player_xp", 0)) + xp_earned

	var current_level = int(d.get("player_level", 1))
	var required_xp = current_level * 250
	var leveled_up = false

	while d["player_xp"] >= required_xp:
		d["player_xp"] -= required_xp
		current_level += 1
		leveled_up = true
		required_xp = current_level * 250

	d["player_level"] = current_level
	save_game()

	return {
		"level": current_level,
		"xp": d["player_xp"],
		"xp_needed": required_xp,
		"leveled_up": leveled_up
	}

static func record_game_finished(final_score: int, lines: int, max_combo: int) -> void:
	var d = get_data()
	d["total_games"] = int(d.get("total_games", 0)) + 1
	d["total_lines_cleared"] = int(d.get("total_lines_cleared", 0)) + lines

	if final_score > int(d.get("high_score", 0)):
		d["high_score"] = final_score
	if max_combo > int(d.get("best_combo", 0)):
		d["best_combo"] = max_combo

	# Check achievements
	var ach = d.get("achievements", {})
	if lines > 0: ach["first_clear"] = true
	if max_combo >= 3: ach["combo_3"] = true
	if max_combo >= 5: ach["combo_5"] = true
	if final_score >= 1000: ach["score_1000"] = true
	if final_score >= 5000: ach["score_5000"] = true
	d["achievements"] = ach

	save_game()

static func get_daily_status() -> Dictionary:
	var d = get_data()
	var daily: Dictionary = d.get("daily_challenge", {})
	var today_str = Time.get_date_string_from_system()

	if daily.get("last_played_date", "") != today_str:
		daily["today_completed"] = false

	return {
		"today_date": today_str,
		"completed": daily.get("today_completed", false),
		"streak": daily.get("current_streak", 0)
	}

static func mark_daily_completed() -> void:
	var d = get_data()
	var daily: Dictionary = d.get("daily_challenge", {})
	var today_str = Time.get_date_string_from_system()

	if daily.get("last_played_date", "") != today_str:
		daily["last_played_date"] = today_str
		daily["current_streak"] = int(daily.get("current_streak", 0)) + 1
		daily["today_completed"] = true
		if daily["current_streak"] > int(daily.get("highest_streak", 0)):
			daily["highest_streak"] = daily["current_streak"]
	d["daily_challenge"] = daily
	save_game()

static func reset_all_progress() -> void:
	_data = {
		"high_score": 0,
		"best_combo": 0,
		"total_games": 0,
		"total_lines_cleared": 0,
		"player_level": 1,
		"player_xp": 0,
		"active_theme": "classic",
		"unlocked_themes": ["classic", "neon", "pastel", "cyberpunk"],
		"settings": {
			"sound_enabled": true,
			"music_enabled": true,
			"haptics_enabled": true,
			"reduced_motion": false
		},
		"daily_challenge": {
			"last_played_date": "",
			"current_streak": 0,
			"highest_streak": 0,
			"today_completed": false
		},
		"achievements": {
			"first_clear": false,
			"double_blast": false,
			"quad_blast": false,
			"combo_3": false,
			"combo_5": false,
			"score_1000": false,
			"score_5000": false
		}
	}
	save_game()

static func save_game() -> void:
	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		var json_str = JSON.stringify(_data, "  ")
		file.store_string(json_str)
		file.close()

static func load_game() -> void:
	_loaded = true
	if not FileAccess.file_exists(SAVE_PATH):
		return

	var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file:
		var content = file.get_as_text()
		file.close()
		var parse_res = JSON.parse_string(content)
		if parse_res is Dictionary:
			for k in parse_res:
				_data[k] = parse_res[k]
