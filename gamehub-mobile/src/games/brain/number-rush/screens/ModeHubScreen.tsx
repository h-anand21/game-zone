// ============================================================
// Number Rush — Screen 03: MODE HUB (Choose Your Rush Game Hub)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, BottomNavBar } from '../components';
import { CATEGORY_CONFIGS, MODE_CONFIGS } from '../data';
import type { CategoryId, GameModeId } from '../types';

const { width } = Dimensions.get('window');
const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const ModeHubScreen: React.FC = () => {
  const { setScreen, setSelectedCategory, setSelectedMode, selectedMode } = useNumberRushStore();

  const handleCategorySelect = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
    setScreen('category');
  };

  const handleDirectModeSelect = (modeId: GameModeId) => {
    setSelectedMode(modeId);
    setScreen('mode-preview');
  };

  const playableModes = [
    MODE_CONFIGS['animal-count'],
    MODE_CONFIGS['quick-rush'],
    MODE_CONFIGS['emoji-count'],
    MODE_CONFIGS['number-box'],
    MODE_CONFIGS['mixed-rush'],
  ];

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="CHOOSE YOUR RUSH" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Tagline */}
        <View style={styles.hubBanner}>
          <Text style={styles.hubSub}>SELECT YOUR BRAIN DISCIPLINE</Text>
          <Text style={styles.hubTitle}>ALL 5 GAME MODES</Text>
        </View>

        {/* 3. Direct Play Modes List */}
        <View style={styles.directModesList}>
          {playableModes.map((mode) => (
            <Pressable
              key={mode.id}
              onPress={() => handleDirectModeSelect(mode.id)}
              style={({ pressed }) => [
                styles.directModeCard,
                { borderColor: mode.themeColor },
                selectedMode === mode.id && styles.directModeActive,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={[styles.directIconBox, { backgroundColor: mode.themeColor + '25', borderColor: mode.themeColor }]}>
                <Text style={styles.directIcon}>{mode.icon}</Text>
              </View>

              <View style={styles.directInfo}>
                <View style={styles.badgeRow}>
                  <Text style={[styles.directBadge, { color: mode.themeColor }]}>{mode.badge}</Text>
                  {selectedMode === mode.id && (
                    <Text style={styles.activeCheck}>✓ CURRENT</Text>
                  )}
                </View>
                <Text style={styles.directName}>{mode.name}</Text>
                <Text style={styles.directDesc} numberOfLines={2}>{mode.description}</Text>
              </View>

              <View style={[styles.directPlayPill, { backgroundColor: mode.themeColor }]}>
                <Text style={styles.directPlayText}>PLAY ▶</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* 4. Discipline Arenas Section */}
        <View style={styles.arenasHeaderRow}>
          <Text style={styles.arenasTitle}>4 DISCIPLINE ARENAS</Text>
          <Text style={styles.arenasSub}>EXPLORE BY SKILL</Text>
        </View>

        {/* 2x2 Category Selection Grid */}
        <View style={styles.categoryGrid}>
          {CATEGORY_CONFIGS.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => handleCategorySelect(cat.id)}
              style={({ pressed }) => [
                styles.categoryCard,
                { borderColor: cat.color },
                pressed && styles.cardPressed,
              ]}
            >
              <View style={[styles.cardHeader, { backgroundColor: cat.color }]}>
                <Text style={styles.modeCountBadge}>
                  {cat.modes.length} MODES
                </Text>
                <Text style={styles.cardCrown}>★</Text>
              </View>

              <View style={styles.cardBody}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: cat.color + '25', borderColor: cat.color },
                  ]}
                >
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                </View>

                <Text style={[styles.catName, { color: cat.color }]}>
                  {cat.name}
                </Text>

                <Text style={styles.catSubtitle} numberOfLines={2}>
                  {cat.subtitle}
                </Text>

                <View
                  style={[
                    styles.enterPill,
                    { borderColor: cat.color, backgroundColor: cat.color + '20' },
                  ]}
                >
                  <Text style={[styles.enterText, { color: cat.color }]}>
                    EXPLORE →
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Quick Training Tip Card */}
        <View style={styles.tipCard}>
          <Text style={styles.tipLight}>💡</Text>
          <View style={styles.tipTextCol}>
            <Text style={styles.tipTitle}>PRO RUSH TIP</Text>
            <Text style={styles.tipDesc}>
              Rotating between Calculation (Rush) and Observation (Observe) trains both brain hemispheres for higher combo streaks!
            </Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Global Bottom Navigation */}
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06120D',
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
  },
  darkVignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 18, 13, 0.65)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  hubBanner: {
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 4,
  },
  hubSub: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 2,
  },
  hubTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  directModesList: {
    gap: 10,
    marginBottom: 20,
  },
  directModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(43, 20, 8, 0.95)',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#7A3F1D',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  directModeActive: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(53, 26, 12, 0.98)',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  directIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  directIcon: {
    fontSize: 26,
  },
  directInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  directBadge: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  activeCheck: {
    color: '#2ED573',
    fontSize: 8,
    fontWeight: '900',
    backgroundColor: 'rgba(46, 213, 115, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  directName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  directDesc: {
    color: '#A0B2C6',
    fontSize: 10,
    lineHeight: 14,
  },
  directPlayPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  directPlayText: {
    color: '#04160D',
    fontSize: 11,
    fontWeight: '900',
  },
  arenasHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  arenasTitle: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  arenasSub: {
    color: '#8CA0BA',
    fontSize: 9,
    fontWeight: '700',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  categoryCard: {
    width: (width - 44) / 2,
    backgroundColor: 'rgba(43, 20, 8, 0.92)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFC107',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modeCountBadge: {
    color: '#071324',
    fontSize: 8,
    fontWeight: '900',
  },
  cardCrown: {
    color: '#071324',
    fontSize: 10,
  },
  cardBody: {
    padding: 12,
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  catIcon: {
    fontSize: 22,
  },
  catName: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 2,
  },
  catSubtitle: {
    color: '#8CA0BA',
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 12,
    height: 24,
  },
  enterPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  enterText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFC107',
    padding: 12,
    marginBottom: 8,
  },
  tipLight: {
    fontSize: 24,
    marginRight: 10,
  },
  tipTextCol: {
    flex: 1,
  },
  tipTitle: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 2,
  },
  tipDesc: {
    color: '#D8E2DD',
    fontSize: 10,
    lineHeight: 14,
  },
});
