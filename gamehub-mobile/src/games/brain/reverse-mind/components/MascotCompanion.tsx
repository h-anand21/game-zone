// ============================================================
// REVERSE MIND — Expressive Mascot Companion (Boy & Corgi Duo)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
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
  const scale = size === 'sm' ? 0.7 : size === 'lg' ? 1.25 : 1.0;

  // Reaction emotion icons / badges
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
        <View style={styles.characterBox}>
          <Svg width={70} height={80} viewBox="0 0 100 120">
            <Defs>
              <SvgGradient id="boyShirt" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#4DA3FF" />
                <Stop offset="100%" stopColor="#1E88E5" />
              </SvgGradient>
              <SvgGradient id="boyHair" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#5D4037" />
                <Stop offset="100%" stopColor="#3E2723" />
              </SvgGradient>
            </Defs>

            {/* Hair Back */}
            <Circle cx="50" cy="40" r="32" fill="url(#boyHair)" />

            {/* Head / Face */}
            <Circle cx="50" cy="48" r="26" fill="#FFE0B2" />

            {/* Hair Front Bangs */}
            <Path d="M 26 40 Q 50 18 74 40 Q 60 30 50 36 Q 40 30 26 40 Z" fill="url(#boyHair)" />

            {/* Eyes */}
            {state === 'wrong' ? (
              // Crossed dizzy eyes
              <>
                <Path d="M 38 46 L 46 54 M 46 46 L 38 54" stroke="#263238" strokeWidth="3" strokeLinecap="round" />
                <Path d="M 54 46 L 62 54 M 62 46 L 54 54" stroke="#263238" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : state === 'happy' || state === 'celebrating' ? (
              // Arc happy eyes
              <>
                <Path d="M 36 50 Q 42 44 48 50" stroke="#263238" strokeWidth="3" fill="none" strokeLinecap="round" />
                <Path d="M 52 50 Q 58 44 64 50" stroke="#263238" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            ) : (
              // Round alert eyes
              <>
                <Circle cx="42" cy="48" r="4.5" fill="#263238" />
                <Circle cx="43" cy="46" r="1.5" fill="#FFFFFF" />
                <Circle cx="58" cy="48" r="4.5" fill="#263238" />
                <Circle cx="59" cy="46" r="1.5" fill="#FFFFFF" />
              </>
            )}

            {/* Mouth */}
            {state === 'celebrating' || state === 'happy' || state === 'excited' ? (
              <Path d="M 42 58 Q 50 68 58 58 Z" fill="#E53935" />
            ) : state === 'thinking' ? (
              <Path d="M 44 60 Q 50 60 56 58" stroke="#263238" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            ) : state === 'wrong' ? (
              <Path d="M 42 62 Q 50 56 58 62" stroke="#263238" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            ) : (
              <Path d="M 45 58 Q 50 63 55 58" stroke="#263238" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            )}

            {/* Cheeks */}
            <Circle cx="35" cy="54" r="4" fill="#FF8A80" opacity="0.6" />
            <Circle cx="65" cy="54" r="4" fill="#FF8A80" opacity="0.6" />

            {/* Body / Hoodie */}
            <Path d="M 28 85 Q 50 74 72 85 L 76 118 L 24 118 Z" fill="url(#boyShirt)" />
            {/* Collar */}
            <Circle cx="50" cy="78" r="8" fill="#FFD83D" />
          </Svg>
        </View>

        {/* Emotion Indicator Badge */}
        <View style={styles.emotionCircle}>
          <Text style={styles.emotionEmoji}>{getEmotionBadge()}</Text>
        </View>

        {/* Caped Corgi Companion (Right) */}
        <View style={styles.characterBox}>
          <Svg width={60} height={70} viewBox="0 0 100 110">
            <Defs>
              <SvgGradient id="corgiFur" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FFA726" />
                <Stop offset="100%" stopColor="#FB8C00" />
              </SvgGradient>
              <SvgGradient id="corgiCape" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FF5252" />
                <Stop offset="100%" stopColor="#D32F2F" />
              </SvgGradient>
            </Defs>

            {/* Red Hero Cape */}
            <Path d="M 22 55 Q 10 75 14 102 Q 35 95 45 65 Z" fill="url(#corgiCape)" />

            {/* Left Ear */}
            <Path d="M 30 35 L 20 8 L 45 25 Z" fill="url(#corgiFur)" />
            <Path d="M 32 30 L 25 14 L 40 25 Z" fill="#FFE0B2" />

            {/* Right Ear */}
            <Path d="M 70 35 L 80 8 L 55 25 Z" fill="url(#corgiFur)" />
            <Path d="M 68 30 L 75 14 L 60 25 Z" fill="#FFE0B2" />

            {/* Head */}
            <Circle cx="50" cy="45" r="26" fill="url(#corgiFur)" />
            {/* White Muzzle */}
            <Circle cx="50" cy="53" r="16" fill="#FFFFFF" />

            {/* Eyes */}
            <Circle cx="40" cy="42" r="3.5" fill="#263238" />
            <Circle cx="41" cy="40" r="1.2" fill="#FFFFFF" />
            <Circle cx="60" cy="42" r="3.5" fill="#263238" />
            <Circle cx="61" cy="40" r="1.2" fill="#FFFFFF" />

            {/* Nose */}
            <Circle cx="50" cy="49" r="3" fill="#212121" />

            {/* Cute Tongue */}
            {(state === 'happy' || state === 'celebrating' || state === 'idle') && (
              <Path d="M 48 55 Q 50 62 52 55 Z" fill="#FF80AB" />
            )}

            {/* Little Body */}
            <Path d="M 32 70 Q 50 68 68 70 L 64 100 L 36 100 Z" fill="url(#corgiFur)" />
            {/* White Chest */}
            <Path d="M 42 70 Q 50 72 58 70 L 55 95 L 45 95 Z" fill="#FFFFFF" />
          </Svg>
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
    marginBottom: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bubbleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#07111F',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -6,
    left: '45%',
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
    gap: 6,
  },
  characterBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emotionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 27, 43, 0.85)',
    borderWidth: 1.5,
    borderColor: RMTheme.colors.cyanNeon,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
  },
  emotionEmoji: {
    fontSize: 14,
  },
});
