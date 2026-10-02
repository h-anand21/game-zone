// ============================================================
// PATTERN BREAKER — GameButton Component
// High-Fidelity UI Button using authentic Sci-Fi / Fantasy Image Assets
// Preserves exact aspect ratio, neon glow, bevels & tactile haptics
// ============================================================

import React, { useState } from 'react';
import {
  Pressable,
  Image,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ImageSourcePropType,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';

interface GameButtonProps {
  asset: ImageSourcePropType;
  pressedAsset?: ImageSourcePropType;
  disabledAsset?: ImageSourcePropType;
  disabled?: boolean;
  width?: number | `${number}%`;
  height?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  soundType?: 'light' | 'medium' | 'heavy' | 'selection';
}

export const GameButton: React.FC<GameButtonProps> = ({
  asset,
  pressedAsset,
  disabledAsset,
  disabled = false,
  width = '100%',
  height = 58,
  onPress,
  style,
  accessibilityLabel,
  soundType = 'medium',
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (disabled || !onPress) return;
    try {
      if (soundType === 'light') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (soundType === 'heavy') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else if (soundType === 'selection') {
        Haptics.selectionAsync();
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (e) {}
    onPress();
  };

  const currentSource = disabled && disabledAsset
    ? disabledAsset
    : isPressed && pressedAsset
    ? pressedAsset
    : asset;

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => !disabled && setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.touchContainer,
        { width, height },
        disabled && styles.disabledTouch,
        style,
        pressed && !pressedAsset && styles.defaultPressedScale,
      ]}
    >
      <View style={styles.imageHolder}>
        <Image
          source={currentSource}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  touchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  defaultPressedScale: {
    transform: [{ scale: 0.96 }],
    opacity: 0.92,
  },
  disabledTouch: {
    opacity: 0.55,
  },
  imageHolder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
