// ============================================================
// REVERSE MIND — Profile, Collection & Settings Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameBackground } from '../components/GameBackground';
import { BottomTabBar } from '../components/BottomTabBar';
import { MascotCompanion } from '../components/MascotCompanion';
import { useReverseMindStore } from '../store/reverseMindStore';
import type { AppNavScreen, CollectibleItem } from '../types';
import { RMTheme } from '../theme';

interface ProfileScreenProps {
  onNavigate: (screen: AppNavScreen) => void;
  onBack: () => void;
}

const COLLECTIBLES: CollectibleItem[] = [
  {
    id: 'char_boy',
    category: 'character',
    name: 'Curious Scholar',
    preview: '👦',
    unlocked: true,
    equipped: true,
    rarity: 'common',
  },
  {
    id: 'char_corgi',
    category: 'character',
    name: 'Caped Corgi',
    preview: '🐕',
    unlocked: true,
    equipped: true,
    rarity: 'epic',
  },
  {
    id: 'char_astro',
    category: 'character',
    name: 'Astronaut Scout',
    preview: '🧑‍🚀',
    unlocked: false,
    equipped: false,
    costCoins: 800,
    rarity: 'rare',
  },
  {
    id: 'char_robot',
    category: 'character',
    name: 'Cyber Core',
    preview: '🤖',
    unlocked: false,
    equipped: false,
    costGems: 25,
    rarity: 'legendary',
  },
  {
    id: 'badge_inversion',
    category: 'badge',
    name: 'Mirror Master',
    preview: '🪞',
    unlocked: true,
    equipped: true,
    rarity: 'epic',
  },
  {
    id: 'badge_flawless',
    category: 'badge',
    name: 'Flawless Pulse',
    preview: '✨',
    unlocked: true,
    equipped: false,
    rarity: 'rare',
  },
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate, onBack }) => {
  const { playerStats, settings, toggleSetting } = useReverseMindStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'collection' | 'settings'>('profile');

  return (
    <GameBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>PLAYER IDENTITY</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Tab Selector */}
        <View style={styles.tabsRow}>
          <Pressable
            onPress={() => setActiveTab('profile')}
            style={[styles.tabBtn, activeTab === 'profile' && styles.tabActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'profile' && styles.tabTextActive]}>
              PROFILE
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('collection')}
            style={[styles.tabBtn, activeTab === 'collection' && styles.tabActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'collection' && styles.tabTextActive]}>
              COLLECTION
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('settings')}
            style={[styles.tabBtn, activeTab === 'settings' && styles.tabActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'settings' && styles.tabTextActive]}>
              SETTINGS
            </Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'profile' && (
            <>
              {/* Player Card */}
              <LinearGradient
                colors={['#1A2C46', '#0E1A2C']}
                style={styles.playerCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.avatarRow}>
                  <View style={styles.bigAvatar}>
                    <Text style={styles.avatarEmoji}>👦</Text>
                    <View style={styles.corgiPip}>
                      <Text style={{ fontSize: 14 }}>🐕</Text>
                    </View>
                  </View>
                  <View style={styles.playerDetails}>
                    <Text style={styles.playerName}>Agent Mind</Text>
                    <Text style={styles.playerRank}>Level {playerStats.level} Invertor</Text>
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagBadgeText}>COGNITIVE AGENT</Text>
                    </View>
                  </View>
                </View>

                {/* Balance Row */}
                <View style={styles.balanceRow}>
                  <View style={styles.balanceItem}>
                    <Text style={styles.balanceVal}>🪙 {playerStats.coins}</Text>
                    <Text style={styles.balanceLabel}>Coins</Text>
                  </View>
                  <View style={styles.balanceItem}>
                    <Text style={styles.balanceVal}>💎 {playerStats.gems}</Text>
                    <Text style={styles.balanceLabel}>Gems</Text>
                  </View>
                  <View style={styles.balanceItem}>
                    <Text style={styles.balanceVal}>🔥 {playerStats.dailyStreak}d</Text>
                    <Text style={styles.balanceLabel}>Streak</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Mascot Overview */}
              <View style={styles.mascotBox}>
                <MascotCompanion
                  state="happy"
                  size="md"
                  showSpeechBubble={true}
                  speechText="Your mental agility score is climbing!"
                />
              </View>
            </>
          )}

          {activeTab === 'collection' && (
            <View style={styles.collectionGrid}>
              {COLLECTIBLES.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.collectCard,
                    item.equipped && styles.collectEquipped,
                    !item.unlocked && styles.collectLocked,
                  ]}
                >
                  <Text style={styles.collectEmoji}>{item.preview}</Text>
                  <Text style={styles.collectName}>{item.name}</Text>

                  {item.equipped ? (
                    <View style={styles.equippedBadge}>
                      <Text style={styles.equippedText}>EQUIPPED</Text>
                    </View>
                  ) : item.unlocked ? (
                    <View style={styles.unlockedBadge}>
                      <Text style={styles.unlockedText}>UNLOCKED</Text>
                    </View>
                  ) : (
                    <View style={styles.lockedBadge}>
                      <Text style={styles.lockedText}>
                        🔒 {item.costCoins ? `${item.costCoins} 🪙` : `${item.costGems} 💎`}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {activeTab === 'settings' && (
            <View style={styles.settingsList}>
              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingTitle}>Sound Effects</Text>
                  <Text style={styles.settingSub}>Audio feedback on taps and matches</Text>
                </View>
                <Switch
                  value={settings.soundEnabled}
                  onValueChange={() => toggleSetting('soundEnabled')}
                  trackColor={{ false: '#263238', true: RMTheme.colors.cyanNeon }}
                />
              </View>

              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingTitle}>Background Music</Text>
                  <Text style={styles.settingSub}>Ambient cozy study melody</Text>
                </View>
                <Switch
                  value={settings.musicEnabled}
                  onValueChange={() => toggleSetting('musicEnabled')}
                  trackColor={{ false: '#263238', true: RMTheme.colors.cyanNeon }}
                />
              </View>

              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingTitle}>Haptic Feedback</Text>
                  <Text style={styles.settingSub}>Tactile vibration pulses</Text>
                </View>
                <Switch
                  value={settings.hapticsEnabled}
                  onValueChange={() => toggleSetting('hapticsEnabled')}
                  trackColor={{ false: '#263238', true: RMTheme.colors.cyanNeon }}
                />
              </View>
            </View>
          )}
        </ScrollView>

        <BottomTabBar currentScreen="profile" onNavigate={onNavigate} />
      </View>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RMTheme.radii.full,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  tabActive: {
    backgroundColor: 'rgba(77, 231, 255, 0.18)',
    borderColor: RMTheme.colors.cyanNeon,
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: RMTheme.colors.textMuted,
    letterSpacing: 1,
  },
  tabTextActive: {
    color: RMTheme.colors.cyanNeon,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  playerCard: {
    borderRadius: RMTheme.radii.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(77, 231, 255, 0.3)',
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bigAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E3250',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: RMTheme.colors.cyanNeon,
    marginRight: 14,
  },
  avatarEmoji: {
    fontSize: 34,
  },
  corgiPip: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF9800',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#07111F',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  playerRank: {
    fontSize: 12,
    color: RMTheme.colors.cyanNeon,
    fontWeight: '700',
    marginTop: 2,
  },
  tagBadge: {
    backgroundColor: 'rgba(255, 216, 61, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RMTheme.radii.full,
    alignSelf: 'flex-start',
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 216, 61, 0.4)',
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFE082',
    letterSpacing: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  balanceLabel: {
    fontSize: 10,
    color: RMTheme.colors.textSecondary,
    fontWeight: '700',
    marginTop: 2,
  },
  mascotBox: {
    marginVertical: 12,
  },
  collectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  collectCard: {
    width: '48%',
    backgroundColor: 'rgba(16, 27, 43, 0.75)',
    borderRadius: RMTheme.radii.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  collectEquipped: {
    borderColor: RMTheme.colors.primaryGold,
    shadowColor: RMTheme.colors.primaryGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  collectLocked: {
    opacity: 0.5,
  },
  collectEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  collectName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  equippedBadge: {
    backgroundColor: 'rgba(255, 216, 61, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: RMTheme.colors.primaryGold,
  },
  equippedText: {
    fontSize: 9,
    fontWeight: '900',
    color: RMTheme.colors.primaryGold,
  },
  unlockedBadge: {
    backgroundColor: 'rgba(77, 231, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  unlockedText: {
    fontSize: 9,
    fontWeight: '800',
    color: RMTheme.colors.cyanNeon,
  },
  lockedBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  lockedText: {
    fontSize: 10,
    fontWeight: '800',
    color: RMTheme.colors.textMuted,
  },
  settingsList: {
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 27, 43, 0.75)',
    padding: 16,
    borderRadius: RMTheme.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  settingSub: {
    fontSize: 11,
    color: RMTheme.colors.textSecondary,
    marginTop: 2,
  },
});
