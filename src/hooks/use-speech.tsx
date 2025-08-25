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

  const USE_TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true';

  // if (USE_TEST_MODE) {
  //   console.log('Speech hook initialized in TEST MODE');
  // }

  const TEST_SPEECH_DATA = {
    description: 'Symptoms experienced after eating a large amount of seafood.',
    symptoms: [
      {
        name: 'Headache',
        severity: 'Mild',
      },
      {
        name: 'Fever',
        severity: 'High',
      },
      {
        name: 'Diarrhea',
        severity: 'High',
      },
    ],
    since: '2024-08-10',
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const sendAudioToEndoint = useCallback(
    async (blob: Blob) => {
      setIsProcessing(true);
      setError(null);
      setTranscript(null);
      setStructuredData(null);

      if (USE_TEST_MODE) {
        setTimeout(() => {
          setTranscript(TEST_SPEECH_DATA.description);
          setStructuredData(TEST_SPEECH_DATA);
          // console.log("Using test data for speech processing", TEST_SPEECH_DATA);
          setIsProcessing(false);
        }, 2000);
        return;
      }

      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');

      try {
        const response = await axios.post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const result = response.data;
        // const result = {"text": "I have been sick for around 3 days after eating a lot of seafood, the symptoms include a mild headache, high fever, and high diarrhea. The symptoms started on august 10"}
        // console.log("hasil transcribe", result);
        setTranscript(result.text);

        if (result.text) {
          try {
            const diagnosisResponse =
              await DiagnosisService.getUnstructuredDiagnosis({
                text: result.text,
              });

            console.log('diagnosisResponse', diagnosisResponse);

            const structuredData = {
              description: diagnosisResponse.description,
              symptoms: diagnosisResponse.symptoms || [],
              since:
                diagnosisResponse.since ||
                new Date().toISOString().split('T')[0],
            };

            setStructuredData(structuredData);
            console.log('structured data from diagnosis', structuredData);
          } catch (diagnosisError) {
            console.warn('Failed to get structured diagnosis:', diagnosisError);
          }
        }
      } catch (err: any) {
        setError(`Failed to send audio: ${err.message || err}`);
      } finally {
        setIsProcessing(false);
      }
    },
    [endpoint, USE_TEST_MODE],
  );

  const initializeMediaRecorder = useCallback(async () => {
    if (USE_TEST_MODE) {
      return true;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const currentAudioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus',
        });

        const url = URL.createObjectURL(currentAudioBlob);
        setAudioBlob(currentAudioBlob);
        setAudioUrl(url);
        setIsRecording(false);

        await sendAudioToEndoint(currentAudioBlob);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      return true;
    } catch (err) {
      setError(`Microphone access denied: ${err}`);
      return false;
    }
  }, [sendAudioToEndoint, USE_TEST_MODE]);

  const startListening = useCallback(async () => {
    resetRecording();

    if (USE_TEST_MODE) {
      setIsRecording(true);
      return;
    }

    const mediaRecorderInitialized = await initializeMediaRecorder();
    if (!mediaRecorderInitialized) {
      return;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'inactive'
    ) {
      mediaRecorderRef.current.start(100);
      setIsRecording(true);
    }
  }, [initializeMediaRecorder, USE_TEST_MODE]);

  const stopListening = useCallback(() => {
    if (USE_TEST_MODE) {
      setIsRecording(false);
      const dummyBlob = new Blob(['test'], { type: 'audio/webm' });
      setTimeout(() => {
        sendAudioToEndoint(dummyBlob);
      }, 500);
      return;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
  }, [sendAudioToEndoint, USE_TEST_MODE]);

  const resetRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setError(null);
    setTranscript(null);
    setStructuredData(null);
    setIsProcessing(false);
    setIsRecording(false);
    audioChunksRef.current = [];
  }, [audioUrl]);

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
