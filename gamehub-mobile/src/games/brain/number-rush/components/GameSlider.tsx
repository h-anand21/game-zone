// ============================================================
// Number Rush — Custom Arcade Volume Slider Component
// ============================================================

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { NRTheme } from '../theme';
import { NRHaptics } from '../services/haptics';

interface GameSliderProps {
  value: number; // 0 to 1
  onValueChange: (newValue: number) => void;
  disabled?: boolean;
}

export const GameSlider: React.FC<GameSliderProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const trackWidthRef = useRef<number>(180);
  const lastHapticRef = useRef<number>(Math.round(value * 10));

  const updateFromPosition = (pageX: number, trackLeft: number) => {
    if (disabled || trackWidthRef.current <= 0) return;
    const relX = Math.max(0, Math.min(trackWidthRef.current, pageX - trackLeft));
    const newVal = Math.max(0, Math.min(1, relX / trackWidthRef.current));
    const roundedPercent = Math.round(newVal * 100);

    const hapticStep = Math.round(newVal * 10);
    if (hapticStep !== lastHapticRef.current) {
      lastHapticRef.current = hapticStep;
      NRHaptics.buttonTap();
    }

    onValueChange(roundedPercent / 100);
  };

  const trackRef = useRef<View>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt) => {
        trackRef.current?.measure((_x, _y, _w, _h, pageX) => {
          updateFromPosition(evt.nativeEvent.pageX, pageX);
        });
      },
      onPanResponderMove: (evt) => {
        trackRef.current?.measure((_x, _y, _w, _h, pageX) => {
          updateFromPosition(evt.nativeEvent.pageX, pageX);
        });
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    trackWidthRef.current = e.nativeEvent.layout.width;
  };

  const percentage = Math.round(value * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.percentText}>{percentage}%</Text>

      <View
        ref={trackRef}
        onLayout={onLayout}
        style={styles.trackContainer}
        {...panResponder.panHandlers}
      >
        {/* Track Background */}
        <View style={styles.trackBg}>
          {/* Progress Golden Fill */}
          <View
            style={[
              styles.progressFill,
              { width: `${percentage}%` },
            ]}
          />
          {/* Top gloss line */}
          <View style={styles.trackGloss} />
        </View>

        {/* Thumb Knob */}
        <View
          style={[
            styles.thumb,
            { left: `${percentage}%` },
            disabled && styles.thumbDisabled,
          ]}
        >
          <View style={styles.thumbCenter} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    maxWidth: 210,
  },
  percentText: {
    color: '#FFE082',
    fontWeight: '900',
    fontSize: 13,
    minWidth: 38,
    textAlign: 'right',
  },
  trackContainer: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    position: 'relative',
  },
  trackBg: {
    height: 12,
    backgroundColor: '#0A1710',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#3D2214',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFB800',
    borderRadius: 6,
  },
  trackGloss: {
    position: 'absolute',
    top: 1,
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 1,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD42A',
    borderWidth: 2.5,
    borderColor: '#FFF4D6',
    marginLeft: -12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 5,
  },
  thumbCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C67C00',
  },
  thumbDisabled: {
    opacity: 0.5,
  },
});
