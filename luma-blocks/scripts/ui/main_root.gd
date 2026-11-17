# ============================================================
# Luma Blocks — Master Application Root & Screen Manager
# ============================================================
class_name MainRoot
extends Control

var _sound_manager: SoundManager

var _home_screen: HomeScreen
var _game_screen: GameScreen
var _daily_screen: DailyChallengeScreen
var _themes_screen: ThemesScreen
var _settings_screen: SettingsScreen
var _tutorial_screen: TutorialScreen

var _pause_screen: PauseScreen
var _game_over_screen: GameOverScreen

var _current_active_screen: Control

func _ready() -> void:
	anchors_preset = PRESET_FULL_RECT

	# Initialize Sound Manager
	_sound_manager = SoundManager.new()
	_sound_manager.name = "SoundManager"
	add_child(_sound_manager)

	# Build & show Home screen initially
	_open_home_screen()

func _clear_current_screen() -> void:
	if is_instance_valid(_current_active_screen):
		_current_active_screen.queue_free()
		_current_active_screen = null

func _open_home_screen() -> void:
	_clear_current_screen()
	_home_screen = HomeScreen.new()
	add_child(_home_screen)
	_current_active_screen = _home_screen

	_home_screen.play_classic_requested.connect(_start_classic_game)
	_home_screen.daily_challenge_requested.connect(_open_daily_screen)
	_home_screen.themes_requested.connect(_open_themes_screen)
	_home_screen.tutorial_requested.connect(_open_tutorial_screen)
	_home_screen.settings_requested.connect(_open_settings_screen)

func _start_classic_game() -> void:
	_clear_current_screen()
	_game_screen = GameScreen.new()
	add_child(_game_screen)
	_current_active_screen = _game_screen

	_game_screen.setup_game(false)
	_game_screen.pause_requested.connect(_open_pause_modal)
	_game_screen.game_over_reached.connect(_open_game_over_modal)

func _start_daily_game() -> void:
	_clear_current_screen()
	_game_screen = GameScreen.new()
	add_child(_game_screen)
	_current_active_screen = _game_screen

	_game_screen.setup_game(true)
	_game_screen.pause_requested.connect(_open_pause_modal)
	_game_screen.game_over_reached.connect(_open_game_over_modal)

func _open_daily_screen() -> void:
	_clear_current_screen()
	_daily_screen = DailyChallengeScreen.new()
	add_child(_daily_screen)
	_current_active_screen = _daily_screen

	_daily_screen.back_requested.connect(_open_home_screen)
	_daily_screen.start_daily_requested.connect(_start_daily_game)

func _open_themes_screen() -> void:
	_clear_current_screen()
	_themes_screen = ThemesScreen.new()
	add_child(_themes_screen)
	_current_active_screen = _themes_screen

	_themes_screen.back_requested.connect(_open_home_screen)
	_themes_screen.theme_changed.connect(func():
		# Refresh theme
		pass
	)

func _open_settings_screen() -> void:
	_clear_current_screen()
	_settings_screen = SettingsScreen.new()
	add_child(_settings_screen)
	_current_active_screen = _settings_screen

	_settings_screen.back_requested.connect(_open_home_screen)

func _open_tutorial_screen() -> void:
	_clear_current_screen()
	_tutorial_screen = TutorialScreen.new()
	add_child(_tutorial_screen)
	_current_active_screen = _tutorial_screen

	_tutorial_screen.back_requested.connect(_open_home_screen)

# ── Modal Overlays ──

func _open_pause_modal() -> void:
	if is_instance_valid(_pause_screen):
		return
	_pause_screen = PauseScreen.new()
	add_child(_pause_screen)

	_pause_screen.resume_requested.connect(func():
		_pause_screen.queue_free()
		_pause_screen = null
	)
	_pause_screen.restart_requested.connect(func():
		_pause_screen.queue_free()
		_pause_screen = null
		_start_classic_game()
	)
	_pause_screen.settings_requested.connect(func():
		_pause_screen.queue_free()
		_pause_screen = null
		_open_settings_screen()
	)
	_pause_screen.home_requested.connect(func():
		_pause_screen.queue_free()
		_pause_screen = null
		_open_home_screen()
	)

func _open_game_over_modal(final_score: int, lines: int, max_combo: int, is_new_high: bool) -> void:
	if is_instance_valid(_game_over_screen):
		return
	_game_over_screen = GameOverScreen.new()
	add_child(_game_over_screen)
	_game_over_screen.setup(final_score, lines, max_combo, is_new_high)

	_game_over_screen.replay_requested.connect(func():
		_game_over_screen.queue_free()
		_game_over_screen = null
		_start_classic_game()
	)
	_game_over_screen.home_requested.connect(func():
		_game_over_screen.queue_free()
		_game_over_screen = null
		_open_home_screen()
	)
