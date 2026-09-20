// ============================================================
// GameHub Backend — HTTP Server Entry & Graceful Shutdown
// ============================================================

import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { pool } from './config/database.js';
import { createServer } from 'http';
import { initCasualSocketServer } from './socket/casual-socket.js';

const server = createServer(app);


server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`❌ Port ${env.PORT} is already in use by another terminal. Please close the previous terminal running on port ${env.PORT}.`);
    process.exit(1);
  }
});

server.listen(env.PORT, () => {
  logger.info(`🚀 GameHub Backend HTTP Server running on port ${env.PORT} [${env.NODE_ENV}]`);
});



initCasualSocketServer(server);
logger.info(`⚡ GameHub Casual Multiplayer WebSocket Server initialized at /ws/casual`);

// Graceful Shutdown System
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Gracefully shutting down Express HTTP server...`);

  server.close(async () => {
    logger.info('Express HTTP server closed.');

    try {
      logger.info('Closing database pool...');
      await pool.end();
      logger.info('Database pool closed cleanly.');
      process.exit(0);
    } catch (err) {
      logger.error(err, 'Error during DB pool closure:');
      process.exit(1);
    }
  });

  // Force exit if shutdown hangs over 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown timeout reached (10s). Terminating process.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
