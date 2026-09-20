# GameHub — Common Game Engine

## Purpose

With 30 non-FPS games, every game must follow the same lifecycle and contract. This prevents 30 different architectures and ensures consistent XP, coins, achievements, and sync across all games.

## Game Contract

```typescript
interface IGame {
  id: string;
  config: GameConfig;
  onInit(): void;       // Load assets, set up state
  onStart(): void;      // Begin gameplay
  onPause(): void;      // Pause timers, save state
  onResume(): void;     // Resume from pause
  onFinish(result: GameResult): void;  // Calculate score, award XP
  onDestroy(): void;    // Cleanup
}
```

## Lifecycle State Machine

```
IDLE → READY → PLAYING → PAUSED → PLAYING → FINISHED → RESULT → SAVE → SYNC
```

## Engine Components

| Component | Responsibility |
|---|---|
| `GameEngine` | Orchestrates lifecycle, manages state transitions |
| `GameSession` | Tracks session: start time, duration, events |
| `GameState` | State machine with transition validation |
| `ScoreManager` | Calculate, validate, submit scores |
| `ResultManager` | Prepare data for result screen |
| `DifficultyManager` | Easy/Normal/Hard/Expert + dynamic |
| `GameStorage` | Save/load game state for resume |

## Adding a New Game

1. Create `games/<category>/<game-id>/`
2. Add `Game.tsx`, `logic.ts`, `types.ts`, `config.ts`
3. Register in `constants/games.ts`
4. **No core infrastructure changes needed**

## Score Submission Flow

```
Game finishes
     ↓
ScoreManager.submit()
     ↓
Validate locally (score rules)
     ↓
Write to SQLite (game_scores with event_id, game_version, score_version)
     ↓
Update game_stats (games_played, best_score, etc.)
     ↓
Award XP + coins
     ↓
Check achievements
     ↓
Enqueue to sync_queue
```

## Difficulty System

```typescript
interface DifficultyConfig {
  level: 'easy' | 'normal' | 'hard' | 'expert';
  params: Record<string, number>;
}
```

Each game defines its own difficulty parameters. Example for Mind Lock:
- Easy: 3 pattern length
- Normal: 5 pattern length
- Hard: 8 pattern length
- Expert: 10+ pattern length

## Save/Resume

| Game Type | Strategy |
|---|---|
| Quick (Tic Tac Toe, RPS) | Result only |
| Medium (Snake, Mind Lock) | Save on background |
| Long (Ludo, Chess, Carrom) | Full state save + resume |
