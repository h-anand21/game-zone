// ============================================================
// MEMORY RUSH — 03 Mode Select Screen (5 Arcade Mode Cards)
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
import { MRIcon, MRIconName } from '../components/MRIcon';
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
  iconName: MRIconName;
  diffTag: string;
  isFusion?: boolean;
}

const MODES_DATA: ModeCardData[] = [
  {
    id: 'memoryGrid',
    title: 'MEMORY GRID',
    desc: 'Remember positions. Locate target numbers after grid hides.',
    visual: '4   8   2  |  7   1   9',
    iconName: 'grid',
    diffTag: 'SPATIAL MEMORY',
  },
  {
    id: 'sequenceRush',
    title: 'SEQUENCE RUSH',
    desc: 'Remember order. Repeat exact sequence forward or in reverse.',
    visual: '3 → 8 → 1 → 6 → 4',
    iconName: 'arrow-right',
    diffTag: 'ORDER RECALL',
  },
  {
    id: 'numberShift',
    title: 'NUMBER SHIFT',
    desc: 'Spot the change. Identify which positions transformed.',
    visual: '[7 2 9]  ➜  [7 8 9]',
    iconName: 'refresh-cw',
    diffTag: 'PATTERN SHIFT',
  },
  {
    id: 'missingNumber',
    title: 'MISSING NUMBER',
    desc: 'Find what vanished. Select the missing number from options.',
    visual: '8   3   _   1',
    iconName: 'help-circle',
    diffTag: 'ELIMINATION',
  },
  {
    id: 'fusionRush',
    title: 'FUSION RUSH',
    desc: '4 challenges. ONE RUN. The signature endless memory rush.',
    visual: 'GRID ➔ SEQUENCE ➔ SHIFT ➔ MISSING',
    iconName: 'zap',
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
            <MRIcon name="arrow-left" size={18} color={MRColors.textPrimary} />
          </Pressable>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>CHOOSE YOUR</Text>
            <Text style={styles.headerTitleAccent}>CHALLENGE</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <Text style={styles.subtitle}>TEST A DIFFERENT PART OF YOUR MEMORY.</Text>

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
                  <View style={[styles.iconBox, item.isFusion && styles.fusionIconBox]}>
                    <MRIcon
                      name={item.iconName}
                      size={20}
                      color={MRColors.yellowStatus}
                    />
                  </View>
                  <View style={styles.titleCol}>
                    <Text style={[styles.diffTagText, styles.fusionTagText]}>
                      {item.diffTag}
                    </Text>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                  </View>
                  <MRIcon name="chevron-right" size={20} color={MRColors.yellowStatus} />
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
    borderWidth: 1.2,
    borderColor: 'rgba(255, 216, 61, 0.35)',
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: MRColors.textSecondary,
    letterSpacing: 2,
  },
  headerTitleAccent: {
    fontSize: 18,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 10,
    color: MRColors.textSecondary,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
    letterSpacing: 1,
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
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 216, 61, 0.15)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 216, 61, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fusionIconBox: {
    backgroundColor: 'rgba(250, 204, 21, 0.22)',
    borderColor: 'rgba(250, 204, 21, 0.5)',
  },
  titleCol: {
    flex: 1,
  },
  diffTagText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 1,
  },
  fusionTagText: {
    color: MRColors.yellowStatus,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: MRColors.textPrimary,
    letterSpacing: 1,
    marginTop: 1,
  },
  cardDesc: {
    fontSize: 11,
    color: MRColors.textSecondary,
    fontWeight: '700',
    marginTop: 8,
    lineHeight: 16,
  },
  visualBox: {
    marginTop: 10,
    backgroundColor: 'rgba(8, 10, 13, 0.85)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 216, 61, 0.25)',
    alignItems: 'center',
  },
  visualText: {
    fontSize: 11,
    fontWeight: '900',
    color: MRColors.yellowStatus,
    letterSpacing: 1.5,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});
