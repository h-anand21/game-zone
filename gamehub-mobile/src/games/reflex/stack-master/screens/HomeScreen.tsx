// ============================================================
// STACK MASTER — Screen 03: Game Home
// Uses: 'Enchanted Floating Islands at Twilight.png' & Logo Nameplate
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { PrimaryButton } from '../ui/PrimaryButton';
import { COLORS } from '../theme/colors';
import { useStackStore } from '../store/stackStore';
import { StackHaptics } from '../utils/haptics';
import type { ScreenId } from '../types';

const LOGO_IMG = require('@/assets/game/backgrounds/Stack Master Crowned Game Logo.png');

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onPlayClassic: () => void;
  onExitGame?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onPlayClassic,
  onExitGame,
}) => {
  const insets = useSafeAreaInsets();
  const coins = useStackStore((state) => state.coins);
  const crystals = useStackStore((state) => state.crystals);
  const playerLevel = useStackStore((state) => state.playerLevel);
  const playerTitle = useStackStore((state) => state.playerTitle);
  const bestScore = useStackStore((state) => state.bestScore);
  const bestHeight = useStackStore((state) => state.bestHeight);
  const dailyStreak = useStackStore((state) => state.dailyStreak);

  return (
    <ScreenBackground type="home" dimAmount={0.35}>
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 16), paddingBottom: insets.bottom + 12 }]}>
        {/* Top Header: Player Level Pill, Currency, Settings */}
        <View style={styles.topHeader}>
          {/* Exit / Back to GameHub button if available */}
          {onExitGame && (
            <Pressable
              onPress={() => {
                StackHaptics.buttonPress();
                onExitGame();
              }}
              style={styles.exitBtn}
              hitSlop={10}
            >
              <Text style={styles.exitText}>◀</Text>
            </Pressable>
          )}

          {/* Player Level & Title */}
          <Pressable
            onPress={() => onNavigate('profile')}
            style={styles.profilePill}
          >
            <View style={styles.levelBadge}>
              <Text style={styles.levelNum}>{playerLevel}</Text>
            </View>
            <View style={styles.titleCol}>
              <Text style={styles.playerName}>LVL {playerLevel}</Text>
              <Text style={styles.playerTitle} numberOfLines={1}>{playerTitle}</Text>
            </View>
          </Pressable>

          {/* Currencies & Settings button */}
          <View style={styles.headerRight}>
            <View style={styles.currencyPill}>
              <Text style={styles.currIcon}>🪙</Text>
              <Text style={styles.currVal}>{coins}</Text>
            </View>
            <View style={[styles.currencyPill, styles.crystalPill]}>
              <Text style={styles.currIcon}>💎</Text>
              <Text style={styles.currVal}>{crystals}</Text>
            </View>
            <Pressable
              onPress={() => {
                StackHaptics.buttonPress();
                onNavigate('settings');
              }}
              style={styles.settingsBtn}
              hitSlop={10}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Crowned Game Logo Nameplate */}
          <View style={styles.logoSection}>
            <Image
              source={LOGO_IMG}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Best Records Banner */}
          <View style={styles.recordsBanner}>
            <LinearGradient
              colors={['#102E56', '#091C38']}
              style={styles.recordsCard}
            >
              <View style={styles.recordItem}>
                <Text style={styles.recordLabel}>BEST HEIGHT</Text>
                <Text style={styles.recordVal}>{bestHeight}</Text>
              </View>
              <View style={styles.recordDivider} />
              <View style={styles.recordItem}>
                <Text style={styles.recordLabel}>HIGH SCORE</Text>
                <Text style={[styles.recordVal, { color: COLORS.gold }]}>{bestScore}</Text>
              </View>
              <View style={styles.recordDivider} />
              <View style={styles.recordItem}>
                <Text style={styles.recordLabel}>DAILY STREAK</Text>
                <Text style={[styles.recordVal, { color: COLORS.orange }]}>🔥 {dailyStreak}d</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Primary Action: Big 3D PLAY Button */}
          <View style={styles.primaryActionWrap}>
            <PrimaryButton
              title="▶ PLAY CLASSIC"
              variant="gold"
              size="large"
              onPress={onPlayClassic}
            />
          </View>

          {/* Secondary Quick Modes Cards: Mode Select & Daily Challenge */}
          <View style={styles.quickCardsRow}>
            <Pressable
              onPress={() => {
                StackHaptics.buttonPress();
                onNavigate('mode-select');
              }}
              style={({ pressed }) => [styles.quickCard, pressed && { transform: [{ scale: 0.96 }] }]}
            >
              <LinearGradient colors={['#153A68', '#0D2444']} style={styles.quickCardGrad}>
                <Text style={styles.quickIcon}>🏰</Text>
                <Text style={styles.quickTitle}>GAME MODES</Text>
                <Text style={styles.quickSub}>ZEN • RUSH • PRECISION</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => {
                StackHaptics.buttonPress();
                onNavigate('daily-challenge');
              }}
              style={({ pressed }) => [styles.quickCard, pressed && { transform: [{ scale: 0.96 }] }]}
            >
              <LinearGradient colors={['#2D1A45', '#160B24']} style={[styles.quickCardGrad, { borderColor: COLORS.magenta }]}>
                <Text style={styles.quickIcon}>👑</Text>
                <Text style={[styles.quickTitle, { color: COLORS.magentaLight }]}>DAILY TRIAL</Text>
                <Text style={styles.quickSub}>CROWNS & GEMS</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Secondary Navigation Grid (Themes, Collection, Stats, Profile, Tutorial) */}
          <View style={styles.navGrid}>
            <Pressable
              onPress={() => onNavigate('tower-themes')}
              style={styles.gridBtn}
            >
              <LinearGradient colors={['#102E56', '#091C38']} style={styles.gridBtnGrad}>
                <Text style={styles.gridIcon}>🎨</Text>
                <Text style={styles.gridLabel}>THEMES</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => onNavigate('collection')}
              style={styles.gridBtn}
            >
              <LinearGradient colors={['#102E56', '#091C38']} style={styles.gridBtnGrad}>
                <Text style={styles.gridIcon}>💎</Text>
                <Text style={styles.gridLabel}>BLOCKS</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => onNavigate('stats')}
              style={styles.gridBtn}
            >
              <LinearGradient colors={['#102E56', '#091C38']} style={styles.gridBtnGrad}>
                <Text style={styles.gridIcon}>📊</Text>
                <Text style={styles.gridLabel}>STATS</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => onNavigate('profile')}
              style={styles.gridBtn}
            >
              <LinearGradient colors={['#102E56', '#091C38']} style={styles.gridBtnGrad}>
                <Text style={styles.gridIcon}>🏆</Text>
                <Text style={styles.gridLabel}>BADGES</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => onNavigate('tutorial')}
              style={styles.gridBtn}
            >
              <LinearGradient colors={['#102E56', '#091C38']} style={styles.gridBtnGrad}>
                <Text style={styles.gridIcon}>📖</Text>
                <Text style={styles.gridLabel}>GUIDE</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  exitBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(7, 19, 41, 0.85)',
    borderWidth: 1.5,
    borderColor: '#244577',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  exitText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '900',
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 19, 41, 0.85)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: '#244577',
    maxWidth: 150,
  },
  levelBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  levelNum: {
    fontSize: 12,
    fontWeight: '900',
    color: '#071329',
  },
  titleCol: {
    flex: 1,
  },
  playerName: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFF',
  },
  playerTitle: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.cyan,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 19, 41, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  crystalPill: {
    borderColor: COLORS.magenta,
  },
  currIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  currVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: 'rgba(7, 19, 41, 0.85)',
    borderWidth: 1.5,
    borderColor: '#244577',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  logoSection: {
    width: '100%',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  logoImage: {
    width: 260,
    height: 140,
  },
  recordsBanner: {
    width: '100%',
    marginBottom: 16,
  },
  recordsCard: {
    flexDirection: 'row',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#244B82',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  recordItem: {
    alignItems: 'center',
    flex: 1,
  },
  recordLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  recordVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 2,
  },
  recordDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#1E3B68',
  },
  primaryActionWrap: {
    width: '100%',
    marginBottom: 16,
  },
  quickCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quickCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#244B82',
    overflow: 'hidden',
  },
  quickCardGrad: {
    padding: 14,
    alignItems: 'center',
  },
  quickIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.8,
  },
  quickSub: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.muted,
    marginTop: 2,
  },
  navGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  gridBtn: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#244B82',
    overflow: 'hidden',
  },
  gridBtnGrad: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.6,
  },
});
