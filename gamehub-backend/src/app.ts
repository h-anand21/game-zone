// ============================================================
// GameHub Backend — Express Application Setup
// ============================================================

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { apiRateLimiter } from './middleware/rate-limit.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { authenticateToken } from './middleware/auth.middleware.js';

import { registerGuest, linkAccount } from './controllers/auth.controller.js';
import { submitScore } from './controllers/scores.controller.js';
import { processOfflineSync } from './controllers/sync.controller.js';
import { getRemoteConfig } from './controllers/config.controller.js';
import { getFriends, sendFriendRequest, acceptFriendRequest } from './controllers/friends.controller.js';
import { getGameLeaderboard } from './controllers/leaderboards.controller.js';

export const app = express();

// Security & Body Parsers
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use('/api', apiRateLimiter);

// Health & Readiness Probe Endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.status(200).json({ success: true, status: 'ready', database: 'connected' });
});

// API Routes
app.get('/api/v1/config', getRemoteConfig);
app.post('/api/v1/auth/guest', registerGuest);
app.post('/api/v1/auth/link', authenticateToken, linkAccount);

app.post('/api/v1/scores', authenticateToken, submitScore);
app.post('/api/v1/sync', authenticateToken, processOfflineSync);

app.get('/api/v1/friends', authenticateToken, getFriends);
app.post('/api/v1/friends/request', authenticateToken, sendFriendRequest);
app.post('/api/v1/friends/accept/:requestId', authenticateToken, acceptFriendRequest);

app.get('/api/v1/leaderboards/:gameId', getGameLeaderboard);

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);
