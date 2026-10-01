// ============================================================
// REVERSE MIND — Mind Shift Dynamic Rule Alert Modal
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import type { MindShiftRule } from '../types';
import { GlowButton } from './GlowButton';
import { RMTheme } from '../theme';

interface MindShiftModalProps {
  visible: boolean;
  rule: MindShiftRule;
  onDismiss: () => void;
}

export const MindShiftModal: React.FC<MindShiftModalProps> = ({
  visible,
  rule,
  onDismiss,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#1F1128', '#140E20', '#0B0714']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            {/* Split Brain Energy Vortex */}
            <View style={styles.vortexContainer}>
              <Svg width={100} height={100} viewBox="0 0 100 100">
                <Defs>
                  <RadialGradient id="vortexGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                    <Stop offset="0%" stopColor="#FF9800" stopOpacity="0.8" />
                    <Stop offset="70%" stopColor="#E91E63" stopOpacity="0.3" />
                    <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </RadialGradient>
                </Defs>

                <Circle cx="50" cy="50" r="45" fill="url(#vortexGlow)" />
                {/* Spiral Energy Rings */}
                <Path
                  d="M 50 15 A 35 35 0 0 1 85 50 A 25 25 0 0 1 50 75 A 15 15 0 0 1 35 50"
                  stroke="#FFD54F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <Path
                  d="M 50 85 A 35 35 0 0 1 15 50 A 25 25 0 0 1 50 25 A 15 15 0 0 1 65 50"
                  stroke="#FF5252"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <Circle cx="50" cy="50" r="8" fill="#FFFFFF" />
              </Svg>
            </View>

            {/* Mind Shift Title */}
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>⚠️ RULE CHANGE ALERT</Text>
            </View>

            <Text style={styles.titlePrimary}>MIND SHIFT!</Text>
            <Text style={styles.subtitle}>NEW RULE ACTIVATED</Text>

            {/* Rule Detail Container */}
            <View style={[styles.ruleBox, { borderColor: rule.badgeColor }]}>
              <Text style={[styles.ruleTag, { color: rule.badgeColor }]}>{rule.ruleTag}</Text>
              <Text style={styles.ruleInstruction}>{rule.instruction}</Text>
            </View>

            {/* Got It Button */}
            <View style={styles.buttonWrapper}>
              <GlowButton
                title="GOT IT, LET'S REVERSE!"
                onPress={onDismiss}
                variant="gold"
                size="lg"
              />
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 11, 22, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: RMTheme.radii.xl,
    borderWidth: 2,
    borderColor: '#FF9800',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 24,
    alignItems: 'center',
  },
  vortexContainer: {
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: RMTheme.radii.full,
    borderWidth: 1,
    borderColor: '#FF9800',
    marginBottom: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFB74D',
    letterSpacing: 1.5,
  },
  titlePrimary: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFD54F',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 152, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFCC80',
    letterSpacing: 2,
    marginBottom: 16,
  },
  ruleBox: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: RMTheme.radii.lg,
    padding: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    marginBottom: 20,
  },
  ruleTag: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  ruleInstruction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F0F6FC',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonWrapper: {
    width: '100%',
  },
});
