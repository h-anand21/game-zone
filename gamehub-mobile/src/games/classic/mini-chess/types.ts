// ============================================================
// GameHub — Mini Chess Types
// ============================================================

export type ChessColor = 'white' | 'black';
export type PieceKind = 'king' | 'queen' | 'rook' | 'knight' | 'pawn';

export interface ChessPiece {
  kind: PieceKind;
  color: ChessColor;
}

export type ChessBoard = (ChessPiece | null)[][];
