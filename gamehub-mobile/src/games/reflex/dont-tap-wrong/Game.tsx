// ============================================================
// DON'T TAP WRONG — Game Entry Component
// Registered with GameHub Registry. Mounts the Master Arcade Experience
// ============================================================

import React from 'react';
import { DontTapWrongMasterGame } from './DontTapWrongMasterGame';
import type { GameEngine } from '../../engine/GameEngine';

interface DontTapWrongProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const DontTapWrongGame: React.FC<DontTapWrongProps> = ({ onFinish }) => {
  return (
    <DontTapWrongMasterGame
      onExit={() => {
        if (onFinish) {
          onFinish(0, false);
        }
      }}
    />
  );
};

export default DontTapWrongGame;
