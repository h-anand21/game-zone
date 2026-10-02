// ============================================================
// PATTERN QUEST — Screen 04: ModeSelectionScreen
// Four Large Tactile Mode Cards: DISCOVER, THINK, RUSH, MEMORY
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { GameBackground } from '../components/background/GameBackground';
import { GameHeader } from '../components/common/GameHeader';
import { ScreenPlaque } from '../components/common/ScreenPlaque';
import { GameButton } from '../components/buttons/GameButton';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { usePatternQuestStore } from '../store/patternQuestStore';
import { pqAssets, pqColors, pqSpacing, pqTypography } from '../theme';
import { PQGameMode } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ModeCardDef {
  mode: PQGameMode;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
}

const MODES: ModeCardDef[] = [
  {
    mode: 'DISCOVER',
    title: 'DISCOVER',
    subtitle: 'Simple Patterns',
    description: 'Explore shape cycles, alternating colors, and directional turns at a calm pace.',
    icon: pqAssets.buttons.modePattern,
    color: '#2ECC71',
  },
  {
    mode: 'THINK',
    title: 'THINK',
    subtitle: 'Mixed Patterns',
    description: 'Solve dual-matrix transformations, multi-attribute shifts, and logic deductions.',
    icon: pqAssets.buttons.typeMixed,
    color: '#00F0FF',
  },
  {
    mode: 'RUSH',
    title: 'RUSH',
    subtitle: 'Beat the Clock',
    description: 'Rapid-fire lightning speed challenges. Race against the golden hourglass!',
    icon: pqAssets.buttons.rushMode,
    color: '#FFA502',
  },
  {
    mode: 'MEMORY',
    title: 'MEMORY',
    subtitle: 'Remember the Pattern',
    description: 'Sequences vanish into temple mist! Memorize the sacred runes before they fade.',
    icon: pqAssets.buttons.memoryShift,
    color: '#9B51E0',
  },
];

export const ModeSelectionScreen: React.FC = () => {
  const { currentScreen, setScreen, gameMode, setGameMode, startNewGame } = usePatternQuestStore();

  const handleSelectMode = (mode: PQGameMode) => {
    setGameMode(mode);
    setScreen('difficulty');
  };

  return (
    <GameBackground screen="mode_select" overlayDarkness={0.2}>
      <GameHeader onBack={() => setScreen('home')} onSettings={() => setScreen('settings')} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenPlaque screen="mode_select" width={280} height={140} style={styles.plaque} />

        <View style={styles.modeList}>
          {MODES.map((item) => {
            const isSelected = gameMode === item.mode;
            return (
              <Pressable
                key={item.mode}
                onPress={() => handleSelectMode(item.mode)}
                style={[
                  styles.modeCard,
                  { borderColor: isSelected ? item.color : '#354354' },
                  isSelected && { backgroundColor: 'rgba(25, 38, 52, 0.96)' },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Image source={item.icon} style={styles.modeIcon} resizeMode="contain" />
                  <View style={styles.titleCol}>
                    <Text style={[pqTypography.h2, { color: isSelected ? item.color : '#FFFFFF' }]}>
                      {item.title}
                    </Text>
                    <Text style={[pqTypography.caption, { color: pqColors.textGold }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                </View>

                <Text style={[pqTypography.body, styles.desc]}>{item.description}</Text>

                <View style={styles.selectRow}>
                  <View
                    style={[
                      styles.selectIndicator,
                      isSelected && { backgroundColor: item.color, borderColor: item.color },
                    ]}
                  >
                    <Text style={styles.selectText}>{isSelected ? 'ACTIVE' : 'SELECT'}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <BottomNavigation currentScreen={currentScreen} onNavigate={setScreen} />
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: pqSpacing.base,
    paddingBottom: 110,
    alignItems: 'center',
  },
  plaque: {
    marginBottom: pqSpacing.md,
  },
  modeList: {
    width: '100%',
    gap: pqSpacing.md,
  },
  modeCard: {
    backgroundColor: 'rgba(18, 25, 35, 0.92)',
    borderRadius: pqSpacing.radiusLg,
    borderWidth: 2,
    borderBottomWidth: 5,
    padding: pqSpacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pqSpacing.xs,
  },
  modeIcon: {
    width: 64,
    height: 48,
    marginRight: pqSpacing.md,
  },
  titleCol: {
    flex: 1,
  },
  desc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: pqSpacing.xs,
    marginBottom: pqSpacing.sm,
  },
  selectRow: {
    alignItems: 'flex-end',
  },
  selectIndicator: {
    paddingHorizontal: pqSpacing.md,
    paddingVertical: 4,
    borderRadius: pqSpacing.radiusPill,
    borderWidth: 1.5,
    borderColor: '#4A5B6E',
    backgroundColor: 'rgba(25, 35, 48, 0.8)',
  },
  selectText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});
