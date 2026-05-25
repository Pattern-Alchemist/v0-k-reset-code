// store/assessmentStore.ts
import { create } from 'zustand';
import { calculateScore, getTier } from '../lib/scoring';

interface AssessmentState {
  answers: Record<string, number>;
  currentQuestion: number;
  score: number | null;
  tier: string | null;
  isComplete: boolean;
  
  setAnswer: (questionId: string, value: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  calculateResults: () => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  answers: {},
  currentQuestion: 0,
  score: null,
  tier: null,
  isComplete: false,
  
  setAnswer: (questionId: string, value: number) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: value },
    }));
  },
  
  nextQuestion: () => {
    set((state) => ({
      currentQuestion: Math.min(state.currentQuestion + 1, 3),
    }));
  },
  
  prevQuestion: () => {
    set((state) => ({
      currentQuestion: Math.max(state.currentQuestion - 1, 0),
    }));
  },
  
  calculateResults: () => {
    const { answers } = get();
    const score = calculateScore(answers);
    const tier = getTier(score);
    set({ score, tier, isComplete: true });
  },
  
  reset: () => {
    set({
      answers: {},
      currentQuestion: 0,
      score: null,
      tier: null,
      isComplete: false,
    });
  },
}));
