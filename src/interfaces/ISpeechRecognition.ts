export interface ISpeechRecognition {
  isRecording?: boolean;
  error: string | null;
  audioUrl?: string;
  audioBlob?: Blob;
  isListening?: boolean;
  transcript?: string;
  confidence?: number;
}

export interface ISpeechModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordingComplete: (audioBlob: Blob) => void;
}

export interface UseSpeechReturn {
  isRecording: boolean;
  error: string | null;
  audioUrl: string | null;
  audioBlob: Blob | null;
  isSaved: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetRecording: () => void;
  clearCurrentRecording: () => void;
  deleteRecording: (filename: string) => Promise<void>;
  getStoredRecordings: () => Promise<string[]>;
  getCurrentRecordingFilename: () => string | null;
  loadRecordingFromProject: (filename: string) => Promise<Blob | null>;
}

// TODO: interface nya yang real 