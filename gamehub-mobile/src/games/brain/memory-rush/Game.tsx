import React from 'react';
import { MemoryRushApp } from './MemoryRushApp';
import type { GameEngine } from '../../engine/GameEngine';

interface MemoryRushGameProps {
  engine?: GameEngine;
  onFinish?: (score: number, won: boolean, metadata?: Record<string, unknown>) => void;
  isPaused?: boolean;
}

export const MemoryRushGame: React.FC<MemoryRushGameProps> = ({ onFinish }) => {
  return <MemoryRushApp onExitGame={() => onFinish?.(0, false)} />;
};

export default MemoryRushGame;

