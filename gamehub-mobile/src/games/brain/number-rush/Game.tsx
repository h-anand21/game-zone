// ============================================================
// GameHub — Number Rush Full Arcade Experience Component
// ============================================================

import React from 'react';
import { NumberRushApp } from './NumberRushApp';
import type { GameEngine } from '../../engine/GameEngine';

interface NumberRushProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const NumberRushGame: React.FC<NumberRushProps> = ({ onFinish }) => {
  return (
    <NumberRushApp
      onExit={() => onFinish?.(0, false)}
      onFinishGame={onFinish}
    />
  );
};
