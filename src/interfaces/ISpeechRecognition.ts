export interface ISpeechRecognition {
  isListening: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
}

export interface ISpeechModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (transcript: string) => void;
}

export interface UseSpeechReturn {
  isListening: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// TODO: interface nya yang real 