// ============================================================
// Number Rush — Mode Hub & Category Select Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, BottomNavBar } from '../components';
import { CATEGORY_CONFIGS, MODE_CONFIGS } from '../data';
import type { CategoryId, GameModeId } from '../types';

export const ModeHubScreen: React.FC = () => {
  const { setScreen, startCountdown, setSelectedMode } = useNumberRushStore();
  const [activeCategory, setActiveCategory] = useState<CategoryId>('observe');

  const selectedCategoryConfig = CATEGORY_CONFIGS.find(
    (c) => c.id === activeCategory
  );

  const availableModes = selectedCategoryConfig?.modes.map(
    (modeId) => MODE_CONFIGS[modeId]
  ) || [];

  const handleLaunchMode = (modeId: GameModeId) => {
    setSelectedMode(modeId);
    startCountdown(modeId, 'easy');
  };

  return (
    <View style={styles.container}>
      <HeaderHUD showBack onBackPress={() => setScreen('home')} title="MODE HUB" />

      {/* Category Pills Tab Row */}
      <View style={styles.categoryTabs}>
        {CATEGORY_CONFIGS.map((cat) => {
          const isSelected = activeCategory === cat.id;

          return (
            <Pressable
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              style={[
                styles.categoryTab,
                isSelected && {
                  backgroundColor: cat.color,
                  borderColor: '#FFFFFF',
                },
              ]}
            >
              <Text style={styles.catTabIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.catTabLabel,
                  isSelected && styles.activeCatTabLabel,
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
        {/* Category Header Banner */}
        {selectedCategoryConfig && (
          <View
            style={[
              styles.categoryBanner,
              { borderColor: selectedCategoryConfig.color },
            ]}
          >
            <View style={styles.bannerRow}>
              <Text style={styles.bannerIcon}>{selectedCategoryConfig.icon}</Text>
              <View style={styles.bannerTextCol}>
                <Text style={styles.bannerTitle}>
                  {selectedCategoryConfig.name} ARENA
                </Text>
                <Text style={styles.bannerSubtitle}>
                  {selectedCategoryConfig.subtitle}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Modes in Category */}
        <Text style={styles.modesSectionTitle}>AVAILABLE CHALLENGES</Text>

        <View style={styles.modesList}>
          {availableModes.map((mode) => (
            <View
              key={mode.id}
              style={[styles.modeCard, { borderColor: mode.themeColor }]}
            >
              <View style={styles.modeCardTop}>
                <View style={styles.modeIconWrapper}>
                  <Text style={styles.modeIconBig}>{mode.icon}</Text>
                </View>

                <View style={styles.modeInfo}>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: mode.themeColor },
                      ]}
                    >
                      <Text style={styles.categoryBadgeText}>{mode.badge}</Text>
                    </View>
                    <Text style={styles.starReq}>⭐ READY</Text>
                  </View>

                  <Text style={styles.modeTitle}>{mode.name}</Text>
                  <Text style={styles.modeDesc}>{mode.description}</Text>
                </View>
              </View>

              <View style={styles.cardActionRow}>
                <Pressable
                  onPress={() => setScreen('how-to-play')}
                  style={styles.tutorialBtn}
                >
                  <Text style={styles.tutorialText}>HOW TO PLAY 📖</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleLaunchMode(mode.id)}
                  style={[
                    styles.startRushBtn,
                    { backgroundColor: mode.themeColor },
                  ]}
                >
                  <Text style={styles.startRushText}>RUSH ▶</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NRTheme.colors.bgDark,
  },
  categoryTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  categoryTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: NRTheme.radius.md,
    backgroundColor: '#0E223D',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  catTabIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  catTabLabel: {
    color: '#8CA0BA',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  activeCatTabLabel: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  categoryBanner: {
    backgroundColor: '#0D2442',
    borderRadius: NRTheme.radius.xl,
    padding: 16,
    borderWidth: 2,
    marginBottom: 16,
    ...NRTheme.shadows.card,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bannerSubtitle: {
    color: '#8CA0BA',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  modesSectionTitle: {
    color: '#8CA0BA',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 12,
  },
  modesList: {
    gap: 14,
  },
  modeCard: {
    backgroundColor: '#0D1E36',
    borderRadius: NRTheme.radius.xl,
    borderWidth: 2,
    padding: 16,
    ...NRTheme.shadows.card,
  },
  modeCardTop: {
    flexDirection: 'row',
  },
  modeIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#18365D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    marginRight: 14,
  },
  modeIconBig: {
    fontSize: 32,
  },
  modeInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  starReq: {
    color: '#2ED573',
    fontSize: 10,
    fontWeight: '900',
  },
  modeTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  modeDesc: {
    color: '#8CA0BA',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  tutorialBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tutorialText: {
    color: '#1E90FF',
    fontSize: 12,
    fontWeight: '800',
  },
  startRushBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: NRTheme.radius.md,
    ...NRTheme.shadows.card,
  },
  startRushText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
