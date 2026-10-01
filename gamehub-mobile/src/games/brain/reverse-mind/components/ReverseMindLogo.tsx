// ============================================================
// REVERSE MIND — Custom Vector Logo Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Circle,
} from 'react-native-svg';
import { RMTheme } from '../theme';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const ReverseMindLogo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
}) => {
  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.2 : 1.0;

  return (
    <View style={[styles.container, { transform: [{ scale }] }]}>
      {/* Dynamic Opposing Reversal Arrows Badge */}
      <View style={styles.badgeWrapper}>
        <Svg width={72} height={72} viewBox="0 0 100 100">
          <Defs>
            <SvgGradient id="arrowCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4DE7FF" />
              <Stop offset="100%" stopColor="#00B0FF" />
            </SvgGradient>
            <SvgGradient id="arrowGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFD83D" />
              <Stop offset="100%" stopColor="#FF9100" />
            </SvgGradient>
          </Defs>

          {/* Outer Ring Glow */}
          <Circle cx="50" cy="50" r="44" stroke="#4DE7FF" strokeWidth="2.5" strokeOpacity="0.4" fill="none" />
          <Circle cx="50" cy="50" r="41" fill="#0D1F34" />

          {/* Clockwise Upper Arrow (Cyan) */}
          <Path
            d="M 28 44 C 30 28, 55 24, 70 34"
            stroke="url(#arrowCyan)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <Path d="M 68 24 L 78 35 L 63 39 Z" fill="url(#arrowCyan)" />

          {/* Counter-Clockwise Lower Arrow (Gold) */}
          <Path
            d="M 72 56 C 70 72, 45 76, 30 66"
            stroke="url(#arrowGold)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <Path d="M 32 76 L 22 65 L 37 61 Z" fill="url(#arrowGold)" />

          {/* Center Brain Core Node */}
          <Circle cx="50" cy="50" r="7" fill="#FFFFFF" />
          <Circle cx="50" cy="50" r="4" fill="#8D6BFF" />
        </Svg>
      </View>

      {/* Chunky Dual-Toned Title */}
      <View style={styles.titleRow}>
        <Text style={[styles.wordFirst, styles.glowCyan]}>REVERSE</Text>
        <Text style={[styles.wordSecond, styles.glowGold]}>MIND</Text>
      </View>

      {showSubtitle && (
        <View style={styles.subtitleBadge}>
          <Text style={styles.subtitleText}>VISUAL MEMORY & INVERSION</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeWrapper: {
    marginBottom: 6,
    shadowColor: '#4DE7FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordFirst: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4DE7FF',
    letterSpacing: 2.5,
  },
  wordSecond: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFD83D',
    letterSpacing: 2.5,
  },
  glowCyan: {
    textShadowColor: 'rgba(77, 231, 255, 0.75)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  glowGold: {
    textShadowColor: 'rgba(255, 216, 61, 0.75)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitleBadge: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: RMTheme.radii.full,
    backgroundColor: 'rgba(77, 231, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(77, 231, 255, 0.3)',
  },
  subtitleText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B2F5EA',
    letterSpacing: 1.5,
  },
});
