# GameHub FPS — Unity Client

Unity + C# — 3D First-Person Shooter Battle Arena

## Status: Phase 8 (Not Yet Implemented)

This project will be implemented after the mobile app and backend are stable.

## Planned Tech Stack

- **Engine**: Unity 2022 LTS+
- **Language**: C#
- **Platform**: Android (primary), iOS (future)
- **Networking**: WebSocket client → FPS Realtime Server

## Planned Structure

```
gamehub-fps/
├── Assets/
│   ├── _Project/
│   │   ├── Core/          — GameManager, SceneLoader, EventBus, ServiceLocator
│   │   ├── Gameplay/      — Player, Weapons, Combat, Health, Movement
│   │   ├── Multiplayer/   — NetworkClient, Prediction, Interpolation, Reconciliation
│   │   ├── GameModes/     — FFA, TDM, GunGame, CapturePoint, Duel
│   │   ├── UI/            — MainMenu, Lobby, HUD, Scoreboard, Results, MobileControls
│   │   ├── Audio/
│   │   ├── Animation/
│   │   ├── VFX/
│   │   ├── Maps/          — FPS_Factory, FPS_Desert
│   │   ├── Bots/          — AI controller, navigation, combat
│   │   ├── Services/      — GameHubApi client, Auth, MatchService
│   │   ├── Data/          — ScriptableObjects for weapons, maps, modes
│   │   └── Utilities/
│   ├── Art/
│   ├── Prefabs/
│   ├── Scenes/            — Bootstrap, MainMenu, Lobby, Loading, FPS maps, Results
│   └── Resources/
├── Packages/
└── ProjectSettings/
```

## Game Modes

1. **Free For All** — Kill count, first to N or highest at time limit
2. **Team Deathmatch** — 2 teams, team kill count
3. **Gun Game** — Kill → weapon upgrade, cycle all to win
4. **Capture Point** — Hold zones, score over time
5. **1v1 Duel** — Best of N rounds

## FPS MVP Target

- 2–8 players
- 1 original map (Factory)
- 4 weapons (Pistol, Rifle, SMG, Shotgun)
- Free For All mode
- 5-minute matches
- Respawn system
- Mobile touch controls
- Bot support for offline practice

## Important Rules

- Unity does NOT directly access Neon PostgreSQL
- Unity → Express API for auth, profile, match results
- Unity → FPS Realtime Server for live gameplay
- All assets, maps, weapons, and branding must be original
