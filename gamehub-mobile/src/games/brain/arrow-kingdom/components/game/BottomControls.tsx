// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Bottom Controls Component
// Dimensional wooden buttons for Undo, Hint & Reset
// ============================================================

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { ArrowHaptics } from '../../utils/haptics';

interface BottomControlsProps {
  onUndo: () => void;
  onHint: () => void;
  onReset: () => void;
  canUndo: boolean;
  hintsRemaining: number;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  onUndo,
  onHint,
  onReset,
  canUndo,
  hintsRemaining,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom + 8, 16) }]}>
      {/* Undo Button */}
      <Pressable
        onPress={() => {
          if (!canUndo) return;
          ArrowHaptics.buttonPress();
          onUndo();
        }}
        disabled={!canUndo}
        style={({ pressed }) => [
          styles.btnWrapper,
          !canUndo && styles.disabledBtn,
          pressed && canUndo && styles.btnPressed,
        ]}
      >
        <LinearGradient
          colors={canUndo ? ['#2A5378', '#112C46'] : ['#1C2633', '#111822']}
          style={styles.btnSurface}
        >
          <Text style={[styles.btnIcon, !canUndo && styles.disabledText]}>↶</Text>
          <Text style={[styles.btnLabel, !canUndo && styles.disabledText]}>UNDO</Text>
        </LinearGradient>
      </Pressable>

      {/* Hint Button (Prominent Center) */}
      <Pressable
        onPress={() => {
          ArrowHaptics.buttonPress();
          onHint();
        }}
        style={({ pressed }) => [styles.btnWrapper, styles.hintWrapper, pressed && styles.btnPressed]}
      >
        <LinearGradient
          colors={['#FFE259', '#E5A016']}
          style={[styles.btnSurface, styles.hintSurface]}
        >
          <Text style={styles.hintIcon}>💡</Text>
          <Text style={styles.hintLabel}>HINT</Text>
          <View style={styles.hintBadge}>
            <Text style={styles.hintBadgeText}>{hintsRemaining}</Text>
          </View>
        </LinearGradient>
      </Pressable>

      {/* Reset Button */}
      <Pressable
        onPress={() => {
          ArrowHaptics.buttonPress();
          onReset();
        }}
        style={({ pressed }) => [styles.btnWrapper, pressed && styles.btnPressed]}
      >
        <LinearGradient
          colors={['#844319', '#4D240E']}
          style={styles.btnSurface}
        >
          <Text style={styles.btnIcon}>↻</Text>
          <Text style={styles.btnLabel}>RESET</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  btnWrapper: {
    width: 86,
    height: 64,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#3D1C08',
    backgroundColor: '#3D1C08',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 6,
  },
  hintWrapper: {
    width: 96,
    height: 68,
    borderColor: '#7A480A',
    shadowColor: COLORS.gold,
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  btnPressed: {
    transform: [{ scale: 0.94 }, { translateY: 2 }],
  },
  disabledBtn: {
    opacity: 0.5,
  },
  btnSurface: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
  },
  hintSurface: {
    borderColor: '#FFF8D0',
    borderWidth: 2,
  },
  btnIcon: {
    fontSize: 22,
    fontWeight: '900',
    color: '#E2EEF9',
  },
  btnLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#E2EEF9',
    letterSpacing: 1,
    marginTop: 2,
  },
  hintIcon: {
    fontSize: 22,
  },
  hintLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#382003',
    letterSpacing: 1,
    marginTop: 1,
  },
  hintBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#78F329',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#127A12',
    paddingHorizontal: 4,
  },
  hintBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#083D08',
  },
  disabledText: {
    color: '#63798E',
  },
});

export default BottomControls;
