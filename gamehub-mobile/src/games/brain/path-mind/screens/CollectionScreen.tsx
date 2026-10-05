// ============================================================
// PATH MIND — Screen 18: CollectionScreen
// Explorer's Vault: Relics, Keys, Sacred Runestones & Badges
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { GameBackground } from '../components/ui/GameBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { TitlePlaque } from '../components/ui/TitlePlaque';
import { GamePanel } from '../components/ui/GamePanel';
import { GameButton } from '../components/ui/GameButton';
import { usePathMindStore } from '../store/pathMindStore';
import { pmColors } from '../design-system/colors';
import { pmTypography } from '../design-system/typography';
import { pmRadii } from '../design-system/radii';
import { pmShadows } from '../design-system/shadows';
import { pmAssets } from '../design-system/uiAssets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RelicItem {
  id: string;
  name: string;
  icon: string;
  desc: string;
  unlocked: boolean;
  category: 'RELICS' | 'KEYS' | 'RUNES';
}

const ITEMS: RelicItem[] = [
  {
    id: 'compass',
    name: 'GOLDEN COMPASS',
    icon: '🧭',
    desc: 'Increases path score multiplier by +10%.',
    unlocked: true,
    category: 'RELICS',
  },
  {
    id: 'amulet',
    name: 'SUN AMULET',
    icon: '☀️',
    desc: 'Grants 1 free hint per daily expedition.',
    unlocked: true,
    category: 'RELICS',
  },
  {
    id: 'chalice',
    name: 'TEMPLE CHALICE',
    icon: '🏆',
    desc: 'Restores 1 heart every 3 flawless runs.',
    unlocked: true,
    category: 'RELICS',
  },
  {
    id: 'key_gold',
    name: 'SOLAR KEY',
    icon: '🗝️',
    desc: 'Unlocks Chamber 10 secret boss vault.',
    unlocked: true,
    category: 'KEYS',
  },
  {
    id: 'key_cyan',
    name: 'ASTRAL KEY',
    icon: '🔑',
    desc: 'Unlocks Chamber 20 astral gateway.',
    unlocked: false,
    category: 'KEYS',
  },
  {
    id: 'rune_ignis',
    name: 'IGNIS RUNESTONE',
    icon: '🔥',
    desc: 'Ancient flame rune glowing with power.',
    unlocked: true,
    category: 'RUNES',
  },
  {
    id: 'rune_aqua',
    name: 'AQUA RUNESTONE',
    icon: '💧',
    desc: 'Glacial rune of ancient clarity.',
    unlocked: false,
    category: 'RUNES',
  },
  {
    id: 'rune_terra',
    name: 'TERRA RUNESTONE',
    icon: '🌿',
    desc: 'Earth rune infused with forest vitality.',
    unlocked: false,
    category: 'RUNES',
  },
];

export const CollectionScreen: React.FC = () => {
  const { setScreen, hearts, coins } = usePathMindStore();
  const [selectedTab, setSelectedTab] = useState<'RELICS' | 'KEYS' | 'RUNES'>('RELICS');

  const filteredItems = ITEMS.filter((item) => item.category === selectedTab);
  const unlockedCount = ITEMS.filter((i) => i.unlocked).length;

  return (
    <GameBackground variant="universal" overlayDarkness={0.25}>
      <GameHeader
        onBack={() => setScreen('home')}
        onSettings={() => setScreen('settings')}
        hearts={hearts}
        coins={coins}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TitlePlaque
          imageSource={pmAssets.plaques.collection}
          style={styles.titlePlaque}
        />

        {/* Counter Banner */}
        <View style={styles.counterBanner}>
          <Text style={styles.counterText}>
            DISCOVERED: <Text style={{ color: pmColors.goldBright }}>{unlockedCount}</Text> / {ITEMS.length} ARTIFACTS
          </Text>
        </View>

        {/* Category Tabs */}
        <View style={styles.tabRow}>
          {(['RELICS', 'KEYS', 'RUNES'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.tabButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Grid of Items */}
        <View style={styles.cardGrid}>
          {filteredItems.map((item) => (
            <GamePanel
              key={item.id}
              variant="stone"
              style={StyleSheet.flatten([
                styles.relicCard,
                !item.unlocked && styles.lockedCard,
              ])}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.relicIcon}>{item.unlocked ? item.icon : '🔒'}</Text>
              </View>

              <Text
                style={[
                  styles.relicName,
                  item.unlocked ? { color: pmColors.goldBright } : { color: pmColors.textMuted },
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <Text style={styles.relicDesc} numberOfLines={2}>
                {item.unlocked ? item.desc : 'Discovered in deeper valley chambers'}
              </Text>
            </GamePanel>
          ))}
        </View>

        {/* Return Button */}
        <View style={styles.ctaWrap}>
          <GameButton
            label="BACK TO HOME"
            variant="wood"
            size="medium"
            width={Math.min(SCREEN_WIDTH - 64, 240)}
            height={50}
            onPress={() => setScreen('home')}
            accessibilityLabel="Back to Home"
          />
        </View>
      </ScrollView>
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
    alignItems: 'center',
  },
  titlePlaque: {
    width: Math.min(SCREEN_WIDTH - 36, 320),
    marginBottom: 12,
    marginTop: 4,
  },
  counterBanner: {
    backgroundColor: 'rgba(10, 18, 26, 0.92)',
    borderWidth: 1.5,
    borderColor: pmColors.stoneBorder,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 14,
    ...pmShadows.soft,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '800',
    color: pmColors.textSecondary,
    letterSpacing: 0.8,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: pmRadii.md,
    backgroundColor: 'rgba(12, 20, 28, 0.85)',
    borderWidth: 1.5,
    borderColor: pmColors.stoneBorder,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(74, 40, 16, 0.9)',
    borderColor: pmColors.goldBright,
    ...pmShadows.glowGold,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '900',
    color: pmColors.textSecondary,
    letterSpacing: 0.8,
  },
  tabTextActive: {
    color: pmColors.goldBright,
  },
  cardGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  relicCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    padding: 12,
    alignItems: 'center',
  },
  lockedCard: {
    opacity: 0.5,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: pmColors.stoneBorder,
  },
  relicIcon: {
    fontSize: 22,
  },
  relicName: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  relicDesc: {
    ...pmTypography.caption,
    color: pmColors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  ctaWrap: {
    marginTop: 24,
    alignItems: 'center',
  },
});
