import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mic, MicOff, Volume2, Check, RotateCcw } from 'lucide-react';
import { ISpeechModalProps } from '../../interfaces/ISpeechRecognition';
import { useSpeech } from '../../hooks/use-speech';

export const SpeechModal: React.FC<ISpeechModalProps> = ({ 
  isOpen, 
  onClose, 
  onTranscriptComplete 
}) => {
  const { 
    isListening, 
    transcript, 
    confidence, 
    error, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeech();

  useEffect(() => {
    if (isOpen) {
      startListening();
    }
  }, [isOpen, startListening]);

  if (!isOpen) return null;
  // TODO: Implementation untuk init SpeechRecognition

  const handleApprove = () => {
    onTranscriptComplete(transcript);
    resetTranscript();
    onClose();
  };

  const handleClose = () => {
    resetTranscript();
    onClose();
  };

  const handleRetry = () => {
    resetTranscript();
    startListening();
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

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
                  Voice Input
                </h2>
                <p className="text-sm text-purple-300">
                  Describe your symptoms by voice
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
                  isListening 
                    ? 'bg-red-500/20 border-red-400 shadow-lg shadow-red-500/30 animate-pulse' 
                    : 'bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-500/30'
                }`}
              >
                {isListening ? (
                  <MicOff className="text-red-400" size={32} />
                ) : (
                  <Mic className="text-purple-400" size={32} />
                )}
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-purple-100">
                  {isListening ? 'Listening...' : 'Ready to listen'}
                </p>
                {confidence > 0 && (
                  <div className="flex items-center justify-center gap-2">
                    <Volume2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">
                      {Math.round(confidence * 100)}% confidence
                    </span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-400/50 text-red-300">
                {error}
              </div>
            )}

            {transcript && transcript !== 'Listening...' && (
              <div className="p-4 rounded-lg bg-slate-800/60 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">
                    Transcript:
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-purple-100">
                  {transcript}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {isListening ? (
                <button
                  onClick={stopListening}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <MicOff size={18} />
                  Stop Recording
                </button>
              ) : (
                transcript && transcript !== 'Listening...' && (
                  <button
                    onClick={handleRetry}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <RotateCcw size={18} />
                    Retry
                  </button>
                )
              )}

              {transcript && transcript !== 'Listening...' && (
                <>
                  <button
                    onClick={resetTranscript}
                    className="py-3 px-4 bg-slate-800/70 hover:bg-slate-800 text-purple-200 font-medium rounded-lg transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400/50 border border-purple-500/30"
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={handleApprove}
                    className="py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <Check size={16} />
                    Use This
                  </button>
                </>
              )}
            </div>

            <div className="text-center text-xs text-purple-400">
              Web Speech API integration pending
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
