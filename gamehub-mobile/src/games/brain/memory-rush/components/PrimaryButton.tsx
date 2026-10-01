// ============================================================
// MEMORY RUSH — 2.5D Arcade Primary CTA Button
// (Structured identically to Reverse Mind & Number Rush GlowButtons)
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRColors, MRButtonThemes } from '../constants/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'cyan' | 'gold' | 'emerald' | 'danger';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  size = 'lg',
  variant = 'cyan',
  icon,
  disabled = false,
  style,
  textStyle,
}) => {
  const height = size === 'sm' ? 44 : size === 'md' ? 52 : 60;
  const fontSize = size === 'sm' ? 13 : size === 'md' ? 15 : 18;
  const lipHeight = size === 'sm' ? 3 : size === 'md' ? 4 : 5;

  const getTheme = () => {
    switch (variant) {
      case 'gold':
        return MRButtonThemes.gold;
      case 'emerald':
        return MRButtonThemes.emerald;
      case 'danger':
        return MRButtonThemes.coral;
      case 'cyan':
      default:
        return MRButtonThemes.cyan;
    }
  };

  const theme = getTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.outerContainer,
        { opacity: disabled ? 0.4 : 1 },
        style,
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.buttonWrapper,
            {
              height: height + lipHeight,
              backgroundColor: theme.shadow,
              borderRadius: 18,
            },
          ]}
        >
          <View
            style={[
              styles.lipBase,
              {
                height: height,
                marginTop: pressed ? lipHeight : 0,
                shadowColor: theme.glow,
              },
            ]}
          >
            <LinearGradient
              colors={[theme.highlight, theme.face, theme.bevel]}
              style={[
                styles.gradientSurface,
                { height: height, borderColor: theme.highlight },
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              {/* Metallic Glass Highlights */}
              <View style={styles.topLightGlow} />

              <View style={styles.contentRow}>
                <Text style={[styles.title, { fontSize, color: theme.text }, textStyle]}>
                  {title}
                </Text>
                {icon && <View style={styles.iconBox}>{icon}</View>}
              </View>
            </LinearGradient>
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
  },
  buttonWrapper: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  lipBase: {
    width: '100%',
    borderRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.65,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientSurface: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  topLightGlow: {
    position: 'absolute',
    top: 2,
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    borderRadius: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  iconBox: {
    marginLeft: 4,
  },
});
