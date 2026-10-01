// ============================================================
// REVERSE MIND — Hanging Wooden Signboard Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { RMTheme } from '../theme';

interface HangingSignboardProps {
  title: string;
  subtitle?: string;
  tag?: string;
  variant?: 'wood' | 'gold' | 'neon';
}

export const HangingSignboard: React.FC<HangingSignboardProps> = ({
  title,
  subtitle,
  tag,
  variant = 'wood',
}) => {
  return (
    <View style={styles.container}>
      {/* Twin Suspension Chains & Edison Bulb */}
      <View style={styles.suspensionRow}>
        {/* Left Chain */}
        <Svg width={16} height={28} viewBox="0 0 16 28">
          <Line x1="8" y1="0" x2="8" y2="28" stroke="#8CA0B8" strokeWidth="2.5" strokeDasharray="3,2" />
          <Circle cx="8" cy="24" r="3.5" fill="#4B5563" />
        </Svg>

        {/* Center Glowing Lightbulb */}
        <View style={styles.bulbWrapper}>
          <Svg width={24} height={28} viewBox="0 0 24 28">
            <Line x1="12" y1="0" x2="12" y2="10" stroke="#8CA0B8" strokeWidth="2" />
            <Circle cx="12" cy="18" r="6" fill="#FFEE58" />
            <Path d="M 9 22 L 15 22" stroke="#B0BEC5" strokeWidth="2" />
          </Svg>
        </View>

        {/* Right Chain */}
        <Svg width={16} height={28} viewBox="0 0 16 28">
          <Line x1="8" y1="0" x2="8" y2="28" stroke="#8CA0B8" strokeWidth="2.5" strokeDasharray="3,2" />
          <Circle cx="8" cy="24" r="3.5" fill="#4B5563" />
        </Svg>
      </View>

      {/* Carved 2.5D Wooden Board */}
      <View style={styles.boardShadowWrapper}>
        <LinearGradient
          colors={[RMTheme.colors.woodBorder, RMTheme.colors.woodMedium, RMTheme.colors.woodDark]}
          style={styles.outerRim}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {/* Inner Inset Panel */}
          <LinearGradient
            colors={['#4A2109', '#301404', '#1E0B02']}
            style={styles.innerPanel}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            {/* Metallic Corner Rivets */}
            <View style={[styles.rivet, styles.rivetTL]} />
            <View style={[styles.rivet, styles.rivetTR]} />
            <View style={[styles.rivet, styles.rivetBL]} />
            <View style={[styles.rivet, styles.rivetBR]} />

            {/* Optional Small Status Tag */}
            {tag && (
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            )}

            {/* Main Signboard Title */}
            <Text style={styles.titleText}>{title}</Text>

            {/* Subtitle / Instructions */}
            {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
          </LinearGradient>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  suspensionRow: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 24,
  },
  bulbWrapper: {
    alignItems: 'center',
    marginTop: -2,
    shadowColor: '#FFEE58',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 4,
  },
  boardShadowWrapper: {
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  outerRim: {
    borderRadius: RMTheme.radii.lg,
    padding: 3,
    borderWidth: 1,
    borderColor: '#A85A24',
  },
  innerPanel: {
    borderRadius: RMTheme.radii.md,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 224, 130, 0.2)',
  },
  rivet: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFE082',
    borderWidth: 1,
    borderColor: '#795548',
  },
  rivetTL: { top: 6, left: 8 },
  rivetTR: { top: 6, right: 8 },
  rivetBL: { bottom: 6, left: 8 },
  rivetBR: { bottom: 6, right: 8 },
  tagBadge: {
    backgroundColor: 'rgba(255, 216, 61, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 216, 61, 0.4)',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFE082',
    letterSpacing: 1.2,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF8E1',
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD54F',
    marginTop: 2,
    textAlign: 'center',
  },
});
