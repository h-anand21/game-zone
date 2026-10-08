// ============================================================
// ONE TAP: PRECISION GAME — ModeSelectScreen
// Mode Selection with Classic, Endless, Rush & Locked Modes
// ============================================================

import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { OneTapLogo } from '../components/OneTapLogo';
import {
  SvgBackArrow,
  SvgChevronRight,
  SvgLock,
} from '../components/icons/OneTapIcons';
import { OTColors } from '../theme/colors';
import { GameModeId } from '../types';
import { GAME_MODES } from '../config';

interface ModeSelectScreenProps {
  onBack: () => void;
  onSelectMode: (mode: GameModeId) => void;
}

export const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  onBack,
  onSelectMode,
}) => {
  const modes = [GAME_MODES.classic, GAME_MODES.endless, GAME_MODES.rush];
  const lockedModes = [GAME_MODES.zen, GAME_MODES.hardcore, GAME_MODES.chaos];

  return (
    <BackgroundLayer screen="other" overlayDarkness={0.4}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
            onPress={onBack}
            hitSlop={8}
          >
            <SvgBackArrow size={20} color="#FFFFFF" />
          </Pressable>
          <OneTapLogo size="compact" showSubtitle={true} />
          <View style={styles.headerRightSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Title Header */}
          <View style={styles.titleSection}>
            <Text style={styles.titleText}>CHOOSE YOUR MODE</Text>
            <Text style={styles.subTitleText}>SAME GAME. DIFFERENT CHALLENGES.</Text>
          </View>

          {/* Active Playable Mode Cards */}
          <View style={styles.modesList}>
            {modes.map((mode) => (
              <Pressable
                key={mode.id}
                style={({ pressed }) => [
                  styles.modeCard,
                  { borderColor: mode.color },
                  pressed && styles.btnPressed,
                ]}
                onPress={() => onSelectMode(mode.id)}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: mode.color }]}>
                    {mode.title}
                  </Text>
                  <View style={[styles.badgePill, { backgroundColor: `${mode.color}25` }]}>
                    <Text style={[styles.badgeText, { color: mode.color }]}>
                      {mode.subtitle}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardDesc}>{mode.description}</Text>

                {/* Mini Visual Timing Rail Graphic */}
                <View style={styles.miniRail}>
                  <View style={[styles.miniTrack, { borderColor: `${mode.color}40` }]}>
                    <View
                      style={[
                        styles.miniTarget,
                        {
                          backgroundColor: `${mode.color}35`,
                          borderColor: mode.color,
                        },
                      ]}
                    />
                    <View style={[styles.miniNeedle, { backgroundColor: mode.color }]} />
                  </View>
                  <View style={[styles.chevronWrap, { backgroundColor: `${mode.color}25` }]}>
                    <SvgChevronRight size={16} color={mode.color} />
                  </View>
                </View>

                {/* Speed indicator */}
                <View style={styles.speedRow}>
                  <Text style={styles.speedLabel}>📶 {mode.speedLabel}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Locked Future Modes (Zen, Hardcore, Chaos) */}
          <View style={styles.lockedSection}>
            <View style={styles.lockedRow}>
              {lockedModes.map((lMode) => (
                <View key={lMode.id} style={styles.lockedCard}>
                  <SvgLock size={20} color={OTColors.textMuted} />
                  <Text style={styles.lockedTitle}>{lMode.title}</Text>
                  <Text style={styles.lockedDesc}>{lMode.subtitle}</Text>
                  <View style={styles.lockedPill}>
                    <Text style={styles.lockedPillText}>LOCKED</Text>
                  </View>
                  <Text style={styles.lockedReq} numberOfLines={2}>
                    {lMode.lockRequirement}
                  </Text>
                </View>
              ))}
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
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  headerRightSpacer: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 14,
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
    color: OTColors.textSecondary,
    letterSpacing: 1.8,
    marginTop: 4,
  },
  modesList: {
    gap: 14,
  },
  modeCard: {
    backgroundColor: 'rgba(16, 21, 28, 0.88)',
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardDesc: {
    fontSize: 11,
    color: OTColors.textSecondary,
    marginTop: 6,
    lineHeight: 16,
  },
  miniRail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  miniTrack: {
    flex: 1,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'rgba(7, 9, 12, 0.7)',
    position: 'relative',
    justifyContent: 'center',
  },
  miniTarget: {
    position: 'absolute',
    left: '55%',
    width: '30%',
    height: '100%',
    borderWidth: 1,
    borderRadius: 4,
  },
  miniNeedle: {
    position: 'absolute',
    left: '30%',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedRow: {
    marginTop: 8,
  },
  speedLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: OTColors.textMuted,
  },
  lockedSection: {
    marginTop: 20,
  },
  lockedRow: {
    flexDirection: 'row',
    gap: 8,
  },
  lockedCard: {
    flex: 1,
    backgroundColor: 'rgba(16, 21, 28, 0.65)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 10,
    alignItems: 'center',
  },
  lockedTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  lockedDesc: {
    fontSize: 7.5,
    color: OTColors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  lockedPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
  },
  lockedPillText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: OTColors.textMuted,
  },
  lockedReq: {
    fontSize: 7,
    color: OTColors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});
