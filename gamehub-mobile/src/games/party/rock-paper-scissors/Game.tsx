// ============================================================
// GameHub — Rock Paper Scissors Component (AI + Online)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { getAIChoice, playRPSRound } from './logic';
import type { Choice, RPSResult } from './types';
import type { GameEngine } from '../../engine/GameEngine';
import { useCasualSocket } from '@/services/socket/casual-socket';

type GameMode = 'ai' | 'online';
type OnlinePhase = 'menu' | 'waiting' | 'playing';

interface RockPaperScissorsProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

export const RockPaperScissorsGame: React.FC<RockPaperScissorsProps> = ({ onFinish, isPaused }) => {
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [lastRound, setLastRound] = useState<RPSResult | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('ai');

  // Online state
  const [onlinePhase, setOnlinePhase] = useState<OnlinePhase>('menu');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [myChoice, setMyChoice] = useState<Choice | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<Choice | null>(null);
  const [waitingForReveal, setWaitingForReveal] = useState(false);
  const [roundNum, setRoundNum] = useState(1);

  const socket = useCasualSocket();

  // Online: listen for room state
  useEffect(() => {
    if (gameMode !== 'online' || !socket.room) return;
    if (socket.room.state === 'PLAYING' && onlinePhase === 'waiting') {
      setOnlinePhase('playing');
    }
  }, [socket.room?.state, socket.room?.players.length]);

  // Online: listen for opponent's move
  useEffect(() => {
    if (gameMode !== 'online' || !socket.lastMove) return;
    const { playerId: moverId, move } = socket.lastMove;
    if (moverId === socket.playerId) return;

    const oppChoice = move.choice as Choice;
    setOpponentChoice(oppChoice);

    // Both have chosen — resolve
    if (myChoice) {
      resolveOnlineRound(myChoice, oppChoice);
    }
  }, [socket.lastMove]);

  // If I chose and now opponent chose, resolve
  useEffect(() => {
    if (myChoice && opponentChoice && gameMode === 'online') {
      resolveOnlineRound(myChoice, opponentChoice);
    }
  }, [opponentChoice]);

  const resolveOnlineRound = (mine: Choice, theirs: Choice) => {
    const result = playRPSRound(mine, theirs);
    setLastRound(result);
    setWaitingForReveal(false);

    let nextPlayerScore = playerScore;
    let nextOpponentScore = opponentScore;

    if (result.outcome === 'WIN') nextPlayerScore += 1;
    if (result.outcome === 'LOSS') nextOpponentScore += 1;

    setPlayerScore(nextPlayerScore);
    setOpponentScore(nextOpponentScore);
    setRoundNum((prev) => prev + 1);

    // Reset for next round after delay
    setTimeout(() => {
      setMyChoice(null);
      setOpponentChoice(null);

      if (nextPlayerScore >= 3 || nextOpponentScore >= 3) {
        const won = nextPlayerScore > nextOpponentScore;
        onFinish(nextPlayerScore * 20, won, { mode: 'online', playerScore: nextPlayerScore, opponentScore: nextOpponentScore });
        if (socket.room) {
          socket.sendGameOver(socket.room.code, won ? socket.playerId || undefined : undefined);
        }
      }
    }, 1500);
  };

  // AI Mode handler
  const handleAIChoice = (choice: Choice) => {
    if (isPaused) return;
    const ai = getAIChoice();
    const res = playRPSRound(choice, ai);
    setLastRound(res);

    let nextP = playerScore;
    let nextA = opponentScore;
    if (res.outcome === 'WIN') nextP += 1;
    if (res.outcome === 'LOSS') nextA += 1;
    setPlayerScore(nextP);
    setOpponentScore(nextA);

    if (nextP >= 3 || nextA >= 3) {
      const won = nextP > nextA;
      onFinish(nextP * 20, won, { playerScore: nextP, aiScore: nextA });
    }
  };

  // Online: make choice
  const handleOnlineChoice = (choice: Choice) => {
    if (myChoice) return; // Already chosen
    setMyChoice(choice);
    setWaitingForReveal(true);
    if (socket.room) {
      socket.makeMove(socket.room.code, { choice, round: roundNum });
    }
  };

  const handleCreateRoom = () => {
    socket.createRoom('rock-paper-scissors', 'Player 1', 2);
    setOnlinePhase('waiting');
    resetGame();
  };

  const handleJoinRoom = () => {
    if (!roomCodeInput.trim()) return;
    socket.joinRoom(roomCodeInput.trim().toUpperCase(), 'Player 2');
    setOnlinePhase('waiting');
    resetGame();
  };

  const resetGame = () => {
    setPlayerScore(0);
    setOpponentScore(0);
    setLastRound(null);
    setMyChoice(null);
    setOpponentChoice(null);
    setWaitingForReveal(false);
    setRoundNum(1);
  };

  const getEmoji = (c?: Choice | null) => {
    if (c === 'rock') return '✊';
    if (c === 'paper') return '✋';
    if (c === 'scissors') return '✌️';
    return '❓';
  };

  // ── Online Menu ────────────────────────────────────────────
  if (gameMode === 'online' && onlinePhase === 'menu') {
    return (
      <View style={styles.container}>
        <View style={styles.modeRow}>
          <Pressable style={styles.modeBtn} onPress={() => { setGameMode('ai'); resetGame(); }}>
            <Text style={styles.modeText}>🤖 vs AI</Text>
          </Pressable>
          <Pressable style={[styles.modeBtn, styles.modeBtnActive]} onPress={() => { setGameMode('online'); resetGame(); setOnlinePhase('menu'); }}>
            <Text style={[styles.modeText, styles.modeTextActive]}>🌐 Online</Text>
          </Pressable>
        </View>

        <View style={styles.onlineMenu}>
          <Text style={styles.onlineTitle}>🌐 Online Rock Paper Scissors</Text>
          {!socket.isConnected ? (
            <View style={styles.connectingBox}>
              <ActivityIndicator color={Colors.primary} />
              <Text style={styles.connectingText}>Connecting...</Text>
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
                  placeholder="CODE"
                  placeholderTextColor={Colors.textMuted}
                  value={roomCodeInput}
                  onChangeText={setRoomCodeInput}
                  autoCapitalize="characters"
                  maxLength={6}
                />
                <TouchableOpacity style={[styles.joinBtn, !roomCodeInput.trim() && styles.disabledBtn]} onPress={handleJoinRoom} disabled={!roomCodeInput.trim()}>
                  <Text style={styles.joinBtnText}>Join</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
            </View>
          )}
        </View>
      </View>
    );
  }

  // ── MAIN GAME UI ──────────────────────────────────────────
  const isOnline = gameMode === 'online';
  return (
    <View style={styles.container}>
      {/* Mode Selector */}
      <View style={styles.modeRow}>
        <Pressable style={[styles.modeBtn, gameMode === 'ai' && styles.modeBtnActive]} onPress={() => { setGameMode('ai'); resetGame(); setOnlinePhase('menu'); }}>
          <Text style={[styles.modeText, gameMode === 'ai' && styles.modeTextActive]}>🤖 vs AI</Text>
        </Pressable>
        <Pressable style={[styles.modeBtn, gameMode === 'online' && styles.modeBtnActive]} onPress={() => { setGameMode('online'); resetGame(); setOnlinePhase('menu'); }}>
          <Text style={[styles.modeText, gameMode === 'online' && styles.modeTextActive]}>🌐 Online</Text>
        </Pressable>
      </View>

      {/* Score */}
      <View style={styles.scoreRow}>
        <Text style={styles.scoreText}>You: {playerScore}</Text>
        <Text style={styles.vsText}>Best of 5 • R{roundNum}</Text>
        <Text style={styles.scoreText}>{isOnline ? 'Opponent' : 'AI'}: {opponentScore}</Text>
      </View>

      {/* Arena */}
      <View style={styles.arena}>
        <View style={styles.fighter}>
          <Text style={styles.fighterLabel}>You</Text>
          <Text style={styles.fighterEmoji}>
            {isOnline ? (myChoice ? getEmoji(myChoice) : '❓') : getEmoji(lastRound?.playerChoice)}
          </Text>
        </View>
        <Text style={styles.versusLabel}>VS</Text>
        <View style={styles.fighter}>
          <Text style={styles.fighterLabel}>{isOnline ? 'Opponent' : 'AI'}</Text>
          <Text style={styles.fighterEmoji}>
            {isOnline
              ? (waitingForReveal && !opponentChoice ? '🤔' : getEmoji(opponentChoice))
              : getEmoji(lastRound?.aiChoice)}
          </Text>
        </View>
      </View>

      {/* Round Outcome */}
      {lastRound && (
        <View style={styles.outcomeBox}>
          <Text style={styles.outcomeText}>
            {lastRound.outcome === 'WIN' ? '🎉 You Won the Round!' : lastRound.outcome === 'LOSS' ? '❌ You Lost the Round!' : '🤝 Draw!'}
          </Text>
        </View>
      )}

      {isOnline && waitingForReveal && !opponentChoice && (
        <View style={styles.outcomeBox}>
          <Text style={styles.outcomeText}>⏳ Waiting for opponent...</Text>
        </View>
      )}

      {/* Choice Buttons */}
      <View style={styles.choicesRow}>
        {(['rock', 'paper', 'scissors'] as Choice[]).map((choice) => (
          <Pressable
            key={choice}
            style={[styles.choiceBtn, isOnline && myChoice === choice && styles.choiceBtnSelected]}
            onPress={() => isOnline ? handleOnlineChoice(choice) : handleAIChoice(choice)}
            disabled={isOnline && !!myChoice}
          >
            <Text style={styles.choiceEmoji}>{getEmoji(choice)}</Text>
            <Text style={styles.choiceText}>{choice.charAt(0).toUpperCase() + choice.slice(1)}</Text>
          </Pressable>
        ))}
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
  modeBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  modeBtnActive: { backgroundColor: Colors.primary },
  modeText: { fontSize: Typography.bodySmall, color: Colors.textMuted, fontWeight: Typography.semibold },
  modeTextActive: { color: '#FFFFFF' },
  scoreRow: {
    flexDirection: 'row', justifyContent: 'space-around', width: '100%',
    backgroundColor: Colors.surface, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border,
  },
  scoreText: { fontSize: Typography.h4, color: Colors.primary, fontWeight: Typography.bold },
  vsText: { fontSize: Typography.caption, color: Colors.textMuted },
  arena: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    width: '100%', height: 180, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl, borderWidth: 1, borderColor: Colors.border, ...Shadows.md,
  },
  fighter: { alignItems: 'center' },
  fighterLabel: { fontSize: Typography.caption, color: Colors.textMuted, fontWeight: Typography.semibold },
  fighterEmoji: { fontSize: 56, marginTop: 8 },
  versusLabel: { fontSize: Typography.h2, color: Colors.accent, fontWeight: Typography.bold },
  outcomeBox: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.full },
  outcomeText: { fontSize: Typography.body, color: Colors.textPrimary, fontWeight: Typography.bold },
  choicesRow: { flexDirection: 'row', gap: Spacing.md, width: '100%', justifyContent: 'center' },
  choiceBtn: {
    flex: 1, height: 90, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.xl,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border, ...Shadows.sm,
  },
  choiceBtnSelected: { borderColor: Colors.primary, borderWidth: 2, backgroundColor: Colors.primary + '15' },
  choiceEmoji: { fontSize: 32 },
  choiceText: { fontSize: Typography.caption, color: Colors.textPrimary, fontWeight: Typography.semibold, marginTop: 4 },

  // Online UI
  onlineMenu: { width: '100%', alignItems: 'center', gap: Spacing.md },
  onlineTitle: { fontSize: Typography.h3, color: Colors.textPrimary, fontWeight: Typography.bold },
  connectingBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  connectingText: { color: Colors.textMuted },
  createRoomBtn: { backgroundColor: Colors.primary, width: '100%', paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center' },
  createRoomText: { color: '#FFFFFF', fontSize: Typography.body, fontWeight: Typography.bold },
  orText: { color: Colors.textMuted, fontSize: Typography.caption },
  joinRow: { flexDirection: 'row', gap: Spacing.sm, width: '100%' },
  codeInput: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm, color: Colors.textPrimary, fontSize: Typography.h3, fontWeight: Typography.bold,
    textAlign: 'center', letterSpacing: 4, borderWidth: 1, borderColor: Colors.border,
  },
  joinBtn: { backgroundColor: Colors.success, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.lg, justifyContent: 'center' },
  disabledBtn: { opacity: 0.4 },
  joinBtnText: { color: '#FFFFFF', fontWeight: Typography.bold },
  waitingBox: { alignItems: 'center', gap: Spacing.lg },
  waitingTitle: { fontSize: Typography.h3, color: Colors.textPrimary, fontWeight: Typography.bold },
  roomCodeBox: { backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: BorderRadius.xl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  roomCodeLabel: { color: Colors.textMuted, fontSize: Typography.caption },
  roomCode: { color: Colors.primary, fontSize: 36, fontWeight: Typography.extrabold, letterSpacing: 6, marginVertical: Spacing.sm },
});
