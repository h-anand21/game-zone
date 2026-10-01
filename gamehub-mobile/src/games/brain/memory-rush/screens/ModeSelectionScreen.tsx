// ============================================================
// MEMORY RUSH — 03 Mode Select Screen (5 Vertical Mode Cards)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { GameBackground } from '../components/GameBackground';
import { GlassCard } from '../components/GlassCard';
import { BottomTabBar } from '../components/BottomTabBar';
import { MRColors } from '../constants/colors';
import { useMemoryRushStore } from '../store/memoryRushStore';
import type { GameMode, AppNavScreen } from '../types';

interface ModeSelectionScreenProps {
  onSelectMode: (mode: GameMode) => void;
  onNavigate: (screen: AppNavScreen) => void;
  onBack: () => void;
}

interface ModeCardData {
  id: GameMode;
  title: string;
  desc: string;
  visual: string;
  icon: string;
  diffTag: string;
  isFusion?: boolean;
}

const MODES_DATA: ModeCardData[] = [
  {
    id: 'memoryGrid',
    title: 'MEMORY GRID',
    desc: 'Remember positions. Locate target numbers after grid hides.',
    visual: '4   8   2  |  7   1   9',
    icon: '◫',
    diffTag: 'SPATIAL MEMORY',
  },
  {
    id: 'sequenceRush',
    title: 'SEQUENCE RUSH',
    desc: 'Remember order. Repeat exact sequence forward or in reverse.',
    visual: '3 → 8 → 1 → 6 → 4',
    icon: '➔',
    diffTag: 'ORDER RECALL',
  },
  {
    id: 'numberShift',
    title: 'NUMBER SHIFT',
    desc: 'Spot the change. Identify which positions transformed.',
    visual: '[7 2 9]  ➜  [7 8 9]',
    icon: '⇄',
    diffTag: 'PATTERN SHIFT',
  },
  {
    id: 'missingNumber',
    title: 'MISSING NUMBER',
    desc: 'Find what vanished. Select the missing number from options.',
    visual: '8   3   _   1',
    icon: '?',
    diffTag: 'ELIMINATION',
  },
  {
    id: 'fusionRush',
    title: 'FUSION RUSH',
    desc: '4 challenges. ONE RUN. The signature endless memory rush.',
    visual: 'GRID ➔ SEQUENCE ➔ SHIFT ➔ MISSING',
    icon: '✦',
    diffTag: 'SIGNATURE ENDLESS',
    isFusion: true,
  },
];

export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
  onSelectMode,
  onNavigate,
  onBack,
}) => {
  const { setMode } = useMemoryRushStore();

  const handlePickMode = (m: GameMode) => {
    setMode(m);
    onSelectMode(m);
  };

  return (
    <GameBackground theme="home">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>CHOOSE YOUR</Text>
            <Text style={styles.headerTitleAccent}>CHALLENGE</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <Text style={styles.subtitle}>Test a different part of your memory.</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {MODES_DATA.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handlePickMode(item.id)}
              style={({ pressed }) => [
                styles.cardWrapper,
                pressed && styles.pressed,
              ]}
            >
              <GlassCard glowing={item.isFusion} style={styles.cardInner}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.iconBox}>
                    <Text style={styles.iconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.titleCol}>
                    <Text style={styles.diffTagText}>{item.diffTag}</Text>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </View>

                <Text style={styles.cardDesc}>{item.desc}</Text>

                <View style={styles.visualBox}>
                  <Text style={styles.visualText}>{item.visual}</Text>
                </View>
              </GlassCard>
            </Pressable>
          ))}
        </ScrollView>

        <BottomTabBar currentScreen="modes" onNavigate={onNavigate} />
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MRColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  backText: {
    fontSize: 18,
    color: MRColors.textPrimary,
    fontWeight: 'bold',
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 2,
  },
  headerTitleAccent: {
    fontSize: 18,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    color: MRColors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  cardWrapper: {
    width: '100%',
  },
  cardInner: {
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: MRColors.cyanMuted,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
    color: MRColors.cyanBright,
    fontWeight: '900',
  },
  titleCol: {
    flex: 1,
  },
  diffTagText: {
    fontSize: 8,
    fontWeight: '900',
    color: MRColors.cyanBright,
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 1,
    marginTop: 1,
  },
  chevron: {
    fontSize: 22,
    color: MRColors.cyanBright,
    fontWeight: '900',
  },
  cardDesc: {
    fontSize: 11,
    color: MRColors.textSecondary,
    fontWeight: '600',
    marginTop: 8,
    lineHeight: 15,
  },
  visualBox: {
    marginTop: 10,
    backgroundColor: 'rgba(8, 10, 13, 0.75)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  visualText: {
    fontSize: 12,
    fontWeight: '800',
    color: MRColors.cyanBright,
    letterSpacing: 1.5,
  },
  pressed: {
    transform: [{ translateY: -3 }],
    opacity: 0.9,
  },
});
