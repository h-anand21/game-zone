// ============================================================
// GameHub Backend — Casual Online Multiplayer WebSocket Server
// ============================================================

import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';

interface CasualPlayer {
  id: string;
  name: string;
  ws: WebSocket;
  isHost: boolean;
}

interface CasualRoom {
  code: string;
  gameId: string;
  maxPlayers: number;
  players: Map<string, CasualPlayer>;
  state: 'LOBBY' | 'PLAYING' | 'FINISHED';
  currentTurnPlayerId?: string;
  gameData?: any;
}

const rooms = new Map<string, CasualRoom>();

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function serializeRoom(room: CasualRoom) {
  return {
    code: room.code,
    gameId: room.gameId,
    maxPlayers: room.maxPlayers,
    state: room.state,
    currentTurnPlayerId: room.currentTurnPlayerId,
    players: Array.from(room.players.values()).map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
    })),
  };
}

function broadcastToRoom(room: CasualRoom, message: any, excludePlayerId?: string) {
  const payload = JSON.stringify(message);
  room.players.forEach((player) => {
    if (player.id !== excludePlayerId && player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(payload);
    }
  });
}

export function initCasualSocketServer(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/casual' });

  wss.on('connection', (ws: WebSocket) => {
    let currentPlayerId: string | null = null;
    let currentRoomCode: string | null = null;

    ws.on('message', (rawMessage: string) => {
      try {
        const msg = JSON.parse(rawMessage.toString());
        const { type } = msg;

        switch (type) {
          case 'CREATE_ROOM': {
            const { gameId, maxPlayers = 2, hostName = 'Player 1', userId } = msg;
            const roomCode = generateRoomCode();
            const playerId = userId || `user_${Math.random().toString(36).substring(2, 9)}`;

            const hostPlayer: CasualPlayer = {
              id: playerId,
              name: hostName,
              ws,
              isHost: true,
            };

            const newRoom: CasualRoom = {
              code: roomCode,
              gameId: gameId || 'tic-tac-toe',
              maxPlayers: Math.max(2, Math.min(8, maxPlayers)),
              players: new Map([[playerId, hostPlayer]]),
              state: 'LOBBY',
              currentTurnPlayerId: playerId,
            };

            rooms.set(roomCode, newRoom);
            currentPlayerId = playerId;
            currentRoomCode = roomCode;

            ws.send(
              JSON.stringify({
                type: 'ROOM_CREATED',
                roomCode,
                playerId,
                room: serializeRoom(newRoom),
              })
            );
            break;
          }

          case 'JOIN_ROOM': {
            const { roomCode, playerName = 'Player 2', userId } = msg;
            const room = rooms.get(roomCode?.toUpperCase());

            if (!room) {
              ws.send(JSON.stringify({ type: 'ERROR', message: 'Room not found' }));
              return;
            }

            if (room.players.size >= room.maxPlayers) {
              ws.send(JSON.stringify({ type: 'ERROR', message: 'Room is full' }));
              return;
            }

            const playerId = userId || `user_${Math.random().toString(36).substring(2, 9)}`;
            const newPlayer: CasualPlayer = {
              id: playerId,
              name: playerName,
              ws,
              isHost: false,
            };

            room.players.set(playerId, newPlayer);
            currentPlayerId = playerId;
            currentRoomCode = room.code;

            if (room.players.size === room.maxPlayers) {
              room.state = 'PLAYING';
            }

            ws.send(
              JSON.stringify({
                type: 'ROOM_JOINED',
                roomCode: room.code,
                playerId,
                room: serializeRoom(room),
              })
            );

            broadcastToRoom(
              room,
              {
                type: 'PLAYER_JOINED',
                player: { id: newPlayer.id, name: newPlayer.name, isHost: newPlayer.isHost },
                room: serializeRoom(room),
              },
              playerId
            );
            break;
          }

          case 'MAKE_MOVE': {
            const { roomCode, move } = msg;
            const room = rooms.get(roomCode?.toUpperCase() || currentRoomCode || '');

            if (!room) {
              ws.send(JSON.stringify({ type: 'ERROR', message: 'Room not found' }));
              return;
            }

            // Forward move to all other players in the room
            broadcastToRoom(
              room,
              {
                type: 'MOVE_MADE',
                playerId: currentPlayerId,
                move,
                room: serializeRoom(room),
              },
              currentPlayerId || undefined
            );
            break;
          }

          case 'CHAT_MESSAGE': {
            const { roomCode, text } = msg;
            const room = rooms.get(roomCode?.toUpperCase() || currentRoomCode || '');

            if (room && currentPlayerId) {
              const player = room.players.get(currentPlayerId);
              broadcastToRoom(room, {
                type: 'CHAT',
                senderId: currentPlayerId,
                senderName: player?.name || 'Player',
                text,
              });
            }
            break;
          }

          case 'GAME_OVER': {
            const { roomCode, winnerId, scores } = msg;
            const room = rooms.get(roomCode?.toUpperCase() || currentRoomCode || '');

            if (room) {
              room.state = 'FINISHED';
              broadcastToRoom(room, {
                type: 'GAME_RESULT',
                winnerId,
                scores,
                room: serializeRoom(room),
              });
            }
            break;
          }

          case 'LEAVE_ROOM': {
            handlePlayerDisconnect(currentRoomCode, currentPlayerId);
            currentRoomCode = null;
            currentPlayerId = null;
            break;
          }

          default:
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Unknown action type' }));
        }
      } catch (err: any) {
        ws.send(JSON.stringify({ type: 'ERROR', message: err.message || 'Invalid JSON format' }));
      }
    });

    ws.on('close', () => {
      handlePlayerDisconnect(currentRoomCode, currentPlayerId);
    });
  });

  return wss;
}

function handlePlayerDisconnect(roomCode: string | null, playerId: string | null) {
  if (!roomCode || !playerId) return;

  const room = rooms.get(roomCode);
  if (!room) return;

  room.players.delete(playerId);

  if (room.players.size === 0) {
    rooms.delete(roomCode);
  } else {
    // Re-assign host if host left
    const remainingPlayers = Array.from(room.players.values());
    if (!remainingPlayers.some((p) => p.isHost)) {
      remainingPlayers[0].isHost = true;
    }

    broadcastToRoom(room, {
      type: 'PLAYER_LEFT',
      playerId,
      room: serializeRoom(room),
    });
  }
}
