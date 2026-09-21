// ============================================================
// GameHub — Free For All (FFA) Game Component
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import type { GameEngine } from '../../engine/GameEngine';

interface FFAProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

interface EnemyBot {
  id: string;
  name: string;
  x: number;
  y: number;
  hp: number;
  isAlive: boolean;
}

const WEAPONS = [
  { id: 'ak47', name: 'AK-47', icon: '🔫', damage: 35, ammo: 30, maxAmmo: 120 },
  { id: 'sniper', name: 'Barrett .50', icon: '🎯', damage: 100, ammo: 5, maxAmmo: 20 },
  { id: 'shotgun', name: 'Spas-12', icon: '💥', damage: 75, ammo: 8, maxAmmo: 32 },
  { id: 'smg', name: 'MP5', icon: '⚡', damage: 25, ammo: 40, maxAmmo: 160 },
];

const WIN_KILLS_TARGET = 15;

export const FreeForAllGame: React.FC<FFAProps> = ({ onFinish, isPaused }) => {
  const [weapon, setWeapon] = useState(WEAPONS[0]);
  const [health, setHealth] = useState(100);
  const [shield, setShield] = useState(50);
  const [ammo, setAmmo] = useState(weapon.ammo);
  const [reserveAmmo, setReserveAmmo] = useState(weapon.maxAmmo);

  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [streak, setStreak] = useState(0);
  const [killFeed, setKillFeed] = useState<string[]>(['⚔️ FFA Match Started! Goal: 15 Kills']);
  const [streakBanner, setStreakBanner] = useState<string | null>(null);

  const [bots, setBots] = useState<EnemyBot[]>([
    { id: '1', name: 'Viper', x: 25, y: 35, hp: 100, isAlive: true },
    { id: '2', name: 'Ghost', x: 75, y: 20, hp: 100, isAlive: true },
    { id: '3', name: 'Reaper', x: 50, y: 70, hp: 100, isAlive: true },
    { id: '4', name: 'Shadow', x: 20, y: 80, hp: 100, isAlive: true },
    { id: '5', name: 'Blaze', x: 80, y: 75, hp: 100, isAlive: true },
    { id: '6', name: 'Titan', x: 40, y: 20, hp: 100, isAlive: true },
    { id: '7', name: 'Spectre', x: 60, y: 50, hp: 100, isAlive: true },
  ]);

  const recoilAnim = useRef(new Animated.Value(1)).current;

  // Change weapon reload
  useEffect(() => {
    setAmmo(weapon.ammo);
    setReserveAmmo(weapon.maxAmmo);
  }, [weapon]);

  // Check win condition
  useEffect(() => {
    if (kills >= WIN_KILLS_TARGET) {
      onFinish(kills * 100, true, { kills, deaths, mode: 'FFA' });
    }
  }, [kills]);

  // Bot Movement & Damage simulation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setBots((prev) =>
        prev.map((b) => {
          if (!b.isAlive) return b;
          return {
            ...b,
            x: Math.max(10, Math.min(90, b.x + (Math.random() - 0.5) * 12)),
            y: Math.max(10, Math.min(90, b.y + (Math.random() - 0.5) * 12)),
          };
        })
      );

      // Bot attacks player occasionally
      if (Math.random() < 0.28) {
        setHealth((prevHp) => {
          const dmg = Math.floor(Math.random() * 15) + 5;
          const next = Math.max(0, prevHp - dmg);
          if (next === 0) {
            setDeaths((d) => d + 1);
            setStreak(0);
            setKillFeed((kf) => ['💀 You were eliminated by Spectre', ...kf.slice(0, 3)]);
            setTimeout(() => setHealth(100), 1800); // Respawn
          }
          return next;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Respawn Dead Bots
  useEffect(() => {
    const deadBots = bots.filter((b) => !b.isAlive);
    if (deadBots.length > 0) {
      const timer = setTimeout(() => {
        setBots((prev) =>
          prev.map((b) =>
            !b.isAlive
              ? { ...b, hp: 100, isAlive: true, x: Math.random() * 70 + 15, y: Math.random() * 70 + 15 }
              : b
          )
        );
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [bots]);

  const handleShoot = () => {
    if (ammo <= 0 || isPaused) return;
    setAmmo((a) => a - 1);

    // Recoil animation
    Animated.sequence([
      Animated.timing(recoilAnim, { toValue: 1.25, duration: 60, useNativeDriver: true }),
      Animated.timing(recoilAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
    ]).start();

    // Damage random alive bot
    const aliveBots = bots.filter((b) => b.isAlive);
    if (aliveBots.length > 0) {
      const target = aliveBots[Math.floor(Math.random() * aliveBots.length)];
      const damage = weapon.damage;
      const nextHp = target.hp - damage;

      setBots((prev) =>
        prev.map((b) => {
          if (b.id === target.id) {
            const killed = nextHp <= 0;
            if (killed) {
              setKills((k) => k + 1);
              setStreak((s) => {
                const nextS = s + 1;
                if (nextS === 2) setStreakBanner('🔥 DOUBLE KILL!');
                else if (nextS === 3) setStreakBanner('⚡ TRIPLE KILL!');
                else if (nextS >= 4) setStreakBanner('🚀 ULTRA KILL! RAMPAGE!');
                setTimeout(() => setStreakBanner(null), 1500);
                return nextS;
              });
              setKillFeed((kf) => [`💥 You eliminated ${b.name} (+100 PTS)`, ...kf.slice(0, 3)]);
            }
            return { ...b, hp: Math.max(0, nextHp), isAlive: nextHp > 0 };
          }
          return b;
        })
      );
    }
  };

  const handleReload = () => {
    if (reserveAmmo <= 0 || ammo === weapon.ammo) return;
    const needed = weapon.ammo - ammo;
    const reloaded = Math.min(needed, reserveAmmo);
    setAmmo((a) => a + reloaded);
    setReserveAmmo((r) => r - reloaded);
    setKillFeed((kf) => ['🔄 Reloading...', ...kf.slice(0, 3)]);
  };

  return (
    <View style={styles.container}>
      {/* Top Header HUD */}
      <View style={styles.hudHeader}>
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>HP</Text>
          <Text style={[styles.hudValue, { color: health < 30 ? Colors.error : Colors.success }]}>
            {health}
          </Text>
        </View>

        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>KILLS</Text>
          <Text style={[styles.hudValue, { color: Colors.primaryLight }]}>
            {kills} / {WIN_KILLS_TARGET}
          </Text>
        </View>

        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>DEATHS</Text>
          <Text style={[styles.hudValue, { color: Colors.error }]}>{deaths}</Text>
        </View>

        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>STREAK</Text>
          <Text style={[styles.hudValue, { color: Colors.warning }]}>🔥 {streak}</Text>
        </View>
      </View>

      {/* Streak Banner Popup */}
      {streakBanner && (
        <View style={styles.streakBanner}>
          <Text style={styles.streakText}>{streakBanner}</Text>
        </View>
      )}

      {/* 2.5D Radar Battle Map */}
      <View style={styles.arenaRadar}>
        {bots.map((b) => (
          <View
            key={b.id}
            style={[
              styles.botMarker,
              { left: `${b.x}%`, top: `${b.y}%` },
              !b.isAlive && styles.deadMarker,
            ]}
          >
            <Text style={styles.botText}>{b.isAlive ? `🔴 ${b.hp}` : '💀'}</Text>
          </View>
        ))}

        {/* Player Crosshair */}
        <Animated.View style={[styles.crosshair, { transform: [{ scale: recoilAnim }] }]}>
          <View style={styles.crosshairRing} />
          <Text style={styles.weaponIcon}>{weapon.icon}</Text>
        </Animated.View>

        {/* Kill Feed Overlay */}
        <View style={styles.killFeedContainer}>
          {killFeed.map((kf, i) => (
            <Text key={i} style={styles.killFeedLine}>{kf}</Text>
          ))}
        </View>
      </View>

      {/* Weapon Selector Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weaponScroll}>
        {WEAPONS.map((w) => (
          <Pressable
            key={w.id}
            style={[styles.weaponChip, weapon.id === w.id && styles.weaponChipActive]}
            onPress={() => setWeapon(w)}
          >
            <Text style={styles.weaponChipText}>{w.icon} {w.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Controls Bar */}
      <View style={styles.controlsRow}>
        <View style={styles.ammoBox}>
          <Text style={styles.ammoCount}>{ammo} / {reserveAmmo}</Text>
          <Pressable style={styles.reloadButton} onPress={handleReload}>
            <Text style={styles.reloadButtonText}>🔄 RELOAD</Text>
          </Pressable>
        </View>

        <Pressable style={styles.fireButton} onPress={handleShoot}>
          <Text style={styles.fireButtonText}>💥 FIRE!</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  hudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hudItem: { alignItems: 'center' },
  hudLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: Typography.bold },
  hudValue: { fontSize: Typography.body, fontWeight: Typography.extrabold },
  streakBanner: {
    alignSelf: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginVertical: 4,
    ...Shadows.lg,
  },
  streakText: { color: '#FFFFFF', fontWeight: Typography.extrabold, fontSize: Typography.bodySmall },
  arenaRadar: {
    flex: 1,
    marginVertical: Spacing.sm,
    backgroundColor: '#131326',
    borderRadius: BorderRadius.xxl,
    borderWidth: 2,
    borderColor: Colors.categoryBattle,
    position: 'relative',
    overflow: 'hidden',
  },
  botMarker: {
    position: 'absolute',
    padding: 3,
    backgroundColor: Colors.error + '30',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  deadMarker: { opacity: 0.2, borderColor: 'transparent' },
  botText: { fontSize: 10, color: '#FFFFFF', fontWeight: Typography.bold },
  crosshair: {
    position: 'absolute',
    top: '42%',
    left: '42%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.warning,
  },
  weaponIcon: { fontSize: 24, marginTop: 4 },
  killFeedContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  killFeedLine: { color: '#F1F5F9', fontSize: 10, fontWeight: Typography.medium },
  weaponScroll: { maxHeight: 44, marginBottom: Spacing.xs },
  weaponChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weaponChipActive: {
    backgroundColor: Colors.categoryBattle,
    borderColor: Colors.categoryBattle,
  },
  weaponChipText: { color: '#FFFFFF', fontSize: Typography.caption, fontWeight: Typography.bold },
  controlsRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  ammoBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ammoCount: { color: Colors.textPrimary, fontWeight: Typography.extrabold, fontSize: Typography.body },
  reloadButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  reloadButtonText: { color: '#FFFFFF', fontSize: 10, fontWeight: Typography.bold },
  fireButton: {
    flex: 1.5,
    backgroundColor: Colors.error,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.lg,
  },
  fireButtonText: { color: '#FFFFFF', fontSize: Typography.h3, fontWeight: Typography.extrabold },
});
