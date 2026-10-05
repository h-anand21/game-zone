// ============================================================
// PATH MIND — Screen 19: ProfileScreen
// Explorer Dossier: Rank, Character Avatar, Accuracy & Star Metrics
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { GameBackground } from '../components/ui/GameBackground';
import { GameHeader } from '../components/ui/GameHeader';
import { TitlePlaque } from '../components/ui/TitlePlaque';
import { GamePanel } from '../components/ui/GamePanel';
import { GameButton } from '../components/ui/GameButton';
import { StatCard } from '../components/ui/StatCard';
import { ExplorerCharacter } from '../components/ui/ExplorerCharacter';
import { usePathMindStore } from '../store/pathMindStore';
import { pmColors } from '../design-system/colors';
import { pmTypography } from '../design-system/typography';
import { pmRadii } from '../design-system/radii';
import { pmShadows } from '../design-system/shadows';
import { pmAssets } from '../design-system/uiAssets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ProfileScreen: React.FC = () => {
  const {
    setScreen,
    currentLevel,
    stars,
    streak,
    hearts,
    coins,
    getUserName,
  } = usePathMindStore();

  const userName = getUserName();

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
          imageSource={pmAssets.plaques.profile}
          style={styles.titlePlaque}
        />

        {/* Hero Card */}
        <GamePanel variant="wood" style={styles.heroPanel}>
          <View style={styles.heroRow}>
            <View style={styles.avatarWrap}>
              <ExplorerCharacter size={80} />
            </View>

            <View style={styles.heroDetails}>
              <View style={styles.rankPill}>
                <Text style={styles.rankText}>RANK: CARTOGRAPHER</Text>
              </View>
              <Text style={styles.heroName} numberOfLines={1}>
                {userName}
              </Text>
              <Text style={styles.heroTitle}>Valley Pathfinder • Lv. {currentLevel}</Text>
            </View>
          </View>
        </GamePanel>

        {/* Stats 2x2 Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="CHAMBERS CONQUERED"
            value={`${currentLevel}`}
            variant="cyan"
            style={styles.statItem}
          />
          <StatCard
            label="STARS GATHERED"
            value={`${stars} ★`}
            variant="gold"
            style={styles.statItem}
          />
          <StatCard
            label="EXPEDITION STREAK"
            value={`${streak} DAYS`}
            variant="purple"
            style={styles.statItem}
          />
          <StatCard
            label="ACCURACY RATE"
            value="94.8%"
            variant="green"
            style={styles.statItem}
          />
        </View>

        {/* Achievements Showcase */}
        <GamePanel variant="stone" style={styles.badgePanel}>
          <Text style={styles.panelTitle}>EARNED BADGES</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badgePill}>
              <Text style={styles.badgeIcon}>🧭</Text>
              <Text style={styles.badgeLabel}>PATH PRODIGY</Text>
            </View>
            <View style={styles.badgePill}>
              <Text style={styles.badgeIcon}>✨</Text>
              <Text style={styles.badgeLabel}>RUNE SIGHT</Text>
            </View>
            <View style={styles.badgePill}>
              <Text style={styles.badgeIcon}>👑</Text>
              <Text style={styles.badgeLabel}>CHAMBER KING</Text>
            </View>
          </View>
        </GamePanel>

        {/* Action Button */}
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
  heroPanel: {
    width: Math.min(SCREEN_WIDTH - 36, 340),
    padding: 14,
    marginBottom: 14,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 2,
    borderColor: pmColors.woodHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroDetails: {
    flex: 1,
  },
  rankPill: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: pmColors.goldBright,
    borderRadius: pmRadii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  rankText: {
    fontSize: 9,
    fontWeight: '900',
    color: pmColors.goldBright,
    letterSpacing: 0.5,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroTitle: {
    ...pmTypography.caption,
    color: pmColors.textWood,
    marginTop: 2,
  },
  statsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statItem: {
    width: (SCREEN_WIDTH - 44) / 2,
  },
  badgePanel: {
    width: Math.min(SCREEN_WIDTH - 36, 340),
    padding: 14,
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: pmColors.textCyan,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  badgePill: {
    alignItems: 'center',
    gap: 4,
  },
  badgeIcon: {
    fontSize: 22,
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: pmColors.textSecondary,
    letterSpacing: 0.5,
  },
  ctaWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
});
