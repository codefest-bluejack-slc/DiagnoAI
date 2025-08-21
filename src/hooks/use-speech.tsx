import { useState, useRef, useCallback } from 'react';
import { UseSpeechReturn } from '../interfaces/ISpeechRecognition';

export const useSpeech = (): UseSpeechReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingFileNameRef = useRef<string | null>(null);

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
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        
        try {
          const url = URL.createObjectURL(audioBlob);
          setAudioBlob(audioBlob);
          setAudioUrl(url);
          setIsRecording(false);

          const filename = await saveRecordingToProject(audioBlob);
          recordingFileNameRef.current = filename;
          setIsSaved(true);
        } catch (err) {
          console.error('Failed to save recording:', err);
          setError(`Failed to save recording: ${err}`);
          setAudioBlob(audioBlob);
          setAudioUrl(URL.createObjectURL(audioBlob));
          setIsRecording(false);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      return true;
    } catch (err) {
      setError(`Microphone access denied: ${err}`);
      return false;
    }
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setIsSaved(false);
    audioChunksRef.current = [];
    recordingFileNameRef.current = null;

    const mediaRecorderInitialized = await initializeMediaRecorder();
    if (!mediaRecorderInitialized) {
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      mediaRecorderRef.current.start(100);
      setIsRecording(true);
    }
  }, [initializeMediaRecorder]);

  const saveRecordingToProject = useCallback(async (blob: Blob): Promise<string> => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `recording-${timestamp}.webm`;
    
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
      const base64String = btoa(binaryString);
      
      const recordings = JSON.parse(localStorage.getItem('voiceRecordings') || '{}');
      recordings[filename] = {
        data: base64String,
        timestamp: new Date().toISOString(),
        size: blob.size,
        mimeType: blob.type || 'audio/webm;codecs=opus'
      };
      localStorage.setItem('voiceRecordings', JSON.stringify(recordings));
      
      return filename;
    } catch (err) {
      throw new Error(`Failed to save recording: ${err}`);
    }
  }, []);

  const loadRecordingFromProject = useCallback(async (filename: string): Promise<Blob | null> => {
    try {
      const recordings = JSON.parse(localStorage.getItem('voiceRecordings') || '{}');
      const recording = recordings[filename];
      
      if (!recording) return null;
      
      const binaryString = atob(recording.data);
      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
      
      return new Blob([uint8Array], { type: recording.mimeType });
    } catch (err) {
      console.error('Failed to load recording:', err);
      return null;
    }
  }, []);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const resetRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setIsSaved(false);
    setError(null);
    audioChunksRef.current = [];
    recordingFileNameRef.current = null;
  }, [audioUrl]);

  const clearCurrentRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setIsSaved(false);
    setError(null);
    audioChunksRef.current = [];
    recordingFileNameRef.current = null;
  }, [audioUrl]);  const deleteRecording = useCallback(async (filename: string): Promise<void> => {
    try {
      const recordings = JSON.parse(localStorage.getItem('voiceRecordings') || '{}');
      delete recordings[filename];
      localStorage.setItem('voiceRecordings', JSON.stringify(recordings));
      
      if (recordingFileNameRef.current === filename) {
        clearCurrentRecording();
      }
    } catch (err) {
      throw new Error(`Failed to delete recording: ${err}`);
    }
  }, [clearCurrentRecording]);

  const getStoredRecordings = useCallback(async (): Promise<string[]> => {
    try {
      const recordings = JSON.parse(localStorage.getItem('voiceRecordings') || '{}');
      return Object.keys(recordings);
    } catch (err) {
      throw new Error(`Failed to retrieve recordings: ${err}`);
    }
  }, []);

  const getCurrentRecordingFilename = useCallback(() => {
    return recordingFileNameRef.current;
  }, []);

  return {
    isRecording,
    error,
    audioUrl,
    audioBlob,
    isSaved,
    startListening,
    stopListening,
    resetRecording,
    clearCurrentRecording,
    deleteRecording,
    getStoredRecordings,
    getCurrentRecordingFilename,
    loadRecordingFromProject
  };
};
