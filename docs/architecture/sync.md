# GameHub — Offline Sync Architecture

## Overview

GameHub is offline-first. All game data is written to SQLite first, then synced to the cloud when connectivity is available.

## Sync Pipeline

```
Game Completion
     ↓
SQLite (game_scores, game_stats)
     ↓
sync_queue (event_id = UUID, status = 'pending')
     ↓
Network Monitor detects ONLINE
     ↓
Sync Manager processes queue
     ↓
POST /api/v1/sync (batch of events)
     ↓
Express validates each event
     ↓
Check event_id (idempotency)
     ├── Already processed → skip (200 OK, status: 'duplicate')
     └── New → process → mark processed_at
     ↓
Neon PostgreSQL (permanent storage)
```

## Idempotency

Every sync event has a client-generated `event_id` (UUID). The same event is NEVER processed twice.

```
event_id: "abc-123"
  First submission  → Process → Award XP + Coins → 200 OK (status: 'processed')
  Second submission → Skip    → No duplicate XP  → 200 OK (status: 'duplicate')
```

## Conflict Resolution

| Data Type | Strategy |
|---|---|
| Scores | Append (all scores kept, deduplicate by event_id) |
| Stats | Server wins if server timestamp is newer |
| Achievements | Union (keep all unlocked from both sides) |
| Profile | Server wins for cloud-owned fields |
| Settings | Latest timestamp wins |
| Progress | Latest timestamp wins |

## Retry Strategy

```
Failed sync event
     ↓
Retry #1 after 2 seconds
     ↓
Retry #2 after 4 seconds
     ↓
Retry #3 after 8 seconds
     ↓
Max 5 retries → status = 'failed'
     ↓
Manual retry available
```

## Network State Machine

```
ONLINE → OFFLINE → CONNECTING → RECONNECTING → SYNCING → SYNC_FAILED → ONLINE
```

## Guest → Cloud Account Linking

When a guest creates a cloud account:
1. Guest identity is linked to cloud user ID
2. All local data is merged using conflict resolution rules
3. Sync queue processes any pending events
4. Future events sync normally
