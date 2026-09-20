// ============================================================
// GameHub FPS Server — Matchmaking & Mode Factory
// ============================================================

import type { IGameMode } from '../modes/game-mode.interface.js';
import { FreeForAllMode } from '../modes/free-for-all.js';
import { TeamDeathmatchMode } from '../modes/team-deathmatch.js';
import { GunGameMode } from '../modes/gun-game.js';
import { CapturePointMode } from '../modes/capture-point.js';
import { DuelMode } from '../modes/duel.js';

export function createGameModeInstance(modeId: string): IGameMode {
  switch (modeId.toLowerCase()) {
    case 'team-deathmatch':
    case 'tdm':
      return new TeamDeathmatchMode();
    case 'gun-game':
    case 'gg':
      return new GunGameMode();
    case 'capture-point':
    case 'cp':
      return new CapturePointMode();
    case '1v1-duel':
    case 'duel':
      return new DuelMode();
    case 'free-for-all':
    case 'ffa':
    default:
      return new FreeForAllMode();
  }
}
