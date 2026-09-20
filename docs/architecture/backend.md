# GameHub — Backend Architecture

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict)
- **ORM**: Drizzle ORM
- **Database**: Neon PostgreSQL
- **Validation**: Zod
- **Auth**: JWT (access 15min + refresh 7d)
- **Logging**: Pino (structured)
- **Security**: Helmet, CORS, rate limiting

## Request Flow

```
Client Request
     ↓
Express Router (/api/v1/...)
     ↓
Middleware Chain
├── Rate Limiting
├── Authentication (JWT)
├── Validation (Zod)
└── Idempotency Check
     ↓
Controller (thin — delegates to service)
     ↓
Service (business logic)
     ↓
Repository / Drizzle (database queries)
     ↓
Neon PostgreSQL
     ↓
Response { success: true/false, data/error }
```

## API Response Format

### Success
```json
{ "success": true, "data": { ... } }
```

### Paginated Success
```json
{ "success": true, "data": [...], "pagination": { "page": 1, "limit": 20, "total": 150, "hasMore": true } }
```

### Error
```json
{ "success": false, "error": { "code": "INVALID_REQUEST", "message": "..." } }
```

## Score Validation

Every score submission is validated against per-game rules:
- Maximum possible score
- Minimum/maximum game duration
- Submission frequency
- Duplicate detection (event_id)

## Graceful Shutdown

```
SIGTERM → Stop new requests → Finish in-flight → Close DB pool → Exit 0
```
