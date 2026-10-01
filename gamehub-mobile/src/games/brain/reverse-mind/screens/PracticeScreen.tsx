// ============================================================
// REVERSE MIND — Practice & Training Lab Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { EnvironmentalBackground } from '../components/EnvironmentalBackground';
import { GlowButton } from '../components/GlowButton';
import { BottomTabBar } from '../components/BottomTabBar';
import type { GameDifficulty, ObjectCategory, AppNavScreen } from '../types';
import { RMTheme } from '../theme';

interface PracticeScreenProps {
  onStartPractice: (diff: GameDifficulty, cat: ObjectCategory) => void;
  onNavigate: (screen: AppNavScreen) => void;
  onBack: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  onStartPractice,
  onNavigate,
  onBack,
}) => {
  const [difficulty, setDifficulty] = useState<GameDifficulty>('easy');
  const [category, setCategory] = useState<ObjectCategory>('animal');

  const categories: { id: ObjectCategory; label: string; icon: string }[] = [
    { id: 'animal', label: 'Animals', icon: '🐕' },
    { id: 'food', label: 'Food', icon: '🍎' },
    { id: 'vehicle', label: 'Vehicles', icon: '🚗' },
    { id: 'nature', label: 'Nature', icon: '⭐' },
    { id: 'toy', label: 'Toys', icon: '🎮' },
  ];

  return (
    <EnvironmentalBackground theme="practice">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>PRACTICE LAB</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Card: Select Object Category */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>OBJECT CATEGORY</Text>
            <View style={styles.catGrid}>
              {categories.map((cat) => {
                const isSelected = category === cat.id;

                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    style={[
                      styles.catChip,
                      isSelected && styles.catSelected,
                    ]}
                  >
                    <Text style={styles.catIcon}>{cat.icon}</Text>
                    <Text style={[styles.catLabel, isSelected && styles.catTextActive]}>
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Card: Select Difficulty */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>TIMING & LENGTH</Text>
            <View style={styles.diffRow}>
              {(['easy', 'medium', 'hard'] as GameDifficulty[]).map((diff) => {
                const isSelected = difficulty === diff;

                return (
                  <Pressable
                    key={diff}
                    onPress={() => setDifficulty(diff)}
                    style={[styles.diffBtn, isSelected && styles.diffActive]}
                  >
                    <Text style={[styles.diffText, isSelected && styles.diffTextActive]}>
                      {diff.toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Practice Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>UNTIMED PRACTICE ENVIRONMENT</Text>
            <Text style={styles.infoDesc}>
              No leaderboards, no streak penalties. Train your visual memory inversion at your own comfortable pace.
            </Text>
          </View>

          <View style={styles.actionWrapper}>
            <GlowButton
              title="BEGIN PRACTICE SESSION"
              variant="green"
              size="lg"
              icon="🎯"
              onPress={() => onStartPractice(difficulty, category)}
            />
          </View>
        </ScrollView>

        <BottomTabBar currentScreen="practice" onNavigate={onNavigate} />
      </View>
    </EnvironmentalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    backgroundColor: 'rgba(16, 27, 43, 0.8)',
    borderRadius: RMTheme.radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: RMTheme.colors.cyanNeon,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RMTheme.radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  catSelected: {
    backgroundColor: 'rgba(77, 231, 255, 0.18)',
    borderColor: RMTheme.colors.cyanNeon,
  },
  catIcon: {
    fontSize: 16,
  },
  catLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8CA0B8',
  },
  catTextActive: {
    color: '#FFFFFF',
  },
  diffRow: {
    flexDirection: 'row',
    gap: 10,
  },
  diffBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RMTheme.radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
  },
  diffActive: {
    backgroundColor: 'rgba(87, 227, 137, 0.18)',
    borderColor: RMTheme.colors.emeraldGreen,
  },
  diffText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8CA0B8',
  },
  diffTextActive: {
    color: RMTheme.colors.emeraldGreen,
  },
  infoBox: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: RMTheme.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: RMTheme.colors.emeraldGreen,
    letterSpacing: 1,
  },
  infoDesc: {
    fontSize: 11,
    color: RMTheme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  actionWrapper: {
    width: '100%',
    marginTop: 10,
  },
});
