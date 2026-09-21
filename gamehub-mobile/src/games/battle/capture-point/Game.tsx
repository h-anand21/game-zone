// ============================================================
// GameHub — Capture Point (Domination) Game Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import type { GameEngine } from '../../engine/GameEngine';

interface CapturePointProps {
  engine: GameEngine;
  onFinish: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused: boolean;
}

interface Zone {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  owner: 'alpha' | 'bravo' | 'neutral';
  progress: number; // 0 - 100
}

const TARGET_SCORE = 500;

export const CapturePointGame: React.FC<CapturePointProps> = ({ onFinish, isPaused }) => {
  const [alphaScore, setAlphaScore] = useState(0); // Player Team
  const [bravoScore, setBravoScore] = useState(0); // Enemy Team
  const [activeZoneId, setActiveZoneId] = useState<string>('A');
  const [statusMsg, setStatusMsg] = useState<string>('📍 Move to a zone to start capturing!');

  const [zones, setZones] = useState<Zone[]>([
    { id: 'A', name: 'Zone A (Factory)', icon: '🏭', x: 25, y: 30, owner: 'neutral', progress: 0 },
    { id: 'B', name: 'Zone B (Hangar)', icon: '🚁', x: 70, y: 40, owner: 'neutral', progress: 0 },
    { id: 'C', name: 'Zone C (Helipad)', icon: '📍', x: 45, y: 75, owner: 'neutral', progress: 0 },
  ]);

  // Check win condition
  useEffect(() => {
    if (alphaScore >= TARGET_SCORE) {
      onFinish(alphaScore, true, { alphaScore, bravoScore });
    } else if (bravoScore >= TARGET_SCORE) {
      onFinish(alphaScore, false, { alphaScore, bravoScore });
    }
  }, [alphaScore, bravoScore]);

  // Game Loop: Capture & Scoring Tickets
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // 1. Generate tickets based on owned zones
      setZones((prevZones) => {
        let alphaZonesCount = 0;
        let bravoZonesCount = 0;

        prevZones.forEach((z) => {
          if (z.owner === 'alpha') alphaZonesCount++;
          if (z.owner === 'bravo') bravoZonesCount++;
        });

        setAlphaScore((s) => Math.min(TARGET_SCORE, s + alphaZonesCount * 6));
        setBravoScore((s) => Math.min(TARGET_SCORE, s + bravoZonesCount * 4));

        // 2. Active Zone capture progress
        return prevZones.map((z) => {
          if (z.id === activeZoneId) {
            if (z.owner !== 'alpha') {
              const nextProg = z.progress + 25;
              if (nextProg >= 100) {
                setStatusMsg(`🎉 TEAM ALPHA CAPTURED ${z.name.toUpperCase()}!`);
                return { ...z, owner: 'alpha', progress: 100 };
              }
              setStatusMsg(`⏳ Capturing ${z.name}: ${nextProg}%`);
              return { ...z, progress: nextProg };
            }
          }

          // Enemy bot random capture of other zones
          if (Math.random() < 0.15 && z.id !== activeZoneId && z.owner !== 'bravo') {
            return { ...z, owner: 'bravo', progress: 100 };
          }

          return z;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeZoneId, isPaused]);

  return (
    <View style={styles.container}>
      {/* Score Banner */}
      <View style={styles.scoreBanner}>
        <View style={styles.teamScoreBox}>
          <Text style={styles.alphaText}>🔴 TEAM ALPHA</Text>
          <Text style={styles.scoreVal}>{alphaScore}</Text>
        </View>

        <View style={styles.targetBox}>
          <Text style={styles.targetLabel}>GOAL</Text>
          <Text style={styles.targetVal}>{TARGET_SCORE} PTS</Text>
        </View>

        <View style={styles.teamScoreBox}>
          <Text style={styles.bravoText}>🔵 TEAM BRAVO</Text>
          <Text style={styles.scoreVal}>{bravoScore}</Text>
        </View>
      </View>

      {/* Status Message */}
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{statusMsg}</Text>
      </View>

      {/* 2.5D Domination Map */}
      <View style={styles.mapContainer}>
        {zones.map((z) => (
          <Pressable
            key={z.id}
            style={[
              styles.zoneCircle,
              { left: `${z.x}%`, top: `${z.y}%` },
              z.owner === 'alpha' && styles.alphaOwned,
              z.owner === 'bravo' && styles.bravoOwned,
              activeZoneId === z.id && styles.activeZoneSelected,
            ]}
            onPress={() => setActiveZoneId(z.id)}
          >
            <Text style={styles.zoneIcon}>{z.icon}</Text>
            <Text style={styles.zoneNameText}>{z.id}</Text>
            <Text style={styles.zoneOwnerTag}>
              {z.owner === 'alpha' ? '🔴 RED' : z.owner === 'bravo' ? '🔵 BLUE' : '⚪ NEUTRAL'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Zone Picker & Capture Controls */}
      <View style={styles.controlsSection}>
        <Text style={styles.sectionHeading}>Tap a Zone to Deploy & Capture:</Text>
        <View style={styles.zoneButtonsRow}>
          {zones.map((z) => (
            <Pressable
              key={z.id}
              style={[
                styles.zoneBtn,
                activeZoneId === z.id && styles.activeZoneBtn,
                z.owner === 'alpha' && styles.alphaZoneBtn,
              ]}
              onPress={() => setActiveZoneId(z.id)}
            >
              <Text style={styles.zoneBtnIcon}>{z.icon}</Text>
              <Text style={styles.zoneBtnText}>{z.name}</Text>
              <Text style={styles.zoneProgressVal}>{z.progress}%</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1520', padding: Spacing.md, justifyContent: 'space-between' },
  scoreBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  teamScoreBox: { alignItems: 'center' },
  alphaText: { color: Colors.error, fontSize: Typography.tiny, fontWeight: Typography.extrabold },
  bravoText: { color: Colors.primaryLight, fontSize: Typography.tiny, fontWeight: Typography.extrabold },
  scoreVal: { color: Colors.textPrimary, fontSize: Typography.h2, fontWeight: Typography.extrabold },
  targetBox: { alignItems: 'center' },
  targetLabel: { color: Colors.warning, fontSize: 10, fontWeight: Typography.bold },
  targetVal: { color: Colors.textSecondary, fontSize: Typography.caption, fontWeight: Typography.bold },
  statusBox: {
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusText: { color: Colors.textPrimary, fontSize: Typography.bodySmall, fontWeight: Typography.bold },
  mapContainer: {
    flex: 1,
    marginVertical: Spacing.sm,
    backgroundColor: '#172338',
    borderRadius: BorderRadius.xxl,
    borderWidth: 2,
    borderColor: Colors.primary,
    position: 'relative',
  },
  zoneCircle: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  alphaOwned: { borderColor: Colors.error, backgroundColor: Colors.error + '30' },
  bravoOwned: { borderColor: Colors.primaryLight, backgroundColor: Colors.primaryLight + '30' },
  activeZoneSelected: { borderWidth: 4, borderColor: Colors.warning },
  zoneIcon: { fontSize: 22 },
  zoneNameText: { color: Colors.textPrimary, fontSize: 11, fontWeight: Typography.extrabold },
  zoneOwnerTag: { fontSize: 8, color: Colors.textMuted, fontWeight: Typography.bold },
  controlsSection: { gap: Spacing.xs },
  sectionHeading: { color: Colors.textPrimary, fontSize: Typography.caption, fontWeight: Typography.bold },
  zoneButtonsRow: { gap: Spacing.xs },
  zoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
  },
  activeZoneBtn: { borderColor: Colors.warning, borderWidth: 2 },
  alphaZoneBtn: { backgroundColor: Colors.error + '20' },
  zoneBtnIcon: { fontSize: 20 },
  zoneBtnText: { color: Colors.textPrimary, fontWeight: Typography.bold, fontSize: Typography.bodySmall, flex: 1, marginLeft: 8 },
  zoneProgressVal: { color: Colors.warning, fontWeight: Typography.extrabold, fontSize: Typography.caption },
});
