// ============================================================
// GameHub Backend — Friends Controller
// ============================================================

import type { Response } from 'express';
import { db } from '../config/database.js';
import { friends, friendRequests, users } from '../db/schema.js';
import { eq, or, and } from 'drizzle-orm';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function getFriends(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const friendRows = await db.query.friends.findMany({
      where: eq(friends.userId, userId),
    });

    const friendIds = friendRows.map((f) => f.friendId);
    let friendUsers: any[] = [];

    if (friendIds.length > 0) {
      friendUsers = await db.query.users.findMany({
        where: or(...friendIds.map((id) => eq(users.id, id))),
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        friends: friendUsers.map((u) => ({
          id: u.id,
          username: u.username,
          displayName: u.displayName,
          avatarUrl: u.avatarUrl,
          level: u.level,
          xp: u.xp,
        })),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function sendFriendRequest(req: AuthenticatedRequest, res: Response) {
  try {
    const senderId = req.user?.userId;
    const { targetUsername } = req.body;

    if (!senderId || !targetUsername) {
      return res.status(400).json({ success: false, message: 'targetUsername required' });
    }

    const receiver = await db.query.users.findFirst({
      where: eq(users.username, targetUsername),
    });

    if (!receiver) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (receiver.id === senderId) {
      return res.status(400).json({ success: false, message: 'Cannot add yourself' });
    }

    const request = await db
      .insert(friendRequests)
      .values({
        senderId,
        receiverId: receiver.id,
        status: 'pending',
      })
      .returning();

    return res.status(201).json({ success: true, data: { request: request[0] } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function acceptFriendRequest(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { requestId } = req.params;

    if (!userId || !requestId) {
      return res.status(400).json({ success: false, message: 'requestId required' });
    }

    const request = await db.query.friendRequests.findFirst({
      where: eq(friendRequests.id, requestId),
    });

    if (!request || request.receiverId !== userId) {
      return res.status(404).json({ success: false, message: 'Friend request not found' });
    }

    // Accept request
    await db.update(friendRequests).set({ status: 'accepted' }).where(eq(friendRequests.id, requestId));

    // Create bidirectional friend entries
    await db.insert(friends).values([
      { userId: request.senderId, friendId: request.receiverId },
      { userId: request.receiverId, friendId: request.senderId },
    ]);

    return res.status(200).json({ success: true, data: { message: 'Friend request accepted' } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
}
