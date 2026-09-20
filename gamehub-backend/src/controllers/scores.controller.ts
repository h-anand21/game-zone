// ============================================================
// GameHub Backend — Score & Anti-Cheat Validation Controller
// ============================================================

import type { Response } from 'express';
import { db } from '../config/database.js';
import { gameScores, gameStats, syncEvents, users } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function submitScore(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { eventId, gameId, gameVersion, scoreVersion, score, duration, metadata } = req.body;

    if (!eventId || !gameId || score === undefined || duration === undefined) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Missing required score fields' },
      });
    }

    // 1. Idempotency Check: check if eventId already processed
    const existingScore = await db.query.gameScores.findFirst({
      where: eq(gameScores.eventId, eventId),
    });

    if (existingScore) {
      return res.status(200).json({
        success: true,
        data: { message: 'Already processed (idempotent)', scoreId: existingScore.id },
      });
    }

    // 2. Score Validation / Anti-Cheat Rules
    if (score < 0 || duration < 1) {
      return res.status(422).json({
        success: false,
        error: { code: 'INVALID_SCORE', message: 'Score or duration outside allowed bounds' },
      });
    }

    // 3. Insert Score Record
    const insertedScore = await db
      .insert(gameScores)
      .values({
        eventId,
        userId,
        gameId,
        gameVersion: gameVersion || '1.0.0',
        scoreVersion: scoreVersion || 'v1',
        score,
        duration,
        metadata,
      })
      .returning();

    // 4. Update Game Stats
    const existingStats = await db.query.gameStats.findFirst({
      where: and(eq(gameStats.userId, userId), eq(gameStats.gameId, gameId)),
    });

    if (existingStats) {
      await db
        .update(gameStats)
        .set({
          gamesPlayed: existingStats.gamesPlayed + 1,
          totalScore: existingStats.totalScore + score,
          bestScore: Math.max(existingStats.bestScore, score),
          updatedAt: new Date(),
        })
        .where(eq(gameStats.id, existingStats.id));
    } else {
      await db.insert(gameStats).values({
        userId,
        gameId,
        gamesPlayed: 1,
        bestScore: score,
        totalScore: score,
      });
    }

    return res.status(201).json({
      success: true,
      data: { scoreId: insertedScore[0].id },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SCORE_SUBMIT_FAILED', message: err.message },
    });
  }
}
