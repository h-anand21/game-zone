// ============================================================
// GameHub FPS Server — Capture Point Mode
// ============================================================

import type { IGameMode } from './game-mode.interface.js';
import type { FPSPlayer } from '../game/player.js';

export interface CPPlayer extends FPSPlayer {
  team?: 'ALPHA' | 'BRAVO';
}

export class CapturePointMode implements IGameMode {
  id = 'capture-point';
  name = 'Capture Point';
  maxPlayers = 8;
  matchDurationSeconds = 600;
  targetKills = 1000; // Target control score

  alphaScore = 0;
  bravoScore = 0;

  onPlayerJoin(player: CPPlayer): void {
    player.score = 0;
    player.kills = 0;
    player.deaths = 0;
    player.team = this.alphaScore <= this.bravoScore ? 'ALPHA' : 'BRAVO';
  }

  onPlayerLeave(player: CPPlayer): void {}

  onPlayerKill(attacker: CPPlayer, victim: CPPlayer, isHeadshot: boolean): void {
    attacker.kills += 1;
    attacker.score += isHeadshot ? 150 : 100;
    if (attacker.team === 'ALPHA') {
      this.alphaScore += 50;
    } else {
      this.bravoScore += 50;
    }
  }

  checkWinner(players: CPPlayer[]): { isOver: boolean; winnerId?: string } {
    if (this.alphaScore >= this.targetKills) return { isOver: true, winnerId: 'ALPHA' };
    if (this.bravoScore >= this.targetKills) return { isOver: true, winnerId: 'BRAVO' };
    return { isOver: false };
  }
}
