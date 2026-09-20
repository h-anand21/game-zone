// ============================================================
// GameHub FPS Server — Free For All Deathmatch Mode
// ============================================================

import type { IGameMode } from './game-mode.interface.js';
import type { FPSPlayer } from '../game/player.js';

export class FreeForAllMode implements IGameMode {
  id = 'free-for-all';
  name = 'Free For All';
  maxPlayers = 8;
  matchDurationSeconds = 600; // 10 minutes
  targetKills = 25; // First to 25 kills

  onPlayerJoin(player: FPSPlayer): void {
    player.score = 0;
    player.kills = 0;
    player.deaths = 0;
  }

  onPlayerLeave(player: FPSPlayer): void {}

  onPlayerKill(attacker: FPSPlayer, victim: FPSPlayer, isHeadshot: boolean): void {
    attacker.kills += 1;
    attacker.score += isHeadshot ? 150 : 100;
  }

  checkWinner(players: FPSPlayer[]): { isOver: boolean; winnerId?: string } {
    if (players.length === 0) return { isOver: false };

    // Check target kills
    for (const player of players) {
      if (player.kills >= this.targetKills) {
        return { isOver: true, winnerId: player.id };
      }
    }

    return { isOver: false };
  }
}
