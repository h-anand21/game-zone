// ============================================================
// GameHub — Team Deathmatch (TDM) Game Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import type { GameEngine } from '../../engine/GameEngine';

interface TDMProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  team: 'alpha' | 'bravo';
  x: number;
  y: number;
  hp: number;
  isAlive: boolean;
}

const WEAPONS = [
  { id: 'm4a1', name: 'M4A1 Assault', icon: '🔫', damage: 32, ammo: 30, maxAmmo: 120 },
  { id: 'sniper', name: 'AWM Sniper', icon: '🎯', damage: 95, ammo: 5, maxAmmo: 25 },
  { id: 'shotgun', name: 'Origin Shotgun', icon: '💥', damage: 80, ammo: 8, maxAmmo: 32 },
];

const TARGET_TEAM_KILLS = 25;

export const TeamDeathmatchGame: React.FC<TDMProps> = ({ onFinish, isPaused }) => {
  const [selectedWeapon, setSelectedWeapon] = useState(WEAPONS[0]);
  const [health, setHealth] = useState(100);
  const [ammo, setAmmo] = useState(selectedWeapon.ammo);
  const [reserveAmmo, setReserveAmmo] = useState(selectedWeapon.maxAmmo);

  const [alphaKills, setAlphaKills] = useState(0); // Player Team
  const [bravoKills, setBravoKills] = useState(0); // Enemy Team

  const [myKills, setMyKills] = useState(0);
  const [myDeaths, setMyDeaths] = useState(0);
  const [callout, setCallout] = useState<string | null>(null);

  const [members, setMembers] = useState<TeamMember[]>([
    // Teammates (Alpha - Red)
    { id: 'a1', name: 'Teammate_Ray', team: 'alpha', x: 20, y: 70, hp: 100, isAlive: true },
    { id: 'a2', name: 'Teammate_Falcon', team: 'alpha', x: 35, y: 80, hp: 100, isAlive: true },
    { id: 'a3', name: 'Teammate_Hawk', team: 'alpha', x: 50, y: 75, hp: 100, isAlive: true },
    // Enemies (Bravo - Blue)
    { id: 'b1', name: 'Bravo_Wolf', team: 'bravo', x: 25, y: 25, hp: 100, isAlive: true },
    { id: 'b2', name: 'Bravo_Tiger', team: 'bravo', x: 60, y: 30, hp: 100, isAlive: true },
    { id: 'b3', name: 'Bravo_Eagle', team: 'bravo', x: 80, y: 20, hp: 100, isAlive: true },
    { id: 'b4', name: 'Bravo_Bear', team: 'bravo', x: 45, y: 40, hp: 100, isAlive: true },
  ]);

  // Check win condition
  useEffect(() => {
    if (alphaKills >= TARGET_TEAM_KILLS) {
      onFinish(alphaKills * 50 + myKills * 50, true, { alphaKills, bravoKills, kills: myKills });
    } else if (bravoKills >= TARGET_TEAM_KILLS) {
      onFinish(alphaKills * 20, false, { alphaKills, bravoKills, kills: myKills });
    }
  }, [alphaKills, bravoKills]);

  // Simulated Team Combat Loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setMembers((prev) =>
        prev.map((m) => {
          if (!m.isAlive) return m;
          return {
            ...m,
            x: Math.max(10, Math.min(90, m.x + (Math.random() - 0.5) * 10)),
            y: Math.max(10, Math.min(90, m.y + (Math.random() - 0.5) * 10)),
          };
        })
      );

      // AI Teammates vs AI Enemies clash
      if (Math.random() < 0.4) {
        if (Math.random() > 0.5) {
          setAlphaKills((a) => a + 1);
        } else {
          setBravoKills((b) => b + 1);
        }
      }

      // Enemy attacks Player
      if (Math.random() < 0.2) {
        setHealth((prevHp) => {
          const dmg = Math.floor(Math.random() * 18) + 6;
          const next = Math.max(0, prevHp - dmg);
          if (next === 0) {
            setMyDeaths((d) => d + 1);
            setBravoKills((b) => b + 1);
            setTimeout(() => setHealth(100), 2000);
          }
          return next;
        });
      }
    }, 1100);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleShoot = () => {
    if (ammo <= 0 || isPaused) return;
    setAmmo((a) => a - 1);

    const enemies = members.filter((m) => m.team === 'bravo' && m.isAlive);
    if (enemies.length > 0) {
      const target = enemies[Math.floor(Math.random() * enemies.length)];
      const nextHp = target.hp - selectedWeapon.damage;

      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === target.id) {
            const killed = nextHp <= 0;
            if (killed) {
              setMyKills((k) => k + 1);
              setAlphaKills((ak) => ak + 1);
              setCallout(`💥 Eliminated ${m.name}! (+100 PTS)`);
              setTimeout(() => setCallout(null), 1500);
            }
            return { ...m, hp: Math.max(0, nextHp), isAlive: nextHp > 0 };
          }
          return m;
        })
      );
    }
  };

  const handleReload = () => {
    if (reserveAmmo <= 0 || ammo === selectedWeapon.ammo) return;
    const needed = selectedWeapon.ammo - ammo;
    const reloaded = Math.min(needed, reserveAmmo);
    setAmmo((a) => a + reloaded);
    setReserveAmmo((r) => r - reloaded);
  };

  const triggerCallout = (msg: string) => {
    setCallout(`🗣️ Team Callout: "${msg}"`);
    setTimeout(() => setCallout(null), 1800);
  };

  return (
    <View style={styles.container}>
      {/* TDM Team Score Banner */}
      <View style={styles.scoreBanner}>
        <View style={styles.teamScoreBox}>
          <Text style={styles.teamAlphaLabel}>🔴 TEAM ALPHA</Text>
          <Text style={styles.teamScoreVal}>{alphaKills}</Text>
        </View>

        <View style={styles.versusBox}>
          <Text style={styles.versusText}>VS</Text>
          <Text style={styles.targetGoalText}>First to {TARGET_TEAM_KILLS}</Text>
        </View>

        <View style={styles.teamScoreBox}>
          <Text style={styles.teamBravoLabel}>🔵 TEAM BRAVO</Text>
          <Text style={styles.teamScoreVal}>{bravoKills}</Text>
        </View>
      </View>

      {/* Callout Popup */}
      {callout && (
        <View style={styles.calloutPopup}>
          <Text style={styles.calloutText}>{callout}</Text>
        </View>
      )}

      {/* Tactical Radar Arena */}
      <View style={styles.tacticalRadar}>
        {members.map((m) => (
          <View
            key={m.id}
            style={[
              styles.memberMarker,
              m.team === 'alpha' ? styles.alphaMarker : styles.bravoMarker,
              { left: `${m.x}%`, top: `${m.y}%` },
              !m.isAlive && styles.deadMember,
            ]}
          >
            <Text style={styles.memberText}>
              {m.isAlive ? (m.team === 'alpha' ? '🟢' : '🔴') : '💀'}
            </Text>
          </View>
        ))}

        <View style={styles.playerCrosshair}>
          <Text style={styles.crosshairIcon}>{selectedWeapon.icon}</Text>
        </View>
      </View>

      {/* Quick Team Callouts */}
      <View style={styles.calloutBar}>
        <Pressable style={styles.calloutBtn} onPress={() => triggerCallout('Cover Me!')}>
          <Text style={styles.calloutBtnText}>🛡️ Cover Me</Text>
        </Pressable>
        <Pressable style={styles.calloutBtn} onPress={() => triggerCallout('Enemy Spotted!')}>
          <Text style={styles.calloutBtnText}>🎯 Enemy Spotted</Text>
        </Pressable>
        <Pressable style={styles.calloutBtn} onPress={() => triggerCallout('Fall Back!')}>
          <Text style={styles.calloutBtnText}>🏃 Fall Back</Text>
        </Pressable>
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <View style={styles.ammoBox}>
          <Text style={styles.ammoText}>{ammo} / {reserveAmmo}</Text>
          <Pressable style={styles.reloadBtn} onPress={handleReload}>
            <Text style={styles.reloadBtnText}>🔄 RELOAD</Text>
          </Pressable>
        </View>

        <Pressable style={styles.fireBtn} onPress={handleShoot}>
          <Text style={styles.fireBtnText}>💥 FIRE!</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19', padding: Spacing.md, justifyContent: 'space-between' },
  scoreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  teamScoreBox: { alignItems: 'center' },
  teamAlphaLabel: { color: Colors.error, fontSize: Typography.tiny, fontWeight: Typography.extrabold },
  teamBravoLabel: { color: Colors.primaryLight, fontSize: Typography.tiny, fontWeight: Typography.extrabold },
  teamScoreVal: { color: Colors.textPrimary, fontSize: Typography.h2, fontWeight: Typography.extrabold },
  versusBox: { alignItems: 'center' },
  versusText: { color: Colors.warning, fontSize: Typography.h3, fontWeight: Typography.extrabold },
  targetGoalText: { color: Colors.textMuted, fontSize: Typography.tiny },
  calloutPopup: {
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginVertical: 4,
  },
  calloutText: { color: '#FFFFFF', fontWeight: Typography.bold, fontSize: Typography.caption },
  tacticalRadar: {
    flex: 1,
    marginVertical: Spacing.xs,
    backgroundColor: '#161E2E',
    borderRadius: BorderRadius.xxl,
    borderWidth: 2,
    borderColor: Colors.primary,
    position: 'relative',
    overflow: 'hidden',
  },
  memberMarker: {
    position: 'absolute',
    padding: 2,
    borderRadius: BorderRadius.full,
  },
  alphaMarker: { backgroundColor: 'rgba(0, 210, 160, 0.3)' },
  bravoMarker: { backgroundColor: 'rgba(255, 71, 87, 0.3)' },
  deadMember: { opacity: 0.2 },
  memberText: { fontSize: 10 },
  playerCrosshair: { position: 'absolute', top: '42%', left: '42%', alignItems: 'center' },
  crosshairIcon: { fontSize: 24 },
  calloutBar: { flexDirection: 'row', gap: Spacing.xs, justifyContent: 'center', marginVertical: Spacing.xs },
  calloutBtn: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calloutBtnText: { color: Colors.textSecondary, fontSize: Typography.tiny, fontWeight: Typography.bold },
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
  ammoText: { color: Colors.textPrimary, fontWeight: Typography.extrabold, fontSize: Typography.body },
  reloadBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm },
  reloadBtnText: { color: '#FFFFFF', fontSize: 10, fontWeight: Typography.bold },
  fireBtn: {
    flex: 1.5,
    backgroundColor: Colors.error,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.lg,
  },
  fireBtnText: { color: '#FFFFFF', fontSize: Typography.h3, fontWeight: Typography.extrabold },
});
