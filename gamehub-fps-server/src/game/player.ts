// ============================================================
// GameHub FPS Server — Authoritative Player Representation
// ============================================================

import type { Vector3, Quaternion, PlayerInputPayload, PlayerSnapshot } from '../protocol/fps-events.js';
import type { WebSocket } from 'ws';

export class FPSPlayer {
  id: string;
  name: string;
  ws: WebSocket;
  position: Vector3 = { x: 0, y: 1, z: 0 };
  rotation: Quaternion = { x: 0, y: 0, z: 0, w: 1 };
  health = 100;
  maxHealth = 100;
  armor = 50;
  weapon = 'rifle';
  isFiring = false;
  isDead = false;
  kills = 0;
  deaths = 0;
  score = 0;
  respawnTime = 0;

  lastInputSequence = 0;

  constructor(id: string, name: string, ws: WebSocket) {
    this.id = id;
    this.name = name;
    this.ws = ws;
  }

  processInput(input: PlayerInputPayload) {
    if (this.isDead) return;

    if (input.sequence > this.lastInputSequence) {
      this.lastInputSequence = input.sequence;
      this.position = input.position;
      this.rotation = input.rotation;
      this.isFiring = input.isFiring;
      if (input.selectedWeapon) {
        this.weapon = input.selectedWeapon;
      }
    }
  }

  takeDamage(amount: number, attackerId: string): { isKill: boolean; remainingHealth: number } {
    if (this.isDead) return { isKill: false, remainingHealth: 0 };

    // Armor damage absorption (50%)
    if (this.armor > 0) {
      const armorAbsorb = Math.min(this.armor, amount * 0.5);
      this.armor -= armorAbsorb;
      amount -= armorAbsorb;
    }

    this.health -= amount;

    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      this.deaths += 1;
      this.respawnTime = Date.now() + 3000; // 3 second respawn delay
      return { isKill: true, remainingHealth: 0 };
    }

    return { isKill: false, remainingHealth: this.health };
  }

  respawn(spawnPoint: Vector3) {
    this.position = { ...spawnPoint };
    this.health = this.maxHealth;
    this.armor = 50;
    this.isDead = false;
    this.respawnTime = 0;
  }

  toSnapshot(): PlayerSnapshot {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
      rotation: this.rotation,
      health: this.health,
      armor: this.armor,
      weapon: this.weapon,
      isFiring: this.isFiring,
      isDead: this.isDead,
      score: this.score,
      kills: this.kills,
      deaths: this.deaths,
    };
  }
}
