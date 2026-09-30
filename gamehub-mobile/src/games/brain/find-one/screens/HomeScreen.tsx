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
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FOColors, FORadius, FOSpacing, FOTypography } from '../theme';
import {
  GameLogo,
  GameButton,
  PandaIllustration,
  FoxIllustration,
  CategoryCard,
  StatCard,
  CategorySelectionModal,
  LeaderboardModal,
  ProfileEditModal,
  CoinRewardModal,
  SettingsModal,
} from '../components';
import { useFindOneStore } from '../store/findOneStore';
import { CATEGORIES_DATA } from '../logic';
import type { CategoryType } from '../types';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Modals state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCoinsModal, setShowCoinsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Interactive 4x4 Mini Puzzle on Home Screen
  const [demoPairIndex, setDemoPairIndex] = useState(0);
  const [demoOddIndex, setDemoOddIndex] = useState(9);
  const [foundSpotToast, setFoundSpotToast] = useState(false);

  const demoPairs = [
    { base: '🐼', odd: '🦊', label: 'Fox in Pandas!' },
    { base: '🐻', odd: '🐨', label: 'Koala in Bears!' },
    { base: '🐸', odd: '🐢', label: 'Turtle in Frogs!' },
    { base: '🦆', odd: '🐥', label: 'Chick in Ducks!' },
    { base: '🍔', odd: '🍩', label: 'Donut in Burgers!' },
  ];

  const currentDemo = demoPairs[demoPairIndex % demoPairs.length];

  const handleDemoTap = (idx: number) => {
    if (idx === demoOddIndex) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setFoundSpotToast(true);
      setTimeout(() => setFoundSpotToast(false), 1200);
      setDemoPairIndex((prev) => prev + 1);
      setDemoOddIndex(Math.floor(Math.random() * 16));
    } else {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 20,
    16
  );
  const bottomInset = Math.max(insets.bottom, 16);

  const {
    stats,
    profile,
    selectedCategory,
    setCategory,
    startGame,
    setScreen,
  } = useFindOneStore();

  const demoTiles = Array.from({ length: 16 }).map((_, idx) => ({
    id: idx,
    emoji: idx === demoOddIndex ? currentDemo.odd : currentDemo.base,
    isOdd: idx === demoOddIndex,
  }));

  return (
    <LinearGradient
      colors={['#081729', '#05101C', '#02070D']}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topInset + 6,
            paddingBottom: bottomInset + 32,
          },
        ]}
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

            {/* Profile Tap -> Opens ProfileEditModal */}
            <Pressable
              onPress={() => setShowProfileModal(true)}
              style={styles.profileClickArea}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
            >
              {profile.avatar && profile.avatar.startsWith('http') ? (
                <Image source={{ uri: profile.avatar }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarEmojiHolder}>
                  <Text style={{ fontSize: 24 }}>{profile.avatar || '🐼'}</Text>
                </View>
              )}
              <View>
                <Text style={styles.greetingText}>Hi there!</Text>
                <View style={styles.nameRow}>
                  <Text style={styles.playerName}>{profile.name}</Text>
                  <Text style={styles.editIcon}>✏️</Text>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Right Badges: Coins, Rank, Settings */}
          <View style={styles.rightBadges}>
            {/* Coins -> Opens CoinRewardModal */}
            <Pressable
              onPress={() => setShowCoinsModal(true)}
              style={({ pressed }) => [styles.coinPill, pressed && { opacity: 0.8 }]}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={styles.pillIcon}>⭐</Text>
              <Text style={styles.pillText}>{profile.coins}</Text>
              <Text style={styles.pillPlus}>+</Text>
            </Pressable>

            {/* Rank -> Opens LeaderboardModal */}
            <Pressable
              onPress={() => setShowLeaderboardModal(true)}
              style={({ pressed }) => [styles.rankPill, pressed && { opacity: 0.8 }]}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={styles.pillIcon}>👑</Text>
              <Text style={styles.pillText}>#{profile.rank}</Text>
            </Pressable>

            {/* Settings Icon -> Opens SettingsModal */}
            <Pressable
              onPress={() => setShowSettingsModal(true)}
              style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.8 }]}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
            >
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
              <Text style={styles.bubbleText}>
                {foundSpotToast ? 'Spot Found! 🎯' : `${currentDemo.label} ✨`}
              </Text>
            </View>
          </View>

          {/* 4x4 Mini Interactive Preview Grid */}
          <View style={styles.miniGridWrapper}>
            <View style={styles.miniGrid}>
              {demoTiles.map((t) => (
                <Pressable
                  key={t.id}
                  onPress={() => handleDemoTap(t.id)}
                  style={({ pressed }) => [
                    styles.miniTile,
                    t.isOdd && styles.miniTileOdd,
                    pressed && { transform: [{ scale: 0.88 }] },
                  ]}
                >
                  <Text style={styles.miniTileEmoji}>{t.emoji}</Text>
                </Pressable>
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
            onPress={() => setShowLeaderboardModal(true)}
            style={styles.subBtn}
          />
        </View>

        {/* ── Categories Section ── */}
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesHeader}>
            <Text style={styles.categoriesTitle}>CATEGORIES</Text>
            <Pressable
              onPress={() => setShowCategoryModal(true)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={({ pressed }) => pressed && { opacity: 0.7 }}
            >
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

      {/* Category Selection Modal */}
      <CategorySelectionModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      />

      {/* Leaderboard & Match History Modal */}
      <LeaderboardModal
        visible={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Coin Reward Modal */}
      <CoinRewardModal
        visible={showCoinsModal}
        onClose={() => setShowCoinsModal(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
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
    gap: 4,
  },
  profileClickArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarEmojiHolder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0E2845',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFC928',
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
