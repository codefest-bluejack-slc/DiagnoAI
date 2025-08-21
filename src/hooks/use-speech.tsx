import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { DiagnosisService } from '../services/diagnosis.service';

export interface UseSpeechReturn {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
  transcript: string | null;
  audioUrl: string | null;
  audioBlob: Blob | null;
  structuredData: any | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetRecording: () => void;
}

export const useSpeech = (endpoint: string): UseSpeechReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [structuredData, setStructuredData] = useState<any | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const sendAudioToEndoint = useCallback(async (blob: Blob) => {
    setIsProcessing(true);
    setError(null);
    setTranscript(null);
    setStructuredData(null);

    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const result = response.data;
      console.log("hsilnya ", result);
      setTranscript(result.text);

      if (result.text) {
        try {
          const diagnosisResponse = await DiagnosisService.getUnstructuredDiagnosis({
            text: result.text
          });
          
          const parsedStructuredData = JSON.parse(diagnosisResponse.result);
          setStructuredData(parsedStructuredData);
        } catch (diagnosisError) {
          console.warn("Failed to get structured diagnosis:", diagnosisError);
          setStructuredData({
            description: result.text,
            symptoms: [],
            since: new Date().toISOString().split('T')[0]
          });
        }
      }
    } catch (err: any) {
      setError(`Failed to send audio: ${err.message || err}`);
    } finally {
      setIsProcessing(false);
    }
  }, [endpoint]);

  const initializeMediaRecorder = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const currentAudioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus'
        });

        const url = URL.createObjectURL(currentAudioBlob);
        setAudioBlob(currentAudioBlob);
        setAudioUrl(url);
        setIsRecording(false);

        await sendAudioToEndoint(currentAudioBlob);

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      return true;
    } catch (err) {
      setError(`Microphone access denied: ${err}`);
      return false;
    }
  }, [sendAudioToEndoint]);

  const startListening = useCallback(async () => {
    resetRecording();

    const mediaRecorderInitialized = await initializeMediaRecorder();
    if (!mediaRecorderInitialized) {
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      mediaRecorderRef.current.start(100);
      setIsRecording(true);
    }
  }, [initializeMediaRecorder]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const resetRecording = useCallback(() => {
    setAudioUrl((prevUrl) => {
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      return null;
    });
    setAudioBlob(null);
    setError(null);
    setTranscript(null);
    setStructuredData(null);
    setIsProcessing(false);
    setIsRecording(false);
    audioChunksRef.current = [];
  }, []);

  return {
    isRecording,
    isProcessing,
    error,
    transcript,
    audioUrl,
    audioBlob,
    structuredData,
    startListening,
    stopListening,
    resetRecording,
  };
};