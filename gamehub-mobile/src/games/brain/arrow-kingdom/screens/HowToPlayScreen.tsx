// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Screen 06: How To Play Screen
// Illustrated tutorial cards with arrow diagrams & rules
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polygon, Line } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import { FantasyBackground } from '../components/ui/FantasyBackground';
import { WoodHeader } from '../components/ui/WoodHeader';
import { GameButton } from '../components/ui/GameButton';

interface HowToPlayScreenProps {
  onBack: () => void;
  onStartPlaying: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({
  onBack,
  onStartPlaying,
}) => {
  const insets = useSafeAreaInsets();

  const tutorialSteps = [
    {
      num: '01',
      title: 'SLIDE IN ARROW DIRECTION',
      desc: 'Each bent arrow points in exactly ONE escape direction. Touch or swipe the arrow along its path to launch it forward.',
      color: COLORS.blue,
      diagram: (
        <View style={styles.diagramBox}>
          <Svg width={180} height={70} viewBox="0 0 180 70">
            {/* Grid hint */}
            <Line x1="10" y1="35" x2="170" y2="35" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            {/* Arrow body */}
            <Path d="M 25 35 L 130 35" stroke={COLORS.blue} strokeWidth={12} strokeLinecap="round" />
            <Path d="M 25 35 L 130 35" stroke="#FFF" strokeWidth={3} strokeLinecap="round" />
            <Polygon points="150,35 125,20 125,50" fill={COLORS.blue} />
          </Svg>
          <Text style={styles.handHint}>👆 TAP TO SLIDE</Text>
        </View>
      ),
    },
    {
      num: '02',
      title: 'AVOID BLOCKED OBSTACLES',
      desc: 'Arrows cannot pass through other arrows! If another arrow occupies the path ahead, it will shake with an error flash. Clear the blockers first!',
      color: COLORS.pink,
      diagram: (
        <View style={styles.diagramBox}>
          <Svg width={180} height={90} viewBox="0 0 180 90">
            {/* Blocker vertical arrow */}
            <Path d="M 115 15 L 115 75" stroke={COLORS.pink} strokeWidth={10} strokeLinecap="round" />
            <Polygon points="115,85 102,70 128,70" fill={COLORS.pink} />

            {/* Blocked horizontal arrow */}
            <Path d="M 20 45 L 85 45" stroke={COLORS.red} strokeWidth={10} strokeLinecap="round" />
            <Polygon points="98,45 84,32 84,58" fill={COLORS.red} />

            {/* Collision cross */}
            <Text style={{ position: 'absolute', left: 95, top: 25, fontSize: 16 }}>💥</Text>
          </Svg>
          <Text style={[styles.handHint, { color: COLORS.red }]}>⛔ BLOCKED BY OTHER ARROWS</Text>
        </View>
      ),
    },
    {
      num: '03',
      title: 'CLEAR BOARD TO CONQUER',
      desc: 'When an arrow reaches the border without collision, it WHOOSHES off the board. Remove all arrows in minimal moves to claim 3 STARS and treasure chests!',
      color: COLORS.green,
      diagram: (
        <View style={styles.diagramBox}>
          <Text style={styles.celebrationEmoji}>🏆 ⭐⭐⭐</Text>
          <Text style={styles.celebrationLabel}>ALL ARROWS ESCAPED!</Text>
        </View>
      ),
    },
  ];

  return (
    <FantasyBackground>
      <View style={styles.container}>
        <WoodHeader
          title="HOW TO PLAY"
          subtitle="TACTICAL TRAINING"
          onBack={onBack}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 24, 36) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {tutorialSteps.map((s) => (
            <View key={s.num} style={styles.stepCard}>
              <LinearGradient
                colors={['#10395C', '#071F36']}
                style={styles.cardGrad}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={[styles.numBadge, { backgroundColor: s.color }]}>
                    <Text style={styles.numText}>{s.num}</Text>
                  </View>
                  <Text style={[styles.stepTitle, { color: s.color }]}>{s.title}</Text>
                </View>

                {/* Description */}
                <Text style={styles.stepDesc}>{s.desc}</Text>

                {/* Diagram */}
                {s.diagram}
              </LinearGradient>
            </View>
          ))}

          {/* Action Button */}
          <GameButton
            title="START PUZZLING ▶"
            variant="green"
            size="large"
            onPress={onStartPlaying}
            style={styles.startBtn}
          />
        </ScrollView>
      </View>
    </FantasyBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 14,
  },
  stepCard: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#3D1C08',
    backgroundColor: '#351503',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
  },
  cardGrad: {
    padding: 16,
    borderRadius: 17,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  numBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#04101D',
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  stepDesc: {
    fontSize: 11,
    color: '#E2EEF9',
    lineHeight: 16,
    marginBottom: 12,
  },
  diagramBox: {
    width: '100%',
    backgroundColor: 'rgba(6, 18, 32, 0.85)',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  handHint: {
    fontSize: 10,
    fontWeight: '900',
    color: '#78F329',
    letterSpacing: 1,
    marginTop: 6,
  },
  celebrationEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  celebrationLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
  startBtn: {
    width: '100%',
    marginTop: 8,
  },
});

export default HowToPlayScreen;
