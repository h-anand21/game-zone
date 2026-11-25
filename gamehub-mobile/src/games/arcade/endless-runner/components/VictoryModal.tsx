// ============================================================
// Color Bloom Sort — Victory Modal Dialog
// Confetti particles, stars rating, moves taken & coin rewards
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowRightIcon,
  CloseIcon,
  CoinIcon,
  MenuGridIcon,
  RestartIcon,
  StarIcon,
  TrophyIcon,
} from './GameIcons';

interface VictoryModalProps {
  visible: boolean;
  level: number;
  moves: number;
  coinsEarned: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onClose?: () => void;
  onExit?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  visible,
  level,
  moves,
  coinsEarned,
  onNextLevel,
  onReplay,
  onClose,
  onExit,
}) => {
  const [scaleAnim] = useState(() => new Animated.Value(0.85));
  const [bounceAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 0,
            friction: 4,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      bounceAnim.setValue(0);
    }
  }, [visible, scaleAnim, bounceAnim]);

  // Star calculation based on move efficiency
  const stars = moves <= 12 ? 3 : moves <= 20 ? 2 : 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose || onExit}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalWrapper,
            {
              transform: [{ scale: scaleAnim }, { translateY: bounceAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#181E3B', '#0A0E1F']}
            style={styles.modalCard}
          >
            {/* Top Close Dismiss Button */}
            {onClose && (
              <Pressable
                onPress={onClose}
                style={styles.closeModalBtn}
                hitSlop={12}
              >
                <CloseIcon size={15} color="#94A3B8" />
              </Pressable>
            )}

            {/* Top Glow Trophy Banner */}
            <View style={styles.bannerBadge}>
              <TrophyIcon size={17} />
              <Text style={styles.bannerText}>LEVEL {level} SOLVED!</Text>
            </View>

            {/* Stars Row */}
            <View style={styles.starsRow}>
              <StarIcon size={32} filled={stars >= 1} />
              <StarIcon size={42} filled={stars >= 2} style={styles.starCenter} />
              <StarIcon size={32} filled={stars >= 3} />
            </View>

            <Text style={styles.subtitle}>All colors beautifully bloomed!</Text>

            {/* Reward & Moves Stats Card */}
            <View style={styles.statsCard}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>MOVES</Text>
                <Text style={styles.statValue}>{moves}</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>REWARD</Text>
                <View style={styles.rewardValueRow}>
                  <Text style={[styles.statValue, { color: '#FBBF24' }]}>+{coinsEarned}</Text>
                  <CoinIcon size={19} />
                </View>
              </View>
            </View>

            {/* Primary Action: Next Level */}
            <Pressable
              onPress={onNextLevel}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
              ]}
            >
              <LinearGradient
                colors={['#00CFFF', '#0284C7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.btnGradient}
              >
                <View style={styles.btnContentRow}>
                  <Text style={styles.primaryBtnText}>NEXT LEVEL</Text>
                  <ArrowRightIcon size={16} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </Pressable>

            {/* Secondary Actions */}
            <View style={styles.rowBtns}>
              <Pressable
                onPress={onReplay}
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <View style={styles.secondaryBtnRow}>
                  <RestartIcon size={14} color="#E2E8F0" />
                  <Text style={styles.secondaryBtnText}>REPLAY</Text>
                </View>
              </Pressable>

              {onExit && (
                <Pressable
                  onPress={onExit}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={styles.secondaryBtnRow}>
                    <MenuGridIcon size={14} color="#E2E8F0" />
                    <Text style={styles.secondaryBtnText}>MENU</Text>
                  </View>
                </Pressable>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 7, 15, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  modalCard: {
    width: '100%',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#00CFFF',
    padding: 22,
    alignItems: 'center',
    shadowColor: '#00CFFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 12,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 207, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00CFFF',
    marginBottom: 10,
    gap: 6,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#00CFFF',
    letterSpacing: 1.2,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 8,
  },
  starCenter: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 16,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    paddingVertical: 12,
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '75%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignSelf: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  rewardValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
  },
  btnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  rowBtns: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E2E8F0',
    letterSpacing: 0.6,
  },
  closeModalBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 10,
  },
});
