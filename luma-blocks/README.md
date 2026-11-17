# 🧩 Luma Blocks — 8x8 Mobile Block Puzzle Game

**Engine:** Godot 4.3+ (GDScript)  
**Target Platforms:** Android (Portrait-first), Desktop (Mouse testing), iOS  
**Resolution:** 720 × 1280 (Viewport with CanvasItems stretch, responsive aspect)

---

## 1. Game Overview

**Luma Blocks** is a premium, original, production-quality 8x8 drag-and-drop block puzzle game inspired by the timeless block puzzle genre. It features a custom midnight-navy aesthetic, 2.5D jewel bevels, procedural vector particles, and a built-in algorithmic audio synthesizer requiring zero external 3rd-party assets.

### Core Gameplay Rules:
- **8×8 Board:** Clear rows and columns on an 8×8 grid.
- **Drag & Drop:** Pieces float with an ~88px vertical finger offset so your thumb never blocks placement.
- **Ghost Preview:** Real-time dashed jewel preview shows exact snapped placement on the board.
- **No Rotation & No Gravity:** Standard classic puzzle rules — pieces retain their dealt orientation and blocks remain locked where placed.
- **Simultaneous Line Clears:** If intersecting rows and columns are filled on the same move, they blast simultaneously!
- **Consecutive Combos:** Every consecutive move that clears lines escalates the combo streak with increasing score multipliers up to **3.0×**!
- **Smart Adaptive Spawner:** Generates batches of 3 pieces. When the board is congested (>60% full), large 3×3 and 5-bar shapes are suppressed and at least one playable piece is always guaranteed.
- **Undo Support:** Safe one-move undo state restore for board, tray, score, and combo streak.
- **Autosave & Persistence:** High scores, player level, daily streak, and settings persist to `user://luma_blocks_save.json`.

---

## 2. Exact Scoring Mathematical Model

$$\text{Total Score} = \text{Placement Points} + \text{round}(\text{Clear Bonus} \times \text{Combo Multiplier})$$

1. **Placement Points:**  
   $$\text{Points}_{\text{place}} = \text{CellCount}(\text{Piece})$$

2. **Clear Bonus:**  
   $$\text{Bonus}_{\text{clear}} = 10 \times (\text{LinesCleared})^2$$
   - 1 Line: $10 \text{ pts}$
   - 2 Lines (Double Blast): $40 \text{ pts}$
   - 3 Lines (Triple Blast): $90 \text{ pts}$
   - 4 Lines (Luma Quad Blast): $160 \text{ pts}$

3. **Combo Multiplier:**  
   $$\text{Multiplier} = 1.0 + 0.25 \times \min(\text{ComboStreak} - 1, 8)$$
   - Streak 1 (First clear): $1.0\times$
   - Streak 2: $1.25\times$
   - Streak 3: $1.50\times$
   - Streak 4: $1.75\times$
   - Streak 5: $2.00\times$
   - Streak $\ge 9$: $3.00\times$ (Maximum cap)
   - *Any placement that does not clear lines resets the combo streak to 0.*

---

## 3. Project File Structure

```
luma-blocks/
├── project.godot                 # Godot 4.x engine configuration (Portrait 720x1280)
├── export_presets.cfg            # Android export preset config
├── icon.svg                      # Vector branding icon
├── README.md                     # Documentation & Android export guide
│
├── scripts/
│   ├── core/
│   │   ├── board_logic.gd        # Pure 8x8 matrix engine, collision, dual-axis line clear, game over check
│   │   ├── piece_data.gd         # 22+ Polyomino definitions, matrices, and color palettes
│   │   ├── piece_generator.gd    # Density-aware fair spawner with playability guarantee
│   │   └── scoring.gd            # Exact placement, clear bonus, and combo multiplier formulas
│   │
│   ├── systems/
│   │   ├── save_manager.gd       # Persistent storage (high score, stats, daily streaks, settings)
│   │   ├── sound_manager.gd      # Procedural WAV synthesizer (clicks, thuds, blasts, combo chimes)
│   │   ├── theme_manager.gd      # 4 visual themes: Classic Luma, Neon Pulse, Pastel Dream, Cyberpunk
│   │   └── haptics.gd            # Mobile haptic feedback wrapper
│   │
│   └── ui/
│       ├── main_root.gd          # Master screen stack navigator and transition manager
│       ├── board_view.gd         # 8x8 Grid rendering with custom _draw(), beveled cells, ghost preview
│       ├── draggable_piece.gd    # Touch/mouse drag-and-drop with finger offset and spring-back
│       ├── tray_view.gd          # 3-slot bottom tray container
│       ├── particle_burst.gd     # Vector particle burst for cleared rows and columns
│       ├── combo_popup.gd        # Floating animated combo toast banner
│       └── screens/
│           ├── home_screen.gd    # Main menu: Play Classic, Daily Challenge, Themes, Settings, Tutorial
│           ├── game_screen.gd    # Main HUD, 8x8 Board, Tray, Undo button, Pause button
│           ├── pause_screen.gd   # Resume, Restart, Settings, Home
│           ├── game_over_screen.gd # Final score, best score, new record banner, lines, replay
│           ├── daily_challenge_screen.gd # Calendar seed, streak tracker, daily goal
│           ├── themes_screen.gd  # Theme selector with live palette swatches
│           ├── settings_screen.gd# Audio toggles, haptics, reduced motion, reset data
│           └── tutorial_screen.gd# 4-step interactive visual tutorial
│
├── scenes/
│   └── main.tscn                 # Primary entry scene
│
└── tests/
    ├── test_runner.gd            # Godot 4 headless GDScript test suite
    └── verify_logic.py           # Standalone Python core logic verification script
```

---

## 4. Running the Game

### Desktop / Editor:
1. Open the **Godot 4.3+ Engine**.
2. Click **Import** and select the `luma-blocks/project.godot` file.
3. Press **F5** (or click the **Play** button in the top right).
4. Use mouse click & drag to simulate touch input.

### Running Headless Automated Tests:
```bash
# In Godot 4:
godot --headless -s tests/test_runner.gd

# Standalone Python test verification:
python tests/verify_logic.py
```

---

## 5. Android Export Instructions

### Prerequisites:
1. Install **OpenJDK 17** (or Android Studio's bundled JDK).
2. Install **Android SDK** (API Level 34) and Command-line Tools via Android Studio.
3. Configure Godot Editor Settings:
   - Go to `Editor -> Editor Settings -> Export -> Android`.
   - Set `Android SDK Path` to your SDK folder (e.g. `C:/Users/<Username>/AppData/Local/Android/Sdk`).
   - Set `Java SDK Path` (e.g. `C:/Program Files/Java/jdk-17`).

### Generate Keystore:
```bash
keytool -v -genkey -v -keystore luma_release.keystore -alias lumablocks -keyalg RSA -keysize 2048 -validity 10000
```

### Export APK / AAB:
1. In Godot 4, click **Project -> Export**.
2. Select the **Android** preset (already pre-configured in `export_presets.cfg`).
3. Set your Release Keystore path, alias, and password in the preset dialog.
4. Click **Export Project** and choose the destination folder (e.g., `./build/LumaBlocks.apk`).
5. Transfer the APK to your Android device or run:
   ```bash
   adb install -r ./build/LumaBlocks.apk
   ```
