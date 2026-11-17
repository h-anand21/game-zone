# ============================================================
# Luma Blocks — Vector Particle Burst Effect
# ============================================================
class_name ParticleBurst
extends Node2D

class Spark:
	var pos: Vector2
	var vel: Vector2
	var size: float
	var color: Color
	var life: float
	var max_life: float

var _sparks: Array[Spark] = []
var _is_active: bool = false

func emit_burst(cell_positions: Array[Vector2], colors: Array[Color], count_per_cell: int = 4) -> void:
	_sparks.clear()
	var rng = RandomNumberGenerator.new()
	rng.randomize()

	var reduced_motion = SaveManager.get_setting("reduced_motion", false)
	var particle_mult = 0.5 if reduced_motion else 1.0

	for i in range(cell_positions.size()):
		var center = cell_positions[i]
		var col = colors[i] if i < colors.size() else Color("#50CFE7")

		var count = int(float(count_per_cell) * particle_mult)
		for p in range(count):
			var spark = Spark.new()
			spark.pos = center
			var angle = rng.randf_range(0.0, TAU)
			var speed = rng.randf_range(60.0, 240.0)
			spark.vel = Vector2(cos(angle), sin(angle)) * speed
			spark.size = rng.randf_range(4.0, 9.0)
			spark.color = col
			spark.max_life = rng.randf_range(0.35, 0.65)
			spark.life = spark.max_life
			_sparks.append(spark)

	_is_active = true
	set_process(true)
	queue_redraw()

func _process(delta: float) -> void:
	if not _is_active:
		set_process(false)
		return

	var all_dead = true
	for s in _sparks:
		if s.life > 0.0:
			all_dead = false
			s.life -= delta
			s.pos += s.vel * delta
			s.vel.y += 180.0 * delta # Gravity falloff
			s.vel *= 0.94 # Air friction

	queue_redraw()

	if all_dead:
		_is_active = false
		set_process(false)
		queue_free()

func _draw() -> void:
	for s in _sparks:
		if s.life > 0.0:
			var progress = s.life / s.max_life
			var alpha = clampf(progress * 1.5, 0.0, 1.0)
			var current_size = s.size * progress
			var draw_color = Color(s.color.r, s.color.g, s.color.b, alpha)

			# Draw rounded glow spark
			draw_circle(s.pos, current_size, draw_color)
			draw_circle(s.pos, current_size * 0.4, Color(1, 1, 1, alpha * 0.8))
