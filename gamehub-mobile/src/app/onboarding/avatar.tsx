// ============================================================
// GameHub — Onboarding: Avatar Selection Screen
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { useProfileStore } from '@/store/profile-store';

const AVATAR_SETS = {
  'Gaming': ['🎮', '🕹️', '👾', '🤖', '🎯', '🏆', '⚡', '🔥'],
  'Animals': ['🐺', '🦁', '🐉', '🦅', '🐍', '🦊', '🐻', '🦈'],
  'Cool': ['😎', '🥷', '🧙‍♂️', '🦸', '👻', '💀', '🎭', '🤠'],
  'Nature': ['🌟', '💎', '🌙', '☄️', '🌊', '⛰️', '🌋', '🍀'],
};

const AVATAR_COLORS = [
  '#6C5CE7', '#FF6B6B', '#00D2A0', '#FDCB6E',
  '#FF4757', '#A29BFE', '#00CEC9', '#FD79A8',
  '#E17055', '#74B9FF', '#55EFC4', '#FAB1A0',
];

type AvatarCategory = keyof typeof AVATAR_SETS;

export default function AvatarScreen() {
  const [selectedEmoji, setSelectedEmoji] = useState('🎮');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [activeCategory, setActiveCategory] = useState<AvatarCategory>('Gaming');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const { setAvatarUrl } = useProfileStore();

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    Animated.sequence([
      Animated.spring(bounceAnim, { toValue: 1.2, friction: 3, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const handleFinish = () => {
    // Store avatar as encoded string (emoji + color)
    setAvatarUrl(`${selectedEmoji}|${selectedColor}`);
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Progress indicator */}
        <View style={styles.progress}>
          <View style={[styles.progressDot, styles.progressDotDone]} />
          <View style={[styles.progressDot, styles.progressDotDone]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
        </View>

        <Text style={styles.title}>Pick Your Avatar</Text>
        <Text style={styles.subtitle}>Apna avatar choose karo — baad mein change bhi kar sakte ho!</Text>

        {/* Preview */}
        <Animated.View style={[styles.preview, { backgroundColor: selectedColor, transform: [{ scale: bounceAnim }] }]}>
          <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
        </Animated.View>

        {/* Color Picker */}
        <Text style={styles.sectionLabel}>Background Color</Text>
        <View style={styles.colorRow}>
          {AVATAR_COLORS.map((color) => (
            <Pressable
              key={color}
              style={[
                styles.colorDot,
                { backgroundColor: color },
                selectedColor === color && styles.colorDotSelected,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryRow}>
          {(Object.keys(AVATAR_SETS) as AvatarCategory[]).map((cat) => (
            <Pressable
              key={cat}
              style={[styles.catTab, activeCategory === cat && styles.catTabActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catTabText, activeCategory === cat && styles.catTabTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </View>

        {/* Emoji Grid */}
        <ScrollView contentContainerStyle={styles.emojiGrid}>
          {AVATAR_SETS[activeCategory].map((emoji) => (
            <Pressable
              key={emoji}
              style={[styles.emojiCell, selectedEmoji === emoji && styles.emojiCellSelected]}
              onPress={() => handleSelect(emoji)}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
          <Text style={styles.finishBtnText}>Let's Play! 🎮</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, paddingTop: 80, paddingHorizontal: Spacing.xl },
  progress: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: Spacing.lg },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.surfaceLight },
  progressDotActive: { backgroundColor: Colors.primary, width: 24 },
  progressDotDone: { backgroundColor: Colors.success },
  title: {
    fontSize: Typography.h2, color: Colors.textPrimary,
    fontWeight: Typography.extrabold, textAlign: 'center', marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.bodySmall, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 20, marginBottom: Spacing.lg,
  },
  preview: {
    width: 96, height: 96, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', marginBottom: Spacing.lg,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)',
  },
  previewEmoji: { fontSize: 48 },
  sectionLabel: { color: Colors.textMuted, fontSize: Typography.caption, marginBottom: Spacing.sm, fontWeight: Typography.semibold },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.lg },
  colorDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  colorDotSelected: { borderColor: '#FFFFFF', borderWidth: 3 },
  categoryRow: { flexDirection: 'row', gap: Spacing.xs, marginBottom: Spacing.md },
  catTab: {
    flex: 1, backgroundColor: Colors.surface, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  catTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catTabText: { color: Colors.textMuted, fontSize: Typography.caption, fontWeight: Typography.semibold },
  catTabTextActive: { color: '#FFFFFF' },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingBottom: 20 },
  emojiCell: {
    width: 64, height: 64, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.border,
  },
  emojiCellSelected: { borderColor: Colors.primary, backgroundColor: Colors.surfaceLight },
  emojiText: { fontSize: 32 },
  bottomCta: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  finishBtn: {
    backgroundColor: Colors.primary, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg, alignItems: 'center',
  },
  finishBtnText: { color: '#FFFFFF', fontSize: Typography.body, fontWeight: Typography.bold },
});
