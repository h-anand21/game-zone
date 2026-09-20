# GameHub — Mobile Architecture

## Technology Stack

- **Framework**: React Native + Expo (SDK 53+)
- **Language**: TypeScript (strict)
- **Navigation**: Expo Router (file-based)
- **Local Database**: SQLite (expo-sqlite)
- **State Management**: Zustand
- **Styling**: React Native StyleSheet + custom theme
- **Secure Storage**: expo-secure-store
- **Networking**: Fetch API + custom client

## Common Game Engine

All 30 non-FPS games share a standard lifecycle:

```
IDLE → READY → PLAYING → PAUSED → PLAYING → FINISHED → RESULT → SAVE → SYNC
```

Every game implements the `IGame` contract and uses:
- `GameEngine` — orchestrates lifecycle
- `ScoreManager` — score calculation + submission
- `DifficultyManager` — difficulty levels
- `GameStorage` — save/resume for long games

## Offline-First Architecture

```
Game Completion
     ↓
SQLite (game_scores, game_stats)
     ↓
Sync Queue (event_id for idempotency)
     ↓
Network Monitor detects connectivity
     ↓
POST /api/v1/sync
     ↓
Express validates + deduplicates
     ↓
Neon PostgreSQL
```

## Network State Machine

```
ONLINE → OFFLINE → CONNECTING → RECONNECTING → SYNCING → SYNC_FAILED → ONLINE
```

## Guest → Cloud Account Linking

```
Guest (device UUID) → Play offline → Create account → Link guest_id → Merge data → Cloud account
```

## Feature Flags

Disabled features show "Coming Soon" — controlled by remote config from backend.
