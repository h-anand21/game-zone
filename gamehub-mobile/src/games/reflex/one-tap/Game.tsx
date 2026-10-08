// ============================================================
// GameHub — One Tap Precision Game Component
// Mounts the Master AAA One Tap Experience with Full Screen Canvas
// ============================================================

import React from 'react';
import { OneTapGame as MasterOneTapGame } from './OneTapGame';
import type { GameEngine } from '../../engine/GameEngine';

interface OneTapProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const OneTapGame: React.FC<OneTapProps> = ({ onFinish }) => {
  return (
    <MasterOneTapGame
      onExit={() => {
        if (onFinish) {
          onFinish(0, false);
        }
      }}
    />
  );
};

export default OneTapGame;
