# ============================================================
# Luma Blocks — Fair Weighted Piece Generator
# ============================================================
class_name PieceGenerator
extends RefCounted

var _rng: RandomNumberGenerator = RandomNumberGenerator.new()

func _init(seed_val: int = 0) -> void:
	if seed_val != 0:
		_rng.seed = seed_val
	else:
		_rng.randomize()

func set_seed(seed_val: int) -> void:
	_rng.seed = seed_val

# Weighted random picker from candidate catalog
func _pick_weighted(candidates: Array[Dictionary]) -> Dictionary:
	var total_weight: int = 0
	for item in candidates:
		total_weight += int(item.get("weight", 5))

	var roll: int = _rng.randi_range(0, max(1, total_weight - 1))
	var accumulated: int = 0

	for item in candidates:
		accumulated += int(item.get("weight", 5))
		if roll < accumulated:
			return item

	return candidates[0]

# Generates 3 pieces adapted to board density with guaranteed playability
func generate_tray_pieces(board: BoardLogic) -> Array[Dictionary]:
	var occupancy: float = board.calculate_occupancy()
	var catalog: Array[Dictionary] = PieceData.PIECE_CATALOG

	# If board is dense (>60%), suppress huge pieces (3x3 and 5-bars)
	var active_pool: Array[Dictionary] = []
	for def in catalog:
		if occupancy > 0.60:
			if def["difficulty"] == "hard":
				continue
		active_pool.append(def)

	if active_pool.is_empty():
		active_pool = catalog

	var tray: Array[Dictionary] = [
		PieceData.create_piece_instance(_pick_weighted(active_pool)),
		PieceData.create_piece_instance(_pick_weighted(active_pool)),
		PieceData.create_piece_instance(_pick_weighted(active_pool))
	]

	# Guarantee at least one piece in the fresh batch can fit on the board
	var has_playable: bool = false
	for p in tray:
		if board.can_piece_fit_anywhere(p["matrix"]):
			has_playable = true
			break

	if not has_playable:
		# Find candidate shapes that can fit on this exact board state
		var playable_defs: Array[Dictionary] = []
		for def in catalog:
			if board.can_piece_fit_anywhere(def["matrix"]):
				playable_defs.append(def)

		if not playable_defs.is_empty():
			var rescue_def: Dictionary = _pick_weighted(playable_defs)
			tray[2] = PieceData.create_piece_instance(rescue_def)
		else:
			# Extreme fallback: 1x1 dot
			for def in catalog:
				if def["id"] == "dot_1":
					tray[2] = PieceData.create_piece_instance(def)
					break

	return tray
