// ============================================================
// MEMORY RUSH — Chunky 2.5D Cyber Arcade Primary CTA Button
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRColors } from '../constants/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'cyan' | 'gold' | 'danger';
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

  const getVariantStyles = () => {
    switch (variant) {
      case 'gold':
        return {
          gradient: ['#FDE047', '#EAB308', '#CA8A04'],
          lipColor: '#A16207',
          textColor: '#080A0D',
          borderColor: '#FEF08A',
          glow: 'rgba(250, 204, 21, 0.4)',
        };
      case 'danger':
        return {
          gradient: ['#FDA4AF', '#F43F5E', '#BE123C'],
          lipColor: '#881337',
          textColor: '#FFFFFF',
          borderColor: '#FECDD3',
          glow: 'rgba(251, 113, 133, 0.4)',
        };
      case 'cyan':
      default:
        return {
          gradient: ['#67E8F9', '#22D3EE', '#0891B2'],
          lipColor: '#155E75',
          textColor: '#080A0D',
          borderColor: '#A5F3FC',
          glow: 'rgba(34, 211, 238, 0.5)',
        };
    }
  };

  const vConfig = getVariantStyles();

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
              backgroundColor: vConfig.lipColor,
            },
          ]}
        >
          <View
            style={[
              styles.lipBase,
              {
                height: height,
                marginTop: pressed ? lipHeight : 0,
                shadowColor: vConfig.glow,
              },
            ]}
          >
            <LinearGradient
              colors={vConfig.gradient as any}
              style={[
                styles.gradientSurface,
                { height: height, borderColor: vConfig.borderColor },
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              {/* Metallic Glass Highlights */}
              <View style={styles.topLightGlow} />

              <View style={styles.contentRow}>
                <Text style={[styles.title, { fontSize, color: vConfig.textColor }, textStyle]}>
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
    borderRadius: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  lipBase: {
    width: '100%',
    borderRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
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
    left: '12%',
    right: '12%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
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
  },
  iconBox: {
    marginLeft: 4,
  },
});
