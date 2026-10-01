// ============================================================
// Number Rush — Screen 03: MODE HUB (Choose Your Rush Game Hub Reference)
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
import { CATEGORY_CONFIGS } from '../data';
import type { CategoryId } from '../types';

const { width } = Dimensions.get('window');
const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

export const ModeHubScreen: React.FC = () => {
  const { setScreen, setSelectedCategory } = useNumberRushStore();

  const handleCategorySelect = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
    setScreen('category');
  };

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
          <Text style={styles.hubTitle}>4 ARENAS OF MASTERY</Text>
        </View>

        {/* 3. 2x2 Category Selection Grid */}
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
              {/* Card Header Pill */}
              <View style={[styles.cardHeader, { backgroundColor: cat.color }]}>
                <Text style={styles.modeCountBadge}>
                  {cat.modes.length} MODES
                </Text>
                <Text style={styles.cardCrown}>★</Text>
              </View>

              {/* Card Body */}
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

                {/* Enter Button Pill */}
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
    marginBottom: 16,
    paddingVertical: 4,
  },
  hubSub: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 2,
  },
  hubTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  categoryCard: {
    width: (width - 46) / 2,
    backgroundColor: 'rgba(7, 27, 52, 0.88)',
    borderRadius: 22,
    borderWidth: 2.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modeCountBadge: {
    color: '#071324',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardCrown: {
    color: '#071324',
    fontSize: 10,
    fontWeight: '900',
  },
  cardBody: {
    padding: 14,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  catIcon: {
    fontSize: 30,
  },
  catName: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  catSubtitle: {
    color: '#8CA0BA',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
    height: 28,
    marginBottom: 10,
  },
  enterPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  enterText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(11, 40, 72, 0.8)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFC107',
    padding: 14,
    marginTop: 20,
    alignItems: 'center',
  },
  tipLight: {
    fontSize: 26,
    marginRight: 12,
  },
  tipTextCol: {
    flex: 1,
  },
  tipTitle: {
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 2,
  },
  tipDesc: {
    color: '#D8E2DD',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },
});
