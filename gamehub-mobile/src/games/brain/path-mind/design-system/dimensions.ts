// ============================================================
// PATH MIND — Design System: Dimensions & Layout Bounds
// Responsive layout constraints across phones and tablets
// ============================================================

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const pmDimensions = {
  windowWidth: width,
  windowHeight: height,
  maxContentWidth: Math.min(width - 32, 420),
  boardMaxWidth: Math.min(width - 40, 360),
  buttonHeightLarge: 62,
  buttonHeightMedium: 52,
  buttonHeightSmall: 42,
  hudHeight: 56,
};
