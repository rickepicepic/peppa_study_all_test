export type QuestionType = 'single' | 'multiple' | 'boolean';

export interface AttemptItem {
  id: string;
  type: QuestionType;
  correct: string[];
  user: string[];
}

export interface AttemptDetail {
  id: string;
  isCorrect: boolean;
}

export interface AttemptResult {
  score: number;
  correctCount: number;
  total: number;
  details: AttemptDetail[];
}

function normalizeAnswer(answer: string[]): string {
  return [...answer].sort().join('|');
}

export function evaluateAttempt(items: AttemptItem[]): AttemptResult {
  const details = items.map((item) => ({
    id: item.id,
    isCorrect: normalizeAnswer(item.correct) === normalizeAnswer(item.user)
  }));

  const correctCount = details.filter((detail) => detail.isCorrect).length;
  const total = items.length;
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);

  return {
    score,
    correctCount,
    total,
    details
  };
}
