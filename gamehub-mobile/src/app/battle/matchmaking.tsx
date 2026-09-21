// ============================================================
// GameHub — Battle: Matchmaking Screen
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

const MODE_META: Record<string, { name: string; icon: string; color: string }> = {
  'free-for-all': { name: 'Free For All', icon: '💥', color: '#FF4757' },
  'team-deathmatch': { name: 'Team Deathmatch', icon: '⚔️', color: '#6C5CE7' },
  'gun-game': { name: 'Gun Game', icon: '🔫', color: '#00D2A0' },
  'capture-point': { name: 'Capture Point', icon: '🏴', color: '#FDCB6E' },
  'duel': { name: '1v1 Duel', icon: '🎯', color: '#FF6B6B' },
};

const TIPS = [
  '💡 Headshots deal 2x damage!',
  '💡 Use cover to reload safely.',
  '💡 Crouch for better accuracy.',
  '💡 Keep moving — standing still = easy target.',
  '💡 Check corners before entering rooms.',
  '💡 Shotgun is best at close range.',
];

export default function MatchmakingScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [elapsed, setElapsed] = useState(0);
  const [playersFound, setPlayersFound] = useState(1);
  const [tip, setTip] = useState(TIPS[0]);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  const modeMeta = MODE_META[mode || 'free-for-all'] || MODE_META['free-for-all'];

  // Spinning animation
  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: true })
    );
    spin.start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();

    const dots = Animated.loop(
      Animated.timing(dotAnim, { toValue: 3, duration: 1500, useNativeDriver: false })
    );
    dots.start();

    return () => { spin.stop(); pulse.stop(); dots.stop(); };
  }, []);

  // Timer + simulate finding players
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    const playerTimer = setInterval(() => {
      setPlayersFound((prev) => {
        if (prev >= 8) return prev;
        return prev + Math.floor(Math.random() * 2) + 1;
      });
    }, 2000);

    const tipTimer = setInterval(() => {
      setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    }, 4000);

    // Simulate match found after 5-8 seconds
    const matchTimer = setTimeout(() => {
      router.replace(('/battle/result?mode=' + (mode || 'free-for-all')) as any);
    }, 6000 + Math.random() * 3000);

    return () => {
      clearInterval(timer);
      clearInterval(playerTimer);
      clearInterval(tipTimer);
      clearTimeout(matchTimer);
    };
  }, [mode]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      {/* Decorative circles */}
      <View style={[styles.bgRing, styles.bgRing1]} />
      <View style={[styles.bgRing, styles.bgRing2]} />

      <View style={styles.content}>
        {/* Mode Header */}
        <View style={styles.modeHeader}>
          <Text style={styles.modeIcon}>{modeMeta.icon}</Text>
          <Text style={styles.modeName}>{modeMeta.name}</Text>
        </View>

        {/* Spinning Loader */}
        <Animated.View style={[styles.spinnerContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spin }], borderColor: modeMeta.color }]} />
          <View style={styles.spinnerCenter}>
            <Text style={styles.spinnerEmoji}>🎮</Text>
          </View>
        </Animated.View>

        <Text style={styles.searchingText}>Finding Match...</Text>
        <Text style={styles.timerText}>{formatTime(elapsed)}</Text>

        {/* Players found */}
        <View style={styles.playersBar}>
          <Text style={styles.playersLabel}>Players Found</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(playersFound / 8) * 100}%`, backgroundColor: modeMeta.color }]} />
          </View>
          <Text style={styles.playersCount}>{Math.min(playersFound, 8)}/8</Text>
        </View>

        {/* Tip */}
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      </View>

      {/* Cancel Button */}
      <View style={styles.bottomCta}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel Matchmaking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  bgRing: { position: 'absolute', borderWidth: 1, borderColor: Colors.border, borderRadius: 999, opacity: 0.3 },
  bgRing1: { width: 300, height: 300, top: '20%', left: '50%', marginLeft: -150 },
  bgRing2: { width: 450, height: 450, top: '15%', left: '50%', marginLeft: -225 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  modeHeader: { alignItems: 'center', marginBottom: Spacing.xl },
  modeIcon: { fontSize: 48, marginBottom: Spacing.sm },
  modeName: { color: Colors.textPrimary, fontSize: Typography.h2, fontWeight: Typography.extrabold },
  spinnerContainer: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  spinnerRing: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    borderWidth: 4, borderTopColor: 'transparent', borderRightColor: 'transparent',
  },
  spinnerCenter: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center',
  },
  spinnerEmoji: { fontSize: 36 },
  searchingText: { color: Colors.textSecondary, fontSize: Typography.body, fontWeight: Typography.semibold },
  timerText: { color: Colors.textMuted, fontSize: Typography.h3, fontWeight: Typography.bold, marginTop: 4 },
  playersBar: { width: '100%', marginTop: Spacing.xl },
  playersLabel: { color: Colors.textMuted, fontSize: Typography.caption, marginBottom: Spacing.xs },
  progressBar: { height: 8, backgroundColor: Colors.surfaceLight, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  playersCount: { color: Colors.textSecondary, fontSize: Typography.caption, textAlign: 'right', marginTop: 4 },
  tipBox: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginTop: Spacing.xl,
    borderWidth: 1, borderColor: Colors.border,
  },
  tipText: { color: Colors.textSecondary, fontSize: Typography.bodySmall, textAlign: 'center' },
  bottomCta: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  cancelBtn: {
    backgroundColor: Colors.surface, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.error,
  },
  cancelText: { color: Colors.error, fontWeight: Typography.bold, fontSize: Typography.body },
});
