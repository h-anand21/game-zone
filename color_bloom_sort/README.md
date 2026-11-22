# Color Bloom Sort 🧪🌸

A premium, beautiful, playable 2D mobile puzzle game built with Flutter and Dart, inspired by the classic ball sorting puzzle mechanic with original visual styling, smooth animations, and a deterministic level engine.

---

## 🌟 Features

- **Intuitive Core Mechanics**:
  - Tap any tube to lift the top ball with smooth bounce animation.
  - Tap another tube to transfer.
  - Strict move validation:
    - Tube capacity is capped at 4 balls.
    - Transfer allowed only if destination tube is empty or top ball matches the source color.
    - Cannot transfer to a full tube or to the same tube.
- **Rich 3D Glossy Visuals**:
  - Handcrafted `CustomPainter` rendering for glossy 3D spheres with specular reflections and ambient shadows.
  - Realistic transparent glass test tubes with glass thickness, rim styling, and liquid reflection highlights.
- **Deterministic Level Generator**:
  - Procedural reverse-move generation from a solved state ensuring **100% solvability** without unsolvable dead ends.
  - Progressive difficulty scaling:
    - Levels 1–5: Tutorial & easy levels (2–3 colors, 3–4 tubes)
    - Levels 6–20: Intermediate levels (4–5 colors, 5–6 tubes)
    - Levels 21–50+: Advanced puzzles (6–8 colors, 8–10 tubes)
  - Over 500+ playable levels supported out of the box.
- **Intelligent BFS Hint Solver**:
  - Built-in Breadth-First Search (BFS) state-space solver that searches valid board transitions to find the optimal next move when players are stuck.
- **Player Assists & Boosters**:
  - **Multi-step Undo**: Revert moves backwards seamlessly.
  - **+1 Extra Tube Booster**: Add an empty standby tube to unblock tricky arrangements.
  - **Hint System**: Highlights the recommended source and destination tubes.
- **Celebration & Victory**:
  - Complete all tubes to trigger star ratings, coin rewards, and level progression.
- **Offline-First**:
  - No internet connection or backend required for gameplay.

---

## 📂 Architecture Overview

```
color_bloom_sort/
├── lib/
│   ├── main.dart                             # App entry point
│   ├── features/
│   │   └── gameplay/
│   │       └── gameplay_screen.dart          # Responsive gameplay screen & UI controls
│   └── game/
│       ├── engine/
│       │   └── puzzle_engine.dart            # Pure state engine (rules, moves, undo, win state)
│       ├── generator/
│       │   └── level_generator.dart          # Deterministic reverse-move solvable level generator
│       ├── models/
│       │   ├── ball.dart                     # Ball colors, gradients, highlights & shadows
│       │   ├── move_record.dart              # Undo move history record
│       │   └── tube.dart                     # Tube model (capacity 4, push/pop/peek, isSolved)
│       ├── painters/
│       │   ├── glass_tube_painter.dart       # CustomPainter for transparent glass tubes
│       │   └── glossy_ball_painter.dart      # CustomPainter for 3D glossy spheres
│       └── solver/
│           └── bfs_solver.dart               # Queue-based state-space BFS hint solver
├── test/
│   └── puzzle_engine_test.dart               # Comprehensive unit tests for engine, generator & solver
└── pubspec.yaml                              # Flutter dependencies & metadata
```

---

## 🚀 Getting Started

### Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (version 3.0 or higher)
- Android Studio / Android SDK (for mobile deployment)

### 1. Install Dependencies
```bash
cd color_bloom_sort
flutter pub get
```

### 2. Run Tests
Verify puzzle logic, reverse-move level generator, and BFS solver:
```bash
flutter test
```

### 3. Run Locally on Android Device / Emulator
```bash
flutter run
```

### 4. Build Production APK / AAB
To build an Android release package:
```bash
# Generate APK
flutter build apk --release

# Generate App Bundle (Google Play Store)
flutter build appbundle --release
```

---

## 🎨 GameHub Mobile Integration

In addition to this standalone Flutter project, "Color Bloom Sort" has also been integrated into the **GameHub Mobile** React Native / Expo application (`e:\game-zone\gamehub-mobile\src\games\arcade\endless-runner\`), replacing the previous endless-runner with full parity in mechanics, 5 themes, level selection, shop, and offline persistence.
