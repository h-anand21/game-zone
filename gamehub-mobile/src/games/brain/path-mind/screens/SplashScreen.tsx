// ============================================================
// PATH MIND — Screen 01: SplashScreen
// Authentic Fantasy Splash with ancient stone carved loading bar
// Showcases bg_splash.png with bottom dynamic loading indicator
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import { usePathMindStore } from '../store/pathMindStore';
import { pmAssets } from '../design-system/uiAssets';
import { pmColors } from '../design-system/colors';
import { pmTypography } from '../design-system/typography';
import { pmRadii } from '../design-system/radii';
import { pmShadows } from '../design-system/shadows';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LOADING_HINTS = [
  'AWAKENING SACRED RUNES...',
  'WEAVING ANCIENT PATHWAYS...',
  'COMMUNING WITH TEMPLE SPIRITS...',
  'PREPARING EXPEDITION...',
  'ENTERING PATH MIND...',
];

export const SplashScreen: React.FC = () => {
  const { setScreen } = usePathMindStore();
  const [progress, setProgress] = useState<number>(0);
  const [hintIndex, setHintIndex] = useState<number>(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Simulated 2.2s loading progression with realistic incremental stages
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawP = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(rawP);
      const stage = Math.min(
        LOADING_HINTS.length - 1,
        Math.floor((rawP / 100) * LOADING_HINTS.length)
      );
      setHintIndex(stage);

      if (rawP >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setScreen('home');
        }, 350);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [setScreen]);

  return (
    <ImageBackground
      source={pmAssets.backgrounds.splash}
      style={styles.background}
      resizeMode="cover"
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Transparent tap area to skip to home if already loaded */}
        <Pressable
          style={styles.touchArea}
          onPress={() => progress > 50 && setScreen('home')}
        >
          {/* Bottom Ancient Carved Stone Loading Stage */}
          <View style={styles.loadingStage}>
            {/* Outer Stone Panel with Gold Bevel & Rivets */}
            <View style={styles.stonePanel}>
              {/* Corner metal rivets */}
              <View style={[styles.rivet, styles.rivetTL]} />
              <View style={[styles.rivet, styles.rivetTR]} />
              <View style={[styles.rivet, styles.rivetBL]} />
              <View style={[styles.rivet, styles.rivetBR]} />

              {/* Status & Percentage Header Row */}
              <View style={styles.labelRow}>
                <Text style={styles.hintText} numberOfLines={1}>
                  {LOADING_HINTS[hintIndex]}
                </Text>
                <Text style={styles.percentText}>{progress}%</Text>
              </View>

              {/* Carved Energy Channel Track */}
              <View style={styles.gaugeTrack}>
                <View style={[styles.gaugeFill, { width: `${progress}%` }]}>
                  {/* Glowing Energy Glint Beam */}
                  <View style={styles.glintBeam} />
                </View>
              </View>

              {/* Version & Subtitle */}
              <Text style={styles.versionSub}>
                PATH MIND EXPEDITION • VERSION 1.0.0
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  touchArea: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 36,
  },
  loadingStage: {
    width: Math.min(SCREEN_WIDTH - 36, 350),
    alignItems: 'center',
  },
  stonePanel: {
    width: '100%',
    backgroundColor: 'rgba(14, 22, 30, 0.94)',
    borderWidth: 2,
    borderBottomWidth: 4.5,
    borderColor: '#7A5424',
    borderTopColor: '#C49448',
    borderRadius: pmRadii.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: 'relative',
    ...pmShadows.heavy,
  },
  rivet: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFE066',
    borderWidth: 1,
    borderColor: '#7A4D10',
    opacity: 0.85,
  },
  rivetTL: { top: 5, left: 5 },
  rivetTR: { top: 5, right: 5 },
  rivetBL: { bottom: 5, left: 5 },
  rivetBR: { bottom: 5, right: 5 },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hintText: {
    fontFamily: pmTypography.caption.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: '#FFE27A',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    maxWidth: '80%',
  },
  percentText: {
    fontFamily: pmTypography.displaySection.fontFamily,
    fontSize: 13,
    fontWeight: '900',
    color: pmColors.cyanGlow,
    letterSpacing: 1,
  },

  gaugeTrack: {
    width: '100%',
    height: 14,
    backgroundColor: '#070D12',
    borderRadius: pmRadii.pill,
    borderWidth: 1.5,
    borderColor: '#243444',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: pmColors.cyanGlow,
    borderRadius: pmRadii.pill,
    position: 'relative',
  },
  glintBeam: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: pmRadii.pill,
    opacity: 0.9,
  },

  versionSub: {
    fontFamily: pmTypography.caption.fontFamily,
    fontSize: 9,
    fontWeight: '700',
    color: '#8A9BA8',
    letterSpacing: 0.6,
    textAlign: 'center',
    marginTop: 8,
  },
});
