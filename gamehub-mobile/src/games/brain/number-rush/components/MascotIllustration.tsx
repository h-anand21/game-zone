// ============================================================
// Number Rush — High-Fidelity Character Mascot (3D Art + Dynamic Motion)
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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
}

export const MascotIllustration: React.FC<MascotProps> = ({
  size = 180,
  character = 'runner_boy',
  mood = 'happy',
  showAura = true,
}) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Subtle idle floating breath
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    if (mood === 'celebrate') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 500, easing: Easing.out(Easing.back(1.5)) }),
          withTiming(0.98, { duration: 500, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
      rotate.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 600, easing: Easing.inOut(Easing.sin) }),
          withTiming(4, { duration: 600, easing: Easing.inOut(Easing.sin) })
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

  const sourceImg = character === 'tiger' ? TIGER_IMG : RUNNER_BOY_IMG;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Golden/Emerald Aura Backing */}
      {showAura && (
        <View
          style={[
            styles.auraDisk,
            {
              width: size * 0.9,
              height: size * 0.9,
              borderRadius: (size * 0.9) / 2,
              backgroundColor:
                character === 'tiger'
                  ? 'rgba(255, 179, 0, 0.22)'
                  : 'rgba(0, 230, 118, 0.22)',
              borderColor:
                character === 'tiger'
                  ? 'rgba(255, 215, 0, 0.4)'
                  : 'rgba(74, 222, 128, 0.4)',
            },
          ]}
        />
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
  },
});
