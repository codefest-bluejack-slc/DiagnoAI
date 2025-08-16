import React from 'react';
import { createPortal } from 'react-dom';
import { X, History, RefreshCw, Calendar, FileText, ChevronRight } from 'lucide-react';
import { IHistoryModalProps } from '../../interfaces/IHistoryModal';
import Tooltip from '../common/tooltip';

export const HistoryModal: React.FC<IHistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  historyData,
  onClearHistory 
}) => {

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      onClearHistory();
      window.location.reload();
    }
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
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
          className="w-full max-w-4xl max-h-[80vh] overflow-hidden bg-slate-900/95 backdrop-blur-lg rounded-lg border border-purple-500/30 shadow-2xl transform transition-all duration-300 scale-100 opacity-100 translate-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-slate-800/90 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2.5 rounded-lg bg-purple-400/40 text-purple-200">
                <History size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-purple-100">
                  Assessment History
                </h2>
                <p className="text-sm text-purple-300">
                  {historyData.length} previous assessments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {historyData.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-500/20 border border-red-400/50 text-red-300"
                  title="Clear History"
                >
                  <RefreshCw size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-all duration-300 hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-slate-800/80 border border-purple-500/30 text-purple-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="max-h-[calc(80vh-120px)] overflow-y-auto p-6 bg-slate-900/95">
            {historyData.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-purple-500/20 border border-purple-500/30">
                  <History className="text-purple-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-200">
                  No History Found
                </h3>
                <p className="text-sm max-w-md mx-auto text-purple-300/80">
                  Your previous health assessments will appear here once you complete some diagnostic sessions.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {historyData.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl transition-all duration-300 group cursor-pointer hover:scale-[1.02] bg-slate-800/60 border border-purple-500/30 hover:bg-slate-800/80 hover:border-purple-400/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 transition-colors group-hover:text-purple-300 text-purple-100">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm mb-3 text-purple-300">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                      </div>
                      <div 
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-transform duration-200 group-hover:scale-105 ${
                          item.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400 border border-green-400/50' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50'
                        }`}
                      >
                        {item.status}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-medium text-purple-300">
                          Symptoms:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.symptoms.slice(0, 3).map((symptom, idx) => (
                          <Tooltip
                            key={idx}
                            content={`Symptom: ${symptom} - Reported during assessment on ${formatDate(item.date)}`}
                            position="top"
                          >
                            <span
                              className="px-3 py-1 text-xs rounded-full cursor-help transition-all duration-200 hover:scale-105 bg-purple-500/20 text-purple-300 border border-purple-400/50"
                            >
                              {symptom}
                            </span>
                          </Tooltip>
                        ))}
                        {item.symptoms.length > 3 && (
                          <Tooltip
                            content={`Additional symptoms: ${item.symptoms.slice(3).join(', ')}`}
                            position="top"
                          >
                            <span className="px-3 py-1 text-xs rounded-full cursor-help transition-all duration-200 hover:scale-105 bg-slate-700/70 text-purple-200 border border-slate-600/50">
                              +{item.symptoms.length - 3} more
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <span 
                          className={`w-3 h-3 rounded-full ${
                            item.severity === 'mild' ? 'bg-green-400' :
                            item.severity === 'moderate' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                        ></span>
                        <Tooltip
                          content={`Diagnosis: ${item.diagnosis} - Severity: ${item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}`}
                          position="top"
                        >
                          <span className="text-sm font-medium cursor-help text-purple-200">
                            {item.diagnosis}
                          </span>
                        </Tooltip>
                      </div>
                      <ChevronRight 
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 text-indigo-400" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
