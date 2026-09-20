// ============================================================
// GameHub FPS Server — 1v1 Duel Mode
// ============================================================

import type { IGameMode } from './game-mode.interface.js';
import type { FPSPlayer } from '../game/player.js';

export class DuelMode implements IGameMode {
  id = '1v1-duel';
  name = '1v1 Duel';
  maxPlayers = 2;
  matchDurationSeconds = 300; // 5 minutes
  targetKills = 5; // Best of 9 / first to 5 round wins

  onPlayerJoin(player: FPSPlayer): void {
    player.score = 0;
    player.kills = 0;
    player.deaths = 0;
  }

  onPlayerLeave(player: FPSPlayer): void {}

  onPlayerKill(attacker: FPSPlayer, victim: FPSPlayer, isHeadshot: boolean): void {
    attacker.kills += 1;
    attacker.score += isHeadshot ? 200 : 100;
  }

  checkWinner(players: FPSPlayer[]): { isOver: boolean; winnerId?: string } {
    for (const player of players) {
      if (player.kills >= this.targetKills) {
        return { isOver: true, winnerId: player.id };
      }
    }
    return { isOver: false };
  }
}
