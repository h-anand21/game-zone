// ============================================================
// ONE TAP: PRECISION GAME — CountdownScreen
// Cosmic radial countdown dial (Ready 3 2 1 GO)
// ============================================================

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { BackgroundLayer } from '../components/BackgroundLayer';
import { OneTapLogo } from '../components/OneTapLogo';
import { SvgBackArrow, SvgCrown } from '../components/icons/OneTapIcons';
import { OTColors } from '../theme/colors';
import { GameModeId } from '../types';
import { GAME_MODES } from '../config';
import { OneTapHaptics } from '../haptics/hapticManager';

interface CountdownScreenProps {
  modeId: GameModeId;
  bestScore: number;
  onBack: () => void;
  onCountdownComplete: () => void;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({
  modeId,
  bestScore,
  onBack,
  onCountdownComplete,
}) => {
  const [count, setCount] = useState<number | 'GO'>(3);
  const modeConfig = GAME_MODES[modeId] || GAME_MODES.classic;

  const digitScale = useSharedValue(0.4);
  const digitOpacity = useSharedValue(0);

  useEffect(() => {
    const triggerPop = () => {
      digitScale.value = 0.4;
      digitOpacity.value = 0;
      digitScale.value = withSpring(1.0, { damping: 10 });
      digitOpacity.value = withTiming(1, { duration: 150 });
    };

    triggerPop();
    OneTapHaptics.countdownTick();

    const timer1 = setTimeout(() => {
      setCount(2);
      triggerPop();
      OneTapHaptics.countdownTick();
    }, 900);

    const timer2 = setTimeout(() => {
      setCount(1);
      triggerPop();
      OneTapHaptics.countdownTick();
    }, 1800);

    const timer3 = setTimeout(() => {
      setCount('GO');
      triggerPop();
      OneTapHaptics.countdownGo();
    }, 2700);

    const timer4 = setTimeout(() => {
      onCountdownComplete();
    }, 3400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const digitStyle = useAnimatedStyle(() => ({
    transform: [{ scale: digitScale.value }],
    opacity: digitOpacity.value,
  }));

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
          <View style={styles.spacer} />
        </View>

        {/* Telemetry Tag Cards */}
        <View style={styles.tagsRow}>
          {/* Left: Mode tag */}
          <View style={styles.tagCard}>
            <Text style={styles.tagLabel}>MODE</Text>
            <Text style={[styles.tagValue, { color: modeConfig.color }]}>
              {modeConfig.title}
            </Text>
            <Text style={styles.tagSub}>{modeConfig.subtitle}</Text>
          </View>

          {/* Right: Best score tag */}
          <View style={styles.tagCard}>
            <Text style={styles.tagLabel}>BEST SCORE</Text>
            <View style={styles.bestScoreLine}>
              <SvgCrown size={14} color={OTColors.gold} />
              <Text style={styles.bestScoreNum}>{bestScore}</Text>
            </View>
          </View>
        </View>

        {/* Center Countdown Arena */}
        <View style={styles.centerArena}>
          <Text style={styles.readyTitle}>— READY —</Text>

          {/* Giant Cosmic Countdown Dial */}
          <View style={styles.dialWrap}>
            <Svg width={240} height={240} viewBox="0 0 240 240">
              <Defs>
                <LinearGradient id="dialGold" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#FFE875" />
                  <Stop offset="100%" stopColor="#D4AF37" />
                </LinearGradient>
              </Defs>
              <Circle
                cx={120}
                cy={120}
                r={108}
                stroke="url(#dialGold)"
                strokeWidth={3}
                strokeDasharray="24 12"
                fill="none"
              />
              <Circle
                cx={120}
                cy={120}
                r={85}
                stroke={OTColors.cyan}
                strokeWidth={2}
                strokeDasharray="8 6"
                fill="none"
                opacity={0.7}
              />
            </Svg>

            {/* Glowing Digits */}
            <Animated.View style={[styles.digitContainer, digitStyle]}>
              <Text
                style={[
                  styles.digitText,
                  {
                    color: count === 'GO' ? OTColors.cyan : OTColors.gold,
                    fontSize: count === 'GO' ? 56 : 78,
                  },
                ]}
              >
                {count}
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* Bottom space */}
        <View style={styles.bottomSpacer} />
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
  tagsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 12,
  },
  tagCard: {
    flex: 1,
    backgroundColor: 'rgba(16, 21, 28, 0.85)',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tagLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: OTColors.textMuted,
    letterSpacing: 1.5,
  },
  tagValue: {
    fontSize: 14,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1,
    marginTop: 2,
  },
  tagSub: {
    fontSize: 7.5,
    fontWeight: '700',
    color: OTColors.textSecondary,
    letterSpacing: 1,
    marginTop: 1,
  },
  bestScoreLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  bestScoreNum: {
    fontSize: 16,
    fontWeight: '900',
    color: OTColors.gold,
    letterSpacing: 1,
  },
  centerArena: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    fontStyle: 'italic',
    marginBottom: 20,
    textShadowColor: OTColors.gold,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  dialWrap: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  digitContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitText: {
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 2,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 16,
  },
  bottomSpacer: {
    height: 60,
  },
});
