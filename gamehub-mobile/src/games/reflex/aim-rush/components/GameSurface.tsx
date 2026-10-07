// ============================================================
// AIM RUSH — GameSurface Touch Canvas
// The Screen is the Controller: Direct touch coordinate receiver
// ============================================================

import React from 'react';
import { StyleSheet, View, GestureResponderEvent } from 'react-native';

interface GameSurfaceProps {
  onTouch: (touchX: number, touchY: number) => void;
  children?: React.ReactNode;
}

export const GameSurface: React.FC<GameSurfaceProps> = ({ onTouch, children }) => {
  const handleTouchStart = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    onTouch(locationX, locationY);
  };

  return (
    <View
      style={styles.surface}
      onStartShouldSetResponder={() => true}
      onResponderGrant={handleTouchStart}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
});
