// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Screen 02: Main Menu Home
// Grand fantasy kingdom portal with chunky dimensional game buttons
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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
            <Text style={styles.flagEmoji}>🚩</Text>
            <Text style={styles.titleArrow}>ARROW</Text>
            <Text style={styles.titleKingdom}>KINGDOM</Text>
            <Text style={styles.tagline}>TAP • CLEAR • CONQUER</Text>
            <Text style={styles.castleTrees}>🏰 🌲 🌲</Text>
          </View>

          {/* Primary Big Green CTA: PLAY */}
          <View style={styles.primaryActionSection}>
            <GameButton
              title={`▶  PLAY`}
              variant="green"
              size="large"
              onPress={onPlayCurrentLevel}
              style={styles.playBtn}
            />
          </View>

          {/* Secondary Mode Cards (Levels Map & Daily Puzzle) */}
          <View style={styles.bigRow}>
            {/* World Map / Levels Card */}
            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onNavigate('world-map');
              }}
              style={({ pressed }) => [styles.bigTile, pressed && styles.cardPressed]}
            >
              <Text style={styles.bigTileEmoji}>👑</Text>
              <Text style={styles.bigTileTitle}>Levels</Text>
              <Text style={styles.bigTileSub}>{unlockedLevels}/10 Cleared</Text>
            </Pressable>

            {/* Daily Puzzle Card */}
            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onNavigate('daily-puzzle');
              }}
              style={({ pressed }) => [styles.bigTile, pressed && styles.cardPressed]}
            >
              <Text style={styles.bigTileEmoji}>📅</Text>
              <Text style={styles.bigTileTitle}>Daily</Text>
              <Text style={styles.bigTileSub}>Bonus Gems</Text>
            </Pressable>
          </View>

          {/* Bottom Feature Tabs Row: Themes, Achievements, Shop */}
          <View style={styles.featuresRow}>
            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onNavigate('themes');
              }}
              style={({ pressed }) => [styles.featTile, pressed && styles.cardPressed]}
            >
              <Text style={styles.featEmoji}>🎨</Text>
              <Text style={styles.featTitle}>Themes</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onNavigate('achievements');
              }}
              style={({ pressed }) => [styles.featTile, pressed && styles.cardPressed]}
            >
              <Text style={styles.featEmoji}>🏆</Text>
              <Text style={styles.featTitle}>Awards</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                ArrowHaptics.buttonPress();
                onNavigate('shop');
              }}
              style={({ pressed }) => [styles.featTile, pressed && styles.cardPressed]}
            >
              <Text style={styles.featEmoji}>🎁</Text>
              <Text style={styles.featTitle}>Shop</Text>
            </Pressable>
          </View>

          {/* How to play helper link */}
          <Pressable
            onPress={() => {
              ArrowHaptics.buttonPress();
              onNavigate('how-to-play');
            }}
            style={styles.helpLink}
          >
            <Text style={styles.helpText}>❓ How to play?</Text>
          </Pressable>
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
    marginTop: 10,
    marginBottom: 16,
  },
  flagEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  titleArrow: {
    fontSize: 50,
    fontWeight: '900',
    color: '#FFD33D',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textShadowColor: '#7A3200',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  titleKingdom: {
    fontSize: 38,
    fontWeight: '900',
    color: '#20BFFF',
    letterSpacing: 4,
    marginTop: -10,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginTop: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  castleTrees: {
    fontSize: 54,
    marginTop: 10,
  },
  primaryActionSection: {
    width: '100%',
    maxWidth: 340,
    marginBottom: 16,
  },
  playBtn: {
    width: '100%',
  },
  bigRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 340,
    gap: 12,
    marginBottom: 12,
  },
  bigTile: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#0B2944',
    borderWidth: 2.5,
    borderColor: '#2A5D84',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 4,
  },
  cardPressed: {
    transform: [{ scale: 0.95 }],
  },
  bigTileEmoji: {
    fontSize: 28,
  },
  bigTileTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  bigTileSub: {
    color: '#9AB4CA',
    fontWeight: '800',
    fontSize: 10,
    marginTop: 2,
  },
  featuresRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 340,
    gap: 10,
    marginBottom: 14,
  },
  featTile: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#0B2944',
    borderWidth: 2,
    borderColor: '#2A5D84',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  featEmoji: {
    fontSize: 22,
  },
  featTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    marginTop: 4,
  },
  helpLink: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  helpText: {
    color: '#9AB4CA',
    fontSize: 14,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
