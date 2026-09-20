// ============================================================
// GameHub FPS Server — Room Manager
// ============================================================

import { FPSRoom } from './fps-room.js';
import { FreeForAllMode } from '../modes/free-for-all.js';
import type { WebSocket } from 'ws';

class RoomManager {
  private rooms = new Map<string, FPSRoom>();

  getOrCreateRoom(roomId?: string): FPSRoom {
    if (roomId && this.rooms.has(roomId)) {
      return this.rooms.get(roomId)!;
    }

    // Find waiting room
    for (const room of this.rooms.values()) {
      if (room.state === 'WAITING' && room.players.size < room.mode.maxPlayers) {
        return room;
      }
    }

    // Create new room
    const newRoomId = roomId || `room_${Math.random().toString(36).substring(2, 9)}`;
    const newRoom = new FPSRoom(newRoomId, 'FPS_Factory', new FreeForAllMode());
    this.rooms.set(newRoomId, newRoom);
    return newRoom;
  }

  getRoom(roomId: string): FPSRoom | undefined {
    return this.rooms.get(roomId);
  }

  removeRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.stopMatch();
      this.rooms.delete(roomId);
    }
  }

  getActiveRoomsCount(): number {
    return this.rooms.size;
  }

  getTotalPlayersCount(): number {
    let total = 0;
    this.rooms.forEach((r) => (total += r.players.size));
    return total;
  }
}

export const roomManager = new RoomManager();
