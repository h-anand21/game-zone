// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Reward Treasure Chest Modal
// Interactive treasure chest animation with light rays & claim
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Modal, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import { GameButton } from './GameButton';
import { ArrowHaptics } from '../../utils/haptics';

interface RewardChestModalProps {
  visible: boolean;
  rewardCoins: number;
  rewardGems: number;
  onClaim: () => void;
}

export const RewardChestModal: React.FC<RewardChestModalProps> = ({
  visible,
  rewardCoins,
  rewardGems,
  onClaim,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const raysRotate = useRef(new Animated.Value(0)).current;
  const rewardScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsOpened(false);
      rewardScale.setValue(0);

      // Chest shake & jump sequence before opening
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -8, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -20, duration: 150, useNativeDriver: true }), // jump!
        Animated.timing(shakeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      ]).start(() => {
        setIsOpened(true);
        ArrowHaptics.victory();
        Animated.spring(rewardScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }).start();
      });

      // Continuous golden rays rotation
      Animated.loop(
        Animated.timing(raysRotate, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [visible, shakeAnim, raysRotate, rewardScale]);

  const spin = raysRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.woodFrame}>
          <LinearGradient
            colors={['#10395C', '#071F36']}
            style={styles.cardContent}
          >
            {/* Title */}
            <Text style={styles.chestHeader}>ROYAL TREASURE CHEST</Text>

            {/* Light Rays & Chest Stage */}
            <View style={styles.stageContainer}>
              {isOpened && (
                <Animated.View
                  style={[
                    styles.raysWrapper,
                    { transform: [{ rotate: spin }] },
                  ]}
                >
                  <Svg width={260} height={260} viewBox="0 0 260 260">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                      <Line
                        key={`ray-${deg}`}
                        x1="130"
                        y1="130"
                        x2={130 + 120 * Math.cos((deg * Math.PI) / 180)}
                        y2={130 + 120 * Math.sin((deg * Math.PI) / 180)}
                        stroke={COLORS.gold}
                        strokeWidth="12"
                        strokeOpacity="0.22"
                      />
                    ))}
                    <Circle cx="130" cy="130" r="40" fill={COLORS.gold} opacity={0.2} />
                  </Svg>
                </Animated.View>
              )}

              {/* Animated Chest Icon */}
              <Animated.View
                style={[
                  styles.chestIconContainer,
                  { transform: [{ translateX: shakeAnim }, { translateY: shakeAnim }] },
                ]}
              >
                <Text style={styles.chestEmoji}>{isOpened ? '👑' : '🎁'}</Text>
              </Animated.View>
            </View>

            {/* Revealed Rewards */}
            {isOpened ? (
              <Animated.View
                style={[
                  styles.rewardContainer,
                  { transform: [{ scale: rewardScale }] },
                ]}
              >
                <Text style={styles.foundLabel}>YOU DISCOVERED</Text>
                <View style={styles.lootRow}>
                  {rewardCoins > 0 ? (
                    <View style={styles.lootPill}>
                      <Text style={styles.lootEmoji}>🪙</Text>
                      <Text style={styles.lootAmount}>+{rewardCoins}</Text>
                    </View>
                  ) : null}
                  {rewardGems > 0 ? (
                    <View style={[styles.lootPill, styles.gemPill]}>
                      <Text style={styles.lootEmoji}>💎</Text>
                      <Text style={[styles.lootAmount, { color: COLORS.gem }]}>
                        +{rewardGems}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </Animated.View>
            ) : (
              <View style={styles.openingPlaceholder}>
                <Text style={styles.unlockingText}>UNLOCKING RUNIC SEALS...</Text>
              </View>
            )}

            {/* Claim Button */}
            <GameButton
              title="CLAIM REWARDS ✨"
              variant="green"
              size="large"
              onPress={onClaim}
              disabled={!isOpened}
              style={styles.claimBtn}
            />
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 10, 19, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  woodFrame: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#4A2108',
    backgroundColor: '#351503',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
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
  chestHeader: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  stageContainer: {
    width: 200,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  raysWrapper: {
    position: 'absolute',
  },
  chestIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  chestEmoji: {
    fontSize: 74,
  },
  rewardContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  foundLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.muted,
    letterSpacing: 2,
    marginBottom: 8,
  },
  lootRow: {
    flexDirection: 'row',
    gap: 12,
  },
  lootPill: {
    backgroundColor: 'rgba(8, 27, 47, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    gap: 6,
  },
  gemPill: {
    borderColor: COLORS.gem,
  },
  lootEmoji: {
    fontSize: 18,
  },
  lootAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 1,
  },
  openingPlaceholder: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockingText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
  claimBtn: {
    width: '100%',
    marginTop: 6,
  },
});

export default RewardChestModal;
