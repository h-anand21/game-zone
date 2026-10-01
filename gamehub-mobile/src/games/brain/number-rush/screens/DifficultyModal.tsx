// ============================================================
// Number Rush — Screen 06: DIFFICULTY SELECT (Choose Your Challenge Reference)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { NRTheme } from '../theme';
import { useNumberRushStore } from '../store/numberRushStore';
import { HeaderHUD, GameButton, MascotIllustration } from '../components';
import type { Difficulty } from '../types';

const JUNGLE_BG = require('@/../assets/images/jungle/jungle_bg.webp');

interface DifficultyConfig {
  id: Difficulty;
  name: string;
  sub: string;
  icon: string;
  objects: string;
  timeLimit: string;
  multiplier: string;
  color: string;
  badge: string;
}

const DIFFICULTIES: DifficultyConfig[] = [
  {
    id: 'easy',
    name: 'CHILL SAFARI',
    sub: 'Relaxed counting with minimal jungle distractors.',
    icon: '🐼',
    objects: '3 - 5 Animals',
    timeLimit: '12s Per Round',
    multiplier: '1.0x Multiplier',
    color: '#2ED573',
    badge: 'CASUAL',
  },
  {
    id: 'medium',
    name: 'SAVANNAH SPRINT',
    sub: 'Faster timer, moderate animal clusters & trick distractors.',
    icon: '🐯',
    objects: '5 - 8 Animals',
    timeLimit: '8s Per Round',
    multiplier: '1.5x Multiplier',
    color: '#FFB800',
    badge: 'STANDARD',
  },
  {
    id: 'hard',
    name: 'JUNGLE MASTER',
    sub: 'Extreme speed, dense camouflaged wildlife & intense reflex.',
    icon: '🦁',
    objects: '8 - 12 Animals',
    timeLimit: '5s Per Round',
    multiplier: '2.0x Multiplier',
    color: '#FF4757',
    badge: 'INSANE',
  },
];

export const DifficultyModal: React.FC = () => {
  const { difficulty, setDifficulty, startCountdown, selectedMode, setScreen } =
    useNumberRushStore();

  const handleStart = () => {
    startCountdown(selectedMode, difficulty);
  };

  return (
    <View style={styles.container}>
      {/* 1. Atmospheric Jungle Background */}
      <ExpoImage source={JUNGLE_BG} style={styles.bgImage} contentFit="cover" />
      <View style={styles.darkVignette} />

      {/* 2. Top Game HUD */}
      <HeaderHUD showBack onBackPress={() => setScreen('mode-preview')} title="DIFFICULTY" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner with Mascot */}
        <View style={styles.bannerRow}>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerSub}>PICK YOUR TEMPO</Text>
            <Text style={styles.bannerTitle}>CHOOSE CHALLENGE</Text>
          </View>
          <View style={styles.bannerMascot}>
            <MascotIllustration size={75} character="tiger" mood="happy" showAura={false} />
          </View>
        </View>

        {/* 3 Large Difficulty Cards */}
        <View style={styles.cardsList}>
          {DIFFICULTIES.map((d) => {
            const isSelected = difficulty === d.id;

            return (
              <Pressable
                key={d.id}
                onPress={() => setDifficulty(d.id)}
                style={({ pressed }) => [
                  styles.card,
                  { borderColor: d.color },
                  isSelected && [
                    styles.selectedCard,
                    { borderColor: '#FFD700', backgroundColor: 'rgba(11, 40, 72, 0.95)' },
                  ],
                  pressed && styles.cardPressed,
                ]}
              >
                {/* Header Tag */}
                <View style={[styles.cardHeaderStrip, { backgroundColor: d.color }]}>
                  <Text style={styles.badgeText}>{d.badge}</Text>
                  <Text style={styles.multiplierText}>{d.multiplier}</Text>
                </View>

                {/* Card Body */}
                <View style={styles.cardBody}>
                  <View style={styles.cardMainRow}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: d.color + '25', borderColor: d.color },
                      ]}
                    >
                      <Text style={styles.diffIcon}>{d.icon}</Text>
                    </View>

                    <View style={styles.titleCol}>
                      <Text style={[styles.diffName, { color: d.color }]}>
                        {d.name}
                      </Text>
                      <Text style={styles.diffDesc}>{d.sub}</Text>
                    </View>

                    {/* Radio Checkmark */}
                    <View
                      style={[
                        styles.checkCircle,
                        isSelected && { backgroundColor: '#FFD700', borderColor: '#FFFFFF' },
                      ]}
                    >
                      {isSelected && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                  </View>

                  {/* Spec Row */}
                  <View style={styles.specRow}>
                    <View style={styles.specPill}>
                      <Text style={styles.specLabel}>OBJECTS</Text>
                      <Text style={styles.specVal}>{d.objects}</Text>
                    </View>

                    <View style={styles.specPill}>
                      <Text style={styles.specLabel}>TIMER</Text>
                      <Text style={styles.specVal}>{d.timeLimit}</Text>
                    </View>

                    <View style={styles.specPill}>
                      <Text style={styles.specLabel}>REWARD</Text>
                      <Text style={[styles.specVal, { color: '#FFD700' }]}>
                        {d.id === 'easy' ? '100% 🪙' : d.id === 'medium' ? '150% 🪙' : '200% 🪙'}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Start Button CTA */}
        <GameButton
          title="START CHALLENGE"
          icon="▶"
          variant="green"
          size="lg"
          fullWidth
          onPress={handleStart}
          style={styles.startBtn}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06120D',
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
  },
  darkVignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 18, 13, 0.65)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 27, 52, 0.88)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFC107',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerSub: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 2,
  },
  bannerTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  bannerMascot: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsList: {
    gap: 14,
    marginBottom: 18,
  },
  card: {
    backgroundColor: 'rgba(7, 27, 52, 0.88)',
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  selectedCard: {
    borderWidth: 3,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  cardHeaderStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#071324',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  multiplierText: {
    color: '#071324',
    fontSize: 10,
    fontWeight: '900',
  },
  cardBody: {
    padding: 14,
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  diffIcon: {
    fontSize: 26,
  },
  titleCol: {
    flex: 1,
  },
  diffName: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  diffDesc: {
    color: '#8CA0BA',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkMark: {
    color: '#071324',
    fontSize: 14,
    fontWeight: '900',
  },
  specRow: {
    flexDirection: 'row',
    gap: 8,
  },
  specPill: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  specLabel: {
    color: '#8CA0BA',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  specVal: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  startBtn: {
    marginTop: 6,
  },
});
