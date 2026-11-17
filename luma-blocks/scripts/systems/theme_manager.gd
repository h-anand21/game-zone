# ============================================================
# Luma Blocks — Theme Manager & Visual Palettes
# ============================================================
class_name ThemeManager
extends RefCounted

const THEMES: Dictionary = {
	"classic": {
		"id": "classic",
		"name": "Luma Classic",
		"bg_color": Color("#101B30"),
		"bg_gradient": [Color("#182744"), Color("#0A1220")],
		"grid_bg": Color("#344764"),
		"empty_cell": Color("#162540"),
		"empty_cell_border": Color("#203456"),
		"palette": {
			PieceData.ColorId.CYAN: Color("#50CFE7"),
			PieceData.ColorId.VIOLET: Color("#9677F5"),
			PieceData.ColorId.AMBER: Color("#FFB94F"),
			PieceData.ColorId.PINK: Color("#FF729C"),
			PieceData.ColorId.MINT: Color("#51DFA9")
		}
	},
	"neon": {
		"id": "neon",
		"name": "Neon Pulse",
		"bg_color": Color("#070D18"),
		"bg_gradient": [Color("#0D1A30"), Color("#03070E")],
		"grid_bg": Color("#1B2D48"),
		"empty_cell": Color("#0F1A2D"),
		"empty_cell_border": Color("#182E50"),
		"palette": {
			PieceData.ColorId.CYAN: Color("#00F0FF"),
			PieceData.ColorId.VIOLET: Color("#B026FF"),
			PieceData.ColorId.AMBER: Color("#FFB300"),
			PieceData.ColorId.PINK: Color("#FF007F"),
			PieceData.ColorId.MINT: Color("#39FF14")
		}
	},
	"pastel": {
		"id": "pastel",
		"name": "Pastel Dream",
		"bg_color": Color("#182234"),
		"bg_gradient": [Color("#233148"), Color("#101724")],
		"grid_bg": Color("#334562"),
		"empty_cell": Color("#202D44"),
		"empty_cell_border": Color("#2C3E5E"),
		"palette": {
			PieceData.ColorId.CYAN: Color("#8AD2E8"),
			PieceData.ColorId.VIOLET: Color("#B8A9E8"),
			PieceData.ColorId.AMBER: Color("#F6C492"),
			PieceData.ColorId.PINK: Color("#F8A4B8"),
			PieceData.ColorId.MINT: Color("#8AE3C3")
		}
	},
	"cyberpunk": {
		"id": "cyberpunk",
		"name": "Cyberpunk Void",
		"bg_color": Color("#0B0F19"),
		"bg_gradient": [Color("#141B2D"), Color("#05080E")],
		"grid_bg": Color("#27374F"),
		"empty_cell": Color("#141C2C"),
		"empty_cell_border": Color("#1F2E47"),
		"palette": {
			PieceData.ColorId.CYAN: Color("#00E5FF"),
			PieceData.ColorId.VIOLET: Color("#BD00FF"),
			PieceData.ColorId.AMBER: Color("#FFD700"),
			PieceData.ColorId.PINK: Color("#FF0055"),
			PieceData.ColorId.MINT: Color("#00FF66")
		}
	}
}

static func get_current_theme() -> Dictionary:
	var active_id = SaveManager.get_active_theme()
	if THEMES.has(active_id):
		return THEMES[active_id]
	return THEMES["classic"]

static func get_palette_color(color_id: int) -> Color:
	var t = get_current_theme()
	var pal: Dictionary = t["palette"]
	if pal.has(color_id):
		return pal[color_id]
	return Color("#50CFE7")
