import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Types for the Think Day Sanctuary
export interface WheelOfLifeData {
  categories: string[];
  scores: number[];
  satisfaction: number[];
  notes?: string;
}

export interface FearSettingData {
  catalyst: string;
  fears: Array<{
    fear: string;
    prevent: string;
    repair: string;
    likelihood: number; // 1-10 rating
    impact: number; // 1-10 rating
  }>;
  benefits: string;
  costs: {
    sixMonths: string;
    oneYear: string;
    threeYears: string;
  };
}

export interface JournalEntry {
  prompt: string;
  response: string;
  priority?: number; // 1-5 stars for insight priority
  category?: 'reflection' | 'growth' | 'relationship' | 'career' | 'health' | 'financial';
}

export interface ThinkDaySession {
  id: string;
  date: string;
  wheelOfLife?: WheelOfLifeData;
  fearSetting?: FearSettingData;
  journalEntries: JournalEntry[];
  actionSteps: string;
  reviewDate?: string;
  isComplete: boolean;
  sessionRating?: number; // Overall session satisfaction 1-10
  keyInsights?: string[]; // Main takeaways from the session
}

export interface AppSettings {
  wheelCategories: string[];
  journalPrompts: string[];
}

export interface AppState {
  currentSession: ThinkDaySession | null;
  completedSessions: ThinkDaySession[];
  settings: AppSettings;
  isGuidedSession: boolean;
  currentStep: number;
}

// Default state
const defaultSettings: AppSettings = {
  wheelCategories: [
    'Mission', 'Family', 'Friends', 'Romance', 'Spiritual', 
    'Mental', 'Physical', 'Growth', 'Money', 'Joy'
  ],
  journalPrompts: [
    "What would I do if money were no object?",
    "If I didn't care about making money, how would I use my talents and skills to serve other people?",
    "What would I like people to say at my funeral? And to what extent am I currently living aligned with that future?",
    "If I repeated this week's actions for the next ten years, where would that lead me? And is that where I want to be?",
    "What activities in the last month have energised me, and what activities in the last month have drained me? How can I do more of what energises me and less of what has drained me?",
    "When it comes to my work or my life, what is the goal and what is the primary bottleneck?",
    "Do I work for my business or does my business work for me?",
    "If I knew I was going to die two years from now, how would I spend my time?",
    "What's the biggest bottleneck to achieving my next goal, and why am I not addressing it more directly?",
    "How much do my current goals reflect my own desires versus someone else's expectations?",
    "What are some areas in which I could invest more money to make life smoother and easier for myself?",
    "What could I do to make my life more meaningful?",
    "What do I wish I could do more quickly? And what do I wish I could do more slowly?",
    "What backpack am I carrying that no longer serves me?"
  ]
};

const initialState: AppState = {
  currentSession: null,
  completedSessions: [],
  settings: defaultSettings,
  isGuidedSession: false,
  currentStep: 0,
};

// Action types
type AppAction =
  | { type: 'START_NEW_SESSION' }
  | { type: 'START_GUIDED_SESSION' }
  | { type: 'END_SESSION' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_WHEEL_OF_LIFE'; payload: WheelOfLifeData }
  | { type: 'UPDATE_FEAR_SETTING'; payload: Partial<FearSettingData> }
  | { type: 'ADD_JOURNAL_ENTRY'; payload: JournalEntry }
  | { type: 'UPDATE_ACTION_STEPS'; payload: string }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'SET_REVIEW_DATE'; payload: string };

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'START_NEW_SESSION':
      return {
        ...state,
        currentSession: {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          journalEntries: [],
          actionSteps: '',
          isComplete: false,
        },
        isGuidedSession: false,
        currentStep: 0,
      };

    case 'START_GUIDED_SESSION':
      return {
        ...state,
        currentSession: {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          journalEntries: [],
          actionSteps: '',
          isComplete: false,
        },
        isGuidedSession: true,
        currentStep: 0,
      };

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 4),
      };

    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };

    case 'UPDATE_WHEEL_OF_LIFE':
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          wheelOfLife: action.payload,
        },
      };

    case 'UPDATE_FEAR_SETTING':
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          fearSetting: {
            ...state.currentSession.fearSetting,
            ...action.payload,
          } as FearSettingData,
        },
      };

    case 'ADD_JOURNAL_ENTRY':
      if (!state.currentSession) return state;
      const existingIndex = state.currentSession.journalEntries.findIndex(
        entry => entry.prompt === action.payload.prompt
      );
      
      const updatedEntries = [...state.currentSession.journalEntries];
      if (existingIndex >= 0) {
        updatedEntries[existingIndex] = action.payload;
      } else {
        updatedEntries.push(action.payload);
      }

      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          journalEntries: updatedEntries,
        },
      };

    case 'UPDATE_ACTION_STEPS':
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          actionSteps: action.payload,
        },
      };

    case 'SET_REVIEW_DATE':
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          reviewDate: action.payload,
        },
      };

    case 'COMPLETE_SESSION':
      if (!state.currentSession) return state;
      const completedSession = {
        ...state.currentSession,
        isComplete: true,
      };
      return {
        ...state,
        currentSession: null,
        completedSessions: [completedSession, ...state.completedSessions],
        isGuidedSession: false,
        currentStep: 0,
      };

    case 'END_SESSION':
      return {
        ...state,
        currentSession: null,
        isGuidedSession: false,
        currentStep: 0,
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
};

// Context
const ThinkDayContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export const ThinkDayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { toast } = useToast();

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('thinkDaySanctuaryState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Failed to load saved state:', error);
      toast({
        title: "Error loading data",
        description: "Starting with a fresh session.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('thinkDaySanctuaryState', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state:', error);
      toast({
        title: "Error saving data",
        description: "Your progress may not be saved.",
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <ThinkDayContext.Provider value={{ state, dispatch }}>
      {children}
    </ThinkDayContext.Provider>
  );
};

// Custom hook to use the context
export const useThinkDay = () => {
  const context = useContext(ThinkDayContext);
  if (!context) {
    throw new Error('useThinkDay must be used within a ThinkDayProvider');
  }
  return context;
};