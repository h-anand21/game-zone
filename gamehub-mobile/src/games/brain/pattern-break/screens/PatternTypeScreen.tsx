// ============================================================
// PATTERN BREAKER — 06 Pattern Type Screen
// Select category: Number, Shape, Color, Count, Direction, Mixed, Random
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameBackground } from '../components/background/GameBackground';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { PBPatternType } from '../types';
import { PBColors, PBRadius, PBShadows } from '../theme';
import { usePatternBreakStore } from '../store/patternBreakStore';

interface CategoryOption {
  id: PBPatternType;
  title: string;
  desc: string;
  icon: string;
  color: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'RANDOM', title: 'RANDOM', desc: 'Surprise me with any pattern!', icon: '🎲', color: '#19D3FF' },
  { id: 'NUMBER', title: 'NUMBER', desc: 'Sequence & arithmetic', icon: '🔢', color: '#19D3FF' },
  { id: 'SHAPE', title: 'SHAPE', desc: 'Visual geometry', icon: '🔺', color: '#FFD54A' },
  { id: 'COLOR', title: 'COLOR', desc: 'Harmonic hue rhythm', icon: '🎨', color: '#FF6EA7' },
  { id: 'COUNT', title: 'COUNT', desc: 'Quantity resonance', icon: '💎', color: '#38E58C' },
  { id: 'DIRECTION', title: 'DIRECTION', desc: 'Vector & rotation', icon: '🧭', color: '#A78BFA' },
  { id: 'MIXED', title: 'MIXED', desc: 'Fusion multi-rules', icon: '⚡', color: '#FB923C' },
];

export const PatternTypeScreen: React.FC = () => {
  const { patternType, setPatternType, setScreen } = usePatternBreakStore();

  const handleStart = () => {
    setScreen('how_to_play');
  };

  return (
    <GameBackground variant="observatory">
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title="RULE FAMILY"
          onBack={() => setScreen('difficulty')}
          onSettings={() => setScreen('settings')}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerInfo}>
            <Text style={styles.subtext}>WHAT DO YOU WANT TO BREAK?</Text>
          </View>

          <View style={styles.grid}>
            {CATEGORIES.map((cat) => {
              const isSelected = patternType === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setPatternType(cat.id)}
                  style={[
                    styles.card,
                    isSelected && { borderColor: cat.color, borderWidth: 2 },
                    isSelected && PBShadows.cyanGlow,
                  ]}
                >
                  <View style={[styles.iconCircle, { borderColor: cat.color }]}>
                    <Text style={styles.icon}>{cat.icon}</Text>
                  </View>
                  <Text style={[styles.title, isSelected && { color: cat.color }]}>
                    {cat.title}
                  </Text>
                  <Text style={styles.desc}>{cat.desc}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <PrimaryButton
            title="START ADVENTURE ▶"
            variant="cyan"
            size="lg"
            onPress={handleStart}
          />
        </View>
      </SafeAreaView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 10.5,
    fontWeight: '900',
    color: PBColors.textMuted,
    letterSpacing: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'rgba(24, 47, 57, 0.88)',
    borderRadius: PBRadius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(25, 211, 255, 0.22)',
    alignItems: 'center',
    minHeight: 120,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 13,
    fontWeight: '900',
    color: PBColors.textPrimary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  desc: {
    fontSize: 9.5,
    color: PBColors.textMuted,
    textAlign: 'center',
    lineHeight: 13,
  },
  bottomBar: {
    padding: 16,
  },
});
