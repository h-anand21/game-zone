# GameHub

A single gaming platform containing 35 games — offline-first, mobile-first, built for Android.

## Architecture

```
GameHub/
├── gamehub-mobile/      → React Native + Expo + TypeScript
├── gamehub-backend/     → Node.js + Express + Drizzle + Neon PostgreSQL
├── gamehub-fps/         → Unity + C#
├── gamehub-fps-server/  → Node.js + TypeScript realtime server
├── shared/              → API contracts, enums, game IDs, protocol
└── docs/                → Architecture, API, database docs
```

## System Overview

```
                     GAMEHUB
                        |
      +-----------------+------------------+
      |                                    |
  MOBILE APP                          UNITY FPS
  React Native + Expo                 Unity + C#
      |                                    |
      | HTTPS                              | WebSocket
      v                                    v
  EXPRESS BACKEND                   FPS REALTIME SERVER
  Node.js + Express                        |
      |                                    |
      v                                    |
  Drizzle ORM                             |
      |                                    |
      v                                    |
  Neon PostgreSQL <------------------------+
                    Final Match Results
```

## Games (35 Total)

| Category | Count | Games |
|---|---|---|
| Brain | 8 | Mind Lock, Find One, Reverse Mind, Memory Rush, Number Rush, Pattern Break, Code Breaker, Path Mind |
| Reflex / Skill | 6 | Aim Rush, One Tap, Don't Tap Wrong, Reaction Fire, Stack Master, Perfect Hit |
| Arcade | 5 | Snake, Pong, Sky Jump, Endless Runner, Block Puzzle |
| Classic / Indian | 6 | Ludo, Bagh-Bakri, Carrom, Mini Chess, Connect 4, Memory Cards |
| Battle Arena (FPS) | 5 | Free For All, Team Deathmatch, Gun Game, Capture Point, 1v1 Duel |
| Party / Social | 5 | Tic Tac Toe, Rock Paper Scissors, Air Hockey, Quiz Battle, Guess the Drawing |

## Tech Stack

- **Mobile**: React Native, Expo, TypeScript, Expo Router, SQLite, Zustand
- **Backend**: Node.js, Express, TypeScript, Drizzle ORM, Neon PostgreSQL, Zod
- **FPS Client**: Unity, C#
- **FPS Server**: Node.js, TypeScript, WebSocket
- **Database**: Neon PostgreSQL (cloud), SQLite (offline)

## Getting Started

See [docs/development/setup.md](docs/development/setup.md) for local development setup.

## License

MIT — see [LICENSE](LICENSE)
