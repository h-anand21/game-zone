// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Screen 02: Main Menu Home
// Grand fantasy kingdom portal with chunky dimensional game buttons
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polygon } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import { FantasyBackground } from '../components/ui/FantasyBackground';
import { CurrencyBar } from '../components/ui/CurrencyBar';
import { GameButton } from '../components/ui/GameButton';
import { useGameStore } from '../store/gameStore';
import { ArrowHaptics } from '../utils/haptics';
import type { ScreenId } from '../game/types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onPlayCurrentLevel: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onPlayCurrentLevel,
}) => {
  const insets = useSafeAreaInsets();
  const unlockedLevels = useGameStore((state) => state.unlockedLevels);

  return (
    <FantasyBackground>
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
        {/* Top Status Bar: Settings & Currencies */}
        <View style={styles.topRow}>
          <Pressable
            onPress={() => {
              ArrowHaptics.buttonPress();
              onNavigate('settings');
            }}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.btnPressed]}
            hitSlop={8}
            accessibilityLabel="Settings"
          >
            <LinearGradient colors={['#844319', '#4D240E']} style={styles.iconBtnGrad}>
              <Text style={styles.iconEmoji}>⚙️</Text>
            </LinearGradient>
          </Pressable>

          <CurrencyBar onOpenShop={() => onNavigate('shop')} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 20, 32) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Grand Kingdom Hero Logo */}
          <View style={styles.heroSection}>
            <View style={styles.emblemBadge}>
              <Svg width={90} height={90} viewBox="0 0 120 120">
                <Path
                  d="M 20 40 L 60 40 L 60 70 L 90 70"
                  stroke={COLORS.blue}
                  strokeWidth={11}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <Polygon points="104,70 88,58 88,82" fill={COLORS.blue} />

                <Path
                  d="M 80 100 L 80 85 L 45 85 L 45 30"
                  stroke={COLORS.pink}
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <Polygon points="45,16 35,32 55,32" fill={COLORS.pink} />
              </Svg>
            </View>

            <Text style={styles.titleMain}>ARROW KINGDOM</Text>
            <Text style={styles.subtitleMain}>SLIDE ESCAPE</Text>

            <View style={styles.realmPill}>
              <Text style={styles.realmText}>🏰 REALM OF RUNIC ARROWS</Text>
            </View>
          </View>

          {/* Primary Big Green CTA: PLAY */}
          <View style={styles.primaryActionSection}>
            <GameButton
              title={`▶ PLAY LEVEL ${unlockedLevels}`}
              variant="green"
              size="large"
              onPress={onPlayCurrentLevel}
              style={styles.playBtn}
            />
          </View>

          {/* Secondary Mode Cards (Levels Map & Daily Puzzle) */}
          <View style={styles.modesRow}>
            {/* World Map Card */}
            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onNavigate('world-map');
              }}
              style={({ pressed }) => [styles.modeCard, pressed && styles.cardPressed]}
            >
              <LinearGradient colors={['#10395C', '#071F36']} style={styles.modeCardGrad}>
                <Text style={styles.modeCardIcon}>🗺️</Text>
                <Text style={styles.modeCardTitle}>WORLD MAP</Text>
                <Text style={styles.modeCardSub}>{unlockedLevels}/15 UNLOCKED</Text>
              </LinearGradient>
            </Pressable>

            {/* Daily Puzzle Card */}
            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onNavigate('daily-puzzle');
              }}
              style={({ pressed }) => [styles.modeCard, pressed && styles.cardPressed]}
            >
              <LinearGradient colors={['#2E1022', '#14050F']} style={[styles.modeCardGrad, styles.dailyCardGrad]}>
                <Text style={styles.modeCardIcon}>📅</Text>
                <Text style={[styles.modeCardTitle, { color: COLORS.pink }]}>DAILY PUZZLE</Text>
                <Text style={styles.modeCardSub}>BONUS CHEST</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Bottom Feature Tabs Row: Themes, Achievements, Shop, Tutorial */}
          <View style={styles.featuresRow}>
            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onNavigate('themes');
              }}
              style={({ pressed }) => [styles.featBtn, pressed && styles.cardPressed]}
            >
              <LinearGradient colors={['#10395C', '#0A253E']} style={styles.featBtnGrad}>
                <Text style={styles.featIcon}>🎨</Text>
                <Text style={styles.featLabel}>THEMES</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onNavigate('achievements');
              }}
              style={({ pressed }) => [styles.featBtn, pressed && styles.cardPressed]}
            >
              <LinearGradient colors={['#10395C', '#0A253E']} style={styles.featBtnGrad}>
                <Text style={styles.featIcon}>🏆</Text>
                <Text style={styles.featLabel}>BADGES</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onNavigate('shop');
              }}
              style={({ pressed }) => [styles.featBtn, pressed && styles.cardPressed]}
            >
              <LinearGradient colors={['#10395C', '#0A253E']} style={styles.featBtnGrad}>
                <Text style={styles.featIcon}>🎁</Text>
                <Text style={styles.featLabel}>SHOP</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onNavigate('how-to-play');
              }}
              style={({ pressed }) => [styles.featBtn, pressed && styles.cardPressed]}
            >
              <LinearGradient colors={['#10395C', '#0A253E']} style={styles.featBtnGrad}>
                <Text style={styles.featIcon}>❓</Text>
                <Text style={styles.featLabel}>GUIDE</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </FantasyBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.borderGold,
    overflow: 'hidden',
  },
  btnPressed: {
    transform: [{ scale: 0.94 }],
  },
  iconBtnGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 26,
  },
  emblemBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(8, 27, 47, 0.75)',
    borderWidth: 2,
    borderColor: 'rgba(32, 191, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    marginBottom: 10,
  },
  titleMain: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitleMain: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 4,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  realmPill: {
    backgroundColor: 'rgba(7, 24, 43, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginTop: 12,
  },
  realmText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 1.5,
  },
  primaryActionSection: {
    width: '100%',
    maxWidth: 340,
    marginBottom: 20,
  },
  playBtn: {
    width: '100%',
  },
  modesRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 340,
    gap: 12,
    marginBottom: 20,
  },
  modeCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#3D1C08',
    backgroundColor: '#351503',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  cardPressed: {
    transform: [{ scale: 0.96 }],
  },
  modeCardGrad: {
    padding: 14,
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(32, 191, 255, 0.3)',
  },
  dailyCardGrad: {
    borderColor: 'rgba(255, 69, 181, 0.3)',
  },
  modeCardIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  modeCardTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 1,
  },
  modeCardSub: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.muted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  featuresRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 340,
    gap: 8,
  },
  featBtn: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#3D1C08',
    backgroundColor: '#351503',
    overflow: 'hidden',
  },
  featBtnGrad: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  featLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#E2EEF9',
    letterSpacing: 0.8,
  },
});

export default HomeScreen;
