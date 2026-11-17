# ============================================================
# Luma Blocks — Piece Data & Polyomino Definitions
# ============================================================
class_name PieceData
extends RefCounted

enum ColorId {
	CYAN,
	VIOLET,
	AMBER,
	PINK,
	MINT
}

const PALETTE: Dictionary = {
	ColorId.CYAN: Color("#50CFE7"),
	ColorId.VIOLET: Color("#9677F5"),
	ColorId.AMBER: Color("#FFB94F"),
	ColorId.PINK: Color("#FF729C"),
	ColorId.MINT: Color("#51DFA9"),
}

const PALETTE_SHADOW: Dictionary = {
	ColorId.CYAN: Color("#288EA2"),
	ColorId.VIOLET: Color("#6043B5"),
	ColorId.AMBER: Color("#B8771A"),
	ColorId.PINK: Color("#BA345C"),
	ColorId.MINT: Color("#258A63"),
}

const PALETTE_HIGHLIGHT: Dictionary = {
	ColorId.CYAN: Color("#A6EBF6"),
	ColorId.VIOLET: Color("#C9B8FB"),
	ColorId.AMBER: Color("#FFDEAB"),
	ColorId.PINK: Color("#FFAECC"),
	ColorId.MINT: Color("#A0EED1"),
}

# Raw piece definition dictionary
# id, name, matrix (Array of Array of bool), color_id, weight, difficulty
static var PIECE_CATALOG: Array[Dictionary] = [
	# ── 1. Single Dot (Rescue piece) ──
	{
		"id": "dot_1",
		"name": "Dot",
		"matrix": [[true]],
		"color_id": ColorId.MINT,
		"weight": 8,
		"difficulty": "easy"
	},

	# ── 2. 2-Bars (H / V) ──
	{
		"id": "bar_2_h",
		"name": "2-Bar H",
		"matrix": [[true, true]],
		"color_id": ColorId.CYAN,
		"weight": 10,
		"difficulty": "easy"
	},
	{
		"id": "bar_2_v",
		"name": "2-Bar V",
		"matrix": [[true], [true]],
		"color_id": ColorId.CYAN,
		"weight": 10,
		"difficulty": "easy"
	},

	# ── 3. 3-Bars (H / V) ──
	{
		"id": "bar_3_h",
		"name": "3-Bar H",
		"matrix": [[true, true, true]],
		"color_id": ColorId.VIOLET,
		"weight": 9,
		"difficulty": "easy"
	},
	{
		"id": "bar_3_v",
		"name": "3-Bar V",
		"matrix": [[true], [true], [true]],
		"color_id": ColorId.VIOLET,
		"weight": 9,
		"difficulty": "easy"
	},

	# ── 4. 4-Bars (H / V) ──
	{
		"id": "bar_4_h",
		"name": "4-Bar H",
		"matrix": [[true, true, true, true]],
		"color_id": ColorId.AMBER,
		"weight": 7,
		"difficulty": "medium"
	},
	{
		"id": "bar_4_v",
		"name": "4-Bar V",
		"matrix": [[true], [true], [true], [true]],
		"color_id": ColorId.AMBER,
		"weight": 7,
		"difficulty": "medium"
	},

	# ── 5. 5-Bars (H / V) ──
	{
		"id": "bar_5_h",
		"name": "5-Bar H",
		"matrix": [[true, true, true, true, true]],
		"color_id": ColorId.PINK,
		"weight": 4,
		"difficulty": "hard"
	},
	{
		"id": "bar_5_v",
		"name": "5-Bar V",
		"matrix": [[true], [true], [true], [true], [true]],
		"color_id": ColorId.PINK,
		"weight": 4,
		"difficulty": "hard"
	},

	# ── 6. Squares (2x2, 3x3) ──
	{
		"id": "sq_2",
		"name": "Square 2x2",
		"matrix": [
			[true, true],
			[true, true]
		],
		"color_id": ColorId.AMBER,
		"weight": 10,
		"difficulty": "easy"
	},
	{
		"id": "sq_3",
		"name": "Square 3x3",
		"matrix": [
			[true, true, true],
			[true, true, true],
			[true, true, true]
		],
		"color_id": ColorId.PINK,
		"weight": 3,
		"difficulty": "hard"
	},

	# ── 7. Mini Corners (2x2, 3 blocks) ──
	{
		"id": "corner_tl",
		"name": "Corner TL",
		"matrix": [
			[true, true],
			[true, false]
		],
		"color_id": ColorId.MINT,
		"weight": 9,
		"difficulty": "easy"
	},
	{
		"id": "corner_tr",
		"name": "Corner TR",
		"matrix": [
			[true, true],
			[false, true]
		],
		"color_id": ColorId.MINT,
		"weight": 9,
		"difficulty": "easy"
	},
	{
		"id": "corner_bl",
		"name": "Corner BL",
		"matrix": [
			[true, false],
			[true, true]
		],
		"color_id": ColorId.CYAN,
		"weight": 9,
		"difficulty": "easy"
	},
	{
		"id": "corner_br",
		"name": "Corner BR",
		"matrix": [
			[false, true],
			[true, true]
		],
		"color_id": ColorId.CYAN,
		"weight": 9,
		"difficulty": "easy"
	},

	# ── 8. Classic 4-Cell L-Shapes (3x2) ──
	{
		"id": "l_dr",
		"name": "L-Shape DR",
		"matrix": [
			[true, false],
			[true, false],
			[true, true]
		],
		"color_id": ColorId.VIOLET,
		"weight": 8,
		"difficulty": "medium"
	},
	{
		"id": "l_dl",
		"name": "L-Shape DL",
		"matrix": [
			[false, true],
			[false, true],
			[true, true]
		],
		"color_id": ColorId.VIOLET,
		"weight": 8,
		"difficulty": "medium"
	},
	{
		"id": "l_ur",
		"name": "L-Shape UR",
		"matrix": [
			[true, true],
			[true, false],
			[true, false]
		],
		"color_id": ColorId.VIOLET,
		"weight": 8,
		"difficulty": "medium"
	},
	{
		"id": "l_ul",
		"name": "L-Shape UL",
		"matrix": [
			[true, true],
			[false, true],
			[false, true]
		],
		"color_id": ColorId.VIOLET,
		"weight": 8,
		"difficulty": "medium"
	},

	# ── 9. T-Shapes (3x2) ──
	{
		"id": "t_down",
		"name": "T-Shape Down",
		"matrix": [
			[true, true, true],
			[false, true, false]
		],
		"color_id": ColorId.CYAN,
		"weight": 8,
		"difficulty": "medium"
	},
	{
		"id": "t_up",
		"name": "T-Shape Up",
		"matrix": [
			[false, true, false],
			[true, true, true]
		],
		"color_id": ColorId.CYAN,
		"weight": 8,
		"difficulty": "medium"
	},
	{
		"id": "t_right",
		"name": "T-Shape Right",
		"matrix": [
			[true, false],
			[true, true],
			[true, false]
		],
		"color_id": ColorId.CYAN,
		"weight": 8,
		"difficulty": "medium"
	},
	{
		"id": "t_left",
		"name": "T-Shape Left",
		"matrix": [
			[false, true],
			[true, true],
			[false, true]
		],
		"color_id": ColorId.CYAN,
		"weight": 8,
		"difficulty": "medium"
	},

	# ── 10. Z & S Shapes (3x2) ──
	{
		"id": "z_h",
		"name": "Z-Shape H",
		"matrix": [
			[true, true, false],
			[false, true, true]
		],
		"color_id": ColorId.AMBER,
		"weight": 7,
		"difficulty": "medium"
	},
	{
		"id": "s_h",
		"name": "S-Shape H",
		"matrix": [
			[false, true, true],
			[true, true, false]
		],
		"color_id": ColorId.MINT,
		"weight": 7,
		"difficulty": "medium"
	},

	# ── 11. Giant 5-Cell L-Shapes (3x3) ──
	{
		"id": "big_l_br",
		"name": "Big L Corner",
		"matrix": [
			[true, false, false],
			[true, false, false],
			[true, true, true]
		],
		"color_id": ColorId.PINK,
		"weight": 4,
		"difficulty": "hard"
	},
	{
		"id": "big_l_bl",
		"name": "Big L Mirror",
		"matrix": [
			[false, false, true],
			[false, false, true],
			[true, true, true]
		],
		"color_id": ColorId.PINK,
		"weight": 4,
		"difficulty": "hard"
	},

	# ── 12. Plus Cross (3x3, 5 cells) ──
	{
		"id": "plus_5",
		"name": "Plus Cross",
		"matrix": [
			[false, true, false],
			[true, true, true],
			[false, true, false]
		],
		"color_id": ColorId.CYAN,
		"weight": 4,
		"difficulty": "hard"
	}
]

# Helper to instantiate a runtime piece dictionary with unique ID & cell count
static func create_piece_instance(def: Dictionary, instance_id: String = "") -> Dictionary:
	var matrix: Array = def["matrix"]
	var rows: int = matrix.size()
	var cols: int = 0
	var cell_count: int = 0

	for r in range(rows):
		var row: Array = matrix[r]
		cols = max(cols, row.size())
		for c in range(row.size()):
			if row[c]:
				cell_count += 1

	var id_str = instance_id
	if id_str.is_empty():
		id_str = def["id"] + "_" + str(Time.get_ticks_usec()) + "_" + str(randi() % 1000)

	var color_id: int = def["color_id"]

	return {
		"instance_id": id_str,
		"def_id": def["id"],
		"name": def["name"],
		"matrix": matrix,
		"color_id": color_id,
		"color": PALETTE[color_id],
		"shadow_color": PALETTE_SHADOW[color_id],
		"highlight_color": PALETTE_HIGHLIGHT[color_id],
		"rows": rows,
		"cols": cols,
		"cell_count": cell_count,
		"difficulty": def["difficulty"]
	}
