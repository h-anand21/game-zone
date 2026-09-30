// ============================================================
// Find One — Screen 1: Home Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { FOColors, FORadius, FOSpacing, FOTypography } from '../theme';
import {
  GameLogo,
  GameButton,
  PandaIllustration,
  FoxIllustration,
  CategoryCard,
  StatCard,
} from '../components';
import { useFindOneStore } from '../store/findOneStore';
import { CATEGORIES_DATA } from '../logic';
import type { CategoryType } from '../types';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const {
    stats,
    profile,
    selectedCategory,
    setCategory,
    startGame,
    setScreen,
  } = useFindOneStore();

  // Demo 4x4 example grid with 15 Pandas and 1 Fox
  const demoTiles = Array.from({ length: 16 }).map((_, idx) => ({
    id: idx,
    emoji: idx === 9 ? '🦊' : '🐼',
    isOdd: idx === 9,
  }));

  return (
    <LinearGradient
      colors={['#081729', '#05101C', '#02070D']}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Top Header Row ── */}
        <View style={styles.headerRow}>
          {/* Player Profile & Exit */}
          <View style={styles.profileBadge}>
            <Pressable
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/');
                }
              }}
              style={styles.backBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Image source={{ uri: profile.avatar }} style={styles.avatarImg} />
            <View>
              <Text style={styles.greetingText}>Hi there!</Text>
              <View style={styles.nameRow}>
                <Text style={styles.playerName}>{profile.name}</Text>
                <Text style={styles.editIcon}>✏️</Text>
              </View>
            </View>
          </View>

          {/* Right Badges: Coins, Rank, Settings */}
          <View style={styles.rightBadges}>
            {/* Coins */}
            <View style={styles.coinPill}>
              <Text style={styles.pillIcon}>⭐</Text>
              <Text style={styles.pillText}>{profile.coins}</Text>
              <Text style={styles.pillPlus}>+</Text>
            </View>

            {/* Rank */}
            <View style={styles.rankPill}>
              <Text style={styles.pillIcon}>👑</Text>
              <Text style={styles.pillText}>{profile.rank}</Text>
            </View>

            {/* Settings Icon */}
            <Pressable style={styles.settingsBtn}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Mascots + Logo Section ── */}
        <View style={styles.logoSection}>
          {/* Peeking Panda on Left */}
          <View style={styles.mascotLeft}>
            <PandaIllustration mood="home" size={120} />
          </View>

          {/* Peeking Winking Fox on Right */}
          <View style={styles.mascotRight}>
            <FoxIllustration mood="home" size={115} />
          </View>

          {/* 3D FIND ONE Logo */}
          <GameLogo subtitle="Spot the different one!" />
        </View>

        {/* ── Example 4x4 Card ── */}
        <LinearGradient
          colors={['#102742', '#0A1B2E', '#06121E']}
          style={styles.exampleCard}
        >
          {/* Card Top Row with Callouts */}
          <View style={styles.exampleTopRow}>
            <View style={styles.exampleHeaderLeft}>
              <Text style={styles.exampleTag}>EXAMPLE</Text>
              <Text style={styles.exampleTitle}>Can you find the odd one?</Text>
            </View>

            <View style={styles.exampleBubbleRight}>
              <Text style={styles.bubbleText}>Just one is different! ✨</Text>
            </View>
          </View>

          {/* 4x4 Mini Preview Grid */}
          <View style={styles.miniGridWrapper}>
            <View style={styles.miniGrid}>
              {demoTiles.map((t) => (
                <View
                  key={t.id}
                  style={[
                    styles.miniTile,
                    t.isOdd && styles.miniTileOdd,
                  ]}
                >
                  <Text style={styles.miniTileEmoji}>{t.emoji}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 3 Best Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statEmoji}>🏆</Text>
              <View>
                <Text style={styles.statLabelText}>BEST SCORE</Text>
                <Text style={styles.statValueText}>{stats.bestScore}</Text>
              </View>
            </View>

            <View style={styles.statPill}>
              <Text style={styles.statEmoji}>⏱️</Text>
              <View>
                <Text style={styles.statLabelText}>BEST TIME</Text>
                <Text style={styles.statValueText}>
                  {stats.bestTimeSeconds > 0 ? `${stats.bestTimeSeconds}s` : '0.0s'}
                </Text>
              </View>
            </View>

            <View style={styles.statPill}>
              <Text style={styles.statEmoji}>📊</Text>
              <View>
                <Text style={styles.statLabelText}>BEST STREAK</Text>
                <Text style={styles.statValueText}>{stats.bestStreak}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── Main Action: PLAY NOW Button ── */}
        <View style={styles.ctaWrapper}>
          <GameButton
            title="PLAY NOW"
            size="lg"
            variant="gold"
            icon={<Text style={{ fontSize: 24 }}>▶</Text>}
            onPress={startGame}
          />
        </View>

        {/* ── Secondary Action Buttons ── */}
        <View style={styles.secondaryRow}>
          <GameButton
            title="HOW TO PLAY"
            variant="purple"
            size="sm"
            icon={<Text style={{ fontSize: 16 }}>📖</Text>}
            rightIcon={<Text style={{ fontSize: 16, color: '#FFFFFF' }}>›</Text>}
            onPress={() => setScreen('how-to-play')}
            style={styles.subBtn}
          />

          <GameButton
            title="LEADERBOARD"
            variant="blue"
            size="sm"
            icon={<Text style={{ fontSize: 16 }}>📊</Text>}
            rightIcon={<Text style={{ fontSize: 16, color: '#FFFFFF' }}>›</Text>}
            onPress={() => {}}
            style={styles.subBtn}
          />
        </View>

        {/* ── Categories Section ── */}
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesHeader}>
            <Text style={styles.categoriesTitle}>CATEGORIES</Text>
            <Pressable>
              <Text style={styles.categoriesMore}>More ›</Text>
            </Pressable>
          </View>

          <View style={styles.categoriesRow}>
            {CATEGORIES_DATA.map((cat) => (
              <CategoryCard
                key={cat.id}
                id={cat.id}
                name={cat.name}
                icon={cat.icon}
                isSelected={selectedCategory === cat.id}
                onPress={() => setCategory(cat.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: FOSpacing.md,
    paddingTop: FOSpacing.lg,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: FOSpacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0E2238',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1D3B5C',
    marginRight: 4,
  },
  backArrow: {
    fontSize: 20,
    color: '#E0EEF8',
    fontWeight: '700',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFC928',
  },
  greetingText: {
    fontSize: 11,
    fontWeight: '700',
    color: FOColors.textMuted,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  editIcon: {
    fontSize: 12,
  },
  rightBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F263F',
    borderRadius: FORadius.round,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: '#1F4770',
    gap: 5,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F263F',
    borderRadius: FORadius.round,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: '#1F4770',
    gap: 5,
  },
  pillIcon: {
    fontSize: 14,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  pillPlus: {
    fontSize: 13,
    fontWeight: '900',
    color: FOColors.primary,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F263F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1F4770',
  },
  settingsIcon: {
    fontSize: 16,
  },
  logoSection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 16,
    marginBottom: FOSpacing.md,
  },
  mascotLeft: {
    position: 'absolute',
    left: -12,
    top: -12,
    zIndex: 1,
  },
  mascotRight: {
    position: 'absolute',
    right: -12,
    top: -10,
    zIndex: 1,
  },
  exampleCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: FORadius.xl,
    padding: FOSpacing.md,
    borderWidth: 2,
    borderColor: '#1C426B',
    borderTopColor: '#2C629E',
    borderBottomWidth: 5,
    borderBottomColor: '#05111E',
    marginBottom: FOSpacing.md,
  },
  exampleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exampleHeaderLeft: {
    gap: 2,
  },
  exampleTag: {
    fontSize: 11,
    fontWeight: '900',
    color: FOColors.primary,
    letterSpacing: 0.8,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  exampleBubbleRight: {
    backgroundColor: '#1C3A5E',
    borderRadius: FORadius.round,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#2D588A',
  },
  bubbleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8EDBFF',
  },
  miniGridWrapper: {
    alignItems: 'center',
    marginVertical: 6,
  },
  miniGrid: {
    width: 200,
    height: 200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 6,
    borderRadius: FORadius.md,
  },
  miniTile: {
    width: 41,
    height: 41,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#B0BFCF',
  },
  miniTileOdd: {
    backgroundColor: '#FFEFA8',
    borderBottomColor: '#D49200',
    borderWidth: 1.5,
    borderColor: '#FFC928',
  },
  miniTileEmoji: {
    fontSize: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statEmoji: {
    fontSize: 18,
  },
  statLabelText: {
    fontSize: 9,
    fontWeight: '800',
    color: FOColors.textMuted,
    letterSpacing: 0.5,
  },
  statValueText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  ctaWrapper: {
    width: '100%',
    maxWidth: 340,
    marginVertical: FOSpacing.xs,
  },
  secondaryRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 340,
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 6,
    marginBottom: FOSpacing.lg,
  },
  subBtn: {
    flex: 1,
  },
  categoriesSection: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0D2035',
    borderRadius: FORadius.xl,
    padding: FOSpacing.md,
    borderWidth: 1.5,
    borderColor: '#193A5E',
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoriesTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: FOColors.textMuted,
    letterSpacing: 0.8,
  },
  categoriesMore: {
    fontSize: 12,
    fontWeight: '800',
    color: FOColors.primary,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
