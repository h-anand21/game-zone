// ============================================================
// Find One — Procedural Wooden Signboard Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { FOColors, FORadius } from '../theme';

interface WoodenSignProps {
  text: string;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'wood' | 'gold' | 'red';
}

export const WoodenSign: React.FC<WoodenSignProps> = ({
  text,
  style,
  size = 'md',
  variant = 'wood',
}) => {
  const getGradient = (): readonly [string, string, ...string[]] => {
    if (variant === 'gold') return FOColors.goldGradient;
    if (variant === 'red') return FOColors.redGradient;
    return FOColors.woodGradient;
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <View style={[styles.wrapper, style]}>
      {/* Decorative Green Leaves on Corners */}
      <View style={styles.leafLeft}>
        <Svg width={28} height={28} viewBox="0 0 28 28">
          <Path d="M26,14 C16,4 4,6 2,24 C14,24 24,18 26,14 Z" fill="#4DBE37" />
          <Path d="M22,12 C14,6 6,8 4,20" stroke="#2B7F1C" strokeWidth="1.5" fill="none" />
        </Svg>
      </View>

      <View style={styles.leafRight}>
        <Svg width={28} height={28} viewBox="0 0 28 28">
          <Path d="M2,14 C12,4 24,6 26,24 C14,24 4,18 2,14 Z" fill="#4DBE37" />
          <Path d="M6,12 C14,6 22,8 24,20" stroke="#2B7F1C" strokeWidth="1.5" fill="none" />
        </Svg>
      </View>

      {/* Wooden Plank Container */}
      <LinearGradient
        colors={getGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.plank,
          isSmall && styles.plankSm,
          isLarge && styles.plankLg,
          variant === 'wood' && styles.plankBorderWood,
          variant === 'gold' && styles.plankBorderGold,
          variant === 'red' && styles.plankBorderRed,
        ]}
      >
        {/* Metal Bolts */}
        <View style={[styles.bolt, styles.boltLeft]}>
          <Svg width={8} height={8} viewBox="0 0 8 8">
            <Circle cx="4" cy="4" r="3.5" fill="#FFEAA7" stroke="#664115" strokeWidth="1" />
          </Svg>
        </View>

        <Text
          style={[
            styles.text,
            isSmall && styles.textSm,
            isLarge && styles.textLg,
            variant === 'gold' && { color: '#3A2402' },
          ]}
        >
          {text}
        </Text>

        <View style={[styles.bolt, styles.boltRight]}>
          <Svg width={8} height={8} viewBox="0 0 8 8">
            <Circle cx="4" cy="4" r="3.5" fill="#FFEAA7" stroke="#664115" strokeWidth="1" />
          </Svg>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  plank: {
    paddingHorizontal: 28,
    paddingVertical: 8,
    borderRadius: FORadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomWidth: 4,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  plankSm: {
    paddingHorizontal: 18,
    paddingVertical: 5,
  },
  plankLg: {
    paddingHorizontal: 36,
    paddingVertical: 12,
  },
  plankBorderWood: {
    borderBottomColor: '#5C310D',
    borderTopWidth: 1,
    borderTopColor: '#FFA857',
    borderLeftWidth: 1,
    borderLeftColor: '#7A4518',
    borderRightWidth: 1,
    borderRightColor: '#7A4518',
  },
  plankBorderGold: {
    borderBottomColor: '#8A5E00',
    borderTopWidth: 1,
    borderTopColor: '#FFF2A3',
  },
  plankBorderRed: {
    borderBottomColor: '#8C1212',
    borderTopWidth: 1,
    borderTopColor: '#FFA4A4',
  },
  bolt: {
    position: 'absolute',
    top: '50%',
    marginTop: -4,
  },
  boltLeft: {
    left: 8,
  },
  boltRight: {
    right: 8,
  },
  leafLeft: {
    position: 'absolute',
    left: -12,
    top: -8,
    zIndex: 2,
  },
  leafRight: {
    position: 'absolute',
    right: -12,
    top: -8,
    zIndex: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFEED2',
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  textSm: {
    fontSize: 13,
  },
  textLg: {
    fontSize: 22,
  },
});
