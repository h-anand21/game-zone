# GameHub — Security Architecture

## Core Principle: Never Trust the Client

Every client (mobile, Unity) is untrusted. The server validates all important actions.

## Score Validation / Anti-Cheat

```
Client submits score
     ↓
Backend validates:
├── Is game_id valid?
├── Is score within possible range? (per-game maxScore)
├── Is duration realistic? (minDuration ≤ duration ≤ maxDuration)
├── Is this a duplicate? (check event_id)
├── Is submission frequency suspicious?
└── Is game_version valid?
     ↓
Accept / Reject / Flag
```

### Per-Game Rules

Each game has validation rules defined in `shared/validation/score-rules.ts`:
- `maxScore`: highest plausible score
- `minDuration`: shortest possible game (seconds)
- `maxDuration`: longest reasonable game (seconds)

## FPS Server Authority

```
Unity Client: "I fired my weapon."
FPS Server:
  - Is player alive?
  - Is weapon equipped?
  - Does player have ammo?
  - Has fire-rate cooldown passed?
  - Is the shot geometrically possible?
  - Is the target within valid range?

FPS Server: "Hit confirmed. Damage = 30."
```

The client CANNOT decide:
- Damage values
- Kill confirmations
- Match outcomes
- Score/XP/coin awards

## Authentication

- Passwords hashed with bcrypt (cost factor 12)
- JWT access tokens: 15 minute expiry
- JWT refresh tokens: 7 day expiry
- Tokens stored in expo-secure-store (mobile)
- Refresh token rotation on use

## API Security

| Layer | Implementation |
|---|---|
| Headers | Helmet (security headers) |
| CORS | Configurable allowed origins |
| Rate Limiting | Per-route limits (auth: 5/min, general: 100/min) |
| Input Validation | Zod schemas on all inputs |
| Auth Middleware | JWT verification on protected routes |
| Error Handling | Never expose stack traces in production |

## Secrets Management

**Never expose to clients:**
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- Internal API keys

Mobile app only knows: `EXPO_PUBLIC_API_URL`
Unity only knows: Express API URL + FPS server URL
