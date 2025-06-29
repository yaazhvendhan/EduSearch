// Global type declarations for external APIs and widgets
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
    speechRecognition?: any;
    omnidimensionWidget?: {
      startVoiceRecognition: () => void;
      stopVoiceRecognition: () => void;
      onVoiceResult: (callback: (result: string) => void) => void;
    };
  }
}

export interface VoiceSearchEvent extends CustomEvent {
  detail: {
    query: string;
  };
}

export interface SearchFilters {
  source?: string;
  timeRange?: string;
  level?: string;
  sortBy?: string;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  isLoading: boolean;
  results: any[];
  totalResults: number;
  currentPage: number;
}

export {};
