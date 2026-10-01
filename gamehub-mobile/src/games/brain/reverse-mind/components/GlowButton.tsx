// ============================================================
// REVERSE MIND — Chunky 2.5D Arcade Glow Button
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RMTheme } from '../theme';

interface GlowButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'gold' | 'green' | 'blue' | 'purple' | 'red' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  title,
  onPress,
  variant = 'gold',
  size = 'md',
  icon,
  disabled = false,
  style,
  textStyle,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'gold':
        return {
          gradient: ['#FFE58F', '#FFD83D', '#FF9100'],
          shadowLip: '#C67100',
          textColor: '#07111F',
          glow: RMTheme.colors.goldGlow,
        };
      case 'green':
        return {
          gradient: ['#B7F4C7', '#00E676', '#1B5E20'],
          shadowLip: '#0F4616',
          textColor: '#07111F',
          glow: RMTheme.colors.emeraldGlow,
        };
      case 'blue':
        return {
          gradient: ['#A0E8FF', '#00B0FF', '#0056B3'],
          shadowLip: '#003975',
          textColor: '#07111F',
          glow: RMTheme.colors.blueGlow,
        };
      case 'purple':
        return {
          gradient: ['#E9D5FF', '#B57CFF', '#581C87'],
          shadowLip: '#3B0764',
          textColor: '#FFFFFF',
          glow: RMTheme.colors.purpleGlow,
        };
      case 'red':
        return {
          gradient: ['#FFCDD2', '#FF5252', '#B71C1C'],
          shadowLip: '#7F0000',
          textColor: '#FFFFFF',
          glow: RMTheme.colors.coralGlow,
        };
      case 'glass':
      default:
        return {
          gradient: ['#1A3250', '#0E1F35'],
          shadowLip: '#060E18',
          textColor: '#FFFFFF',
          glow: 'rgba(77, 231, 255, 0.3)',
        };
    }
  };

  const config = getColors();

  const sizeStyles =
    size === 'sm'
      ? { height: 40, paddingHorizontal: 16, fontSize: 13, lipHeight: 4 }
      : size === 'lg'
      ? { height: 56, paddingHorizontal: 28, fontSize: 18, lipHeight: 6 }
      : { height: 48, paddingHorizontal: 22, fontSize: 15, lipHeight: 5 };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.outerContainer,
        {
          height: sizeStyles.height + sizeStyles.lipHeight,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {({ pressed }) => (
        <View style={styles.fullWidth}>
          {/* Bottom 2.5D Lip */}
          <View
            style={[
              styles.shadowLip,
              {
                backgroundColor: config.shadowLip,
                height: sizeStyles.height,
                borderRadius: RMTheme.radii.lg,
                marginTop: sizeStyles.lipHeight,
              },
            ]}
          />

          {/* Top Face */}
          <LinearGradient
            colors={config.gradient as any}
            style={[
              styles.face,
              {
                height: sizeStyles.height,
                paddingHorizontal: sizeStyles.paddingHorizontal,
                borderRadius: RMTheme.radii.lg,
                transform: [{ translateY: pressed ? sizeStyles.lipHeight - 1 : 0 }],
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            {/* Top specular highlight line */}
            <View style={styles.specularLine} />

            <View style={styles.contentRow}>
              {icon && (
                <View style={styles.iconContainer}>
                  {typeof icon === 'string' ? (
                    <Text style={styles.buttonIconText}>{icon}</Text>
                  ) : (
                    icon
                  )}
                </View>
              )}
              <Text
                style={[
                  styles.titleText,
                  {
                    color: config.textColor,
                    fontSize: sizeStyles.fontSize,
                  },
                  textStyle,
                ]}
              >
                {title}
              </Text>
            </View>
          </LinearGradient>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    justifyContent: 'flex-start',
  },
  fullWidth: {
    width: '100%',
  },
  shadowLip: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  face: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    overflow: 'hidden',
  },
  specularLine: {
    position: 'absolute',
    top: 2,
    left: '8%',
    right: '8%',
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIconText: {
    fontSize: 18,
  },
  titleText: {
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
});
