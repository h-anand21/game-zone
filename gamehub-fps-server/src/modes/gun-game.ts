// ============================================================
// GameHub FPS Server — Gun Game Mode
// ============================================================

import type { IGameMode } from './game-mode.interface.js';
import type { FPSPlayer } from '../game/player.js';

const WEAPON_PROGRESSION = ['pistol', 'smg', 'shotgun', 'rifle', 'sniper'];

export interface GunGamePlayer extends FPSPlayer {
  weaponLevel: number;
}

export class GunGameMode implements IGameMode {
  id = 'gun-game';
  name = 'Gun Game';
  maxPlayers = 8;
  matchDurationSeconds = 600;
  targetKills = WEAPON_PROGRESSION.length;

  onPlayerJoin(player: GunGamePlayer): void {
    player.score = 0;
    player.kills = 0;
    player.deaths = 0;
    player.weaponLevel = 0;
    player.weapon = WEAPON_PROGRESSION[0];
  }

  onPlayerLeave(player: GunGamePlayer): void {}

  onPlayerKill(attacker: GunGamePlayer, victim: GunGamePlayer, isHeadshot: boolean): void {
    attacker.kills += 1;
    attacker.score += isHeadshot ? 150 : 100;

    // Advance weapon level
    if (attacker.weaponLevel < WEAPON_PROGRESSION.length - 1) {
      attacker.weaponLevel += 1;
      attacker.weapon = WEAPON_PROGRESSION[attacker.weaponLevel];
    }
  }

  checkWinner(players: GunGamePlayer[]): { isOver: boolean; winnerId?: string } {
    for (const player of players) {
      if (player.kills >= this.targetKills) {
        return { isOver: true, winnerId: player.id };
      }
    }
    return { isOver: false };
  }
}
