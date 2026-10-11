// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Level Complete Modal
// Celebratory victory dialog with animated stars & rewards
// ============================================================

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { GameButton } from '../ui/GameButton';
import { StarsDisplay } from '../ui/StarsDisplay';
import { Confetti } from '../effects/Confetti';
import { ArrowHaptics } from '../../utils/haptics';

interface LevelCompleteModalProps {
  visible: boolean;
  levelNumber: number;
  moves: number;
  bestMoves: number;
  stars: number;
  rewardCoins: number;
  rewardGems?: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  visible,
  levelNumber,
  moves,
  bestMoves,
  stars,
  rewardCoins,
  rewardGems = 0,
  onNextLevel,
  onReplay,
  onHome,
}) => {
  const cardScale = useRef(new Animated.Value(0.7)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      ArrowHaptics.victory();
      Animated.parallel([
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      cardScale.setValue(0.7);
      cardOpacity.setValue(0);
    }
  }, [visible, cardScale, cardOpacity]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        {/* Confetti Rain */}
        <Confetti />

        <Animated.View
          style={[
            styles.cardWrapper,
            {
              transform: [{ scale: cardScale }],
              opacity: cardOpacity,
            },
          ]}
        >
          {/* Wood Outer Frame */}
          <View style={styles.woodFrame}>
            <LinearGradient
              colors={['#10395C', '#071F36']}
              style={styles.cardContent}
            >
              {/* Header Title Ribbon */}
              <View style={styles.titleRibbon}>
                <LinearGradient
                  colors={[COLORS.woodLight, COLORS.woodDark]}
                  style={styles.ribbonGrad}
                >
                  <Text style={styles.titleText}>VICTORY!</Text>
                  <Text style={styles.subtitleText}>LEVEL {levelNumber} CLEARED</Text>
                </LinearGradient>
              </View>

              {/* Stars Earned */}
              <View style={styles.starsContainer}>
                <StarsDisplay stars={stars} size="large" />
              </View>

              {/* Stats Card */}
              <View style={styles.statsCard}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>MOVES USED</Text>
                  <Text style={styles.statValue}>{moves}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>BEST RECORD</Text>
                  <Text style={[styles.statValue, { color: COLORS.gold }]}>
                    {bestMoves} 👑
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>REWARDS</Text>
                  <View style={styles.rewardPills}>
                    <Text style={styles.rewardText}>+{rewardCoins} 🪙</Text>
                    {rewardGems > 0 ? (
                      <Text style={[styles.rewardText, { color: COLORS.gem }]}>
                        +{rewardGems} 💎
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* Primary Next Level CTA */}
              <GameButton
                title="NEXT LEVEL ▶"
                variant="green"
                size="large"
                onPress={onNextLevel}
                style={styles.primaryBtn}
              />

              {/* Secondary Controls (Replay & Home) */}
              <View style={styles.secondaryRow}>
                <GameButton
                  title="REPLAY ↻"
                  variant="wood"
                  size="medium"
                  onPress={onReplay}
                  style={styles.halfBtn}
                />
                <GameButton
                  title="HOME 🏠"
                  variant="blue"
                  size="medium"
                  onPress={onHome}
                  style={styles.halfBtn}
                />
              </View>
            </LinearGradient>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 10, 19, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  woodFrame: {
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#4A2108',
    backgroundColor: '#351503',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  cardContent: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(32, 191, 255, 0.3)',
  },
  titleRibbon: {
    marginTop: -32,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#3D1C08',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  ribbonGrad: {
    paddingHorizontal: 28,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.woodHighlight,
    borderRadius: 11,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
  starsContainer: {
    marginVertical: 12,
  },
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(8, 27, 47, 0.85)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 18,
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  rewardPills: {
    flexDirection: 'row',
    gap: 8,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.gold,
  },
  primaryBtn: {
    width: '100%',
    marginBottom: 10,
  },
  secondaryRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  halfBtn: {
    flex: 1,
  },
});

export default LevelCompleteModal;
