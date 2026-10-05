// ============================================================
// PATH MIND — Component 03: GameButton
// Pure Native Vector RPG Game Button (No jagged crop, no distortion, 100% reliable)
// ============================================================

import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
  View,
  Image,
  ImageSourcePropType,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { pmColors } from '../../design-system/colors';
import { pmTypography } from '../../design-system/typography';
import { pmRadii } from '../../design-system/radii';
import { pmShadows } from '../../design-system/shadows';

export type GameButtonVariant =
  | 'gold'
  | 'green'
  | 'wood'
  | 'cyan'
  | 'blue'
  | 'red'
  | 'purple';

export type GameButtonSize = 'large' | 'medium' | 'small' | 'icon';

interface GameButtonProps {
  label?: string;
  imageSource?: ImageSourcePropType;
  iconName?: 'play' | 'star' | 'compass' | 'map' | 'chest' | 'user' | 'settings' | 'arrow-left' | 'check' | 'cross' | 'pencil';
  variant?: GameButtonVariant;
  size?: GameButtonSize;
  width?: number;
  height?: number;
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const GameButton: React.FC<GameButtonProps> = ({
  label,
  imageSource,
  iconName,
  variant = 'gold',
  size = 'medium',
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
      toValue: 0.95,
      duration: 70,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 140,
      useNativeDriver: true,
    }).start();
  };

  const getTheme = () => {
    switch (variant) {
      case 'green':
        return {
          bg: '#1E7E34',
          bgHighlight: '#28A745',
          border: '#155724',
          borderHighlight: '#5CD67A',
          textColor: '#FFFFFF',
          textShadow: '#0E3A18',
          shadow: pmShadows.glowGreen,
        };
      case 'wood':
        return {
          bg: '#4A2810',
          bgHighlight: '#683A19',
          border: '#2A1405',
          borderHighlight: '#9E5B28',
          textColor: '#F5E6D3',
          textShadow: '#1A0C03',
          shadow: pmShadows.medium,
        };
      case 'cyan':
      case 'blue':
        return {
          bg: '#007799',
          bgHighlight: '#00A8CC',
          border: '#004C61',
          borderHighlight: '#33D6FF',
          textColor: '#FFFFFF',
          textShadow: '#003342',
          shadow: pmShadows.glowCyan,
        };
      case 'red':
        return {
          bg: '#A81D24',
          bgHighlight: '#D32F2F',
          border: '#6B0F14',
          borderHighlight: '#FF6666',
          textColor: '#FFFFFF',
          textShadow: '#42070A',
          shadow: pmShadows.glowRed,
        };
      case 'purple':
        return {
          bg: '#5E2CA5',
          bgHighlight: '#7E3FE4',
          border: '#3A1869',
          borderHighlight: '#A870FF',
          textColor: '#FFFFFF',
          textShadow: '#220D40',
          shadow: pmShadows.medium,
        };
      case 'gold':
      default:
        return {
          bg: '#C5832B',
          bgHighlight: '#E5A638',
          border: '#7A4D10',
          borderHighlight: '#FFE066',
          textColor: '#FFFFFF',
          textShadow: '#4D3007',
          shadow: pmShadows.glowGold,
        };
    }
  };

  const theme = getTheme();

  const getDims = () => {
    if (width && height) return { w: width, h: height };
    if (size === 'large') return { w: width || 260, h: height || 64 };
    if (size === 'small') return { w: width || 140, h: height || 44 };
    if (size === 'icon') return { w: width || 48, h: height || 48 };
    return { w: width || 220, h: height || 54 };
  };

  const dims = getDims();

  const renderIcon = () => {
    if (!iconName) return null;
    const iconSize = size === 'large' ? 22 : size === 'small' ? 16 : 18;

    switch (iconName) {
      case 'play':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={styles.iconMargin}>
            <Path d="M8 5v14l11-7z" fill={theme.textColor} />
          </Svg>
        );
      case 'star':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={styles.iconMargin}>
            <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={theme.textColor} />
          </Svg>
        );
      case 'map':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={styles.iconMargin}>
            <Path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" fill={theme.textColor} />
          </Svg>
        );
      case 'compass':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={styles.iconMargin}>
            <Circle cx="12" cy="12" r="9" stroke={theme.textColor} strokeWidth="2" fill="none" />
            <Path d="M14.5 9.5l-5 2 2 5 5-2z" fill={theme.textColor} />
          </Svg>
        );
      case 'chest':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={styles.iconMargin}>
            <Path d="M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 2v3H4V9h16zm-7 5h-2v-1h2v1z" fill={theme.textColor} />
          </Svg>
        );
      case 'user':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={styles.iconMargin}>
            <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={theme.textColor} />
          </Svg>
        );
      case 'arrow-left':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={styles.iconMargin}>
            <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill={theme.textColor} />
          </Svg>
        );
      case 'pencil':
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={styles.iconMargin}>
            <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill={theme.textColor} />
          </Svg>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, disabled && styles.disabled, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel || label}
        style={[
          styles.buttonFrame,
          {
            width: dims.w,
            height: dims.h,
            backgroundColor: imageSource ? 'transparent' : theme.bg,
            borderColor: imageSource ? 'transparent' : theme.borderHighlight,
            borderBottomColor: imageSource ? 'transparent' : theme.border,
            borderWidth: imageSource ? 0 : 2,
            borderBottomWidth: imageSource ? 0 : 5,
          },
          !imageSource && theme.shadow,
        ]}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={{ width: dims.w, height: dims.h }}
            resizeMode="contain"
          />
        ) : (
          <>
            {/* Inner Top Highlight Bevel */}
            <View style={[styles.innerHighlight, { borderColor: theme.borderHighlight }]} />

            {/* Content Row */}
            <View style={styles.contentRow}>
              {renderIcon()}
              {label && (
                <Text
                  style={[
                    size === 'large'
                      ? pmTypography.buttonLarge
                      : size === 'small'
                      ? pmTypography.buttonSmall
                      : pmTypography.buttonMedium,
                    {
                      color: theme.textColor,
                      textShadowColor: theme.textShadow,
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 3,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              )}
            </View>

            {/* Corner Rivet Studs */}
            <View style={[styles.cornerStud, styles.topLeft, { backgroundColor: theme.borderHighlight }]} />
            <View style={[styles.cornerStud, styles.topRight, { backgroundColor: theme.borderHighlight }]} />
            <View style={[styles.cornerStud, styles.bottomLeft, { backgroundColor: theme.border }]} />
            <View style={[styles.cornerStud, styles.bottomRight, { backgroundColor: theme.border }]} />
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonFrame: {
    borderRadius: pmRadii.lg,
    borderWidth: 2,
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  innerHighlight: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: '42%',
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: pmRadii.md,
    borderTopRightRadius: pmRadii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    pointerEvents: 'none',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  iconMargin: {
    marginRight: 6,
  },
  cornerStud: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.8,
  },
  topLeft: { top: 3, left: 3 },
  topRight: { top: 3, right: 3 },
  bottomLeft: { bottom: 3, left: 3 },
  bottomRight: { bottom: 3, right: 3 },
  disabled: {
    opacity: 0.5,
  },
});
