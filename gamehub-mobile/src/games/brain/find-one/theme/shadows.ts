// ============================================================
// Find One — Shadows and Bevel Styles
// ============================================================

import { ViewStyle } from 'react-native';

export const FOShadows: Record<string, ViewStyle> = {
  cardGlow: {
    shadowColor: '#2488FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  goldButton: {
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  tileShadow: {
    shadowColor: '#03080E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  modalShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 16,
  },
};
