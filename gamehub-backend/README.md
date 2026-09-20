# GameHub Backend

Node.js + Express + TypeScript + Drizzle ORM + Neon PostgreSQL

## Status: Phase 6 (Not Yet Implemented)

This project will be implemented after the mobile foundation and offline games are stable.

## Planned Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict)
- **ORM**: Drizzle ORM
- **Database**: Neon PostgreSQL
- **Validation**: Zod
- **Auth**: JWT (access + refresh tokens)
- **Logging**: Pino
- **Security**: Helmet, CORS, rate limiting

## Planned Structure

```
gamehub-backend/
├── src/
│   ├── app.ts            — Express app setup
│   ├── server.ts         — Entry point + graceful shutdown
│   ├── config/           — env validation, database connection
│   ├── db/
│   │   ├── schema/       — 13 Drizzle table definitions
│   │   └── migrations/   — Drizzle Kit migrations
│   ├── middleware/        — auth, validation, rate-limit, error
│   ├── modules/          — auth, users, profiles, games, scores,
│   │                       stats, friends, achievements,
│   │                       leaderboards, matches, sync, battle, config
│   ├── routes/           — Route aggregator (/api/v1)
│   ├── utils/            — logger, errors, response helpers
│   └── types/
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── .env.example
```

## Key API Endpoints

```
GET  /health
GET  /ready
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/sync
POST /api/v1/scores
GET  /api/v1/leaderboards/:gameId
POST /api/v1/battle/matches/:matchId/result
```

See [../docs/api/](../docs/api/) for full API documentation.
