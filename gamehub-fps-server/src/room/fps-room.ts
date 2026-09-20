// ============================================================
// GameHub FPS Server — Realtime Room Engine
// ============================================================

import { WebSocket } from 'ws';
import { FPSPlayer } from '../game/player.js';
import { validateAndCalculateHit } from '../game/hit-validation.js';
import { FreeForAllMode } from '../modes/free-for-all.js';
import type { IGameMode } from '../modes/game-mode.interface.js';
import type { RoomSnapshot } from '../protocol/fps-events.js';
import { reportMatchResultToExpress } from '../services/express-reporter.js';

const SPAWN_POINTS = [
  { x: -10, y: 1, z: -10 },
  { x: 10, y: 1, z: 10 },
  { x: -10, y: 1, z: 10 },
  { x: 10, y: 1, z: -10 },
  { x: 0, y: 1, z: 15 },
  { x: 0, y: 1, z: -15 },
  { x: 15, y: 1, z: 0 },
  { x: -15, y: 1, z: 0 },
];

export class FPSRoom {
  id: string;
  map: string;
  mode: IGameMode;
  players = new Map<string, FPSPlayer>();
  state: 'WAITING' | 'COUNTDOWN' | 'ACTIVE' | 'ENDED' = 'WAITING';
  startTime = 0;
  timeRemaining = 0;
  sequence = 0;

  private tickInterval: NodeJS.Timeout | null = null;
  private snapshotInterval: NodeJS.Timeout | null = null;

  constructor(id: string, map = 'FPS_Factory', mode: IGameMode = new FreeForAllMode()) {
    this.id = id;
    this.map = map;
    this.mode = mode;
    this.timeRemaining = mode.matchDurationSeconds;
  }

  addPlayer(id: string, name: string, ws: WebSocket): FPSPlayer {
    const player = new FPSPlayer(id, name, ws);
    const spawnIdx = this.players.size % SPAWN_POINTS.length;
    player.respawn(SPAWN_POINTS[spawnIdx]);

    this.players.set(id, player);
    this.mode.onPlayerJoin(player);

    logger.info(`Player ${name} (${id}) joined FPS Room ${this.id}`);

    if (this.players.size >= 2 && this.state === 'WAITING') {
      this.startMatch();
    }

    return player;
  }

  removePlayer(id: string) {
    const player = this.players.get(id);
    if (player) {
      this.mode.onPlayerLeave(player);
      this.players.delete(id);
      logger.info(`Player ${player.name} (${id}) left FPS Room ${this.id}`);

      if (this.players.size === 0) {
        this.stopMatch();
      }
    }
  }

  startMatch() {
    this.state = 'ACTIVE';
    this.startTime = Date.now();
    this.timeRemaining = this.mode.matchDurationSeconds;

    logger.info(`🚀 FPS Match started in Room ${this.id} (${this.map} - ${this.mode.name})`);

    // 60 Hz Simulation Tick
    this.tickInterval = setInterval(() => this.updateSimulation(1 / 60), 1000 / 60);

    // 20 Hz State Snapshot Broadcast
    this.snapshotInterval = setInterval(() => this.broadcastSnapshot(), 1000 / 20);
  }

import { reportMatchResultToExpress } from '../services/express-reporter.js';

  stopMatch(winnerId?: string) {
    if (this.state === 'ENDED') return;
    this.state = 'ENDED';

    if (this.tickInterval) clearInterval(this.tickInterval);
    if (this.snapshotInterval) clearInterval(this.snapshotInterval);
    this.tickInterval = null;
    this.snapshotInterval = null;

    logger.info(`🏁 FPS Match ended in Room ${this.id}`);

    // Transmit match results to Express backend
    reportMatchResultToExpress({
      matchId: this.id,
      map: this.map,
      mode: this.mode.id,
      durationSeconds: Math.ceil((Date.now() - this.startTime) / 1000),
      winnerId,
      players: Array.from(this.players.values()),
    });
  }


  handleHit(attackerId: string, targetId: string, weaponId: string, isHeadshot: boolean) {
    if (this.state !== 'ACTIVE') return;

    const attacker = this.players.get(attackerId);
    const target = this.players.get(targetId);

    if (!attacker || !target) return;

    const validation = validateAndCalculateHit(attacker, target, weaponId, isHeadshot);
    if (!validation.isValid) {
      logger.warn(`Rejected hit in Room ${this.id}: ${validation.reason}`);
      return;
    }

    const result = target.takeDamage(validation.damage, attackerId);

    // Broadcast damage event
    this.broadcast({
      type: 'DAMAGE_DEALT',
      victimId: targetId,
      attackerId,
      damage: validation.damage,
      remainingHealth: result.remainingHealth,
      isHeadshot,
    });

    if (result.isKill) {
      this.mode.onPlayerKill(attacker, target, isHeadshot);

      this.broadcast({
        type: 'PLAYER_KILLED',
        victimId: targetId,
        attackerId,
        weaponId,
        isHeadshot,
        attackerKills: attacker.kills,
        victimDeaths: target.deaths,
      });

      // Check win condition
      const winCheck = this.mode.checkWinner(Array.from(this.players.values()));
      if (winCheck.isOver) {
        this.broadcast({
          type: 'MATCH_OVER',
          winnerId: winCheck.winnerId,
          scores: Array.from(this.players.values()).map((p) => ({ id: p.id, name: p.name, score: p.score, kills: p.kills })),
        });
        this.stopMatch();
      }
    }
  }

  private updateSimulation(deltaTime: number) {
    if (this.state !== 'ACTIVE') return;

    // Timer update
    this.timeRemaining = Math.max(0, this.timeRemaining - deltaTime);
    if (this.timeRemaining <= 0) {
      this.broadcast({
        type: 'MATCH_OVER',
        reason: 'TIME_EXPIRED',
        scores: Array.from(this.players.values()).map((p) => ({ id: p.id, name: p.name, score: p.score, kills: p.kills })),
      });
      this.stopMatch();
      return;
    }

    // Process respawns
    const now = Date.now();
    let spawnIdx = 0;
    this.players.forEach((player) => {
      if (player.isDead && player.respawnTime > 0 && now >= player.respawnTime) {
        player.respawn(SPAWN_POINTS[spawnIdx % SPAWN_POINTS.length]);
        spawnIdx++;
        this.broadcast({ type: 'PLAYER_RESPAWNED', playerId: player.id, position: player.position });
      }
    });
  }

  private broadcastSnapshot() {
    this.sequence++;
    const snapshot: RoomSnapshot = {
      roomId: this.id,
      map: this.map,
      mode: this.mode.id,
      state: this.state,
      timeRemaining: Math.ceil(this.timeRemaining),
      sequence: this.sequence,
      players: Array.from(this.players.values()).map((p) => p.toSnapshot()),
    };

    this.broadcast({ type: 'SNAPSHOT', snapshot });
  }

  private broadcast(message: any) {
    const payload = JSON.stringify(message);
    this.players.forEach((player) => {
      if (player.ws.readyState === WebSocket.OPEN) {
        player.ws.send(payload);
      }
    });
  }
}
