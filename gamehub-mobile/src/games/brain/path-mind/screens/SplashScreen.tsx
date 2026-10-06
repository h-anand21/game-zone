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
          {/* Bottom Ancient Carved Stone Single-Line Loading Bar */}
          <View style={styles.loadingStage}>
            <View style={styles.singleLinePanel}>
              {/* Corner metal rivets */}
              <View style={[styles.rivet, styles.rivetTL]} />
              <View style={[styles.rivet, styles.rivetTR]} />
              <View style={[styles.rivet, styles.rivetBL]} />
              <View style={[styles.rivet, styles.rivetBR]} />

              <View style={styles.singleLineRow}>
                <Text style={styles.singleLineLabel}>LOADING</Text>

                {/* Carved Energy Channel Track */}
                <View style={styles.gaugeTrack}>
                  <View style={[styles.gaugeFill, { width: `${progress}%` }]}>
                    {/* Glowing Energy Glint Beam */}
                    <View style={styles.glintBeam} />
                  </View>
                </View>

                <Text style={styles.percentText}>{progress}%</Text>
              </View>
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
  singleLinePanel: {
    width: Math.min(SCREEN_WIDTH - 36, 350),
    backgroundColor: 'rgba(12, 20, 28, 0.94)',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#7A5424',
    borderTopColor: '#C49448',
    borderRadius: pmRadii.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'relative',
    ...pmShadows.heavy,
  },
  rivet: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFE066',
    borderWidth: 1,
    borderColor: '#7A4D10',
    opacity: 0.85,
  },
  rivetTL: { top: 4, left: 6 },
  rivetTR: { top: 4, right: 6 },
  rivetBL: { bottom: 4, left: 6 },
  rivetBR: { bottom: 4, right: 6 },

  singleLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  singleLineLabel: {
    fontFamily: pmTypography.displaySection.fontFamily,
    fontSize: 12,
    fontWeight: '900',
    color: '#FFE27A',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  gaugeTrack: {
    flex: 1,
    height: 12,
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
    width: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: pmRadii.pill,
    opacity: 0.9,
  },
  percentText: {
    fontFamily: pmTypography.displaySection.fontFamily,
    fontSize: 12,
    fontWeight: '900',
    color: pmColors.cyanGlow,
    letterSpacing: 0.8,
    minWidth: 36,
    textAlign: 'right',
  },
});
