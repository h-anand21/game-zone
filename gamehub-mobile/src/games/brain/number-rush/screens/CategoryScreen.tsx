// ============================================================
// Number Rush — Screen 04: CATEGORY SCREEN (Observe Jungle Modes Reference)
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, BottomNavBar, MascotIllustration } from '../components';
import { CATEGORY_CONFIGS } from '../data';
import type { CategoryId, GameModeId } from '../types';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

interface CategoryModeItem {
  id: GameModeId;
  name: string;
  desc: string;
  icon: string;
  tag: string;
  bestScore: number;
  available: boolean;
}

const OBSERVE_MODES: CategoryModeItem[] = [
  {
    id: 'animal-count',
    name: 'Animal Count',
    desc: 'Spot and count target wildlife peeking through lush jungle canopy.',
    icon: '🐯',
    tag: 'FEATURED',
    bestScore: 2840,
    available: true,
  },
  {
    id: 'emoji-count',
    name: 'Emoji Count',
    desc: 'High-speed visual search across colorful emoji matrices.',
    icon: '😎',
    tag: 'POPULAR',
    bestScore: 1950,
    available: true,
  },
  {
    id: 'mixed-rush',
    name: 'Human World',
    desc: 'Scan busy cartoon streets for specific people and occupations.',
    icon: '🧑‍🤝‍🧑',
    tag: 'NEW',
    bestScore: 1200,
    available: true,
  },
  {
    id: 'mixed-rush',
    name: 'World Count',
    desc: 'Identify world monuments, flags, and travel landmarks.',
    icon: '🌍',
    tag: 'DISCOVERY',
    bestScore: 840,
    available: true,
  },
  {
    id: 'quick-rush',
    name: 'Color Numbers',
    desc: 'Spot numbers matching specific glowing neon background hues.',
    icon: '🎨',
    tag: 'REFLEX',
    bestScore: 2100,
    available: true,
  },
  {
    id: 'number-box',
    name: 'Find Different',
    desc: 'Spot the single odd tile hiding in a sea of deceptive clones.',
    icon: '🔍',
    tag: 'HARD',
    bestScore: 1650,
    available: true,
  },
];

export const CategoryScreen: React.FC = () => {
  const { setScreen, selectedCategory, setSelectedCategory, setSelectedMode } =
    useNumberRushStore();

  const [activeTab, setActiveTab] = useState<CategoryId>(selectedCategory || 'observe');

  const activeCategoryConfig =
    CATEGORY_CONFIGS.find((c) => c.id === activeTab) || CATEGORY_CONFIGS[2];

  const handleModeTap = (mode: CategoryModeItem) => {
    setSelectedMode(mode.id);
    setScreen('mode-preview');
  };

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD showBack onBackPress={() => setScreen('mode-hub')} title="GAME MODES" />

      {/* 3. Category Tab Bar */}
      <View style={styles.tabBar}>
        {CATEGORY_CONFIGS.map((cat) => {
          const isSelected = activeTab === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => {
                setActiveTab(cat.id);
                setSelectedCategory(cat.id);
              }}
              style={[
                styles.tabItem,
                isSelected && {
                  backgroundColor: cat.color,
                  borderColor: '#FFFFFF',
                },
              ]}
            >
              <Text style={styles.tabIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  isSelected && styles.activeTabLabel,
                ]}
              >
                {cat.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 4. Category Hero Banner with Mascot */}
        <View style={[styles.heroCard, { borderColor: activeCategoryConfig.color }]}>
          <View style={styles.heroLeft}>
            <View
              style={[
                styles.categoryPill,
                { backgroundColor: activeCategoryConfig.color },
              ]}
            >
              <Text style={styles.categoryPillText}>
                {activeCategoryConfig.name} ARENA
              </Text>
            </View>
            <Text style={styles.heroTitle}>Visual Perception & Reflexes</Text>
            <Text style={styles.heroDesc}>
              {activeCategoryConfig.subtitle}. Scan scenes, spot targets, and tap the right numbers!
            </Text>
          </View>

          <View style={styles.heroMascotBox}>
            <MascotIllustration size={105} character="tiger" mood="happy" showAura={false} />
          </View>
        </View>

        {/* 5. Mode Cards List */}
        <Text style={styles.sectionTitle}>SELECT CHALLENGE</Text>

        <View style={styles.modesList}>
          {OBSERVE_MODES.map((mode, index) => (
            <Pressable
              key={`${mode.name}-${index}`}
              onPress={() => handleModeTap(mode)}
              style={({ pressed }) => [
                styles.modeCard,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.cardIconBox}>
                <Text style={styles.cardEmoji}>{mode.icon}</Text>
              </View>

              <View style={styles.cardInfo}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardName}>{mode.name}</Text>
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{mode.tag}</Text>
                  </View>
                </View>

                <Text style={styles.cardDesc} numberOfLines={2}>
                  {mode.desc}
                </Text>

                <View style={styles.cardBottomRow}>
                  <Text style={styles.bestScoreText}>
                    ⭐ BEST: {mode.bestScore.toLocaleString()} PTS
                  </Text>
                  <View style={styles.playArrowPill}>
                    <Text style={styles.playArrowText}>PLAY ▶</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
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
    ...StyleSheet.absoluteFillObject,
  },
  darkVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 18, 13, 0.65)',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(7, 27, 52, 0.75)',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  tabLabel: {
    color: '#8CA0BA',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  activeTabLabel: {
    color: '#071324',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  heroCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(7, 27, 52, 0.9)',
    borderRadius: 22,
    borderWidth: 2,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 8,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  categoryPillText: {
    color: '#071324',
    fontSize: 9,
    fontWeight: '900',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  heroDesc: {
    color: '#D8E2DD',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },
  heroMascotBox: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  modesList: {
    gap: 12,
  },
  modeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(7, 27, 52, 0.88)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  cardIconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  tagBadge: {
    backgroundColor: 'rgba(46, 213, 115, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2ED573',
  },
  tagText: {
    color: '#2ED573',
    fontSize: 8,
    fontWeight: '900',
  },
  cardDesc: {
    color: '#8CA0BA',
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 6,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestScoreText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '800',
  },
  playArrowPill: {
    backgroundColor: '#2ED573',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  playArrowText: {
    color: '#04160D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
