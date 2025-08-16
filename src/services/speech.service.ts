import { ISpeechRecognition } from '../interfaces/ISpeechRecognition';

export class SpeechService {
  
  public static async startSpeechRecognition(): Promise<ISpeechRecognition> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isListening: true,
          transcript: 'Mock speech recognition result',
          confidence: 0.95,
          error: null
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
}
