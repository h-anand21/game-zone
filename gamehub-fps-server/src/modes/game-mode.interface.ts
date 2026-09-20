// ============================================================
// GameHub FPS Server — Game Mode Interface
// ============================================================

import type { FPSPlayer } from '../game/player.js';

export interface IGameMode {
  id: string;
  name: string;
  maxPlayers: number;
  matchDurationSeconds: number;
  targetKills: number;

  onPlayerJoin(player: FPSPlayer): void;
  onPlayerLeave(player: FPSPlayer): void;
  onPlayerKill(attacker: FPSPlayer, victim: FPSPlayer, isHeadshot: boolean): void;
  checkWinner(players: FPSPlayer[]): { isOver: boolean; winnerId?: string };
}
