// ============================================================
// GameHub Backend — Leaderboards Controller
// ============================================================

import type { Request, Response } from 'express';
import { db } from '../config/database.js';
import { gameStats, users } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export async function getGameLeaderboard(req: Request, res: Response) {
  try {
    const { gameId } = req.params;
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const page = Math.max(1, Number(req.query.page) || 1);
    const offset = (page - 1) * limit;

    if (!gameId) {
      return res.status(400).json({ success: false, message: 'gameId required' });
    }

    const statsRows = await db
      .select({
        userId: gameStats.userId,
        bestScore: gameStats.bestScore,
        gamesPlayed: gameStats.gamesPlayed,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        level: users.level,
      })
      .from(gameStats)
      .innerJoin(users, eq(gameStats.userId, users.id))
      .where(eq(gameStats.gameId, gameId))
      .orderBy(desc(gameStats.bestScore))
      .limit(limit)
      .offset(offset);

    const leaderboard = statsRows.map((row, idx) => ({
      rank: offset + idx + 1,
      userId: row.userId,
      username: row.username,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl,
      level: row.level,
      bestScore: row.bestScore,
      gamesPlayed: row.gamesPlayed,
    }));

    return res.status(200).json({
      success: true,
      data: {
        gameId,
        leaderboard,
        pagination: {
          page,
          limit,
          hasMore: leaderboard.length === limit,
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
}
