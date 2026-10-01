// ============================================================
// Number Rush — High-Fidelity Character Mascot (3D Art + Dynamic Numbers)
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const RUNNER_BOY_IMG = require('@/../assets/images/jungle/runner_boy.png');
const TIGER_IMG = require('@/../assets/images/jungle/tiger_mascot.png');

interface MascotProps {
  size?: number;
  character?: 'runner_boy' | 'tiger';
  mood?: 'happy' | 'celebrate' | 'thinking';
  showAura?: boolean;
  showNumbers?: boolean;
}

export const MascotIllustration: React.FC<MascotProps> = ({
  size = 180,
  character = 'runner_boy',
  mood = 'happy',
  showAura = true,
  showNumbers = true,
}) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  // Independent bobbing for floating number cubes
  const floatA = useSharedValue(0);
  const floatB = useSharedValue(0);

  useEffect(() => {
    // Subtle idle floating breath for character
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Number cubes oscillation
    floatA.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(4, { duration: 1200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    floatB.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(-5, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    if (mood === 'celebrate') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 500, easing: Easing.out(Easing.back(1.5)) }),
          withTiming(0.98, { duration: 500, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
      rotate.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 600, easing: Easing.inOut(Easing.sin) }),
          withTiming(3, { duration: 600, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }
  }, [mood]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotate.value}deg` },
    ],
  }));

  const floatStyleA = useAnimatedStyle(() => ({
    transform: [{ translateY: floatA.value }],
  }));

  const floatStyleB = useAnimatedStyle(() => ({
    transform: [{ translateY: floatB.value }],
  }));

  const sourceImg = character === 'tiger' ? TIGER_IMG : RUNNER_BOY_IMG;
  const isBoy = character === 'runner_boy';

  return (
    <View style={[styles.container, { width: size + 60, height: size + 20 }]}>
      {/* Golden/Emerald Aura Backing */}
      {showAura && (
        <View
          style={[
            styles.auraDisk,
            {
              width: size * 0.95,
              height: size * 0.95,
              borderRadius: (size * 0.95) / 2,
              backgroundColor:
                character === 'tiger'
                  ? 'rgba(255, 179, 0, 0.22)'
                  : 'rgba(0, 230, 118, 0.25)',
              borderColor:
                character === 'tiger'
                  ? 'rgba(255, 215, 0, 0.45)'
                  : 'rgba(74, 222, 128, 0.45)',
            },
          ]}
        />
      )}

      {/* Floating 3D Arcade Number Blocks Around Boy (Playing with Numbers) */}
      {isBoy && showNumbers && (
        <>
          {/* Cube 3 (Blue with Golden Crown) - Top Left */}
          <Animated.View style={[styles.cubeAbsolute, { top: 0, left: 10 }, floatStyleA]}>
            <View style={styles.crownWrapper}>
              <Text style={styles.crownEmoji}>👑</Text>
            </View>
            <View style={[styles.cube3D, styles.cubeBlue]}>
              <View style={[styles.cubeHighlight, { backgroundColor: '#40C4FF' }]} />
              <Text style={styles.cubeNum}>3</Text>
            </View>
          </Animated.View>

          {/* Cube 7 (Emerald Green) - Top Right */}
          <Animated.View style={[styles.cubeAbsolute, { top: 6, right: 18 }, floatStyleB]}>
            <View style={[styles.cube3D, styles.cubeGreen]}>
              <View style={[styles.cubeHighlight, { backgroundColor: '#69F0AE' }]} />
              <Text style={styles.cubeNum}>7</Text>
            </View>
          </Animated.View>

          {/* Cube 12 (Neon Hot Pink) - Mid Right */}
          <Animated.View style={[styles.cubeAbsolute, { top: size * 0.38, right: 0 }, floatStyleA]}>
            <View style={[styles.cube3D, styles.cubePink]}>
              <View style={[styles.cubeHighlight, { backgroundColor: '#FF80AB' }]} />
              <Text style={[styles.cubeNum, { fontSize: 13 }]}>12</Text>
            </View>
          </Animated.View>

          {/* Cube 25 (Neon Purple) - Bottom Right */}
          <Animated.View style={[styles.cubeAbsolute, { bottom: 10, right: 8 }, floatStyleB]}>
            <View style={[styles.cube3D, styles.cubePurple]}>
              <View style={[styles.cubeHighlight, { backgroundColor: '#EA80FC' }]} />
              <Text style={[styles.cubeNum, { fontSize: 13 }]}>25</Text>
            </View>
          </Animated.View>

          {/* Cube 8 (Neon Orange) - Bottom Left */}
          <Animated.View style={[styles.cubeAbsolute, { bottom: 8, left: 4 }, floatStyleB]}>
            <View style={[styles.cube3D, styles.cubeOrange]}>
              <View style={[styles.cubeHighlight, { backgroundColor: '#FFD180' }]} />
              <Text style={styles.cubeNum}>8</Text>
            </View>
          </Animated.View>

          {/* Cube 4 (Neon Violet) - Bottom Center */}
          <Animated.View style={[styles.cubeAbsolute, { bottom: -6, left: size * 0.44 }, floatStyleA]}>
            <View style={[styles.cube3D, styles.cubeViolet, { width: 34, height: 34 }]}>
              <View style={[styles.cubeHighlight, { backgroundColor: '#B388FF' }]} />
              <Text style={[styles.cubeNum, { fontSize: 14 }]}>4</Text>
            </View>
          </Animated.View>
        </>
      )}

      {/* Floating 3D Character Asset */}
      <Animated.View style={[styles.characterWrapper, animatedStyle]}>
        <ExpoImage
          source={sourceImg}
          style={{ width: size, height: size }}
          contentFit="contain"
          transition={200}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  auraDisk: {
    position: 'absolute',
    borderWidth: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 8,
  },
  characterWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cubeAbsolute: {
    position: 'absolute',
    zIndex: 20,
    alignItems: 'center',
  },
  crownWrapper: {
    marginBottom: -4,
    zIndex: 25,
  },
  crownEmoji: {
    fontSize: 14,
  },
  cube3D: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  cubeHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    opacity: 0.8,
  },
  cubeNum: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
  },
  cubeBlue: {
    backgroundColor: '#0084FF',
    borderColor: '#80D8FF',
  },
  cubeGreen: {
    backgroundColor: '#00C853',
    borderColor: '#B9F6CA',
  },
  cubePink: {
    backgroundColor: '#E91E63',
    borderColor: '#FF80AB',
  },
  cubePurple: {
    backgroundColor: '#9C27B0',
    borderColor: '#EA80FC',
  },
  cubeOrange: {
    backgroundColor: '#FF6D00',
    borderColor: '#FFE57F',
  },
  cubeViolet: {
    backgroundColor: '#6200EA',
    borderColor: '#D1C4E9',
  },
});
