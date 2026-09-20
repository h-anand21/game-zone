// ============================================================
// GameHub — Number Rush Types
// ============================================================

export type Operator = '+' | '-' | '×' | '÷';

export interface MathQuestion {
  num1: number;
  num2: number;
  operator: Operator;
  answer: number;
  options: number[];
}
