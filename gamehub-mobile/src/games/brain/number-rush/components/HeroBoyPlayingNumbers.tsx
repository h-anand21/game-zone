// ============================================================
// Number Rush — Hero Boy Playing with Numbers Component
// Dynamic leaping runner boy surrounded by physics-based 3D neon number cubes
// Matching reference art (media_1790837111481.jpg)
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { FloatingNumberBlock } from './FloatingNumberBlock';

const { width } = Dimensions.get('window');
const RUNNER_BOY_IMG = require('@/../assets/images/jungle/runner_boy.png');

interface HeroBoyPlayingNumbersProps {
  score?: number;
}

export const HeroBoyPlayingNumbers: React.FC<HeroBoyPlayingNumbersProps> = () => {
  // Boy leaping animation
  const boyTranslateY = useSharedValue(0);
  const boyScale = useSharedValue(1);
  const boyRotate = useSharedValue(0);

  useEffect(() => {
    // Dynamic leaping float cycle
    boyTranslateY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        withTiming(4, { duration: 1600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    boyScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.98, { duration: 1600, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    boyRotate.value = withRepeat(
      withSequence(
        withTiming(-2.5, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(2.5, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const boyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: boyTranslateY.value },
      { scale: boyScale.value },
      { rotateZ: `${boyRotate.value}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Background Energy Aura Glow */}
      <View style={styles.glowAura} />

      {/* Floating 3D Number Cubes Surrounding Boy (From Reference Art) */}

      {/* 1. Cube 3: Top-Left Neon Cyan */}
      <FloatingNumberBlock
        value="3"
        size={50}
        color="#00B4D8"
        topColor="#90E0EF"
        shadowColor="#0077B6"
        initialRotate={-12}
        floatDelay={0}
        floatDistance={10}
        duration={1700}
        style={{ top: 12, left: 16 }}
      />

      {/* 2. Cube 7: Top-Right Lime Green */}
      <FloatingNumberBlock
        value="7"
        size={52}
        color="#00C853"
        topColor="#B9F6CA"
        shadowColor="#1B5E20"
        initialRotate={14}
        floatDelay={250}
        floatDistance={11}
        duration={1900}
        style={{ top: 22, right: 18 }}
      />

      {/* 3. Cube 8: Mid-Left Bright Orange */}
      <FloatingNumberBlock
        value="8"
        size={46}
        color="#FF6D00"
        topColor="#FFE082"
        shadowColor="#BF360C"
        initialRotate={-18}
        floatDelay={500}
        floatDistance={9}
        duration={2100}
        style={{ top: 120, left: 12 }}
      />

      {/* 4. Cube 12: Mid-Right Magenta Pink */}
      <FloatingNumberBlock
        value="12"
        size={48}
        color="#E91E63"
        topColor="#F8BBD0"
        shadowColor="#880E4F"
        initialRotate={15}
        floatDelay={350}
        floatDistance={10}
        duration={1850}
        style={{ top: 96, right: 30 }}
      />

      {/* 5. Cube 25: Lower-Right Royal Purple */}
      <FloatingNumberBlock
        value="25"
        size={50}
        color="#9C27B0"
        topColor="#E1BEE7"
        shadowColor="#4A148C"
        initialRotate={-10}
        floatDelay={150}
        floatDistance={8}
        duration={1950}
        style={{ top: 168, right: 12 }}
      />

      {/* 6. Cube 4: Bottom-Left Indigo Violet */}
      <FloatingNumberBlock
        value="4"
        size={44}
        color="#536DFE"
        topColor="#C5CAE9"
        shadowColor="#1A237E"
        initialRotate={12}
        floatDelay={600}
        floatDistance={7}
        duration={2200}
        style={{ top: 195, left: 72 }}
      />

      {/* 7. Cube 2: Bottom-Right Turquoise Emerald */}
      <FloatingNumberBlock
        value="2"
        size={44}
        color="#00BFA5"
        topColor="#A7FFEB"
        shadowColor="#004D40"
        initialRotate={-8}
        floatDelay={400}
        floatDistance={8}
        duration={1750}
        style={{ top: 202, right: 90 }}
      />

      {/* Centerpiece: Dynamic Leaping Boy Mascot */}
      <Animated.View style={[styles.boyWrapper, boyAnimatedStyle]}>
        <ExpoImage
          source={RUNNER_BOY_IMG}
          style={styles.boyImage}
          contentFit="contain"
          priority="high"
        />
      </Animated.View>

      {/* Dynamic 3D Game Title Billboard */}
      <View style={styles.titleContainer}>
        {/* Crown on top of RUSH */}
        <View style={styles.crownRow}>
          <Text style={styles.crownIcon}>👑</Text>
        </View>

        {/* 3D Extruded Title with Lightning Bolt */}
        <View style={styles.titleRow}>
          <Text style={styles.titleNumber}>NUMBER </Text>
          <View style={styles.rushWrapper}>
            <Text style={styles.titleRush}>RUSH</Text>
            <Text style={styles.titleBolt}>⚡</Text>
          </View>
        </View>

        {/* Navy Arc Ribbon */}
        <View style={styles.ribbonContainer}>
          <View style={styles.ribbonLeftTip} />
          <View style={styles.ribbonBody}>
            <Text style={styles.ribbonText}>• THINK • TAP • RUSH •</Text>
          </View>
          <View style={styles.ribbonRightTip} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    height: 330,
    marginTop: 4,
    marginBottom: 8,
  },
  glowAura: {
    position: 'absolute',
    top: 30,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 215, 0, 0.16)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 35,
    elevation: 10,
  },
  boyWrapper: {
    width: 210,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  boyImage: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    zIndex: 10,
    width: '100%',
  },
  crownRow: {
    position: 'absolute',
    top: -24,
    right: width * 0.23,
    zIndex: 12,
  },
  crownIcon: {
    fontSize: 26,
    textShadowColor: '#FFA000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleNumber: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: '#002B49',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  rushWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleRush: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFEA00',
    letterSpacing: 2,
    textShadowColor: '#D84315',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  titleBolt: {
    position: 'absolute',
    left: 2,
    top: 4,
    fontSize: 26,
    color: '#FFF176',
    zIndex: 2,
    textShadowColor: '#FF6D00',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  ribbonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -2,
  },
  ribbonLeftTip: {
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#081D3C',
  },
  ribbonBody: {
    backgroundColor: '#0F2F61',
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3874CB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  ribbonRightTip: {
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#081D3C',
  },
  ribbonText: {
    color: '#E0F2FE',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
});
