# GameHub FPS Server — Realtime Multiplayer

Node.js + TypeScript + WebSocket — Authoritative FPS Game Server

## Status: Phase 8B (Not Yet Implemented)

This project will be implemented after the Unity FPS prototype (Phase 8A) is working offline.

## Planned Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Transport**: WebSocket (ws or Socket.io)
- **Auth**: JWT verification (tokens from Express backend)

## Planned Structure

```
gamehub-fps-server/
├── src/
│   ├── server.ts         — WebSocket server entry point
│   ├── config/           — env, game config (tick rate, max players)
│   ├── network/          — connection manager, message handler, protocol
│   ├── rooms/            — room manager, room state
│   ├── matches/          — match manager, match loop, match state
│   ├── players/          — player state, player manager, input buffer
│   ├── game-modes/       — IGameMode, FFA, TDM, GunGame, CapturePoint, Duel
│   ├── state/            — world state, snapshots, delta compression
│   ├── validation/       — hit validation, movement validation, anti-cheat
│   ├── services/         — GameHub API client, match result submission
│   └── utils/
├── package.json
├── tsconfig.json
└── .env.example
```

## Architecture

- **Server-authoritative**: Server owns all gameplay state
- **Simulation**: 60 Hz server tick
- **Snapshots**: 20 Hz network snapshot rate (configurable)
- **Validation**: All hits, damage, deaths validated server-side
- **Anti-cheat**: Movement speed, fire rate, ammo, range validation
- **Disconnect**: 15–30s grace period with reconnection support

## Data Flow

```
Unity Client → Input → FPS Server → Validates → State Update → Snapshot → All Clients
```

## Match Result Pipeline

```
Match Complete → FPS Server → POST /api/v1/battle/matches/:id/result → Express → Neon
```

Live match state lives in server memory only. No frame-by-frame data goes to PostgreSQL.

## Important Rules

- FPS server does NOT directly access Neon PostgreSQL
- Match results go through Express API
- State is temporary — only final results are persisted
- Server must handle graceful shutdown (notify players, save match state)
