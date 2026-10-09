// ============================================================
// DON'T TAP WRONG — Screen 01: Splash Screen
// Brand introduction, 3x3 neon insignia, safe green / danger pulse
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated, useWindowDimensions } from 'react-native';
import { BackgroundLayer } from '../components/common/BackgroundLayer';
import { DtwColors } from '../theme/colors';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { width } = useWindowDimensions();
  const [progress, setProgress] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const gridGlowAnim = useRef(new Animated.Value(0.4)).current;

  // Pulse animation for insignia and title
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(gridGlowAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(gridGlowAnim, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim, gridGlowAnim]);

  // Loading sequence (approx 1.2s)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      if (current >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 200);
      } else {
        setProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <BackgroundLayer variant="splash">
      <View style={styles.container}>
        {/* Top spacer */}
        <View style={styles.topSpacer} />

        {/* Center Hero Insignia */}
        <Animated.View style={[styles.heroWrapper, { transform: [{ scale: pulseAnim }] }]}>
          {/* Mini 3x3 Tile Logo Symbol */}
          <View style={styles.miniGrid}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const isSafe = i === 4; // Center tile is green
              const isDanger = i === 1 || i === 7;
              return (
                <View
                  key={i}
                  style={[
                    styles.miniTile,
                    isSafe && styles.miniSafeTile,
                    isDanger && styles.miniDangerTile,
                  ]}
                >
                  {isSafe && <Text style={styles.miniTileSymbol}>✓</Text>}
                  {isDanger && <Text style={styles.miniTileDangerSymbol}>✕</Text>}
                </View>
              );
            })}
          </View>

          <Text style={styles.categoryBadge}>REFLEX • RECOGNITION • SURVIVAL</Text>
          <Text style={styles.mainTitle}>DON'T TAP</Text>
          <Text style={styles.subTitle}>WRONG</Text>
          <View style={styles.dividerLine} />
          <Text style={styles.tagline}>20s BLITZ • SPEED CHALLENGE</Text>
        </Animated.View>

        {/* Bottom Loading Bar */}
        <View style={[styles.loaderContainer, { width: Math.min(width - 48, 300) }]}>
          <Text style={styles.loaderLabel}>INITIALIZING NEON MATRIX {progress}%</Text>
          <View style={styles.loaderTrack}>
            <View style={[styles.loaderFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>
    </BackgroundLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  topSpacer: {
    height: 30,
  },
  heroWrapper: {
    alignItems: 'center',
  },
  miniGrid: {
    width: 108,
    height: 108,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(21, 28, 37, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(66, 217, 255, 0.4)',
    marginBottom: 20,
    shadowColor: DtwColors.cyanAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  miniTile: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniSafeTile: {
    backgroundColor: '#162D0B',
    borderColor: DtwColors.safeGreen,
    shadowColor: DtwColors.safeGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  miniDangerTile: {
    backgroundColor: '#300F13',
    borderColor: DtwColors.dangerRed,
    shadowColor: DtwColors.dangerRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  miniTileSymbol: {
    fontSize: 14,
    fontWeight: '900',
    color: DtwColors.safeGreen,
  },
  miniTileDangerSymbol: {
    fontSize: 12,
    fontWeight: '900',
    color: DtwColors.dangerRed,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
    color: DtwColors.cyanAccent,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: DtwColors.textPrimary,
    letterSpacing: 3,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  subTitle: {
    fontSize: 46,
    fontWeight: '900',
    color: DtwColors.dangerRed,
    letterSpacing: 4,
    marginTop: -8,
    textShadowColor: DtwColors.dangerRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  dividerLine: {
    width: 140,
    height: 3,
    backgroundColor: DtwColors.safeGreen,
    marginVertical: 12,
    borderRadius: 2,
    shadowColor: DtwColors.safeGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: DtwColors.textSecondary,
    textTransform: 'uppercase',
  },
  loaderContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  loaderLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: DtwColors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  loaderTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  loaderFill: {
    height: '100%',
    backgroundColor: DtwColors.safeGreen,
    borderRadius: 3,
    shadowColor: DtwColors.safeGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default SplashScreen;
