// ============================================================
// GameHub — 1v1 Duel Game Component (Best of 5 Rounds)
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import type { GameEngine } from '../../engine/GameEngine';

interface DuelProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

const ROUND_WEAPONS = [
  { round: 1, name: 'Barrett .50 Sniper', icon: '🎯', damage: 95 },
  { round: 2, name: 'Desert Eagle Pistol', icon: '🔫', damage: 45 },
  { round: 3, name: 'Double Barrel Shotgun', icon: '💥', damage: 90 },
  { round: 4, name: 'Ak-47 Tactical Rifle', icon: '⚡', damage: 40 },
  { round: 5, name: 'Sudden Death Knife', icon: '🗡️', damage: 100 },
];

export const DuelGame: React.FC<DuelProps> = ({ onFinish, isPaused }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0); // Round wins
  const [opponentScore, setOpponentScore] = useState(0);

  const [playerHp, setPlayerHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [isDodging, setIsDodging] = useState(false);

  const [roundWinner, setRoundWinner] = useState<string | null>(null);

  const roundWeapon = ROUND_WEAPONS[Math.min(currentRound - 1, ROUND_WEAPONS.length - 1)];

  // Check match win condition (Best of 5 -> First to 3)
  useEffect(() => {
    if (playerScore >= 3) {
      onFinish(playerScore * 100, true, { playerScore, opponentScore });
    } else if (opponentScore >= 3) {
      onFinish(playerScore * 30, false, { playerScore, opponentScore });
    }
  }, [playerScore, opponentScore]);

  // AI Opponent Attack Loop
  useEffect(() => {
    if (isPaused || roundWinner || playerHp <= 0 || opponentHp <= 0) return;

    const timer = setInterval(() => {
      if (Math.random() < 0.4) {
        if (isDodging) {
          // Dodged!
          return;
        }
        setPlayerHp((prev) => {
          const dmg = Math.floor(Math.random() * 25) + 15;
          const next = Math.max(0, prev - dmg);
          if (next === 0) {
            handleRoundEnd('opponent');
          }
          return next;
        });
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [isPaused, roundWinner, playerHp, opponentHp, isDodging]);

  const handleShoot = () => {
    if (roundWinner || playerHp <= 0 || opponentHp <= 0 || isPaused) return;

    const dmg = roundWeapon.damage;
    const nextHp = Math.max(0, opponentHp - dmg);
    setOpponentHp(nextHp);

    if (nextHp === 0) {
      handleRoundEnd('player');
    }
  };

  const handleDodge = () => {
    if (isDodging) return;
    setIsDodging(true);
    setTimeout(() => setIsDodging(false), 900);
  };

  const handleRoundEnd = (winner: 'player' | 'opponent') => {
    if (winner === 'player') {
      setPlayerScore((s) => s + 1);
      setRoundWinner('🏆 YOU WON ROUND ' + currentRound + '!');
    } else {
      setOpponentScore((s) => s + 1);
      setRoundWinner('💀 OPPONENT WON ROUND ' + currentRound);
    }

    setTimeout(() => {
      setRoundWinner(null);
      setPlayerHp(100);
      setOpponentHp(100);
      setCurrentRound((r) => r + 1);
    }, 1800);
  };

  return (
    <View style={styles.container}>
      {/* Round Header */}
      <View style={styles.headerBanner}>
        <Text style={styles.roundTag}>ROUND {currentRound} / 5</Text>
        <Text style={styles.weaponTitle}>
          {roundWeapon.icon} {roundWeapon.name}
        </Text>

        {/* Score Board */}
        <View style={styles.scoreRow}>
          <Text style={styles.playerScoreText}>YOU: {playerScore}</Text>
          <Text style={styles.versusText}>VS</Text>
          <Text style={styles.opponentScoreText}>SHADOW_SNIPER: {opponentScore}</Text>
        </View>
      </View>

      {/* Round Winner Popup */}
      {roundWinner && (
        <View style={styles.winnerPopup}>
          <Text style={styles.winnerText}>{roundWinner}</Text>
        </View>
      )}

      {/* 1v1 Battle Arena Duel Ring */}
      <View style={styles.duelRing}>
        {/* Opponent HUD */}
        <View style={styles.opponentBox}>
          <Text style={styles.opponentName}>🤖 Shadow_Sniper (AI Duelist)</Text>
          <View style={styles.hpBarBg}>
            <View style={[styles.hpBarFill, { width: `${opponentHp}%`, backgroundColor: Colors.error }]} />
          </View>
          <Text style={styles.hpText}>{opponentHp} / 100 HP</Text>
        </View>

        {/* Center Target Pointer */}
        <View style={styles.centerTarget}>
          <Text style={styles.targetIcon}>{roundWeapon.icon}</Text>
          <Text style={styles.dodgeText}>{isDodging ? '💨 DODGING!' : '🎯 AIM LOCKED'}</Text>
        </View>

        {/* Player Health HUD */}
        <View style={styles.playerBox}>
          <Text style={styles.playerName}>👤 YOU (Warrior)</Text>
          <View style={styles.hpBarBg}>
            <View style={[styles.hpBarFill, { width: `${playerHp}%`, backgroundColor: Colors.success }]} />
          </View>
          <Text style={styles.hpText}>{playerHp} / 100 HP</Text>
        </View>
      </View>

      {/* Action Duel Controls */}
      <View style={styles.controlsRow}>
        <Pressable
          style={[styles.dodgeBtn, isDodging && styles.dodgeBtnActive]}
          onPress={handleDodge}
        >
          <Text style={styles.dodgeBtnText}>💨 DODGE!</Text>
        </Pressable>

        <Pressable style={styles.strikeBtn} onPress={handleShoot}>
          <Text style={styles.strikeBtnText}>💥 STRIKE!</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0D18', padding: Spacing.md, justifyContent: 'space-between' },
  headerBanner: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roundTag: { color: Colors.warning, fontSize: Typography.tiny, fontWeight: Typography.extrabold, letterSpacing: 1 },
  weaponTitle: { color: Colors.textPrimary, fontSize: Typography.h3, fontWeight: Typography.extrabold, marginTop: 2 },
  scoreRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xs, alignItems: 'center' },
  playerScoreText: { color: Colors.success, fontSize: Typography.bodySmall, fontWeight: Typography.extrabold },
  versusText: { color: Colors.textMuted, fontSize: Typography.tiny, fontWeight: Typography.bold },
  opponentScoreText: { color: Colors.error, fontSize: Typography.bodySmall, fontWeight: Typography.extrabold },
  winnerPopup: {
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginVertical: 4,
  },
  winnerText: { color: '#FFFFFF', fontWeight: Typography.extrabold, fontSize: Typography.bodySmall },
  duelRing: {
    flex: 1,
    marginVertical: Spacing.sm,
    backgroundColor: '#141728',
    borderRadius: BorderRadius.xxl,
    borderWidth: 2,
    borderColor: Colors.accent,
    padding: Spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  opponentBox: { width: '100%', alignItems: 'center' },
  opponentName: { color: Colors.error, fontSize: Typography.caption, fontWeight: Typography.bold, marginBottom: 4 },
  hpBarBg: { width: '90%', height: 12, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.full, overflow: 'hidden' },
  hpBarFill: { height: '100%' },
  hpText: { color: Colors.textMuted, fontSize: 10, marginTop: 2, fontWeight: Typography.bold },
  centerTarget: { alignItems: 'center' },
  targetIcon: { fontSize: 44 },
  dodgeText: { color: Colors.warning, fontSize: Typography.caption, fontWeight: Typography.bold, marginTop: 4 },
  playerBox: { width: '100%', alignItems: 'center' },
  playerName: { color: Colors.success, fontSize: Typography.caption, fontWeight: Typography.bold, marginBottom: 4 },
  controlsRow: { flexDirection: 'row', gap: Spacing.sm },
  dodgeBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dodgeBtnActive: { backgroundColor: Colors.warning + '40', borderColor: Colors.warning },
  dodgeBtnText: { color: Colors.textPrimary, fontSize: Typography.bodySmall, fontWeight: Typography.bold },
  strikeBtn: {
    flex: 2,
    backgroundColor: Colors.error,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.lg,
  },
  strikeBtnText: { color: '#FFFFFF', fontSize: Typography.h3, fontWeight: Typography.extrabold },
});
