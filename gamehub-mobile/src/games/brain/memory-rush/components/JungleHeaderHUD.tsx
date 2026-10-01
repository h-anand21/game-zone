// ============================================================
// MEMORY RUSH — Jungle Header HUD
// Tactile stone & wood navigation header with gold trim
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MRIcon, MRIconName } from './MRIcon';
import { MRColors } from '../constants/colors';

interface JungleHeaderHUDProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  backIcon?: MRIconName;
  rightAction?: React.ReactNode;
}

export const JungleHeaderHUD: React.FC<JungleHeaderHUDProps> = ({
  title,
  subtitle,
  onBack,
  backIcon = 'arrow-left',
  rightAction,
}) => {
  const handleBack = () => {
    if (!onBack) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onBack();
  };

  return (
    <View style={styles.container}>
      {/* Back Button (Tactile Stone Disc) */}
      {onBack ? (
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backBtnWrapper,
            pressed && styles.pressed,
          ]}
          accessibilityLabel="Back button"
        >
          <View style={styles.backBtnExtrusion} />
          <LinearGradient
            colors={['#4E5E6E', '#323E4B', '#1F2730']}
            style={styles.backBtnFace}
          >
            <View style={styles.btnTopHighlight} />
            <MRIcon name={backIcon} size={20} color="#FFD700" />
          </LinearGradient>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Center Title Plank */}
      {title && (
        <View style={styles.titleContainer}>
          {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
          <Text style={styles.titleText}>{title}</Text>
        </View>
      )}

      {/* Right Action Element */}
      {rightAction ? (
        <View style={styles.rightActionWrapper}>{rightAction}</View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
  },
  backBtnWrapper: {
    position: 'relative',
    width: 44,
    height: 48,
  },
  backBtnExtrusion: {
    position: 'absolute',
    bottom: 0,
    left: 2,
    right: 2,
    height: 8,
    backgroundColor: '#12181E',
    borderRadius: 22,
  },
  backBtnFace: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#718496',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  btnTopHighlight: {
    position: 'absolute',
    top: 1,
    left: '15%',
    right: '15%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 1,
  },
  pressed: {
    transform: [{ translateY: 3 }],
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  rightActionWrapper: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  placeholder: {
    width: 44,
  },
});
