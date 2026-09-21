// ============================================================
// GameHub — Gun Game Component (6-Tier Weapon Progression)
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import type { GameEngine } from '../../engine/GameEngine';

interface GunGameProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

const WEAPON_TIERS = [
  { tier: 1, name: '9mm Pistol', icon: '🔫', damage: 30, ammo: 12, killsNeeded: 2 },
  { tier: 2, name: 'MP5 SMG', icon: '⚡', damage: 25, ammo: 30, killsNeeded: 2 },
  { tier: 3, name: 'Pump Shotgun', icon: '💥', damage: 80, ammo: 6, killsNeeded: 2 },
  { tier: 4, name: 'AK-47 Rifle', icon: '🔫', damage: 40, ammo: 30, killsNeeded: 2 },
  { tier: 5, name: 'Barrett Sniper', icon: '🎯', damage: 100, ammo: 5, killsNeeded: 1 },
  { tier: 6, name: 'Golden Knife', icon: '🗡️', damage: 100, ammo: 1, killsNeeded: 1 },
];

export const GunGame: React.FC<GunGameProps> = ({ onFinish, isPaused }) => {
  const [tierIdx, setTierIdx] = useState(0);
  const [tierKills, setTierKills] = useState(0);
  const [totalKills, setTotalKills] = useState(0);

  const currentWeapon = WEAPON_TIERS[tierIdx];
  const [ammo, setAmmo] = useState(currentWeapon.ammo);
  const [health, setHealth] = useState(100);
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);

  const [targetBots, setTargetBots] = useState([
    { id: '1', name: 'Bot_Apex', x: 30, y: 40, hp: 100 },
    { id: '2', name: 'Bot_Blaze', x: 70, y: 30, hp: 100 },
    { id: '3', name: 'Bot_Cipher', x: 50, y: 70, hp: 100 },
  ]);

  // Update ammo on tier upgrade
  useEffect(() => {
    setAmmo(currentWeapon.ammo);
  }, [tierIdx]);

  const handleShoot = () => {
    if (ammo <= 0 || isPaused) return;
    setAmmo((a) => a - 1);

    const target = targetBots[Math.floor(Math.random() * targetBots.length)];
    const nextHp = target.hp - currentWeapon.damage;

    if (nextHp <= 0) {
      // Kill recorded!
      const newTierKills = tierKills + 1;
      setTotalKills((k) => k + 1);

      // Check if tier completed
      if (newTierKills >= currentWeapon.killsNeeded) {
        if (tierIdx + 1 >= WEAPON_TIERS.length) {
          // Final Golden Knife kill win!
          onFinish(1000, true, { kills: totalKills + 1, finalTier: 'Golden Knife' });
          return;
        } else {
          // Promote to next weapon tier!
          const nextTierObj = WEAPON_TIERS[tierIdx + 1];
          setTierIdx((t) => t + 1);
          setTierKills(0);
          setUpgradeMessage(`🎉 UPGRADED TO TIER ${nextTierObj.tier}: ${nextTierObj.name} ${nextTierObj.icon}`);
          setTimeout(() => setUpgradeMessage(null), 2000);
        }
      } else {
        setTierKills(newTierKills);
      }

      // Respawn hit bot
      setTargetBots((prev) =>
        prev.map((b) => (b.id === target.id ? { ...b, hp: 100, x: Math.random() * 70 + 15, y: Math.random() * 70 + 15 } : b))
      );
    } else {
      setTargetBots((prev) =>
        prev.map((b) => (b.id === target.id ? { ...b, hp: nextHp } : b))
      );
    }
  };

  const handleReload = () => {
    setAmmo(currentWeapon.ammo);
  };

  return (
    <View style={styles.container}>
      {/* Tier Progress Header */}
      <View style={styles.tierHeader}>
        <Text style={styles.tierTitle}>
          WEAPON TIER {currentWeapon.tier} / {WEAPON_TIERS.length}
        </Text>
        <Text style={styles.currentWeaponName}>
          {currentWeapon.icon} {currentWeapon.name}
        </Text>
        <Text style={styles.tierProgressText}>
          Kills for next tier: {tierKills} / {currentWeapon.killsNeeded}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${((tierIdx + (tierKills / currentWeapon.killsNeeded)) / WEAPON_TIERS.length) * 100}%` }]} />
        </View>
      </View>

      {/* Upgrade Popup */}
      {upgradeMessage && (
        <View style={styles.upgradeBanner}>
          <Text style={styles.upgradeText}>{upgradeMessage}</Text>
        </View>
      )}

      {/* Gun Ladder Preview Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ladderScroll}>
        {WEAPON_TIERS.map((w, idx) => (
          <View
            key={w.tier}
            style={[
              styles.ladderChip,
              idx === tierIdx && styles.activeLadderChip,
              idx < tierIdx && styles.completedLadderChip,
            ]}
          >
            <Text style={styles.ladderChipText}>
              {idx < tierIdx ? '✅' : w.icon} T{w.tier}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Arena Radar */}
      <View style={styles.arenaRadar}>
        {targetBots.map((b) => (
          <View key={b.id} style={[styles.targetMarker, { left: `${b.x}%`, top: `${b.y}%` }]}>
            <Text style={styles.targetText}>🎯 {b.hp}</Text>
          </View>
        ))}
        <View style={styles.crosshair}>
          <Text style={styles.weaponIcon}>{currentWeapon.icon}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <View style={styles.ammoBox}>
          <Text style={styles.ammoText}>{ammo} / ∞</Text>
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
  container: { flex: 1, backgroundColor: '#0A111E', padding: Spacing.md, justifyContent: 'space-between' },
  tierHeader: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tierTitle: { color: Colors.warning, fontSize: Typography.tiny, fontWeight: Typography.extrabold, letterSpacing: 1 },
  currentWeaponName: { color: Colors.textPrimary, fontSize: Typography.h2, fontWeight: Typography.extrabold, marginTop: 2 },
  tierProgressText: { color: Colors.textSecondary, fontSize: Typography.caption, marginTop: 4 },
  progressBarBg: { width: '100%', height: 8, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.full, marginTop: Spacing.sm, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: Colors.accent },
  upgradeBanner: {
    alignSelf: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginVertical: 4,
  },
  upgradeText: { color: '#FFFFFF', fontWeight: Typography.extrabold, fontSize: Typography.bodySmall },
  ladderScroll: { maxHeight: 40, marginVertical: Spacing.xs },
  ladderChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeLadderChip: { backgroundColor: Colors.warning, borderColor: Colors.warning },
  completedLadderChip: { backgroundColor: Colors.surfaceLight, opacity: 0.6 },
  ladderChipText: { color: '#FFFFFF', fontSize: Typography.tiny, fontWeight: Typography.bold },
  arenaRadar: {
    flex: 1,
    backgroundColor: '#141E33',
    borderRadius: BorderRadius.xxl,
    borderWidth: 2,
    borderColor: Colors.warning,
    position: 'relative',
  },
  targetMarker: { position: 'absolute', padding: 2, backgroundColor: Colors.error + '30', borderRadius: BorderRadius.full },
  targetText: { fontSize: 10, color: '#FFFFFF', fontWeight: Typography.bold },
  crosshair: { position: 'absolute', top: '42%', left: '42%', alignItems: 'center' },
  weaponIcon: { fontSize: 28 },
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
