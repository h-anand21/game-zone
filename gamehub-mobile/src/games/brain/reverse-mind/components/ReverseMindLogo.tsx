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

      {/* Chunky Dual-Toned Title Banner */}
      <View style={styles.titleColumn}>
        <View style={styles.wordRow}>
          <Text style={[styles.wordFirst, styles.glowCyan]}>REVERSE</Text>
        </View>
        <View style={styles.wordRow}>
          <Text style={[styles.wordSecond, styles.glowGold]}>MIND 🧠</Text>
        </View>
      </View>

      {showSubtitle && (
        <View style={styles.subtitleBadge}>
          <Text style={styles.subtitleText}>Remember. Flip. Think Different.</Text>
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
    marginBottom: 4,
    shadowColor: '#4DE7FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  titleColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordFirst: {
    fontSize: 28,
    fontWeight: '900',
    color: '#4DE7FF',
    letterSpacing: 2,
    fontFamily: undefined,
  },
  wordSecond: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFD83D',
    letterSpacing: 2,
  },
  glowCyan: {
    textShadowColor: 'rgba(77, 231, 255, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 14,
  },
  glowGold: {
    textShadowColor: 'rgba(255, 216, 61, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 14,
  },
  subtitleBadge: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: RMTheme.radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E2F1FF',
    letterSpacing: 1.2,
  },
});
