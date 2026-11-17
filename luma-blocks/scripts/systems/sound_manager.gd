# ============================================================
# Luma Blocks — Procedural Audio Engine (Zero External Assets)
# ============================================================
class_name SoundManager
extends Node

static var instance: SoundManager

var _sfx_players: Array[AudioStreamPlayer] = []
var _bgm_player: AudioStreamPlayer
var _cache: Dictionary = {}

const MIX_RATE: int = 22050

# Musical scale frequencies for combo streaks: C5, D5, E5, F5, G5, A5, B5, C6, D6
const SCALE_NOTES: Array[float] = [
	523.25, 587.33, 659.25, 698.46,
	783.99, 880.00, 987.77, 1046.50, 1174.66
]

func _init() -> void:
	instance = self

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS

	# Create SFX player pool
	for i in range(8):
		var p = AudioStreamPlayer.new()
		p.bus = "Master"
		add_child(p)
		_sfx_players.append(p)

	# BGM player
	_bgm_player = AudioStreamPlayer.new()
	_bgm_player.bus = "Master"
	add_child(_bgm_player)

	# Pre-generate common procedural audio streams
	_cache["click"] = _generate_tone(880.0, 0.03, "sine", 0.3, true)
	_cache["pickup"] = _generate_sweep(440.0, 660.0, 0.05, 0.4)
	_cache["snap"] = _generate_tone(1200.0, 0.015, "triangle", 0.25, true)
	_cache["place"] = _generate_sweep(150.0, 60.0, 0.08, 0.6)
	_cache["blast"] = _generate_blast_sound()
	_cache["game_over"] = _generate_game_over_sound()

	for i in range(SCALE_NOTES.size()):
		_cache["combo_" + str(i + 1)] = _generate_combo_chime(SCALE_NOTES[i])

	# Start background ambient music
	_start_ambient_music()

func _get_free_player() -> AudioStreamPlayer:
	for p in _sfx_players:
		if not p.playing:
			return p
	return _sfx_players[0]

func play_sfx(sound_name: String) -> void:
	if not SaveManager.get_setting("sound_enabled", true):
		return
	if _cache.has(sound_name):
		var p = _get_free_player()
		p.stream = _cache[sound_name]
		p.volume_db = -2.0
		p.play()

func play_combo_chime(streak: int) -> void:
	if not SaveManager.get_setting("sound_enabled", true):
		return
	var note_idx: int = mini(maxi(0, streak - 1), SCALE_NOTES.size() - 1)
	var key: String = "combo_" + str(note_idx + 1)
	if _cache.has(key):
		var p = _get_free_player()
		p.stream = _cache[key]
		p.volume_db = 0.0
		p.play()

func _start_ambient_music() -> void:
	if not SaveManager.get_setting("music_enabled", true):
		return
	# Generate a soft ambient relaxing pad loop (approx 4 seconds loop)
	var bgm_stream = _generate_ambient_loop(4.0)
	bgm_stream.loop_mode = AudioStreamWAV.LOOP_FORWARD
	bgm_stream.loop_end = int(4.0 * float(MIX_RATE))
	_bgm_player.stream = bgm_stream
	_bgm_player.volume_db = -12.0
	_bgm_player.play()

func update_music_state() -> void:
	var enabled = SaveManager.get_setting("music_enabled", true)
	if enabled:
		if not _bgm_player.playing:
			_bgm_player.play()
	else:
		_bgm_player.stop()

# ── Procedural Sound Synthesis Utilities ──

func _generate_tone(freq: float, duration: float, wave_type: String = "sine", volume: float = 0.5, fast_decay: bool = false) -> AudioStreamWAV:
	var sample_count: int = int(duration * float(MIX_RATE))
	var data: PackedByteArray = PackedByteArray()
	data.resize(sample_count * 2)

	for i in range(sample_count):
		var t: float = float(i) / float(MIX_RATE)
		var progress: float = float(i) / float(sample_count)
		var env: float = 1.0 - progress
		if fast_decay:
			env = exp(-progress * 6.0)

		var val: float = 0.0
		var phase: float = t * freq * TAU
		if wave_type == "sine":
			val = sin(phase)
		elif wave_type == "triangle":
			val = abs(fmod(phase, TAU) / PI - 1.0) * 2.0 - 1.0

		var sample_val: int = int(clampf(val * env * volume, -1.0, 1.0) * 32767.0)
		data.encode_s16(i * 2, sample_val)

	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = MIX_RATE
	stream.stereo = false
	stream.data = data
	return stream

func _generate_sweep(start_freq: float, end_freq: float, duration: float, volume: float = 0.5) -> AudioStreamWAV:
	var sample_count: int = int(duration * float(MIX_RATE))
	var data: PackedByteArray = PackedByteArray()
	data.resize(sample_count * 2)

	var phase: float = 0.0
	for i in range(sample_count):
		var progress: float = float(i) / float(sample_count)
		var freq: float = lerpf(start_freq, end_freq, progress)
		phase += (freq * TAU) / float(MIX_RATE)

		var env: float = (1.0 - progress) * (1.0 - progress)
		var val: float = sin(phase) * env * volume
		var sample_val: int = int(clampf(val, -1.0, 1.0) * 32767.0)
		data.encode_s16(i * 2, sample_val)

	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = MIX_RATE
	stream.stereo = false
	stream.data = data
	return stream

func _generate_combo_chime(base_freq: float) -> AudioStreamWAV:
	var duration: float = 0.35
	var sample_count: int = int(duration * float(MIX_RATE))
	var data: PackedByteArray = PackedByteArray()
	data.resize(sample_count * 2)

	for i in range(sample_count):
		var t: float = float(i) / float(MIX_RATE)
		var progress: float = float(i) / float(sample_count)
		var env: float = exp(-progress * 4.5)

		# Fundamental + 1 octave harmonic + bell sparkle
		var val: float = (
			sin(t * base_freq * TAU) * 0.6 +
			sin(t * base_freq * 2.0 * TAU) * 0.3 +
			sin(t * base_freq * 3.01 * TAU) * 0.1
		) * env * 0.55

		var sample_val: int = int(clampf(val, -1.0, 1.0) * 32767.0)
		data.encode_s16(i * 2, sample_val)

	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = MIX_RATE
	stream.stereo = false
	stream.data = data
	return stream

func _generate_blast_sound() -> AudioStreamWAV:
	var duration: float = 0.28
	var sample_count: int = int(duration * float(MIX_RATE))
	var data: PackedByteArray = PackedByteArray()
	data.resize(sample_count * 2)

	var rng = RandomNumberGenerator.new()
	rng.seed = 42

	for i in range(sample_count):
		var t: float = float(i) / float(MIX_RATE)
		var progress: float = float(i) / float(sample_count)
		var env: float = exp(-progress * 5.0)

		# Chord sweep + noise crunch
		var chord: float = (
			sin(t * 523.25 * TAU) * 0.35 +
			sin(t * 659.25 * TAU) * 0.35 +
			sin(t * 783.99 * TAU) * 0.30
		)
		var noise: float = rng.randf_range(-0.35, 0.35) * exp(-progress * 12.0)
		var val: float = (chord + noise) * env * 0.6

		var sample_val: int = int(clampf(val, -1.0, 1.0) * 32767.0)
		data.encode_s16(i * 2, sample_val)

	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = MIX_RATE
	stream.stereo = false
	stream.data = data
	return stream

func _generate_game_over_sound() -> AudioStreamWAV:
	var duration: float = 0.6
	var sample_count: int = int(duration * float(MIX_RATE))
	var data: PackedByteArray = PackedByteArray()
	data.resize(sample_count * 2)

	for i in range(sample_count):
		var t: float = float(i) / float(MIX_RATE)
		var progress: float = float(i) / float(sample_count)
		var env: float = exp(-progress * 3.0)

		# Minor chord descending feel (311Hz -> 261Hz -> 196Hz)
		var freq: float = lerpf(311.13, 196.0, progress)
		var val: float = sin(t * freq * TAU) * env * 0.55

		var sample_val: int = int(clampf(val, -1.0, 1.0) * 32767.0)
		data.encode_s16(i * 2, sample_val)

	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = MIX_RATE
	stream.stereo = false
	stream.data = data
	return stream

func _generate_ambient_loop(duration: float) -> AudioStreamWAV:
	var sample_count: int = int(duration * float(MIX_RATE))
	var data: PackedByteArray = PackedByteArray()
	data.resize(sample_count * 2)

	for i in range(sample_count):
		var t: float = float(i) / float(MIX_RATE)
		# Smooth cycling ambient pad chord (Major 7th: C3, G3, B3, E4)
		var c3 = sin(t * 130.81 * TAU) * 0.25
		var g3 = sin(t * 196.00 * TAU) * 0.20
		var b3 = sin(t * 246.94 * TAU) * 0.20
		var e4 = sin(t * 329.63 * TAU) * 0.15

		var lfo = 0.8 + 0.2 * sin(t * 0.5 * TAU)
		var val = (c3 + g3 + b3 + e4) * lfo * 0.25

		var sample_val: int = int(clampf(val, -1.0, 1.0) * 32767.0)
		data.encode_s16(i * 2, sample_val)

	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = MIX_RATE
	stream.stereo = false
	stream.data = data
	return stream
