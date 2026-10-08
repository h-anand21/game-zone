// ============================================================
// ONE TAP: PRECISION GAME — HowToPlayScreen
// 5 Step Visual Guide with Diagrams and Start CTA
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Rect, Circle, Line } from 'react-native-svg';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { OneTapLogo } from '../components/OneTapLogo';
import { SvgBackArrow, SvgPlay } from '../components/icons/OneTapIcons';
import { OTColors } from '../theme/colors';

interface HowToPlayScreenProps {
  onBack: () => void;
  onStartGame: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({
  onBack,
  onStartGame,
}) => {
  return (
    <BackgroundLayer screen="other" overlayDarkness={0.45}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header Row */}
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
            <Text style={styles.titleText}>HOW TO PLAY</Text>
            <Text style={styles.subTitleText}>TAP AT THE RIGHT MOMENT</Text>
          </View>

          {/* 5 Step Cards */}
          <View style={styles.stepsList}>
            {/* Step 01: WATCH */}
            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.numBadge}>
                  <Text style={styles.numBadgeText}>01</Text>
                </View>
                <Text style={styles.stepTitle}>WATCH</Text>
              </View>
              <Text style={styles.stepDesc}>
                A moving marker will slide back and forth on the track.
              </Text>
              <View style={styles.diagramTrack}>
                <View style={styles.diagramTarget}>
                  <Text style={styles.diagramLabel}>TARGET</Text>
                </View>
                <View style={[styles.diagramNeedle, { left: 40 }]} />
              </View>
            </View>

            {/* Step 02: WAIT */}
            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.numBadge}>
                  <Text style={styles.numBadgeText}>02</Text>
                </View>
                <Text style={styles.stepTitle}>WAIT</Text>
              </View>
              <Text style={styles.stepDesc}>
                Let the marker slide toward the highlighted target zone.
              </Text>
              <View style={styles.diagramTrack}>
                <View style={styles.diagramTarget}>
                  <Text style={styles.diagramLabel}>TARGET</Text>
                </View>
                <View style={[styles.diagramNeedle, { left: 110, opacity: 0.6 }]} />
                <View style={[styles.diagramNeedle, { left: 140 }]} />
              </View>
            </View>

            {/* Step 03: TAP ANYWHERE */}
            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.numBadge}>
                  <Text style={styles.numBadgeText}>03</Text>
                </View>
                <Text style={styles.stepTitle}>TAP ANYWHERE</Text>
              </View>
              <Text style={styles.stepDesc}>
                When the marker is inside the target zone, tap anywhere on the entire screen!
              </Text>
              <View style={styles.diagramTouchArea}>
                <Text style={styles.diagramTouchText}>✦ TOUCH ANYWHERE ON SCREEN ✦</Text>
              </View>
            </View>

            {/* Step 04: GET A SCORE */}
            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.numBadge}>
                  <Text style={styles.numBadgeText}>04</Text>
                </View>
                <Text style={styles.stepTitle}>GET A SCORE</Text>
              </View>
              <Text style={styles.stepDesc}>
                The closer your timing is to the center sweetspot, the higher your score:
              </Text>
              <View style={styles.tiersRow}>
                <View style={[styles.tierCapsule, { borderColor: OTColors.green }]}>
                  <Text style={[styles.tierTitle, { color: OTColors.green }]}>GOOD</Text>
                  <Text style={styles.tierPts}>+10</Text>
                </View>
                <View style={[styles.tierCapsule, { borderColor: OTColors.cyan }]}>
                  <Text style={[styles.tierTitle, { color: OTColors.cyan }]}>GREAT</Text>
                  <Text style={styles.tierPts}>+25</Text>
                </View>
                <View style={[styles.tierCapsule, { borderColor: OTColors.gold }]}>
                  <Text style={[styles.tierTitle, { color: OTColors.gold }]}>PERFECT</Text>
                  <Text style={styles.tierPts}>+50</Text>
                </View>
              </View>
            </View>

            {/* Step 05: KEEP THE COMBO & FEVER */}
            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.numBadge}>
                  <Text style={styles.numBadgeText}>05</Text>
                </View>
                <Text style={styles.stepTitle}>COMBO & FEVER</Text>
              </View>
              <Text style={styles.stepDesc}>
                Hit targets consecutively to build combo multipliers. Chain 5 perfects to ignite 5s of Fever Mode (x2 points)!
              </Text>
              <View style={styles.feverBannerRow}>
                <Text style={styles.feverBannerText}>⚡ FEVER MODE ×2 MULTIPLIER</Text>
              </View>
            </View>
          </View>

          {/* Bottom Start CTA */}
          <Pressable
            style={({ pressed }) => [styles.startCta, pressed && styles.btnPressed]}
            onPress={onStartGame}
          >
            <Text style={styles.startCtaText}>START</Text>
            <SvgPlay size={20} color="#07090C" />
          </Pressable>
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
  stepsList: {
    gap: 12,
  },
  stepCard: {
    backgroundColor: 'rgba(16, 21, 28, 0.88)',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    padding: 14,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  numBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: OTColors.gold,
  },
  numBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: OTColors.gold,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  stepDesc: {
    fontSize: 11,
    color: OTColors.textSecondary,
    lineHeight: 16,
    marginTop: 6,
  },
  diagramTrack: {
    height: 32,
    backgroundColor: 'rgba(7, 9, 12, 0.75)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginTop: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  diagramTarget: {
    position: 'absolute',
    left: '50%',
    width: '35%',
    height: '100%',
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    borderWidth: 1,
    borderColor: OTColors.cyan,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagramLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: OTColors.cyan,
    letterSpacing: 1,
  },
  diagramNeedle: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: OTColors.gold,
  },
  diagramTouchArea: {
    height: 36,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: OTColors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  diagramTouchText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: OTColors.cyan,
    letterSpacing: 1.5,
  },
  tiersRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  tierCapsule: {
    flex: 1,
    backgroundColor: 'rgba(7, 9, 12, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 6,
    alignItems: 'center',
  },
  tierTitle: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tierPts: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  feverBannerRow: {
    marginTop: 10,
    backgroundColor: OTColors.feverSoft,
    borderWidth: 1,
    borderColor: OTColors.feverHot,
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  feverBannerText: {
    fontSize: 10,
    fontWeight: '900',
    color: OTColors.feverHot,
    letterSpacing: 1,
  },
  startCta: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: OTColors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    shadowColor: OTColors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  startCtaText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#07090C',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
});
