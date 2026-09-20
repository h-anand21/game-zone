// ============================================================
// GameHub Backend — Offline Sync Controller
// ============================================================

import type { Response } from 'express';
import { db } from '../config/database.js';
import { syncEvents, gameScores, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function processOfflineSync(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'items array is required' },
      });
    }

    const processedResults: { eventId: string; status: 'processed' | 'skipped' | 'failed' }[] = [];

    for (const item of items) {
      const { eventId, type, payload } = item;
      if (!eventId || !type) continue;

      // Check if already processed
      const existing = await db.query.syncEvents.findFirst({
        where: eq(syncEvents.eventId, eventId),
      });

      if (existing) {
        processedResults.push({ eventId, status: 'skipped' });
        continue;
      }

      // Record sync event
      await db.insert(syncEvents).values({
        eventId,
        userId,
        type,
        payload: payload || {},
      });

      // Update XP/Coins if present in payload
      if (payload.xpEarned || payload.coinsEarned) {
        const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
        if (user) {
          await db
            .update(users)
            .set({
              xp: user.xp + (payload.xpEarned || 0),
              coins: user.coins + (payload.coinsEarned || 0),
            })
            .where(eq(users.id, userId));
        }
      }

      processedResults.push({ eventId, status: 'processed' });
    }

    return res.status(200).json({
      success: true,
      data: { results: processedResults },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SYNC_FAILED', message: err.message },
    });
  }
}
