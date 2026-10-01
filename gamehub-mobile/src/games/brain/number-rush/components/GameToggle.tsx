// ============================================================
// Number Rush — Custom Animated Game Switch Component
// ============================================================

import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { NRHaptics } from '../services/haptics';

interface GameToggleProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  disabled?: boolean;
}

export const GameToggle: React.FC<GameToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const offset = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    offset.value = withSpring(value ? 1 : 0, {
      damping: 14,
      stiffness: 180,
    });
  }, [value]);

  const handlePress = () => {
    if (disabled) return;
    NRHaptics.buttonTap();
    onValueChange(!value);
  };

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      offset.value,
      [0, 1],
      ['#14231B', '#20C83A']
    );
    const borderColor = interpolateColor(
      offset.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.15)', '#7BED9F']
    );

    return {
      backgroundColor,
      borderColor,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateX = offset.value * 24; // 0px to 24px
    const scale = offset.value === 1 || offset.value === 0 ? 1 : 1.08;

    return {
      transform: [{ translateX }, { scale }],
    };
  });

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.pressArea, disabled && styles.disabled]}
    >
      <Animated.View style={[styles.track, trackAnimatedStyle]}>
        {/* Inner track bevel */}
        <View style={styles.trackBevel} />

        {/* Thumb Knob */}
        <Animated.View style={[styles.thumb, thumbAnimatedStyle]}>
          <View style={styles.thumbCore} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressArea: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    width: 54,
    height: 30,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    paddingHorizontal: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  trackBevel: {
    position: 'absolute',
    top: 0,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.45,
  },
});
