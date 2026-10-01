// ============================================================
// REVERSE MIND — Procedural Cozy Night Study Background Wrapper
// ============================================================

import React from 'react';
import { EnvironmentalBackground, EnvTheme } from './EnvironmentalBackground';

export const GameBackground: React.FC<{ theme?: EnvTheme; children?: React.ReactNode }> = ({
  theme = 'home',
  children,
}) => {
  return <EnvironmentalBackground theme={theme}>{children}</EnvironmentalBackground>;
};
