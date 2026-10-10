// ============================================================
// REACTION FIRE — Screen 05: How to Play Training Guide
// Rules, color states, threshold classifications & native SVG diagrams
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line } from 'react-native-svg';
import { HeaderBar } from '../components/HeaderBar';
import { ArcadeButton } from '../components/ArcadeButton';
import { RfColors } from '../theme';

interface HowToPlayScreenProps {
  onBack: () => void;
  onOpenPractice: () => void;
  onStartClassic: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({
  onBack,
  onOpenPractice,
  onStartClassic,
}) => {
  const insets = useSafeAreaInsets();
  const sections = [
    {
      num: '01',
      title: 'WAIT FOR GREEN',
      desc: 'Electric blue means standby. The delay is random (1 to 4 seconds). Keep your finger hovering. DO NOT TAP YET.',
      color: RfColors.primaryBlue,
      diagram: (
        <View style={[styles.diagramBox, { borderColor: RfColors.primaryBlue }]}>
          <Svg width={60} height={60} viewBox="0 0 60 60">
            <Circle cx="30" cy="30" r="26" stroke={RfColors.primaryBlue} strokeWidth="1.5" fill="none" strokeDasharray="4,4" />
            <Circle cx="30" cy="30" r="14" stroke={RfColors.primaryBlue} strokeWidth="2" fill="none" />
          </Svg>
          <Text style={styles.diagramIcon}>⏳</Text>
        </View>
      ),
    },
    {
      num: '02',
      title: 'REACT INSTANTLY',
      desc: 'When the screen turns bright neon LIME, tap anywhere on the screen immediately. Tap latency is measured in milliseconds.',
      color: RfColors.goLime,
      diagram: (
        <View style={[styles.diagramBox, { borderColor: RfColors.goLime, backgroundColor: 'rgba(183, 255, 60, 0.1)' }]}>
          <Svg width={60} height={60} viewBox="0 0 60 60">
            <Circle cx="30" cy="30" r="26" stroke={RfColors.goLime} strokeWidth="2" fill="none" />
            <Circle cx="30" cy="30" r="14" stroke={RfColors.goLime} strokeWidth="2" fill="none" />
          </Svg>
          <Text style={[styles.diagramIcon, { color: RfColors.goLime }]}>⚡</Text>
        </View>
      ),
    },
    {
      num: '03',
      title: 'AVOID FALSE STARTS',
      desc: 'Tapping before the green signal flashes RED and invalidates your attempt. Wait for true confirmation.',
      color: RfColors.signalRed,
      diagram: (
        <View style={[styles.diagramBox, { borderColor: RfColors.signalRed, backgroundColor: 'rgba(255, 77, 99, 0.1)' }]}>
          <Svg width={60} height={60} viewBox="0 0 60 60">
            <Circle cx="30" cy="30" r="26" stroke={RfColors.signalRed} strokeWidth="2" fill="none" />
            <Line x1="18" y1="18" x2="42" y2="42" stroke={RfColors.signalRed} strokeWidth="2" />
            <Line x1="42" y1="18" x2="18" y2="42" stroke={RfColors.signalRed} strokeWidth="2" />
          </Svg>
          <Text style={styles.diagramIcon}>⚠️</Text>
        </View>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <HeaderBar
        title="HOW TO PLAY"
        subtitle="COMBAT REFLEX TRAINING"
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollList,
          { paddingBottom: Math.max(insets.bottom + 20, 32) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((sec) => (
          <View key={sec.num} style={[styles.card, { borderColor: sec.color }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.numBadge, { backgroundColor: sec.color }]}>
                <Text style={styles.numText}>{sec.num}</Text>
              </View>
              <Text style={[styles.cardTitle, { color: sec.color }]}>{sec.title}</Text>
            </View>

            <Text style={styles.cardDesc}>{sec.desc}</Text>

            <View style={styles.diagramWrapper}>{sec.diagram}</View>
          </View>
        ))}

        {/* Reaction Time Classification Table */}
        <View style={styles.tableCard}>
          <Text style={styles.tableTitle}>⏱️ PERFORMANCE BENCHMARKS</Text>

          <View style={styles.tableRow}>
            <Text style={[styles.bracketText, { color: RfColors.goLime }]}>&lt; 250 ms</Text>
            <Text style={styles.rankText}>LIGHTNING FAST ⚡</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.bracketText, { color: RfColors.secondaryCyan }]}>250 – 349 ms</Text>
            <Text style={styles.rankText}>FAST / VICTORY TARGET ✓</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.bracketText, { color: RfColors.primaryBlue }]}>350 – 499 ms</Text>
            <Text style={styles.rankText}>GOOD</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.bracketText, { color: RfColors.rewardGold }]}>500 – 699 ms</Text>
            <Text style={styles.rankText}>NORMAL</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.bracketText, { color: RfColors.signalRed }]}>700 ms +</Text>
            <Text style={styles.rankText}>KEEP TRAINING</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionBlock}>
          <ArcadeButton
            title="TRY PRACTICE ARENA (3 RUNS)"
            variant="cyan"
            icon="🛡️"
            size="large"
            onPress={onOpenPractice}
            style={styles.actionBtn}
          />

          <ArcadeButton
            title="PLAY CLASSIC TEST NOW"
            variant="lime"
            icon="⚡"
            onPress={onStartClassic}
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollList: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(10, 23, 41, 0.9)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  numBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#050914',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cardDesc: {
    fontSize: 12,
    color: RfColors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  diagramWrapper: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  diagramBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: 'rgba(5, 9, 20, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  diagramIcon: {
    position: 'absolute',
    fontSize: 22,
  },
  tableCard: {
    backgroundColor: 'rgba(10, 23, 41, 0.9)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  tableTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: RfColors.rewardGold,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  bracketText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  rankText: {
    fontSize: 11,
    fontWeight: '800',
    color: RfColors.textPrimary,
    letterSpacing: 1,
  },
  actionBlock: {
    marginTop: 8,
    gap: 12,
  },
  actionBtn: {
    width: '100%',
  },
});

export default HowToPlayScreen;
