import { describe, expect, it } from 'vitest';
import { evaluateAttempt } from '../src/quizEngine';

describe('evaluateAttempt', () => {
  it('scores single choice as correct', () => {
    const result = evaluateAttempt([
      { id: 'q1', type: 'single', correct: ['B'], user: ['B'] }
    ]);

    expect(result).toMatchObject({
      score: 100,
      correctCount: 1,
      total: 1
    });
    expect(result.details).toEqual([{ id: 'q1', isCorrect: true }]);
  });

  it('scores multiple choice only when answer set matches exactly', () => {
    const correct = evaluateAttempt([
      { id: 'q2', type: 'multiple', correct: ['A', 'C'], user: ['C', 'A'] }
    ]);
    const wrong = evaluateAttempt([
      { id: 'q2', type: 'multiple', correct: ['A', 'C'], user: ['A'] }
    ]);

    expect(correct.correctCount).toBe(1);
    expect(wrong.correctCount).toBe(0);
  });

  it('supports boolean questions and returns aggregate fields', () => {
    const result = evaluateAttempt([
      { id: 'q3', type: 'boolean', correct: ['true'], user: ['false'] },
      { id: 'q4', type: 'boolean', correct: ['false'], user: ['false'] }
    ]);

    expect(result.score).toBe(50);
    expect(result.correctCount).toBe(1);
    expect(result.total).toBe(2);
    expect(result.details).toEqual([
      { id: 'q3', isCorrect: false },
      { id: 'q4', isCorrect: true }
    ]);
  });
});
