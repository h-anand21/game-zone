// ============================================================
// MEMORY RUSH — 03 Mode Select Screen (Jungle Challenge Altar)
// Features Cropped CHOOSE YOUR CHALLENGE Plaque & Map Explorer
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { JungleWorldBackground } from '../components/JungleWorldBackground';
import { JungleScreenPlaque } from '../components/JungleScreenPlaque';
import { JungleHeaderHUD } from '../components/JungleHeaderHUD';
import { WoodPanel } from '../components/WoodPanel';
import { StonePanel } from '../components/StonePanel';
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
  accentColor: string;
  isFusion?: boolean;
}

const MODES_DATA: ModeCardData[] = [
  {
    id: 'memoryGrid',
    title: 'MEMORY GRID',
    desc: 'Remember tile positions. Locate hidden target numbers on the stone altar.',
    visual: '4   8   2  |  7   1   9',
    iconName: 'grid',
    diffTag: 'SPATIAL MEMORY',
    accentColor: '#38BDF8',
  },
  {
    id: 'sequenceRush',
    title: 'SEQUENCE RUSH',
    desc: 'Watch the ancient numbered sequence, then carve it back step by step.',
    visual: '3  ➔  8  ➔  1  ➔  6  ➔  4',
    iconName: 'arrow-right',
    diffTag: 'ORDER RECALL',
    accentColor: '#FFD700',
  },
  {
    id: 'numberShift',
    title: 'NUMBER SHIFT',
    desc: 'Spot which stone tile shifted and transformed its number.',
    visual: '[ 7  2  9 ]  ➔  [ 7  8  9 ]',
    iconName: 'refresh-cw',
    diffTag: 'PATTERN SHIFT',
    accentColor: '#EF4444',
  },
  {
    id: 'missingNumber',
    title: 'MISSING NUMBER',
    desc: 'Which sacred number vanished from the grid? Tap the missing rune.',
    visual: '8    3    ❓    1',
    iconName: 'help-circle',
    diffTag: 'ELIMINATION',
    accentColor: '#10B981',
  },
  {
    id: 'fusionRush',
    title: 'FUSION RUSH',
    desc: '4 temple trials combined into ONE run. The ultimate jungle explorer test.',
    visual: 'GRID ➔ SEQUENCE ➔ SHIFT ➔ MISSING',
    iconName: 'zap',
    diffTag: 'SIGNATURE TRIAL',
    accentColor: '#FFD700',
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
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
    setMode(m);
    onSelectMode(m);
  };

  return (
    <JungleWorldBackground variant="forest">
      <View style={styles.container}>
        {/* Jungle Header HUD with Back Button */}
        <JungleHeaderHUD onBack={onBack} />

        {/* Sculpted CHOOSE YOUR CHALLENGE Plaque */}
        <View style={styles.plaqueHolder}>
          <JungleScreenPlaque type="choose_challenge" height={150} />
          <Text style={styles.subtitle}>
            TEST A DIFFERENT PART OF YOUR MEMORY ARCHIVE
          </Text>
        </View>

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
              accessibilityLabel={`Select ${item.title}`}
            >
              {item.isFusion ? (
                <WoodPanel variant="sign" style={styles.cardWood}>
                  <View style={styles.cardHeaderRow}>
                    <View style={[styles.iconBox, { borderColor: '#FFD700' }]}>
                      <MRIcon name={item.iconName} size={22} color="#FFD700" />
                    </View>
                    <View style={styles.titleCol}>
                      <Text style={[styles.diffTagText, { color: '#FFD700' }]}>
                        {item.diffTag}
                      </Text>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                    </View>
                    <View style={styles.playArrowPill}>
                      <Text style={styles.playArrowText}>PLAY ▶</Text>
                    </View>
                  </View>

                  <Text style={styles.cardDesc}>{item.desc}</Text>

                  <View style={styles.visualBox}>
                    <Text style={[styles.visualText, { color: '#FFD700' }]}>
                      {item.visual}
                    </Text>
                  </View>
                </WoodPanel>
              ) : (
                <StonePanel variant="carved" style={styles.cardStone}>
                  <View style={styles.cardHeaderRow}>
                    <View style={[styles.iconBox, { borderColor: item.accentColor }]}>
                      <MRIcon name={item.iconName} size={22} color={item.accentColor} />
                    </View>
                    <View style={styles.titleCol}>
                      <Text style={[styles.diffTagText, { color: item.accentColor }]}>
                        {item.diffTag}
                      </Text>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                    </View>
                    <View style={styles.playArrowPill}>
                      <Text style={styles.playArrowText}>PLAY ▶</Text>
                    </View>
                  </View>

                  <Text style={styles.cardDesc}>{item.desc}</Text>

                  <View style={styles.visualBox}>
                    <Text style={[styles.visualText, { color: item.accentColor }]}>
                      {item.visual}
                    </Text>
                  </View>
                </StonePanel>
              )}
            </Pressable>
          ))}

          <View style={{ height: 80 }} />
        </ScrollView>

        <BottomTabBar currentScreen="modes" onNavigate={onNavigate} />
      </View>
    </JungleWorldBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
  },
  plaqueHolder: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10,
    color: '#D4E2D4',
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
  },
  cardWrapper: {
    width: '100%',
  },
  cardWood: {
    width: '100%',
  },
  cardStone: {
    width: '100%',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 16, 12, 0.75)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
  },
  diffTagText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  playArrowPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    borderWidth: 1.5,
    borderColor: '#FFF8E7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
  },
  playArrowText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#3B1E00',
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontSize: 11,
    color: '#D1DEC8',
    fontWeight: '700',
    marginTop: 8,
    lineHeight: 16,
  },
  visualBox: {
    marginTop: 10,
    backgroundColor: 'rgba(8, 14, 10, 0.75)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
  },
  visualText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});
