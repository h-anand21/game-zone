// ============================================================
// GameHub FPS Server — Team Deathmatch Mode (4v4)
// ============================================================

import type { IGameMode } from './game-mode.interface.js';
import type { FPSPlayer } from '../game/player.js';

export interface TDMPlayer extends FPSPlayer {
  team?: 'ALPHA' | 'BRAVO';
}

export class TeamDeathmatchMode implements IGameMode {
  id = 'team-deathmatch';
  name = 'Team Deathmatch';
  maxPlayers = 8;
  matchDurationSeconds = 600; // 10 minutes
  targetKills = 50; // Team target

  alphaKills = 0;
  bravoKills = 0;

  onPlayerJoin(player: TDMPlayer): void {
    player.score = 0;
    player.kills = 0;
    player.deaths = 0;
    player.team = this.alphaKills <= this.bravoKills ? 'ALPHA' : 'BRAVO';
  }

  onPlayerLeave(player: TDMPlayer): void {}

  onPlayerKill(attacker: TDMPlayer, victim: TDMPlayer, isHeadshot: boolean): void {
    if (attacker.team === 'ALPHA') {
      this.alphaKills += 1;
    } else {
      this.bravoKills += 1;
    }

    attacker.kills += 1;
    attacker.score += isHeadshot ? 150 : 100;
  }

  checkWinner(players: TDMPlayer[]): { isOver: boolean; winnerId?: string } {
    if (this.alphaKills >= this.targetKills) {
      return { isOver: true, winnerId: 'ALPHA' };
    }
    if (this.bravoKills >= this.targetKills) {
      return { isOver: true, winnerId: 'BRAVO' };
    }
    return { isOver: false };
  }
}
