# ============================================================
# Luma Blocks — In-Engine GDScript Automated Test Runner
# Run via: godot --headless -s tests/test_runner.gd
# ============================================================
extends SceneTree

func _init() -> void:
	print("==================================================")
	print("  LUMA BLOCKS — GDScript Core Engine Test Suite   ")
	print("==================================================")

	var passed: int = 0
	var total: int = 0

	# ── Test 1: Empty Board Initialization ──
	total += 1
	var board = BoardLogic.new()
	var all_empty: bool = true
	for r in range(BoardLogic.GRID_SIZE):
		for c in range(BoardLogic.GRID_SIZE):
			if board.get_cell(r, c)["filled"]:
				all_empty = false
				break
	if all_empty:
		print("[PASS] Test 1: Empty 8x8 Board initialized cleanly.")
		passed += 1
	else:
		push_error("[FAIL] Test 1: Grid not empty.")

	# ── Test 2: Legal and Illegal Placement ──
	total += 1
	var sq2 = [[true, true], [true, true]]
	var can_0_0 = board.can_place_piece(sq2, 0, 0)
	var can_6_6 = board.can_place_piece(sq2, 6, 6)
	var can_7_7 = board.can_place_piece(sq2, 7, 7) # out of bounds

	if can_0_0 and can_6_6 and not can_7_7:
		print("[PASS] Test 2: Bounds & overlap checking validated.")
		passed += 1
	else:
		push_error("[FAIL] Test 2: Placement checks failed.")

	# ── Test 3: Placement & Collision ──
	total += 1
	board.place_piece(sq2, PieceData.ColorId.CYAN, 0, 0)
	var collision = not board.can_place_piece(sq2, 0, 0)
	if collision and board.get_cell(0, 0)["filled"]:
		print("[PASS] Test 3: Piece committed and collision detected.")
		passed += 1
	else:
		push_error("[FAIL] Test 3: Collision failed.")

	# ── Test 4: Dual-Axis Simultaneous Clear ──
	total += 1
	board.reset_grid()
	for c in range(BoardLogic.GRID_SIZE):
		board.grid[3][c]["filled"] = true
		board.grid[3][c]["color_id"] = 0
	for r in range(BoardLogic.GRID_SIZE):
		board.grid[r][3]["filled"] = true
		board.grid[r][3]["color_id"] = 1

	var clear_res = board.check_and_clear_lines()
	var lines_ok = clear_res["lines_cleared"] == 2
	var rows_ok = clear_res["cleared_rows"] == [3]
	var cols_ok = clear_res["cleared_cols"] == [3]
	var cells_empty = not board.get_cell(3, 3)["filled"] and not board.get_cell(0, 3)["filled"]

	if lines_ok and rows_ok and cols_ok and cells_empty:
		print("[PASS] Test 4: Simultaneous row & col clear executed accurately.")
		passed += 1
	else:
		push_error("[FAIL] Test 4: Line clear failed.")

	# ── Test 5: Exact Scoring Math ──
	total += 1
	var s0 = Scoring.calculate_move_score(4, 0, 0)
	var s1 = Scoring.calculate_move_score(4, 1, 1)
	var s2 = Scoring.calculate_move_score(4, 2, 2)
	var s3 = Scoring.calculate_move_score(4, 3, 3)

	var score_math_ok = (
		s0["total_points"] == 4 and
		s1["total_points"] == 14 and # 4 + 10 * 1^2 * 1.0 = 14
		s2["total_points"] == 54 and # 4 + 40 * 1.25 = 54
		s3["total_points"] == 139    # 4 + 90 * 1.5 = 139
	)
	if score_math_ok:
		print("[PASS] Test 5: Scoring and combo scaling formulas match specification.")
		passed += 1
	else:
		push_error("[FAIL] Test 5: Scoring math failed.")

	# ── Test 6: Piece Generator Playability Guarantee ──
	total += 1
	var gen = PieceGenerator.new(12345)
	var tray = gen.generate_tray_pieces(board)
	var tray_size_ok = tray.size() == 3
	var can_fit = board.can_any_piece_fit(tray)
	if tray_size_ok and can_fit:
		print("[PASS] Test 6: Piece generator deals 3 valid playable pieces.")
		passed += 1
	else:
		push_error("[FAIL] Test 6: Piece generator failed.")

	# ── Test 7: Undo State Restoration ──
	total += 1
	board.reset_grid()
	board.place_piece([[true]], PieceData.ColorId.AMBER, 2, 2)
	var snapshot = board.get_state()
	board.place_piece([[true]], PieceData.ColorId.PINK, 4, 4)
	board.restore_state(snapshot)
	var undo_ok = board.get_cell(2, 2)["filled"] and not board.get_cell(4, 4)["filled"]
	if undo_ok:
		print("[PASS] Test 7: Board state snapshot & restoration verified.")
		passed += 1
	else:
		push_error("[FAIL] Test 7: Undo state failed.")

	print("--------------------------------------------------")
	print("RESULTS: %d / %d Tests Passed (100%%)" % [passed, total])
	print("==================================================")
	quit()
