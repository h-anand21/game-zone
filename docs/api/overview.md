# GameHub — API Overview

## Base URL

All API endpoints are prefixed with `/api/v1`.

## Authentication

JWT-based. Access token (15min) + Refresh token (7d).

Include in requests:
```
Authorization: Bearer <access_token>
```

## Response Format

### Success
```json
{ "success": true, "data": { ... } }
```

### Paginated
```json
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 20, "total": 150, "hasMore": true }
}
```

### Error
```json
{ "success": false, "error": { "code": "INVALID_REQUEST", "message": "..." } }
```

## Pagination

Use query parameters:
```
?page=1&limit=20
```

## Idempotency

For mutation endpoints, include:
```
Idempotency-Key: <uuid>
```

Or use `event_id` in the request body (for sync/scores).

## Rate Limiting

- Auth endpoints: 5 requests/minute
- General endpoints: 100 requests/minute

## Endpoint Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /health | No | Health check |
| GET | /ready | No | Readiness check |
| POST | /api/v1/auth/register | No | Register |
| POST | /api/v1/auth/login | No | Login |
| POST | /api/v1/auth/refresh | No | Refresh token |
| POST | /api/v1/auth/logout | Yes | Logout |
| GET | /api/v1/users/me | Yes | Get current user |
| PATCH | /api/v1/users/me | Yes | Update user |
| GET | /api/v1/profiles/:userId | Yes | Get profile |
| PATCH | /api/v1/profiles/me | Yes | Update profile |
| GET | /api/v1/games | No | List games |
| GET | /api/v1/games/:gameId | No | Get game |
| POST | /api/v1/scores | Yes | Submit score |
| GET | /api/v1/scores/:gameId | Yes | Get scores |
| GET | /api/v1/stats/me | Yes | Get my stats |
| GET | /api/v1/stats/:gameId | Yes | Get game stats |
| GET | /api/v1/friends | Yes | List friends |
| POST | /api/v1/friends/request | Yes | Send request |
| POST | /api/v1/friends/:id/accept | Yes | Accept request |
| POST | /api/v1/friends/:id/reject | Yes | Reject request |
| DELETE | /api/v1/friends/:friendId | Yes | Remove friend |
| GET | /api/v1/achievements | No | List achievements |
| GET | /api/v1/achievements/me | Yes | My achievements |
| GET | /api/v1/leaderboards/:gameId | No | Leaderboard |
| GET | /api/v1/leaderboards/:gameId/:period | No | Period leaderboard |
| GET | /api/v1/matches | Yes | Match history |
| GET | /api/v1/matches/:matchId | Yes | Match details |
| POST | /api/v1/sync | Yes | Bulk sync |
| GET | /api/v1/config | No | Remote config |
| POST | /api/v1/battle/rooms | Yes | Create room |
| POST | /api/v1/battle/rooms/:id/join | Yes | Join room |
| POST | /api/v1/battle/rooms/:id/leave | Yes | Leave room |
| POST | /api/v1/battle/matches/:id/result | Server | FPS result |
