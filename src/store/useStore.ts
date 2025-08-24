import { create } from 'zustand';

interface Store {
  currentSnippet: string;
  currentGoal: string;
  setCurrentSnippet: (snippet: string) => void;
  setCurrentGoal: (goal: string) => void;
}

export const useStore = create<Store>((set) => ({
  currentSnippet: '',
  currentGoal: 'general',
  setCurrentSnippet: (snippet) => set({ currentSnippet: snippet }),
  setCurrentGoal: (goal) => set({ currentGoal: goal }),
}));