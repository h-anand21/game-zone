// ============================================================
// GameHub — Onboarding: Welcome Screen
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Decorative background circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Logo / Icon */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.logoEmoji}>🎮</Text>
        </Animated.View>

        <Text style={styles.title}>Welcome to GameHub</Text>
        <Text style={styles.subtitle}>
          35+ games in one app{'\n'}
          Play offline • Compete online • Battle friends
        </Text>

        {/* Feature highlights */}
        <View style={styles.features}>
          {[
            { icon: '🧠', label: 'Brain Games' },
            { icon: '⚡', label: 'Reflex Challenges' },
            { icon: '🕹️', label: 'Arcade Classics' },
            { icon: '⚔️', label: 'FPS Battle Arena' },
          ].map((feat) => (
            <View key={feat.label} style={styles.featureChip}>
              <Text style={styles.featureIcon}>{feat.icon}</Text>
              <Text style={styles.featureLabel}>{feat.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* CTA Buttons */}
      <Animated.View style={[styles.ctaContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/onboarding/username')}>
          <Text style={styles.primaryBtnText}>Get Started 🚀</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/(tabs)/home')}>
          <Text style={styles.skipBtnText}>Skip for now</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  bgCircle1: {
    position: 'absolute', top: -100, right: -80,
    width: 250, height: 250, borderRadius: 125,
    backgroundColor: Colors.primary, opacity: 0.08,
  },
  bgCircle2: {
    position: 'absolute', bottom: -60, left: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.accent, opacity: 0.06,
  },
  bgCircle3: {
    position: 'absolute', top: height * 0.4, left: width * 0.6,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: Colors.success, opacity: 0.05,
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  logoContainer: {
    width: 100, height: 100, borderRadius: 30,
    backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.primary, marginBottom: Spacing.lg,
  },
  logoEmoji: { fontSize: 48 },
  title: {
    fontSize: Typography.h1, color: Colors.textPrimary,
    fontWeight: Typography.extrabold, textAlign: 'center', marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.body, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 24, marginBottom: Spacing.xl,
  },
  features: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.sm },
  featureChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  featureIcon: { fontSize: 16 },
  featureLabel: { color: Colors.textSecondary, fontSize: Typography.caption, fontWeight: Typography.semibold },
  ctaContainer: { paddingHorizontal: Spacing.xl, paddingBottom: 60, width: '100%' },
  primaryBtn: {
    backgroundColor: Colors.primary, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.sm,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: Typography.body, fontWeight: Typography.bold },
  skipBtn: { paddingVertical: Spacing.sm, alignItems: 'center' },
  skipBtnText: { color: Colors.textMuted, fontSize: Typography.bodySmall },
});
