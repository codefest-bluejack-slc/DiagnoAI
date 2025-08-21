export interface ISpeechRecognition {
  isRecording?: boolean;
  error: string | null;
  audioUrl?: string;
  audioBlob?: Blob;
  isListening?: boolean;
  transcript?: string;
}

export interface ISpeechModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordingComplete: (transcript: string) => void;
}

export interface UseSpeechReturn {
  isRecording: boolean;
  isProcessing: boolean;
  error?: string;
  transcript?: string;
  audioUrl?: string;
  audioBlob?: Blob;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetRecording: () => void;
}