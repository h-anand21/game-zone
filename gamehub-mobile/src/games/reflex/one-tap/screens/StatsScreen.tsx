// ============================================================
// ONE TAP: PRECISION GAME — StatsScreen
// Lifetime Career Telemetry, Accuracy, Best Combo & Milestones
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { OneTapLogo } from '../components/OneTapLogo';
import { SvgBackArrow, SvgCrown } from '../components/icons/OneTapIcons';
import { OTColors } from '../theme/colors';
import { OneTapUserProfile } from '../types';

interface StatsScreenProps {
  profile: OneTapUserProfile;
  onBack: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ profile, onBack }) => {
  return (
    <BackgroundLayer screen="other" overlayDarkness={0.45}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
            onPress={onBack}
            hitSlop={8}
          >
            <SvgBackArrow size={20} color="#FFFFFF" />
          </Pressable>
          <OneTapLogo size="compact" showSubtitle={true} />
          <View style={styles.spacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.titleSection}>
            <Text style={styles.titleText}>CAREER STATS</Text>
            <Text style={styles.subTitleText}>LIFETIME PRECISION TELEMETRY</Text>
          </View>

          {/* Top Hero Best Score */}
          <View style={styles.heroBestCard}>
            <SvgCrown size={22} color={OTColors.gold} />
            <Text style={styles.heroBestLabel}>HIGHEST SCORE</Text>
            <Text style={styles.heroBestValue}>{profile.personalBestScore}</Text>
          </View>

          {/* Career Stats Grid */}
          <View style={styles.grid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>GAMES PLAYED</Text>
              <Text style={styles.statVal}>{profile.totalGamesPlayed}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>MAX COMBO</Text>
              <Text style={[styles.statVal, { color: OTColors.cyan }]}>
                ×{profile.maxComboRecorded}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>LIFETIME ACCURACY</Text>
              <Text style={[styles.statVal, { color: OTColors.green }]}>
                {profile.lifetimeAccuracy}%
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>FASTEST REACTION</Text>
              <Text style={[styles.statVal, { color: OTColors.gold }]}>
                {profile.fastestReactionMs}ms
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>PERFECT HITS</Text>
              <Text style={[styles.statVal, { color: OTColors.gold }]}>
                {profile.totalPerfectHits}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>COINS VAULT</Text>
              <Text style={[styles.statVal, { color: '#FFE875' }]}>
                🪙 {profile.coins}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 21, 28, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  spacer: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  subTitleText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: OTColors.gold,
    letterSpacing: 2,
    marginTop: 4,
  },
  heroBestCard: {
    backgroundColor: 'rgba(16, 21, 28, 0.9)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 10,
  },
  heroBestLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: OTColors.textSecondary,
    letterSpacing: 2,
    marginTop: 6,
  },
  heroBestValue: {
    fontSize: 36,
    fontWeight: '900',
    color: OTColors.gold,
    letterSpacing: 1.5,
    fontStyle: 'italic',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(16, 21, 28, 0.75)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: OTColors.textMuted,
    letterSpacing: 1.5,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginTop: 4,
  },
});
