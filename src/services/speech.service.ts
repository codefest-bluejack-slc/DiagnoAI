import { ISpeechRecognition } from '../interfaces/ISpeechRecognition';
import axios from 'axios';

export class SpeechService {
  public static async startSpeechRecognition(): Promise<ISpeechRecognition> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isListening: true,
          transcript: 'Mock speech recognition result',
          error: null,
        });
      }, 1000);
    });
  }

  public static stopSpeechRecognition(): void {
    console.log('TODO: Stop speech recognition');
  }

  public static isSupported(): boolean {
    return true;
  }

  public static async saveRecordingToProject(
    audioBlob: Blob,
    filename?: string,
  ): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const recordingFilename = filename || `voice-recording-${timestamp}.webm`;

    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const binaryString = Array.from(uint8Array)
        .map((byte) => String.fromCharCode(byte))
        .join('');
      const base64String = btoa(binaryString);

      const recordings = JSON.parse(
        localStorage.getItem('projectVoiceRecordings') || '{}',
      );
      recordings[recordingFilename] = {
        data: base64String,
        timestamp: new Date().toISOString(),
        size: audioBlob.size,
        mimeType: audioBlob.type || 'audio/webm;codecs=opus',
        duration: Math.round(audioBlob.size / 16000),
      };
      localStorage.setItem(
        'projectVoiceRecordings',
        JSON.stringify(recordings),
      );

      return recordingFilename;
    } catch (err) {
      throw new Error(`Failed to save recording to project: ${err}`);
    }
  }

  public static async loadRecordingFromProject(
    filename: string,
  ): Promise<Blob | null> {
    try {
      const recordings = JSON.parse(
        localStorage.getItem('projectVoiceRecordings') || '{}',
      );
      const recording = recordings[filename];

      if (!recording) return null;

      const binaryString = atob(recording.data);
      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      return new Blob([uint8Array], { type: recording.mimeType });
    } catch (err) {
      console.error('Failed to load recording from project:', err);
      return null;
    }
  }

  public static async getAllProjectRecordings(): Promise<{
    [key: string]: any;
  }> {
    try {
      return JSON.parse(localStorage.getItem('projectVoiceRecordings') || '{}');
    } catch (err) {
      console.error('Failed to retrieve project recordings:', err);
      return {};
    }
  }

  public static async deleteProjectRecording(filename: string): Promise<void> {
    try {
      const recordings = JSON.parse(
        localStorage.getItem('projectVoiceRecordings') || '{}',
      );
      delete recordings[filename];
      localStorage.setItem(
        'projectVoiceRecordings',
        JSON.stringify(recordings),
      );
    } catch (err) {
      throw new Error(`Failed to delete project recording: ${err}`);
    }
  }

  public static async uploadRecording(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');

    try {
      const response = await axios.post(
        'http://localhost:8002/transcribe',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data.text;
    } catch (error) {
      throw new Error(`Failed to upload recording: ${error}`);
    }
  }
}
