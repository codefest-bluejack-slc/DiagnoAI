import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mic, MicOff, Volume2, Check, Loader2 } from 'lucide-react';
import { ISpeechModalProps } from '../../interfaces/ISpeechRecognition';
import { useSpeech } from '../../hooks/use-speech';

export const SpeechModal: React.FC<ISpeechModalProps> = ({ 
  isOpen, 
  onClose, 
  onRecordingComplete 
}) => {
  const { 
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
  } = useSpeech('http://localhost:8002/transcribe');

  useEffect(() => {
    if (isOpen) {
      resetRecording();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApprove = () => {
    if (transcript) {
      onRecordingComplete(transcript, structuredData);
    }
    onClose();
  };

  const handleClose = () => {
    if (isRecording) {
      stopListening();
    }
    onClose();
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const getStatusContent = () => {
    if (isProcessing) {
      return {
        icon: <Loader2 className="text-purple-400 animate-spin" size={32} />,
        text: 'Processing audio...',
      };
    }
    if (isRecording) {
      return {
        icon: (
          <div className="relative">
            <MicOff className="text-red-400" size={32} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        ),
        text: 'Recording...',
      };
    }
    if (transcript) {
      return {
        icon: <Check className="text-green-400" size={32} />,
        text: 'Transcription complete',
      };
    }
    return {
      icon: <Mic className="text-purple-400" size={32} />,
      text: 'Ready to record',
    };
  };

  const { icon: statusIcon, text: statusText } = getStatusContent();

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] transition-all duration-200 opacity-100"
      onClick={handleOverlayClick}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-purple-950/80 to-indigo-950/80 backdrop-blur-md"></div>

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-pink-500/15 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-3/4 w-56 h-56 bg-indigo-500/20 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div
          className="w-full max-w-lg overflow-hidden bg-slate-900/95 backdrop-blur-lg rounded-lg border border-purple-500/30 shadow-2xl transform transition-all duration-300 scale-100 opacity-100 translate-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-slate-800/90 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2.5 rounded-lg bg-purple-400/40 text-purple-200">
                <Mic size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-purple-100">
                  Voice Transcription
                </h2>
                <p className="text-sm text-purple-300">
                  Record your voice to generate text
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full transition-all duration-300 hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-slate-800/80 border border-purple-500/30 text-purple-200"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center">
              <div 
                className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isRecording
                    ? 'bg-red-500/20 border-red-400 shadow-lg shadow-red-500/30 animate-pulse' 
                    : isProcessing
                    ? 'bg-purple-500/20 border-purple-400'
                    : transcript
                    ? 'bg-green-500/20 border-green-400'
                    : 'bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-500/30'
                }`}
              >
                {statusIcon}
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-purple-100">
                  {statusText}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-400/50 text-red-300">
                {error}
              </div>
            )}

            {transcript && !isProcessing && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-600/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-300">
                      Raw Transcription:
                    </span>
                  </div>
                  <blockquote className="text-purple-200 italic leading-relaxed">
                    "{transcript}"
                  </blockquote>
                </div>
                
                {structuredData && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-400/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-green-300">
                        Structured Analysis:
                      </span>
                    </div>
                    
                    {structuredData.description && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-green-400">Description:</span>
                        <div className="text-sm text-green-200 mt-1 p-2 bg-green-500/5 rounded border border-green-400/20">
                          {structuredData.description}
                        </div>
                      </div>
                    )}
                    
                    {structuredData.symptoms && structuredData.symptoms.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-green-400">Detected Symptoms:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {structuredData.symptoms.map((symptom: any, index: number) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs bg-green-500/20 border border-green-400/40 rounded-full text-green-300"
                            >
                              {symptom.name} ({symptom.severity})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {structuredData.since && (
                      <div className="text-xs text-green-400">
                        <span className="font-medium">Since:</span> {structuredData.since}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {audioUrl && !transcript && (
              <div className="p-4 rounded-lg bg-slate-800/60 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">
                    Playback Recording:
                  </span>
                </div>
                <audio 
                  controls 
                  src={audioUrl} 
                  className="w-full rounded-lg"
                  style={{
                    filter: 'sepia(1) hue-rotate(240deg) saturate(2)',
                    background: 'rgba(147, 51, 234, 0.1)'
                  }}
                />
              </div>
            )}

            <div className="flex gap-3">
              {isRecording ? (
                <button
                  onClick={stopListening}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <MicOff size={18} />
                  Stop Recording
                </button>
              ) : isProcessing ? (
                <button
                  disabled
                  className="flex-1 py-3 px-4 bg-slate-700 text-slate-400 font-semibold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </button>
              ) : (
                <>
                  <button
                    onClick={startListening}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <Mic size={18} />
                    {audioBlob ? 'New Recording' : 'Start Recording'}
                  </button>
                  {transcript && (
                     <button
                        onClick={handleApprove}
                        className="py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-400"
                     >
                        <Check size={16} />
                        Use Transcription
                     </button>
                  )}
                </>
              )}
            </div>
            
            <div className="text-center text-xs text-purple-400">
              Your voice will be sent to our servers for transcription.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};