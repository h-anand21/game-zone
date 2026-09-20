// ============================================================
// GameHub FPS Server — Main Entry Point
// ============================================================

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { roomManager } from './room/room-manager.js';
import type { FPSRoom } from './room/fps-room.js';

const app = express();
app.use(express.json());

// Health & Readiness Probes
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ready',
    activeRooms: roomManager.getActiveRoomsCount(),
    totalPlayers: roomManager.getTotalPlayersCount(),
  });
});

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/fps' });

wss.on('connection', (ws: WebSocket) => {
  let currentPlayerId: string | null = null;
  let currentRoom: FPSRoom | null = null;

  ws.on('message', (rawMsg: string) => {
    try {
      const msg = JSON.parse(rawMsg.toString());
      const { type } = msg;

      switch (type) {
        case 'JOIN_MATCH': {
          const { userId, username, roomId, mode, map } = msg;
          const playerId = userId || `p_${Math.random().toString(36).substring(2, 8)}`;
          const playerName = username || 'Player';

          currentRoom = roomManager.getOrCreateRoom(roomId, mode || 'free-for-all', map || 'FPS_Factory');
          currentPlayerId = playerId;


          const player = currentRoom.addPlayer(playerId, playerName, ws);

          ws.send(
            JSON.stringify({
              type: 'JOINED_MATCH',
              playerId,
              roomId: currentRoom.id,
              map: currentRoom.map,
              mode: currentRoom.mode.id,
              spawnPosition: player.position,
            })
          );
          break;
        }

        case 'PLAYER_INPUT': {
          if (currentRoom && currentPlayerId) {
            const player = currentRoom.players.get(currentPlayerId);
            if (player && msg.input) {
              player.processInput(msg.input);
            }
          }
          break;
        }

        case 'SHOOT_EVENT': {
          if (currentRoom && currentPlayerId) {
            const { targetId, weaponId, isHeadshot } = msg;
            currentRoom.handleHit(currentPlayerId, targetId, weaponId || 'rifle', !!isHeadshot);
          }
          break;
        }

        case 'LEAVE_MATCH': {
          if (currentRoom && currentPlayerId) {
            currentRoom.removePlayer(currentPlayerId);
            currentRoom = null;
            currentPlayerId = null;
          }
          break;
        }
      }
    } catch (err: any) {
      logger.error(err, 'WebSocket message processing error:');
    }
  });

  ws.on('close', () => {
    if (currentRoom && currentPlayerId) {
      currentRoom.removePlayer(currentPlayerId);
    }
  });
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`❌ Port ${env.PORT} is already in use by another terminal or process. Please close any previous terminal running on port ${env.PORT}.`);
    process.exit(1);
  }
});

server.listen(env.PORT, () => {
  logger.info(`🔥 GameHub Authoritative FPS Realtime Server listening on port ${env.PORT} [${env.NODE_ENV}]`);
  logger.info(`⚡ FPS WebSocket endpoint active at /ws/fps`);
});


// Graceful Shutdown
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down FPS Server...`);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'SERVER_SHUTDOWN', message: 'Server is restarting' }));
      client.close();
    }
  });

  server.close(() => {
    logger.info('FPS HTTP & WebSocket servers closed cleanly.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown timeout reached (10s). Exiting.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
