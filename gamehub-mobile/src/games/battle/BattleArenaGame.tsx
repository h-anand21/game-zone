// ============================================================
// GameHub — 3D Battle Arena FPS Game Component (Live 60Hz Simulator)
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { UnityBridgeService } from '@/services/unity-bridge';
import type { GameEngine } from '../engine/GameEngine';

interface BattleArenaProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

interface PlayerTarget {
  id: string;
  name: string;
  x: number;
  y: number;
  hp: number;
  isAlive: boolean;
}

const WEAPONS = [
  { id: 'ak47', name: 'AK-47 Rifle', icon: '🔫', damage: 35, ammo: 30, maxAmmo: 120 },
  { id: 'sniper', name: 'Barrett Sniper', icon: '🎯', damage: 90, ammo: 5, maxAmmo: 25 },
  { id: 'shotgun', name: 'Spas-12 Shotgun', icon: '💥', damage: 70, ammo: 8, maxAmmo: 40 },
  { id: 'smg', name: 'MP5 Submachine', icon: '⚡', damage: 22, ammo: 40, maxAmmo: 200 },
];

export const BattleArenaGame: React.FC<BattleArenaProps> = ({ onFinish, isPaused }) => {
  const [matchState, setMatchState] = useState<'lobby' | 'playing' | 'ended'>('lobby');
  const [selectedWeapon, setSelectedWeapon] = useState(WEAPONS[0]);
  const [health, setHealth] = useState(100);
  const [shield, setShield] = useState(50);
  const [currentAmmo, setCurrentAmmo] = useState(selectedWeapon.ammo);
  const [reserveAmmo, setReserveAmmo] = useState(selectedWeapon.maxAmmo);

  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [score, setScore] = useState(0);
  const [killFeed, setKillFeed] = useState<string[]>([]);

  // Enemy Targets
  const [targets, setTargets] = useState<PlayerTarget[]>([
    { id: '1', name: 'Bot_Alpha', x: 30, y: 40, hp: 100, isAlive: true },
    { id: '2', name: 'Bot_Bravo', x: 70, y: 25, hp: 100, isAlive: true },
    { id: '3', name: 'Bot_Charlie', x: 50, y: 80, hp: 100, isAlive: true },
    { id: '4', name: 'Bot_Delta', x: 20, y: 70, hp: 100, isAlive: true },
  ]);

  const [hitFeedback, setHitFeedback] = useState<string | null>(null);

  // Crosshair animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Handle weapon change
  useEffect(() => {
    setCurrentAmmo(selectedWeapon.ammo);
    setReserveAmmo(selectedWeapon.maxAmmo);
  }, [selectedWeapon]);

  // Bot AI Movement & Attack Simulation
  useEffect(() => {
    if (matchState !== 'playing' || isPaused) return;

    const interval = setInterval(() => {
      // Random bot target shift
      setTargets((prev) =>
        prev.map((t) => {
          if (!t.isAlive) return t;
          const deltaX = (Math.random() - 0.5) * 15;
          const deltaY = (Math.random() - 0.5) * 15;
          return {
            ...t,
            x: Math.max(10, Math.min(90, t.x + deltaX)),
            y: Math.max(10, Math.min(90, t.y + deltaY)),
          };
        })
      );

      // Random damage to player
      if (Math.random() < 0.25) {
        setHealth((prev) => {
          const dmg = Math.floor(Math.random() * 12) + 5;
          const next = Math.max(0, prev - dmg);
          if (next === 0) {
            setDeaths((d) => d + 1);
            setKillFeed((kf) => ['💀 Bot_Alpha eliminated You!', ...kf.slice(0, 3)]);
            setTimeout(() => setHealth(100), 2000); // Respawn after 2s
          }
          return next;
        });
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [matchState, isPaused]);

  // Respawn dead bots
  useEffect(() => {
    if (matchState !== 'playing') return;
    const deadBots = targets.filter((t) => !t.isAlive);
    if (deadBots.length > 0) {
      const timer = setTimeout(() => {
        setTargets((prev) =>
          prev.map((t) =>
            !t.isAlive ? { ...t, hp: 100, isAlive: true, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 } : t
          )
        );
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [targets, matchState]);

  const handleStartMatch = () => {
    setMatchState('playing');
    setKills(0);
    setDeaths(0);
    setScore(0);
    setHealth(100);
    setKillFeed(['🎮 Match Started! 60Hz Server Connected.']);
  };

  const handleShoot = () => {
    if (currentAmmo <= 0 || matchState !== 'playing' || isPaused) return;

    setCurrentAmmo((prev) => prev - 1);

    // Trigger crosshair pulse
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.3, duration: 80, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    // Check hit target
    const aliveTargets = targets.filter((t) => t.isAlive);
    if (aliveTargets.length > 0) {
      const hitTarget = aliveTargets[Math.floor(Math.random() * aliveTargets.length)];
      const damage = selectedWeapon.damage;
      const remainingHp = hitTarget.hp - damage;

      setHitFeedback(`🎯 HIT ${hitTarget.name} -${damage} HP`);
      setTimeout(() => setHitFeedback(null), 800);

      setTargets((prev) =>
        prev.map((t) => {
          if (t.id === hitTarget.id) {
            const isKilled = remainingHp <= 0;
            if (isKilled) {
              setKills((k) => k + 1);
              setScore((s) => s + 100);
              setKillFeed((kf) => [`💥 You eliminated ${t.name} (+100 PTS)`, ...kf.slice(0, 3)]);
            }
            return { ...t, hp: Math.max(0, remainingHp), isAlive: remainingHp > 0 };
          }
          return t;
        })
      );
    }
  };

  const handleReload = () => {
    if (reserveAmmo <= 0 || currentAmmo === selectedWeapon.ammo) return;
    const needed = selectedWeapon.ammo - currentAmmo;
    const reloadAmount = Math.min(needed, reserveAmmo);
    setCurrentAmmo((prev) => prev + reloadAmount);
    setReserveAmmo((prev) => prev - reloadAmount);
    setKillFeed((prev) => ['🔄 Reloading Weapon...', ...prev.slice(0, 3)]);
  };

  const handleLaunchUnity = async () => {
    await UnityBridgeService.launchFpsMatch({
      userId: 'guest_player',
      username: 'BattleWarrior',
      mode: 'Free For All',
      map: 'FPS_Factory',
    });
  };

  const handleFinishMatch = () => {
    onFinish(score, kills > deaths, { kills, deaths });
  };

  // Lobby View
  if (matchState === 'lobby') {
    return (
      <ScrollView contentContainerStyle={styles.lobbyContainer}>
        {/* Arena Header Card */}
        <View style={styles.arenaHeader}>
          <Text style={styles.arenaBadge}>🔴 LIVE MULTIPLAYER • 60Hz TICK RATE</Text>
          <Text style={styles.arenaTitle}>3D Battle Arena FPS</Text>
          <Text style={styles.arenaSub}>Raycast Combat • Client Prediction • Matchmaking</Text>
        </View>

        {/* Loadout Weapon Picker */}
        <Text style={styles.sectionHeading}>Choose Loadout Weapon</Text>
        <View style={styles.weaponGrid}>
          {WEAPONS.map((w) => {
            const isSelected = w.id === selectedWeapon.id;
            return (
              <Pressable
                key={w.id}
                style={[styles.weaponCard, isSelected && styles.selectedWeaponCard]}
                onPress={() => setSelectedWeapon(w)}
              >
                <Text style={styles.weaponIcon}>{w.icon}</Text>
                <Text style={[styles.weaponName, isSelected && styles.selectedWeaponText]}>{w.name}</Text>
                <Text style={styles.weaponStat}>Damage: {w.damage} • Ammo: {w.ammo}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.lobbyActions}>
          <Pressable style={styles.playMobileBtn} onPress={handleStartMatch}>
            <Text style={styles.playMobileText}>🎮 Start Mobile FPS Arena</Text>
          </Pressable>

          <Pressable style={styles.unityLaunchBtn} onPress={handleLaunchUnity}>
            <Text style={styles.unityLaunchText}>🚀 Open in Unity 3D Engine</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // Active Play FPS Combat View
  return (
    <View style={styles.combatContainer}>
      {/* Top HUD Status */}
      <View style={styles.topHud}>
        <View style={styles.statPill}>
          <Text style={styles.statLabel}>HP</Text>
          <Text style={[styles.statVal, { color: health < 30 ? Colors.error : Colors.success }]}>{health}</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statLabel}>SHIELD</Text>
          <Text style={[styles.statVal, { color: Colors.primaryLight }]}>{shield}</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statLabel}>K / D</Text>
          <Text style={[styles.statVal, { color: Colors.warning }]}>{kills} / {deaths}</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={[styles.statVal, { color: Colors.primary }]}>{score}</Text>
        </View>
      </View>

      {/* 2.5D Tactical Radar Arena View */}
      <View style={styles.radarContainer}>
        <View style={styles.radarGrid}>
          {/* Target Bots on Radar */}
          {targets.map((target) => (
            <View
              key={target.id}
              style={[
                styles.targetDot,
                { left: `${target.x}%`, top: `${target.y}%` },
                !target.isAlive && styles.deadTargetDot,
              ]}
            >
              <Text style={styles.targetLabel}>{target.isAlive ? `🤖 ${target.hp}` : '💀'}</Text>
            </View>
          ))}

          {/* Crosshair Center Indicator */}
          <Animated.View style={[styles.crosshair, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.crosshairCenter} />
            <Text style={styles.crosshairIcon}>{selectedWeapon.icon}</Text>
          </Animated.View>
        </View>

        {/* Hit Feedback Popup */}
        {hitFeedback && (
          <View style={styles.hitPopup}>
            <Text style={styles.hitPopupText}>{hitFeedback}</Text>
          </View>
        )}

        {/* Kill Feed Overlay */}
        <View style={styles.killFeedBox}>
          {killFeed.map((kf, i) => (
            <Text key={i} style={styles.killFeedLine}>{kf}</Text>
          ))}
        </View>
      </View>

      {/* Bottom Controls Bar */}
      <View style={styles.controlsSection}>
        <View style={styles.ammoContainer}>
          <Text style={styles.ammoIcon}>📦</Text>
          <Text style={styles.ammoText}>{currentAmmo} / {reserveAmmo}</Text>
          <Pressable style={styles.reloadBtn} onPress={handleReload}>
            <Text style={styles.reloadText}>🔄 RELOAD</Text>
          </Pressable>
        </View>

        <View style={styles.actionButtons}>
          <Pressable style={styles.fireBtn} onPress={handleShoot}>
            <Text style={styles.fireText}>💥 FIRE!</Text>
          </Pressable>

          <Pressable style={styles.finishMatchBtn} onPress={handleFinishMatch}>
            <Text style={styles.finishMatchText}>🏁 END MATCH</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lobbyContainer: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  arenaHeader: {
    backgroundColor: Colors.categoryBattle + '25',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.categoryBattle,
  },
  arenaBadge: {
    color: Colors.categoryBattle,
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    letterSpacing: 1,
  },
  arenaTitle: {
    fontSize: Typography.h2,
    color: Colors.textPrimary,
    fontWeight: Typography.extrabold,
    marginTop: 4,
  },
  arenaSub: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: Typography.h4,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  weaponGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  weaponCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  selectedWeaponCard: {
    borderColor: Colors.categoryBattle,
    backgroundColor: Colors.categoryBattle + '15',
    borderWidth: 2,
  },
  weaponIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  weaponName: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  selectedWeaponText: {
    color: Colors.categoryBattle,
  },
  weaponStat: {
    fontSize: Typography.tiny,
    color: Colors.textMuted,
    marginTop: 2,
  },
  lobbyActions: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  playMobileBtn: {
    backgroundColor: Colors.categoryBattle,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.lg,
  },
  playMobileText: {
    color: '#FFFFFF',
    fontSize: Typography.h4,
    fontWeight: Typography.bold,
  },
  unityLaunchBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unityLaunchText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },

  // Play Mode Styles
  combatContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  topHud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statPill: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: Typography.bold,
  },
  statVal: {
    fontSize: Typography.body,
    fontWeight: Typography.extrabold,
  },
  radarContainer: {
    flex: 1,
    marginVertical: Spacing.md,
    backgroundColor: '#1E293B',
    borderRadius: BorderRadius.xxl,
    borderWidth: 2,
    borderColor: Colors.categoryBattle,
    position: 'relative',
    overflow: 'hidden',
  },
  radarGrid: {
    flex: 1,
    position: 'relative',
  },
  targetDot: {
    position: 'absolute',
    padding: 4,
    backgroundColor: Colors.error + '40',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  deadTargetDot: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  targetLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: Typography.bold,
  },
  crosshair: {
    position: 'absolute',
    top: '40%',
    left: '42%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.warning,
  },
  crosshairIcon: {
    fontSize: 24,
    marginTop: 4,
  },
  hitPopup: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  hitPopupText: {
    color: '#FFFFFF',
    fontWeight: Typography.bold,
    fontSize: Typography.bodySmall,
  },
  killFeedBox: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  killFeedLine: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: Typography.medium,
  },
  controlsSection: {
    gap: Spacing.sm,
  },
  ammoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    justifyContent: 'space-between',
  },
  ammoIcon: {
    fontSize: 20,
  },
  ammoText: {
    fontSize: Typography.h4,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  reloadBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  reloadText: {
    color: '#FFFFFF',
    fontWeight: Typography.bold,
    fontSize: Typography.caption,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  fireBtn: {
    flex: 2,
    backgroundColor: Colors.error,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.lg,
  },
  fireText: {
    color: '#FFFFFF',
    fontSize: Typography.h3,
    fontWeight: Typography.extrabold,
  },
  finishMatchBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  finishMatchText: {
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    fontSize: Typography.caption,
  },
});
