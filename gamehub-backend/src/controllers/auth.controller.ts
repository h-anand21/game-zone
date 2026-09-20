// ============================================================
// GameHub Backend — Auth Controller
// ============================================================

import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { users } from '../db/schema.js';
import { env } from '../config/env.js';
import { eq, or } from 'drizzle-orm';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function registerGuest(req: Request, res: Response) {
  try {
    const { guestId, deviceId } = req.body;
    if (!guestId || !deviceId) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'guestId and deviceId are required' },
      });
    }

    // Check if guest exists
    const existing = await db.query.users.findFirst({
      where: eq(users.guestId, guestId),
    });

    let user = existing;
    if (!user) {
      const username = `guest_${Math.floor(100000 + Math.random() * 900000)}`;
      const displayName = `Player ${username.slice(-4)}`;

      const inserted = await db
        .insert(users)
        .values({
          guestId,
          deviceId,
          username,
          displayName,
        })
        .returning();

      user = inserted[0];
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, guestId: user.guestId },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          guestId: user.guestId,
          username: user.username,
          displayName: user.displayName,
          xp: user.xp,
          level: user.level,
          coins: user.coins,
          linkedAt: user.linkedAt,
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
}

export async function linkAccount(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { email, password, username, displayName } = req.body;

    if (!userId || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Email and password required' },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updated = await db
      .update(users)
      .set({
        email,
        passwordHash: hashedPassword,
        username: username || undefined,
        displayName: displayName || undefined,
        linkedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return res.status(200).json({
      success: true,
      data: {
        user: updated[0],
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'LINK_FAILED', message: err.message },
    });
  }
}
