// ============================================================
// Find One — Memoized Interactive Character Tile Component
// ============================================================

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  withRepeat,
} from 'react-native-reanimated';
import { FORadius } from '../theme';

interface CharacterTileProps {
  id: number;
  emoji: string;
  name: string;
  isOdd: boolean;
  size: number;
  isHighlighted?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CharacterTile: React.FC<CharacterTileProps> = memo(({
  emoji,
  name,
  isOdd,
  size,
  isHighlighted = false,
  onPress,
  style,
}) => {
  const scale = useSharedValue(1);
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    if (isHighlighted) {
      // Pulse animation for hint
      scale.value = withRepeat(
        withSequence(withTiming(1.12, { duration: 250 }), withTiming(1, { duration: 250 })),
        4,
        true
      );
      glowAnim.value = withRepeat(
        withSequence(withTiming(1, { duration: 250 }), withTiming(0.2, { duration: 250 })),
        4,
        true
      );
    }
  }, [isHighlighted]);

  const handlePressIn = () => {
    scale.value = withTiming(0.92, { duration: 50 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, { damping: 10, stiffness: 220 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const fontSize = Math.floor(size * 0.58);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.tileOuter,
        {
          width: size,
          height: size,
          borderRadius: Math.max(8, Math.floor(size * 0.22)),
        },
        isHighlighted && styles.tileHighlighted,
        animatedStyle,
        style,
      ]}
    >
      <LinearGradient
        colors={isHighlighted ? ['#FFF8D6', '#FFE78A', '#FFD13B'] : ['#FFFFFF', '#F2F6FA', '#DCE5EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.tileInner,
          {
            borderRadius: Math.max(6, Math.floor(size * 0.2)),
          },
        ]}
      >
        {/* Top Specular Arc */}
        <View style={styles.topSpecular} />

        {/* Character Icon / Emoji */}
        <Text style={[styles.charEmoji, { fontSize }]}>
          {emoji}
        </Text>
      </LinearGradient>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  tileOuter: {
    borderBottomWidth: 4,
    borderBottomColor: '#B0BFCF',
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tileHighlighted: {
    borderBottomColor: '#B88600',
    shadowColor: '#FFC928',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  tileInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.5)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.5)',
    position: 'relative',
  },
  topSpecular: {
    position: 'absolute',
    top: 2,
    left: '12%',
    width: '76%',
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 8,
  },
  charEmoji: {
    textAlign: 'center',
  },
});
