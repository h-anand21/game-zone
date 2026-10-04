// ============================================================
// PATH MIND — Component 03: GameButton
// Authentic RPG Button with clean aspect ratio, NO stretching, NO duplicate text
// ============================================================

import React, { useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  Image,
  ImageSourcePropType,
  Animated,
} from 'react-native';
import { pmAssets } from '../../design-system/uiAssets';

interface GameButtonProps {
  buttonAsset?: ImageSourcePropType;
  variant?: 'playNow' | 'playDaily' | 'startGame' | 'customMode' | 'collection' | 'profile' | 'settings' | 'back' | 'continue' | 'restart' | 'pause' | 'exit';
  width?: number;
  height?: number;
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const GameButton: React.FC<GameButtonProps> = ({
  buttonAsset,
  variant = 'playNow',
  width,
  height,
  disabled = false,
  onPress,
  style,
  accessibilityLabel,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.94,
      duration: 70,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const getAsset = (): ImageSourcePropType => {
    if (buttonAsset) return buttonAsset;
    switch (variant) {
      case 'playDaily':
        return pmAssets.buttons.playDaily;
      case 'startGame':
        return pmAssets.buttons.startGame;
      case 'customMode':
        return pmAssets.buttons.customMode;
      case 'collection':
        return pmAssets.buttons.collection;
      case 'profile':
        return pmAssets.buttons.profile;
      case 'settings':
        return pmAssets.buttons.settings;
      case 'back':
        return pmAssets.buttons.back;
      case 'continue':
        return pmAssets.buttons.continueBtn;
      case 'restart':
        return pmAssets.buttons.restart;
      case 'pause':
        return pmAssets.buttons.pause;
      case 'exit':
        return pmAssets.buttons.exit;
      case 'playNow':
      default:
        return pmAssets.buttons.playNow;
    }
  };

  // Natural aspect ratio for these buttons is roughly 2.1 to 2.2
  // We specify clean proportional dimensions with NO STRETCHING
  const getDimensions = () => {
    if (width && height) return { w: width, h: height };
    if (width && !height) return { w: width, h: Math.round(width / 2.1) };
    if (!width && height) return { w: Math.round(height * 2.1), h: height };

    // Standard preset sizes
    switch (variant) {
      case 'playNow':
        return { w: 250, h: 72 };
      case 'playDaily':
      case 'startGame':
      case 'customMode':
        return { w: 220, h: 62 };
      case 'collection':
      case 'profile':
        return { w: 160, h: 54 };
      case 'back':
      case 'continue':
        return { w: 150, h: 50 };
      default:
        return { w: 200, h: 58 };
    }
  };

  const dims = getDimensions();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, disabled && styles.disabled, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel || variant}
        style={[styles.pressable, { width: dims.w, height: dims.h }]}
      >
        <Image
          source={getAsset()}
          style={{ width: dims.w, height: dims.h }}
          resizeMode="contain"
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
});
