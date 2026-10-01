// ============================================================
// GameHub — Reverse Mind Full Cognitive Game Component
// ============================================================

import React from 'react';
import { ReverseMindApp } from './ReverseMindApp';
import type { GameEngine } from '../../engine/GameEngine';

interface ReverseMindProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const ReverseMindGame: React.FC<ReverseMindProps> = ({ onFinish }) => {
  return (
    <ReverseMindApp
      onExit={() => onFinish?.(0, false)}
      onFinishGame={onFinish}
    />
  );
};
