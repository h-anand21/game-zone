# GameHub — Development Setup

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Android Studio (for mobile development)
- Expo Go app on Android device
- Unity 2022 LTS+ (for FPS development — Phase 8+)

## Repository Structure

```
game-zone/
├── gamehub-mobile/      → React Native + Expo
├── gamehub-backend/     → Node.js + Express (Phase 6)
├── gamehub-fps/         → Unity + C# (Phase 8)
├── gamehub-fps-server/  → Realtime server (Phase 8B)
├── shared/              → Shared contracts
└── docs/                → Documentation
```

## Quick Start — Mobile App

```bash
cd gamehub-mobile
npm install
npx expo start
```

Scan the QR code with Expo Go on your Android device.

## Quick Start — Shared Contracts

```bash
cd shared
npm install
npm run typecheck
```

## Quick Start — Backend (Phase 6+)

```bash
cd gamehub-backend
npm install
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, etc.
npm run dev
```

## Quick Start — FPS Server (Phase 8B+)

```bash
cd gamehub-fps-server
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

### Mobile (`gamehub-mobile/.env`)
```
EXPO_PUBLIC_API_URL=http://localhost:5000
```

### Backend (`gamehub-backend/.env`)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=*
```

### FPS Server (`gamehub-fps-server/.env`)
```
NODE_ENV=development
PORT=3001
GAMEHUB_API_URL=http://localhost:5000
JWT_SECRET=your-secret
```

## Important Rules

- Never put `DATABASE_URL` in the mobile app
- Never put database credentials in Unity
- Mobile → Express API → Neon (never direct)
- Unity → Express API → Neon (never direct)
