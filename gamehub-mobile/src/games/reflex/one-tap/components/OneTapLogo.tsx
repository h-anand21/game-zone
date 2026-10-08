// ============================================================
// ONE TAP: PRECISION GAME — OneTapLogo
// High-tech Chrome & Gold Vector Emblem
// ============================================================

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { OTColors } from '../theme/colors';

interface OneTapLogoProps {
  size?: 'hero' | 'medium' | 'compact';
  showSubtitle?: boolean;
}

export const OneTapLogo: React.FC<OneTapLogoProps> = ({
  size = 'medium',
  showSubtitle = true,
}) => {
  const isHero = size === 'hero';
  const isCompact = size === 'compact';

  const titleFontSize = isHero ? 38 : isCompact ? 18 : 28;
  const subtitleFontSize = isHero ? 11 : isCompact ? 7.5 : 9.5;
  const ringSize = isHero ? 110 : isCompact ? 44 : 70;

  return (
    <View style={styles.container}>
      {/* Background Concentric Target Glow Rings */}
      <View style={[styles.ringsContainer, { width: ringSize, height: ringSize }]}>
        <Svg width={ringSize} height={ringSize} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFE875" />
              <Stop offset="100%" stopColor="#D4AF37" />
            </LinearGradient>
          </Defs>
          <Circle
            cx={50}
            cy={50}
            r={44}
            stroke="url(#goldGrad)"
            strokeWidth={isHero ? 2.5 : 1.5}
            fill="none"
            opacity={0.4}
          />
          <Circle
            cx={50}
            cy={50}
            r={24}
            stroke={OTColors.cyan}
            strokeWidth={isHero ? 2 : 1.2}
            fill="none"
            opacity={0.5}
          />
          <Circle cx={50} cy={50} r={5} fill={OTColors.gold} opacity={0.8} />
          <Line x1={4} y1={50} x2={20} y2={50} stroke={OTColors.gold} strokeWidth={1.5} opacity={0.4} />
          <Line x1={80} y1={50} x2={96} y2={50} stroke={OTColors.gold} strokeWidth={1.5} opacity={0.4} />
        </Svg>
      </View>

      {/* Main Dual-Tone Chrome & Gold Title */}
      <View style={styles.titleRow}>
        <Text style={[styles.textOne, { fontSize: titleFontSize }]}>ONE</Text>
        <Text style={[styles.textTap, { fontSize: titleFontSize }]}>TAP</Text>
      </View>

      {/* Precision Subtitle */}
      {showSubtitle && (
        <View style={styles.subRow}>
          <View style={styles.subLine} />
          <Text style={[styles.subtitle, { fontSize: subtitleFontSize }]}>
            PRECISION GAME
          </Text>
          <View style={styles.subLine} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringsContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textOne: {
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  textTap: {
    fontWeight: '900',
    fontStyle: 'italic',
    color: OTColors.gold,
    letterSpacing: 2,
    textShadowColor: OTColors.goldGlow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  subLine: {
    width: 20,
    height: 1,
    backgroundColor: OTColors.gold,
    opacity: 0.6,
  },
  subtitle: {
    fontWeight: '800',
    color: OTColors.gold,
    letterSpacing: 3,
  },
});
