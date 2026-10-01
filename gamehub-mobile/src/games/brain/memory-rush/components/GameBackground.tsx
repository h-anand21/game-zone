// ============================================================
// MEMORY RUSH — GameBackground Adapter (Redirects to JungleWorldBackground)
// ============================================================

import React from 'react';
import { JungleWorldBackground, JungleBgVariant } from './JungleWorldBackground';

interface GameBackgroundProps {
  theme?: JungleBgVariant;
  variant?: JungleBgVariant;
  dimmed?: boolean;
  children?: React.ReactNode;
}

export const GameBackground: React.FC<GameBackgroundProps> = ({
  theme,
  variant,
  dimmed = false,
  children,
}) => {
  const activeVariant = variant || theme || 'home';
  return (
    <JungleWorldBackground variant={activeVariant} dimmed={dimmed}>
      {children}
    </JungleWorldBackground>
  );
};
