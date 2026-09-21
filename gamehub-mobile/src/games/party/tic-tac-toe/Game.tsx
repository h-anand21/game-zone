// ============================================================
// GameHub — Tic Tac Toe Component (AI + PVP + Online)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { checkWinner, getAIMove } from './logic';
import type { Board, PlayerSymbol, GameMode, AIDifficulty } from './types';
import type { GameEngine } from '../../engine/GameEngine';
import { useCasualSocket } from '@/services/socket/casual-socket';

interface TicTacToeProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const TicTacToeGame: React.FC<TicTacToeProps> = ({ onFinish, isPaused }) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [turn, setTurn] = useState<PlayerSymbol>('X');
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('hard');
  const [winningCombo, setWinningCombo] = useState<number[] | null>(null);
  const [statusText, setStatusText] = useState('Player X Turn');

  // Online state
  const [onlinePhase, setOnlinePhase] = useState<'menu' | 'waiting' | 'playing'>('menu');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [mySymbol, setMySymbol] = useState<PlayerSymbol>('X');

  const socket = useCasualSocket();

  // ── Online: listen for opponent moves ────────────────────
  useEffect(() => {
    if (gameMode !== 'online' || !socket.lastMove) return;

    const { playerId: moverId, move } = socket.lastMove;
    if (moverId === socket.playerId) return; // ignore own moves echoed back

    const { index, symbol } = move as { index: number; symbol: PlayerSymbol };
    if (board[index] !== null || winningCombo) return;

    const newBoard = [...board];
    newBoard[index] = symbol;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      handleResult(newBoard, result);
    } else {
      setTurn(mySymbol);
      setStatusText('Your Turn');
    }
  }, [socket.lastMove]);

  // ── Online: room state changes ────────────────────────────
  useEffect(() => {
    if (gameMode !== 'online' || !socket.room) return;

    if (socket.room.state === 'PLAYING' && onlinePhase === 'waiting') {
      setOnlinePhase('playing');
      const isHost = socket.room.players.findIndex((p) => p.id === socket.playerId) === 0;
      const sym: PlayerSymbol = isHost ? 'X' : 'O';
      setMySymbol(sym);
      setStatusText(isHost ? 'Your Turn (X)' : "Opponent's Turn");
      setTurn('X'); // X always starts
    }
  }, [socket.room?.state, socket.room?.players.length]);

  // ── Online: game result from server ────────────────────────
  useEffect(() => {
    if (socket.gameResult && gameMode === 'online') {
      const won = socket.gameResult.winnerId === socket.playerId;
      onFinish(won ? 1 : 0, won, { mode: 'online', result: socket.gameResult });
    }
  }, [socket.gameResult]);

  // ── AI turn ────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || gameMode !== 'ai' || turn !== 'O') return;

    const timer = setTimeout(() => {
      const aiIndex = getAIMove([...board], difficulty);
      if (aiIndex !== -1) makeMove(aiIndex, 'O');
    }, 400);

    return () => clearTimeout(timer);
  }, [turn, board, gameMode, difficulty, isPaused]);

  const handleResult = (newBoard: Board, result: { winner: PlayerSymbol | 'DRAW' | null; combo?: number[] }) => {
    if (result.winner === 'DRAW') {
      setStatusText('Game Draw!');
      onFinish(0, false, { mode: gameMode, draw: true });
    } else if (result.winner) {
      setWinningCombo(result.combo || null);
      const playerWon = gameMode === 'online' ? result.winner === mySymbol : result.winner === 'X';
      setStatusText(gameMode === 'online'
        ? (playerWon ? '🏆 You Win!' : '💀 You Lose!')
        : `Player ${result.winner} Wins!`);
      onFinish(playerWon ? 1 : 0, playerWon, { mode: gameMode, winner: result.winner });
    }
  };

  const makeMove = (index: number, player: PlayerSymbol) => {
    if (board[index] || winningCombo || isPaused) return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    // Send to server if online
    if (gameMode === 'online' && socket.room) {
      socket.makeMove(socket.room.code, { index, symbol: player });
    }

    const result = checkWinner(newBoard);
    if (result.winner) {
      handleResult(newBoard, result);
      if (gameMode === 'online' && socket.room) {
        const winnerId = result.winner === mySymbol ? socket.playerId : undefined;
        socket.sendGameOver(socket.room.code, winnerId || undefined);
      }
    } else {
      const nextTurn = player === 'X' ? 'O' : 'X';
      setTurn(nextTurn);
      if (gameMode === 'online') {
        setStatusText(nextTurn === mySymbol ? 'Your Turn' : "Opponent's Turn");
      } else {
        setStatusText(gameMode === 'ai' && nextTurn === 'O' ? 'AI is thinking...' : `Player ${nextTurn} Turn`);
      }
    }
  };

  const handleCellPress = (index: number) => {
    if (gameMode === 'ai' && turn === 'O') return;
    if (gameMode === 'online' && turn !== mySymbol) return;
    makeMove(index, gameMode === 'online' ? mySymbol : (gameMode === 'ai' ? 'X' : turn));
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinningCombo(null);
    setStatusText('Player X Turn');
  };

  // ── Online: Create Room ────────────────────────────────────
  const handleCreateRoom = () => {
    socket.createRoom('tic-tac-toe', 'Player', 2);
    setOnlinePhase('waiting');
    setStatusText('Waiting for opponent...');
    resetBoard();
  };

  // ── Online: Join Room ────────────────────────────────────
  const handleJoinRoom = () => {
    if (!roomCodeInput.trim()) return;
    socket.joinRoom(roomCodeInput.trim().toUpperCase(), 'Player 2');
    setOnlinePhase('waiting');
    resetBoard();
  };

  // ── ONLINE MODE UI ────────────────────────────────────────
  if (gameMode === 'online' && onlinePhase === 'menu') {
    return (
      <View style={styles.container}>
        <View style={styles.modeRow}>
          {renderModeTabs()}
        </View>

        <View style={styles.onlineMenu}>
          <Text style={styles.onlineTitle}>🌐 Online Tic Tac Toe</Text>

          {!socket.isConnected ? (
            <View style={styles.connectingBox}>
              <ActivityIndicator color={Colors.primary} />
              <Text style={styles.connectingText}>Connecting to server...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.createRoomBtn} onPress={handleCreateRoom}>
                <Text style={styles.createRoomText}>➕ Create Room</Text>
              </TouchableOpacity>

              <Text style={styles.orText}>— OR —</Text>

              <View style={styles.joinRow}>
                <TextInput
                  style={styles.codeInput}
                  placeholder="Room Code"
                  placeholderTextColor={Colors.textMuted}
                  value={roomCodeInput}
                  onChangeText={setRoomCodeInput}
                  autoCapitalize="characters"
                  maxLength={6}
                />
                <TouchableOpacity
                  style={[styles.joinBtn, !roomCodeInput.trim() && styles.disabledBtn]}
                  onPress={handleJoinRoom}
                  disabled={!roomCodeInput.trim()}
                >
                  <Text style={styles.joinBtnText}>Join</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {socket.error && <Text style={styles.errorText}>⚠️ {socket.error}</Text>}
        </View>
      </View>
    );
  }

  if (gameMode === 'online' && onlinePhase === 'waiting') {
    return (
      <View style={styles.container}>
        <View style={styles.waitingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.waitingTitle}>Waiting for Opponent...</Text>
          {socket.room && (
            <View style={styles.roomCodeBox}>
              <Text style={styles.roomCodeLabel}>Room Code:</Text>
              <Text style={styles.roomCode}>{socket.room.code}</Text>
              <Text style={styles.roomCodeHint}>Share this code with your friend!</Text>
            </View>
          )}
          <Text style={styles.waitingPlayers}>
            👥 {socket.room?.players.length || 1}/2 Players
          </Text>
        </View>
      </View>
    );
  }

  // ── Shared Mode Tab Renderer ────────────────────────────
  function renderModeTabs() {
    return (
      <>
        <Pressable
          style={[styles.modeBtn, gameMode === 'ai' && styles.modeBtnActive]}
          onPress={() => { setGameMode('ai'); resetBoard(); setOnlinePhase('menu'); }}
        >
          <Text style={[styles.modeText, gameMode === 'ai' && styles.modeTextActive]}>🤖 AI</Text>
        </Pressable>

        <Pressable
          style={[styles.modeBtn, gameMode === 'pvp' && styles.modeBtnActive]}
          onPress={() => { setGameMode('pvp'); resetBoard(); setOnlinePhase('menu'); }}
        >
          <Text style={[styles.modeText, gameMode === 'pvp' && styles.modeTextActive]}>👥 Local</Text>
        </Pressable>

        <Pressable
          style={[styles.modeBtn, gameMode === 'online' && styles.modeBtnActive]}
          onPress={() => { setGameMode('online'); resetBoard(); setOnlinePhase('menu'); }}
        >
          <Text style={[styles.modeText, gameMode === 'online' && styles.modeTextActive]}>🌐 Online</Text>
        </Pressable>
      </>
    );
  }

  // ── MAIN GAME UI ──────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Mode Selector */}
      <View style={styles.modeRow}>
        {renderModeTabs()}
      </View>

      {/* Online indicator */}
      {gameMode === 'online' && socket.room && (
        <View style={styles.onlineBadge}>
          <Text style={styles.onlineBadgeText}>🌐 Room: {socket.room.code} • {socket.room.players.length}/2</Text>
        </View>
      )}

      {/* Turn Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>{statusText}</Text>
      </View>

      {/* Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {board.map((cell, idx) => {
            const isWinningCell = winningCombo?.includes(idx);
            const canTap = gameMode === 'online' ? turn === mySymbol : (gameMode === 'ai' ? turn === 'X' : true);
            return (
              <Pressable
                key={idx}
                style={({ pressed }) => [
                  styles.cell,
                  isWinningCell && styles.winningCell,
                  pressed && canTap && styles.cellPressed,
                  !canTap && styles.cellDisabled,
                ]}
                onPress={() => handleCellPress(idx)}
                disabled={!canTap || !!cell || !!winningCombo}
              >
                <Text style={[styles.cellText, cell === 'X' ? styles.cellX : styles.cellO]}>
                  {cell}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: Spacing.lg, justifyContent: 'space-around' },
  modeRow: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: BorderRadius.full,
    padding: 4, borderWidth: 1, borderColor: Colors.border,
  },
  modeBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  modeBtnActive: { backgroundColor: Colors.primary },
  modeText: { fontSize: Typography.caption, color: Colors.textMuted, fontWeight: Typography.semibold },
  modeTextActive: { color: '#FFFFFF' },
  banner: { backgroundColor: Colors.surfaceLight, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg },
  bannerText: { fontSize: Typography.h4, color: Colors.textPrimary, fontWeight: Typography.bold },
  onlineBadge: { backgroundColor: Colors.success + '20', paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: BorderRadius.full },
  onlineBadgeText: { color: Colors.success, fontSize: Typography.tiny, fontWeight: Typography.bold },
  gridContainer: {
    width: 320, height: 320, backgroundColor: Colors.surface, borderRadius: BorderRadius.xxl,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadows.md,
  },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: {
    width: 92, height: 92, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  cellPressed: { opacity: 0.7 },
  cellDisabled: { opacity: 0.85 },
  winningCell: { backgroundColor: Colors.success + '40', borderWidth: 2, borderColor: Colors.success },
  cellText: { fontSize: 48, fontWeight: Typography.bold },
  cellX: { color: Colors.primary },
  cellO: { color: Colors.accent },

  // Online Menu
  onlineMenu: { width: '100%', alignItems: 'center', gap: Spacing.md },
  onlineTitle: { fontSize: Typography.h3, color: Colors.textPrimary, fontWeight: Typography.bold },
  connectingBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  connectingText: { color: Colors.textMuted, fontSize: Typography.bodySmall },
  createRoomBtn: {
    backgroundColor: Colors.primary, width: '100%', paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg, alignItems: 'center',
  },
  createRoomText: { color: '#FFFFFF', fontSize: Typography.body, fontWeight: Typography.bold },
  orText: { color: Colors.textMuted, fontSize: Typography.caption },
  joinRow: { flexDirection: 'row', gap: Spacing.sm, width: '100%' },
  codeInput: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm, color: Colors.textPrimary, fontSize: Typography.h3, fontWeight: Typography.bold,
    textAlign: 'center', letterSpacing: 4, borderWidth: 1, borderColor: Colors.border,
  },
  joinBtn: {
    backgroundColor: Colors.success, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.lg,
    justifyContent: 'center', alignItems: 'center',
  },
  disabledBtn: { opacity: 0.4 },
  joinBtnText: { color: '#FFFFFF', fontWeight: Typography.bold, fontSize: Typography.body },
  errorText: { color: Colors.error, fontSize: Typography.caption },

  // Waiting
  waitingBox: { alignItems: 'center', gap: Spacing.lg },
  waitingTitle: { fontSize: Typography.h3, color: Colors.textPrimary, fontWeight: Typography.bold },
  roomCodeBox: { backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: BorderRadius.xl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  roomCodeLabel: { color: Colors.textMuted, fontSize: Typography.caption },
  roomCode: { color: Colors.primary, fontSize: 36, fontWeight: Typography.extrabold, letterSpacing: 6, marginVertical: Spacing.sm },
  roomCodeHint: { color: Colors.textSecondary, fontSize: Typography.tiny },
  waitingPlayers: { color: Colors.textSecondary, fontSize: Typography.body },
});
