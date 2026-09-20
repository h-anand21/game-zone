// ============================================================
// GameHub Backend — Remote Config & Feature Flags Controller
// ============================================================

import type { Request, Response } from 'express';

export async function getRemoteConfig(req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    data: {
      version: {
        minSupported: '1.0.0',
        latest: '1.0.0',
      },
      features: {
        fpsEnabled: false, // Phase 8+
        onlineMultiplayerEnabled: true,
        dailyChallengesEnabled: true,
        friendsEnabled: true,
        quizBattleEnabled: true,
        guessTheDrawingEnabled: true,
      },
      maintenance: {
        isMaintenance: false,
        message: null,
      },
    },
  });
}
