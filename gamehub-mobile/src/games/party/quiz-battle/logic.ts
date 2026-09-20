// ============================================================
// GameHub — Quiz Battle Pure Logic
// ============================================================

import type { QuizQuestion } from './types';

export function getQuizQuestions(): QuizQuestion[] {
  return [
    {
      id: 1,
      category: 'Science',
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctIndex: 1,
    },
    {
      id: 2,
      category: 'Gaming',
      question: 'What is the highest-selling video game of all time?',
      options: ['Tetris', 'Minecraft', 'GTA V', 'Super Mario'],
      correctIndex: 1,
    },
    {
      id: 3,
      category: 'Technology',
      question: 'Which programming language is commonly used for React Native?',
      options: ['Python', 'TypeScript', 'Java', 'C++'],
      correctIndex: 1,
    },
    {
      id: 4,
      category: 'Geography',
      question: 'What is the capital of Japan?',
      options: ['Kyoto', 'Osaka', 'Tokyo', 'Hiroshima'],
      correctIndex: 2,
    },
    {
      id: 5,
      category: 'General',
      question: 'How many sides does a hexagon have?',
      options: ['5', '6', '7', '8'],
      correctIndex: 1,
    },
  ];
}
