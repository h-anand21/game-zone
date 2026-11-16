// ============================================================
// Block Blast — Mobile Arcade Control Pad Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlockHaptics } from '../haptics';

interface ControlPadProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  disabled?: boolean;
}

export const ControlPad: React.FC<ControlPadProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  disabled = false,
}) => {
  const handleLeft = () => {
    if (disabled) return;
    BlockHaptics.gridSnap();
    onMoveLeft();
  };

  const handleRight = () => {
    if (disabled) return;
    BlockHaptics.gridSnap();
    onMoveRight();
  };

  const handleRotate = () => {
    if (disabled) return;
    BlockHaptics.piecePickup();
    onRotate();
  };

  const handleSoftDrop = () => {
    if (disabled) return;
    BlockHaptics.gridSnap();
    onSoftDrop();
  };

  const handleHardDrop = () => {
    if (disabled) return;
    BlockHaptics.piecePlaced();
    onHardDrop();
  };

  return (
    <View style={styles.container}>
      {/* Top Action Row: Left, Rotate, Right */}
      <View style={styles.row}>
        {/* Left Button */}
        <Pressable
          onPress={handleLeft}
          disabled={disabled}
          style={({ pressed }) => [styles.btnBase, pressed && styles.btnPressed]}
        >
          <LinearGradient
            colors={['#1E3558', '#0F1D32']}
            style={styles.btnGradient}
          >
            <Text style={styles.btnIcon}>◀</Text>
          </LinearGradient>
        </Pressable>

        {/* Rotate Button (Large Neon Purple/Cyan) */}
        <Pressable
          onPress={handleRotate}
          disabled={disabled}
          style={({ pressed }) => [
            styles.btnBase,
            styles.rotateBtn,
            pressed && styles.btnPressed,
          ]}
        >
          <LinearGradient
            colors={['#80F3FF', '#0091EA']}
            style={styles.btnGradient}
          >
            <Text style={[styles.btnIcon, styles.rotateIcon]}>🔄</Text>
            <Text style={styles.rotateLabel}>ROTATE</Text>
          </LinearGradient>
        </Pressable>

        {/* Right Button */}
        <Pressable
          onPress={handleRight}
          disabled={disabled}
          style={({ pressed }) => [styles.btnBase, pressed && styles.btnPressed]}
        >
          <LinearGradient
            colors={['#1E3558', '#0F1D32']}
            style={styles.btnGradient}
          >
            <Text style={styles.btnIcon}>▶</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Bottom Drop Row: Soft Drop & Hard Slam */}
      <View style={styles.row}>
        {/* Soft Drop Button */}
        <Pressable
          onPress={handleSoftDrop}
          disabled={disabled}
          style={({ pressed }) => [
            styles.btnBase,
            styles.dropBtn,
            pressed && styles.btnPressed,
          ]}
        >
          <LinearGradient
            colors={['#243C62', '#14233A']}
            style={styles.btnGradient}
          >
            <Text style={styles.btnIcon}>▼</Text>
            <Text style={styles.dropLabel}>DROP</Text>
          </LinearGradient>
        </Pressable>

        {/* Hard Drop Button (Golden Slam) */}
        <Pressable
          onPress={handleHardDrop}
          disabled={disabled}
          style={({ pressed }) => [
            styles.btnBase,
            styles.slamBtn,
            pressed && styles.btnPressed,
          ]}
        >
          <LinearGradient
            colors={['#FFE57F', '#FFB300']}
            style={styles.btnGradient}
          >
            <Text style={[styles.btnIcon, { color: '#07111F' }]}>⚡</Text>
            <Text style={[styles.dropLabel, { color: '#07111F' }]}>SLAM</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 8,
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  btnBase: {
    height: 48,
    minWidth: 80,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#26426C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  btnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
  btnIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  rotateBtn: {
    minWidth: 110,
    borderColor: '#80F3FF',
    shadowColor: '#00E5FF',
  },
  rotateIcon: {
    fontSize: 16,
  },
  rotateLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#07111F',
    letterSpacing: 1,
  },
  dropBtn: {
    flex: 1,
    maxWidth: 140,
  },
  dropLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  slamBtn: {
    flex: 1,
    maxWidth: 140,
    borderColor: '#FFD600',
    shadowColor: '#FFD600',
  },
});
