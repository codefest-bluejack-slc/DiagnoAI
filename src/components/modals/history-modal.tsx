import React from 'react';
import { createPortal } from 'react-dom';
import { X, History, RefreshCw, Calendar, FileText, ChevronRight, User, Stethoscope, Pill } from 'lucide-react';
import { IHistoryModalProps } from '../../interfaces/IHistoryModal';
import Tooltip from '../common/tooltip';

export const HistoryModal: React.FC<IHistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  historyData,
  onClearHistory,
  isLoading = false
}) => {

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Unknown date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear all history?')) {
      try {
        await onClearHistory();
      } catch (error) {
        console.error('Error clearing history:', error);
      }
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
            {isLoading ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-purple-500/20 border border-purple-500/30">
                  <RefreshCw className="text-purple-400 animate-spin" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-200">
                  Loading History...
                </h3>
                <p className="text-sm max-w-md mx-auto text-purple-300/80">
                  Fetching your health assessments from the backend.
                </p>
              </div>
            ) : historyData.length === 0 ? (
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
                        <h3 className="font-semibold text-sm mb-2 transition-colors group-hover:text-purple-300 text-purple-100">
                          {item.diagnosis || `Assessment ${item.id.slice(0, 8)}...`}
                        </h3>
                        <div className="flex items-center gap-4 text-sm mb-3">
                          <div className="flex items-center gap-1 text-purple-300">
                            <User className="w-4 h-4" />
                            <span>{item.username}</span>
                          </div>
                          <div className="flex items-center gap-1 text-purple-300">
                            <Calendar className="w-4 h-4" />
                            <span>ID: {item.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-full text-xs font-medium transition-transform duration-200 group-hover:scale-105 bg-green-500/20 text-green-400 border border-green-400/50">
                        completed
                      </div>
                    </div>

                    {item.diagnosis && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-medium text-purple-300">
                            AI Diagnosis Result:
                          </span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-3">
                          <p className="text-sm text-emerald-200 leading-relaxed">
                            {item.diagnosis.length > 200 
                              ? `${item.diagnosis.slice(0, 200)}...` 
                              : item.diagnosis}
                          </p>
                        </div>
                      </div>
                    )}

                    {!item.diagnosis && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-purple-300">
                            Diagnosis Status:
                          </span>
                        </div>
                        <div className="bg-gray-500/10 border border-gray-400/30 rounded-lg p-3">
                          <p className="text-sm text-gray-300">
                            No diagnosis available for this assessment
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-medium text-purple-300">
                          Symptoms ({item.symptoms.length}):
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.symptoms.slice(0, 4).map((symptom, idx) => (
                          <Tooltip
                            key={symptom.id}
                            content={`Symptom: ${symptom.name} - Severity: ${symptom.severity}`}
                            position="top"
                          >
                            <span
                              className={`px-3 py-1 text-xs rounded-full cursor-help transition-all duration-200 hover:scale-105 ${
                                symptom.severity === 'mild' 
                                  ? 'bg-green-500/20 text-green-300 border border-green-400/50'
                                  : symptom.severity === 'moderate'
                                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50'
                                    : 'bg-red-500/20 text-red-300 border border-red-400/50'
                              }`}
                            >
                              {symptom.name}
                            </span>
                          </Tooltip>
                        ))}
                        {item.symptoms.length > 4 && (
                          <Tooltip
                            content={`Additional symptoms: ${item.symptoms.slice(4).map(s => s.name).join(', ')}`}
                            position="top"
                          >
                            <span className="px-3 py-1 text-xs rounded-full cursor-help transition-all duration-200 hover:scale-105 bg-slate-700/70 text-purple-200 border border-slate-600/50">
                              +{item.symptoms.length - 4} more
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    {item.medicines.length > 0 ? (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Pill className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm font-medium text-purple-300">
                            Recommended Medicines ({item.medicines.length}):
                          </span>
                        </div>
                        <div className="space-y-2">
                          {item.medicines.slice(0, 3).map((medicine, idx) => (
                            <div key={idx} className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-cyan-200 mb-1">{medicine.brand_name}</h4>
                                  <p className="text-xs text-cyan-300/80 mb-1">Generic: {medicine.generic_name}</p>
                                  <p className="text-xs text-cyan-300/60">Manufacturer: {medicine.manufacturer}</p>
                                </div>
                                {medicine.product_ndc && (
                                  <span className="text-xs bg-cyan-600/20 text-cyan-300 px-2 py-1 rounded">
                                    NDC: {medicine.product_ndc}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          {item.medicines.length > 3 && (
                            <div className="text-center">
                              <span className="text-xs text-purple-300 bg-slate-700/50 px-3 py-1 rounded-full">
                                +{item.medicines.length - 3} more medicines available
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-purple-300">
                            Medicine Recommendations:
                          </span>
                        </div>
                        <div className="bg-gray-500/10 border border-gray-400/30 rounded-lg p-3">
                          <p className="text-sm text-gray-300">
                            No medicine recommendations available for this assessment
                          </p>
                        </div>
                      </div>
                    )}

                    {item.medicine_response ? (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-orange-400" />
                          <span className="text-sm font-medium text-purple-300">
                            AI Medicine Analysis:
                          </span>
                        </div>
                        <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-3">
                          <p className="text-sm text-orange-200 leading-relaxed">
                            {item.medicine_response.length > 300 
                              ? `${item.medicine_response.slice(0, 300)}...` 
                              : item.medicine_response}
                          </p>
                          {item.medicine_response.length > 300 && (
                            <button className="text-xs text-orange-300 hover:text-orange-200 mt-2 underline">
                              Show full response
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-purple-300">
                            Medicine Analysis:
                          </span>
                        </div>
                        <div className="bg-gray-500/10 border border-gray-400/30 rounded-lg p-3">
                          <p className="text-sm text-gray-300">
                            No AI medicine analysis available for this assessment
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          <span className="text-xs text-purple-300">{item.symptoms.length} symptoms</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                          <span className="text-xs text-purple-300">{item.medicines.length} medicines</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span className="text-xs text-purple-300">{item.diagnosis ? 'diagnosed' : 'pending'}</span>
                        </div>
                      </div>
                      <Tooltip
                        content="Click to view full assessment details"
                        position="top"
                      >
                        <ChevronRight 
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 text-indigo-400" 
                        />
                      </Tooltip>
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
