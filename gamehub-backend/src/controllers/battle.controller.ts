// ============================================================
// GameHub Backend — Battle / FPS Match Controller
// ============================================================

import type { Request, Response } from 'express';
import { db } from '../config/database.js';
import { matches, matchPlayers, gameStats, users } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export interface PlayerMatchResult {
  userId: string;
  kills: number;
  deaths: number;
  score: number;
  isWinner: boolean;
}

export async function submitFpsMatchResult(req: Request, res: Response) {
  try {
    const { matchId, gameId = 'fps-arena', mode = 'free-for-all', map = 'FPS_Factory', durationSeconds = 600, winnerId, results } = req.body;

    if (!matchId || !Array.isArray(results)) {
      return res.status(400).json({ success: false, message: 'matchId and results array required' });
    }

    // 1. Create match record
    await db.insert(matches).values({
      id: matchId,
      gameId,
      mode,
      map,
      duration: durationSeconds,
      winnerId: winnerId || null,
      status: 'completed',
    }).onConflictDoNothing();

    // 2. Insert match players & update user stats
    for (const playerResult of results as PlayerMatchResult[]) {
      if (!playerResult.userId) continue;

      // Insert match_player
      await db.insert(matchPlayers).values({
        matchId,
        userId: playerResult.userId,
        kills: playerResult.kills || 0,
        deaths: playerResult.deaths || 0,
        score: playerResult.score || 0,
        isWinner: !!playerResult.isWinner,
      }).onConflictDoNothing();

      // Upsert game_stats for FPS
      const xpEarned = (playerResult.kills * 20) + (playerResult.isWinner ? 100 : 25);
      const coinsEarned = (playerResult.kills * 5) + (playerResult.isWinner ? 50 : 10);

      const existingStats = await db.query.gameStats.findFirst({
        where: (gs, { and, eq }) => and(eq(gs.userId, playerResult.userId), eq(gs.gameId, gameId)),
      });

      if (existingStats) {
        await db.update(gameStats)
          .set({
            gamesPlayed: existingStats.gamesPlayed + 1,
            wins: existingStats.wins + (playerResult.isWinner ? 1 : 0),
            losses: existingStats.losses + (playerResult.isWinner ? 0 : 1),
            totalScore: existingStats.totalScore + playerResult.score,
            bestScore: Math.max(existingStats.bestScore, playerResult.score),
            updatedAt: new Date(),
          })
          .where(eq(gameStats.id, existingStats.id));
      } else {
        await db.insert(gameStats).values({
          userId: playerResult.userId,
          gameId,
          gamesPlayed: 1,
          wins: playerResult.isWinner ? 1 : 0,
          losses: playerResult.isWinner ? 0 : 1,
          bestScore: playerResult.score,
          totalScore: playerResult.score,
        });
      }

      // Increment User XP and Level
      await db.update(users)
        .set({
          xp: sql`${users.xp} + ${xpEarned}`,
          coins: sql`${users.coins} + ${coinsEarned}`,
        })
        .where(eq(users.id, playerResult.userId));
    }

    return res.status(200).json({
      success: true,
      data: {
        matchId,
        message: 'FPS match results processed successfully',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getActiveFpsRooms(req: Request, res: Response) {
  try {
    return res.status(200).json({
      success: true,
      data: {
        rooms: [
          { id: 'room_factory_1', map: 'FPS_Factory', mode: 'Free For All', players: 4, maxPlayers: 8, ping: '24ms' },
          { id: 'room_desert_1', map: 'FPS_Desert', mode: 'Team Deathmatch', players: 6, maxPlayers: 8, ping: '30ms' },
          { id: 'room_duel_1', map: 'FPS_Factory', mode: '1v1 Duel', players: 1, maxPlayers: 2, ping: '18ms' },
        ],
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
}
