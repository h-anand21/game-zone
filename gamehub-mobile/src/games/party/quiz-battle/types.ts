// ============================================================
// GameHub — Quiz Battle Types
// ============================================================

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
}
