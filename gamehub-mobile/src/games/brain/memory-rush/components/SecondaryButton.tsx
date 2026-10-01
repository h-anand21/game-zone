// ============================================================
// MEMORY RUSH — 2.5D Charcoal Glass Secondary Arcade Button
// ============================================================

import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MRColors } from '../constants/colors';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  size = 'md',
  icon,
  disabled = false,
  style,
  textStyle,
}) => {
  const height = size === 'sm' ? 42 : size === 'md' ? 48 : 54;
  const fontSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;
  const lipHeight = 3;

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
        <View style={[styles.buttonWrapper, { height: height + lipHeight }]}>
          <View
            style={[
              styles.lipBase,
              {
                height: height,
                marginTop: pressed ? lipHeight : 0,
              },
            ]}
          >
            <LinearGradient
              colors={['#1D2633', '#131A24', '#0E131C']}
              style={[styles.gradientSurface, { height }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.topLightGlow} />

              <View style={styles.contentRow}>
                <Text style={[styles.title, { fontSize }, textStyle]}>{title}</Text>
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
    borderRadius: 16,
    backgroundColor: '#070A0E',
    position: 'relative',
    overflow: 'hidden',
  },
  lipBase: {
    width: '100%',
    borderRadius: 16,
  },
  gradientSurface: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 216, 61, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  topLightGlow: {
    position: 'absolute',
    top: 2,
    left: '10%',
    right: '10%',
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '800',
    color: MRColors.textPrimary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  iconBox: {
    marginLeft: 4,
  },
});
