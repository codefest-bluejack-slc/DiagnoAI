import { useState } from 'react';
import { UseSpeechReturn } from '../interfaces/ISpeechRecognition';

export const useSpeech = (): UseSpeechReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const startListening = () => {
    setIsListening(true);
    setError(null);
    setTranscript('Listening...');
    
    setTimeout(() => {
      setTranscript('This is a mock transcript. TODO: Implement actual speech recognition.');
      setConfidence(0.95);
      setIsListening(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const resetTranscript = () => {
    setTranscript('');
    setConfidence(0);
    setError(null);
    setIsListening(false);
  };

  // TODO: Real implementation untuk Speech Recog

  return {
    isListening,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
};
