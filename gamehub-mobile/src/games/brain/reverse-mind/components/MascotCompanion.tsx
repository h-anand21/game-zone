// ============================================================
// REVERSE MIND — Expressive Mascot Companion (Boy & Corgi Duo)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RMTheme } from '../theme';

export type MascotState =
  | 'idle'
  | 'thinking'
  | 'happy'
  | 'excited'
  | 'confused'
  | 'wrong'
  | 'celebrating'
  | 'surprised';

interface MascotCompanionProps {
  state?: MascotState;
  showSpeechBubble?: boolean;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MascotCompanion: React.FC<MascotCompanionProps> = ({
  state = 'idle',
  showSpeechBubble = false,
  speechText,
  size = 'md',
}) => {
  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.2 : 1.0;
  const avatarSize = size === 'sm' ? 56 : size === 'lg' ? 84 : 70;

  const getEmotionBadge = () => {
    switch (state) {
      case 'thinking':
        return '🤔';
      case 'happy':
        return '😄';
      case 'excited':
      case 'celebrating':
        return '🎉';
      case 'confused':
        return '❓';
      case 'wrong':
        return '💥';
      case 'surprised':
        return '⚡';
      case 'idle':
      default:
        return '💡';
    }
  };

  return (
    <View style={[styles.container, { transform: [{ scale }] }]}>
      {/* Optional Speech Bubble */}
      {showSpeechBubble && speechText && (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{speechText}</Text>
          <View style={styles.bubbleTail} />
        </View>
      )}

      {/* Characters Duo Container */}
      <View style={styles.duoRow}>
        {/* Cartoon Boy Mascot (Left) */}
        <View style={[styles.avatarBox, { width: avatarSize, height: avatarSize }]}>
          <Image
            source={require('../../../../../assets/images/rm_char_boy_study.jpg')}
            style={styles.avatarImg}
            resizeMode="cover"
          />
        </View>

        {/* Emotion Indicator Badge */}
        <View style={styles.emotionCircle}>
          <Text style={styles.emotionEmoji}>{getEmotionBadge()}</Text>
        </View>

        {/* Caped Corgi Companion (Right) */}
        <View style={[styles.avatarBox, { width: avatarSize - 8, height: avatarSize - 8 }]}>
          <Image
            source={require('../../../../../assets/images/rm_char_corgi_hero.jpg')}
            style={styles.avatarImg}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RMTheme.radii.md,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    maxWidth: 280,
  },
  bubbleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#07111F',
    textAlign: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -6,
    left: '48%',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  duoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  avatarBox: {
    borderRadius: RMTheme.radii.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: RMTheme.colors.cyanNeon,
    shadowColor: RMTheme.colors.cyanNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  emotionCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(16, 27, 43, 0.95)',
    borderWidth: 1.5,
    borderColor: RMTheme.colors.primaryGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emotionEmoji: {
    fontSize: 14,
  },
});
