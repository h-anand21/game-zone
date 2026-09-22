// ============================================================
// GameHub Mobile — Casual Online Multiplayer WebSocket Client
// ============================================================

import { useEffect, useState, useCallback, useRef } from 'react';

import Constants from 'expo-constants';

function getSocketUrl(): string {
  if (process.env.EXPO_PUBLIC_WS_URL) return process.env.EXPO_PUBLIC_WS_URL;
  try {
    const debuggerHost = Constants.expoConfig?.hostUri ?? (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
    if (debuggerHost) {
      const ip = debuggerHost.split(':')[0];
      return `ws://${ip}:5000/ws/casual`;
    }
  } catch {}
  return 'ws://localhost:5000/ws/casual';
}

const SOCKET_URL = getSocketUrl();

export interface RoomPlayer {
  id: string;
  name: string;
  isHost: boolean;
}

export interface RoomState {
  code: string;
  gameId: string;
  maxPlayers: number;
  state: 'LOBBY' | 'PLAYING' | 'FINISHED';
  currentTurnPlayerId?: string;
  players: RoomPlayer[];
}

export function useCasualSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ playerId: string; move: any } | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ senderId: string; senderName: string; text: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<{ winnerId?: string; scores?: Record<string, number> } | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(SOCKET_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case 'ROOM_CREATED':
          case 'ROOM_JOINED':
            setRoom(msg.room);
            setPlayerId(msg.playerId);
            break;
          case 'PLAYER_JOINED':
          case 'PLAYER_LEFT':
            setRoom(msg.room);
            break;
          case 'MOVE_MADE':
            setLastMove({ playerId: msg.playerId, move: msg.move });
            if (msg.room) setRoom(msg.room);
            break;
          case 'CHAT':
            setChatMessages((prev) => [...prev, { senderId: msg.senderId, senderName: msg.senderName, text: msg.text }]);
            break;
          case 'GAME_RESULT':
            setGameResult({ winnerId: msg.winnerId, scores: msg.scores });
            if (msg.room) setRoom(msg.room);
            break;
          case 'ERROR':
            setError(msg.message);
            break;
        }
      } catch (err) {
        console.error('WebSocket message parse error:', err);
      }
    };

    ws.onerror = (err) => {
      setError('Connection error');
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const createRoom = useCallback((gameId: string, hostName: string, maxPlayers = 2, userId?: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'CREATE_ROOM', gameId, hostName, maxPlayers, userId }));
    }
  }, []);

  const joinRoom = useCallback((roomCode: string, playerName: string, userId?: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'JOIN_ROOM', roomCode, playerName, userId }));
    }
  }, []);

  const makeMove = useCallback((roomCode: string, move: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'MAKE_MOVE', roomCode, move }));
    }
  }, []);

  const sendChat = useCallback((roomCode: string, text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'CHAT_MESSAGE', roomCode, text }));
    }
  }, []);

  const sendGameOver = useCallback((roomCode: string, winnerId?: string, scores?: Record<string, number>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'GAME_OVER', roomCode, winnerId, scores }));
    }
  }, []);

  const leaveRoom = useCallback((roomCode: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'LEAVE_ROOM', roomCode }));
      setRoom(null);
    }
  }, []);

  return {
    isConnected,
    room,
    playerId,
    lastMove,
    chatMessages,
    error,
    gameResult,
    createRoom,
    joinRoom,
    makeMove,
    sendChat,
    sendGameOver,
    leaveRoom,
  };
}
