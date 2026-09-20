// ============================================================
// GameHub FPS Server — Express Backend Result Reporter
// ============================================================

import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import type { FPSPlayer } from '../game/player.js';

export async function reportMatchResultToExpress(params: {
  matchId: string;
  gameId?: string;
  mode?: string;
  map?: string;
  durationSeconds?: number;
  winnerId?: string;
  players: FPSPlayer[];
}): Promise<boolean> {
  try {
    const url = `${env.EXPRESS_BACKEND_URL}/api/v1/battle/matches/${params.matchId}/result`;
    const payload = {
      matchId: params.matchId,
      gameId: params.gameId || 'fps-arena',
      mode: params.mode || 'free-for-all',
      map: params.map || 'FPS_Factory',
      durationSeconds: params.durationSeconds || 600,
      winnerId: params.winnerId,
      results: params.players.map((p) => ({
        userId: p.id,
        kills: p.kills,
        deaths: p.deaths,
        score: p.score,
        isWinner: p.id === params.winnerId,
      })),
    };

    logger.info(`Reporting match ${params.matchId} results to Express backend at ${url}...`);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      logger.info(`Successfully reported FPS match ${params.matchId} result to Express backend.`);
      return true;
    } else {
      const errText = await response.text();
      logger.error(`Failed to report FPS match ${params.matchId} result: HTTP ${response.status} - ${errText}`);
      return false;
    }
  } catch (err: any) {
    logger.error(err, `Error reporting FPS match ${params.matchId} result to Express backend:`);
    return false;
  }
}
