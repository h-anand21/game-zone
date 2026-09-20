// ============================================================
// GameHub — Mini Chess Pure Logic
// ============================================================

import type { ChessBoard, ChessPiece } from './types';

export function getInitialMiniChessBoard(): ChessBoard {
  return [
    [
      { kind: 'rook', color: 'black' },
      { kind: 'knight', color: 'black' },
      { kind: 'queen', color: 'black' },
      { kind: 'king', color: 'black' },
      { kind: 'rook', color: 'black' },
    ],
    [
      { kind: 'pawn', color: 'black' },
      { kind: 'pawn', color: 'black' },
      { kind: 'pawn', color: 'black' },
      { kind: 'pawn', color: 'black' },
      { kind: 'pawn', color: 'black' },
    ],
    [null, null, null, null, null],
    [
      { kind: 'pawn', color: 'white' },
      { kind: 'pawn', color: 'white' },
      { kind: 'pawn', color: 'white' },
      { kind: 'pawn', color: 'white' },
      { kind: 'pawn', color: 'white' },
    ],
    [
      { kind: 'rook', color: 'white' },
      { kind: 'knight', color: 'white' },
      { kind: 'queen', color: 'white' },
      { kind: 'king', color: 'white' },
      { kind: 'rook', color: 'white' },
    ],
  ];
}

export function getPieceEmoji(piece: ChessPiece | null): string {
  if (!piece) return '';
  const { kind, color } = piece;
  if (color === 'white') {
    switch (kind) {
      case 'king': return '♔';
      case 'queen': return '♕';
      case 'rook': return '♖';
      case 'knight': return '♘';
      case 'pawn': return '♙';
    }
  } else {
    switch (kind) {
      case 'king': return '♚';
      case 'queen': return '♛';
      case 'rook': return '♜';
      case 'knight': return '♞';
      case 'pawn': return '♟';
    }
  }
}
