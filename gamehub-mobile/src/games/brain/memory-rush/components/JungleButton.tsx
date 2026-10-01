// ============================================================
// MEMORY RUSH — 3D Tactile Jungle Game Button
// Physical 3D extrusion, beveled highlights & press response
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MRColors, MRButtonThemes } from '../constants/colors';

export type JungleButtonVariant = 'gold' | 'emerald' | 'coral' | 'blue' | 'wood' | 'stone';

interface JungleButtonProps {
  title: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  variant?: JungleButtonVariant;
  icon?: React.ReactNode;
  subtitle?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const JungleButton: React.FC<JungleButtonProps> = ({
  title,
  onPress,
  size = 'lg',
  variant = 'gold',
  icon,
  subtitle,
  disabled = false,
  style,
  textStyle,
}) => {
  const height = size === 'sm' ? 44 : size === 'md' ? 52 : size === 'hero' ? 68 : 60;
  const fontSize = size === 'sm' ? 14 : size === 'md' ? 16 : size === 'hero' ? 22 : 18;
  const lipHeight = size === 'sm' ? 4 : size === 'md' ? 5 : size === 'hero' ? 8 : 6;
  const borderRadius = size === 'sm' ? 14 : size === 'md' ? 16 : 20;

  const theme = MRButtonThemes[variant] || MRButtonThemes.gold;

  const handlePress = () => {
    if (disabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Haptics optional on web/unsupported
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.outerContainer,
        { opacity: disabled ? 0.45 : 1 },
        style,
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.buttonWrapper,
            {
              height: height + lipHeight,
              backgroundColor: theme.extrusion,
              borderRadius,
            },
          ]}
        >
          {/* Main Pressable Surface that physically drops down into the extrusion when pressed */}
          <View
            style={[
              styles.lipBase,
              {
                height,
                borderRadius,
                marginTop: pressed ? lipHeight : 0,
                shadowColor: theme.glow,
              },
            ]}
          >
            <LinearGradient
              colors={[theme.highlight, theme.face, theme.bevel]}
              style={[
                styles.gradientSurface,
                {
                  height,
                  borderRadius,
                  borderColor: theme.highlight,
                },
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              {/* Gloss Highlight Arc on Top Half */}
              <View style={[styles.topLightGlow, { borderRadius: borderRadius - 2 }]} />

              {/* Bottom Inset Shadow */}
              <View style={styles.bottomShadowLine} />

              <View style={styles.contentRow}>
                {icon && <View style={styles.iconBox}>{icon}</View>}
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontSize,
                        color: theme.text,
                        textShadowColor:
                          variant === 'gold' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)',
                      },
                      textStyle,
                    ]}
                  >
                    {title}
                  </Text>
                  {subtitle && (
                    <Text
                      style={[
                        styles.subtitle,
                        { color: theme.text, opacity: 0.8 },
                      ]}
                    >
                      {subtitle}
                    </Text>
                  )}
                </View>
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
    marginVertical: 4,
  },
  buttonWrapper: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 6,
  },
  lipBase: {
    width: '100%',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  gradientSurface: {
    width: '100%',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  topLightGlow: {
    position: 'absolute',
    top: 2,
    left: '8%',
    right: '8%',
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bottomShadowLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconBox: {
    marginRight: 4,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 1,
  },
});
