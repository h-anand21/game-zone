// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Game Entry Point
// ============================================================

import React from 'react';
import { ArrowKingdomApp } from './ArrowKingdomApp';
import type { GameEngine } from '../../engine/GameEngine';

interface ArrowKingdomGameProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const ArrowKingdomGame: React.FC<ArrowKingdomGameProps> = ({ onFinish }) => {
  return <ArrowKingdomApp onExitGame={() => onFinish?.(0, false)} />;
};

export default ArrowKingdomGame;
