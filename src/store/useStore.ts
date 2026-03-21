import { create } from 'zustand';

interface UserProfile {
  name: string;
  goals: string[];
  habits: string[];
}

interface Measurement {
  id: string;
  type: 'urinalysis' | 'ecg' | 'ppg' | 'weight' | 'temp';
  value: any;
  timestamp: number;
}

interface AppState {
  user: UserProfile | null;
  measurements: Measurement[];
  globalScore: number;
  isNfcLoading: boolean;
  setUser: (user: UserProfile) => void;
  addMeasurement: (measurement: Measurement) => void;
  setGlobalScore: (score: number) => void;
  setNfcLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  measurements: [],
  globalScore: 0,
  isNfcLoading: false,
  setUser: (user) => set({ user }),
  addMeasurement: (measurement) => set((state) => ({ 
    measurements: [measurement, ...state.measurements] 
  })),
  setGlobalScore: (score) => set({ globalScore: score }),
  setNfcLoading: (loading) => set({ isNfcLoading: loading }),
}));
