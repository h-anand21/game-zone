# GameHub — API Authentication

## Overview

GameHub uses JWT-based authentication with a guest-first approach.

## Guest Profile (Phase 1–6)

On first launch, the app creates a local guest identity:
```json
{
  "guestId": "uuid-v4",
  "deviceId": "device-fingerprint",
  "username": "Guest_A3F2",
  "displayName": "Guest Player"
}
```

This allows full offline gameplay without any server.

## Cloud Authentication (Phase 7+)

### Register

```
POST /api/v1/auth/register
{
  "username": "playerone",
  "email": "player@example.com",
  "password": "securepassword",
  "guestId": "uuid-from-local-profile"  // optional — links guest data
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "username": "playerone",
      "email": "player@example.com"
    }
  }
}
```

### Login

```
POST /api/v1/auth/login
{
  "email": "player@example.com",
  "password": "securepassword"
}
```

### Refresh Token

```
POST /api/v1/auth/refresh
{
  "refreshToken": "eyJ..."
}
```

### Logout

```
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

## Token Flow

```
Login / Register
     ↓
Access Token (15 min) + Refresh Token (7 days)
     ↓
Store in expo-secure-store
     ↓
Include in API requests: Authorization: Bearer <token>
     ↓
On 401: auto-refresh with refresh token
     ↓
On refresh failure: redirect to login
```

## Guest → Cloud Linking

When a guest creates an account with their `guestId`:
1. Backend creates cloud user
2. Links `guestId` to `cloudUserId`
3. Merges local offline data to cloud
4. Future requests use cloud identity
