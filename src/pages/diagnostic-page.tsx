import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Activity,
  Brain,
  Edit3,
  Clock,
  Search,
  Lightbulb,
  Target,
  Stethoscope,
  TrendingUp,
  AlertCircle,
  Heart,
  Shield,
  Zap,
  Timer,
  Trash2,
  Edit,
  Play,
  RefreshCw,
  History,
  Mic,
  CheckCircle,
  Pill,
  ShoppingCart,
} from 'lucide-react';
import Navbar from '../components/common/navbar';
import Tooltip from '../components/common/tooltip';
import { SpeechModal } from '../components/modals/speech-modal';
import { HistoryModal } from '../components/modals/history-modal';
import { TypingText } from '../components/diagnostics/typing-text';
import { RecommendedProducts } from '../components/diagnostics/recommended-products';
import { IDiagnosticPageProps } from '../interfaces/IDiagnostic';
import { ISymptom, IHealthAssessment } from '../interfaces/IDiagnostic';
import { useDiagnostic } from '../hooks/use-diagnostic';
import { useToast } from '../hooks/use-toast';
import { useMouseTracking } from '../hooks/use-mouse-tracking';
import {
  getSeverityColor,
  getStepIcon,
  getSeverityIcon,
} from '../utils/diagnostic-utils';
import '../styles/diagnostic-page.css';

export default function DiagnosticPage({}: IDiagnosticPageProps) {
  const mousePosition = useMouseTracking();
  const { addToast } = useToast();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      size: 0.2 + Math.random() * 0.3,
    })),
  );

  const {
    history,
    newSymptomName,
    setNewSymptomName,
    newSymptomSeverity,
    setNewSymptomSeverity,
    newDescription,
    setNewDescription,
    newSince,
    setNewSince,
    symptoms,
    setSymptoms,
    showAddForm,
    setShowAddForm,
    currentStep,
    setCurrentStep,
    startDiagnostic,
    addToSymptomList,
    removeFromSymptomList,
    clearSymptomList,
    getProgressPercentage,
    addToHistory,
    clearHistory,
    isLoading,
    refreshData,
    connectionStatus,
  } = useDiagnostic();

  const [isExiting, setIsExiting] = useState(false);
  const [exitingElement, setExitingElement] = useState<'card' | 'form' | null>(null);
  const [illnessResponse, setIllnessResponse] = useState<string>('');
  const [drugsResponse, setDrugsResponse] = useState<string>('');
  const [showProducts, setShowProducts] = useState(false);

  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  const handleHideAddForm = () => {
    setShowAddForm(false);
  };


  const handleEditSymptom = (index: number) => {
    const symptom = symptoms[index];
    if (symptom) {
      setNewSymptomName(symptom.name);
      setNewSymptomSeverity(symptom.severity);
      setEditingSymptom(index.toString());
      setShowAddForm(true);
    }
  };

  const handleSaveEdit = () => {
    console.log('Start Analysis clicked:', {
      editingSymptom,
      newDescription: newDescription.trim(),
      newSince,
      symptomsCount: symptoms.length,
      newSymptomName: newSymptomName.trim()
    });
    
    if (editingSymptom !== null) {
      if (newSymptomName.trim()) {
        const index = parseInt(editingSymptom);
        removeFromSymptomList(index);
        addToSymptomList(newSymptomName.trim());
        setNewSymptomSeverity('mild');
        setEditingSymptom(null);
        setShowAddForm(false);
      }
    } else {
      if (!newDescription.trim()) {
        addToast('Please provide a description of your health concerns', { type: 'warning', title: 'Missing Description' });
        return;
      }
      
      if (!newSince) {
        addToast('Please select when your symptoms started', { type: 'warning', title: 'Missing Date' });
        return;
      }
      
      if (symptoms.length === 0) {
        addToast('Please add at least one symptom to proceed', { type: 'warning', title: 'Missing Symptoms' });
        return;
      }
      
      if (newDescription.trim() && newSince && symptoms.length > 0) {
        console.log('Starting diagnostic analysis...');
        setIllnessResponse('');
        setDrugsResponse('');
        setShowProducts(false);
        setCurrentStep('finding-illness');
        startDiagnostic(
          (illnessResp) => {
            console.log('Illness response received:', illnessResp);
            setIllnessResponse(illnessResp);
          },
          (drugsResp) => {
            console.log('Drugs response received:', drugsResp);
            setDrugsResponse(drugsResp);
          },
          () => {
            console.log('Products ready');
            setShowProducts(true);
          }
        );
      } else if (newSymptomName.trim()) {
        addToSymptomList(newSymptomName.trim());
        setNewSymptomSeverity('mild');
        setShowAddForm(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setNewSymptomName('');
    setNewSymptomSeverity('mild');
    setNewDescription('');
    setNewSince('');
    setSymptoms([]);
    setEditingSymptom(null);
    setShowAddForm(false);
  };

  const toggleSpeechModal = () => {
    setIsSpeechModalOpen(!isSpeechModalOpen);
  };

  const handleSpeechTranscript = (transcript: string) => {
    setNewDescription(transcript);
    setIsSpeechModalOpen(false);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear the current form?')) {
      setNewDescription('');
      setNewSince('');
      setSymptoms([]);
      setShowAddForm(false);
    }
  };

  const toggleHistoryModal = () => {
    setIsHistoryModalOpen(!isHistoryModalOpen);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="diagnostic-container">
      <div className="background-orbs">
        <div className="background-orb-1"></div>
        <div className="background-orb-2"></div>
        <div className="background-orb-3"></div>
      </div>

      <div
        className="mouse-glow"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--primary-purple-200) 0%, transparent 50%)`,
        }}
      ></div>

      <div className="floating-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              width: `${particle.size}rem`,
              height: `${particle.size}rem`,
            }}
          />
        ))}
      </div>

      <Navbar />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={toggleHistoryModal}
        historyData={history}
        onClearHistory={clearHistory}
        isLoading={isLoading}
      />

      <button
        onClick={toggleHistoryModal}
        className="fixed top-20 right-6 p-3 rounded-full transition-all duration-300 z-30 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 group bg-slate-800/80 backdrop-blur-sm border border-purple-500/30 hover:bg-slate-800 hover:border-purple-400/50"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)';
          e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
          e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.3)';
        }}
      >
        {isLoading ? (
          <RefreshCw 
            className="animate-spin transition-transform duration-300 text-purple-300" 
            size={20} 
          />
        ) : (
          <History 
            className="group-hover:rotate-12 transition-transform duration-300 text-purple-300" 
            size={20} 
          />
        )}
      </button>

      <main className="main-content pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-6 pl-20 lg:pl-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Brain className="text-purple-300" size={24} />
              </div>
              <h1 className="text-4xl font-bold text-white">
                AI Diagnostic Assistant
              </h1>
            </div>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Share your symptoms and receive comprehensive AI-powered health insights
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                <div className="step-card">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Activity className="text-purple-300" size={20} />
                    Analysis Steps
                  </h3>
                  <div className="space-y-3">
                    {['input', 'finding-illness', 'finding-drugs', 'finding-products'].map((step, index) => (
                      <div
                        key={step}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                          currentStep === step
                            ? 'step-item-active'
                            : 'step-item-inactive'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full ${
                            currentStep === step
                              ? 'bg-purple-500/30'
                              : 'bg-white/10'
                          }`}
                        >
                          {getStepIcon(step)}
                        </div>
                        <div>
                          <p
                            className={`font-medium text-sm ${
                              currentStep === step
                                ? 'text-white'
                                : 'text-purple-200'
                            }`}
                          >
                            {step === 'input'
                              ? 'Share Your Health Concerns'
                              : step === 'finding-illness'
                                ? 'AI is Analyzing Your Symptoms'
                                : step === 'finding-drugs'
                                  ? 'AI is Finding Your Medications'
                                  : 'Searching Available Products'}
                          </p>
                          <p className="text-purple-300 text-xs">
                            {step === 'input'
                              ? 'Tell us about your symptoms'
                              : step === 'finding-illness'
                                ? 'Identifying potential conditions'
                                : step === 'finding-drugs'
                                  ? 'Recommending treatments'
                                  : 'Finding marketplace options'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6">
              <div className="space-y-6">
                {!showAddForm && (
                  <div
                    className="add-symptom-card group transition-all duration-500 ease-in-out transform hover:scale-105"
                    onClick={handleShowAddForm}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative text-center transform transition-all duration-500 group-hover:scale-105">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 animate-pulse">
                        <Plus
                          className="text-purple-300 group-hover:rotate-90 transition-transform duration-500"
                          size={24}
                        />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-200 transition-colors duration-300">
                        Start Health Analysis
                      </h3>
                      <p className="text-purple-200 mb-6 transform transition-all duration-300 group-hover:scale-105">
                        Describe your health concerns and symptoms
                      </p>
                      <div className="inline-flex items-center gap-2 text-purple-300 text-sm">
                        <span>Begin your diagnostic process</span>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}

                {showAddForm && (
                  <div className="symptom-form-card transition-all duration-500 ease-in-out transform animate-in fade-in slide-in-from-top-3">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-full animate-in zoom-in duration-500 delay-200">
                          <Plus className="text-purple-300 animate-in rotate-in duration-300 delay-300" size={20} />
                        </div>
                        <span className="animate-in slide-in-from-left-3 duration-500 delay-400">
                          {editingSymptom ? 'Edit Symptom' : 'Start Health Analysis'}
                        </span>
                      </h3>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transform hover:scale-110"
                      >
                        <X className="text-purple-300" size={20} />
                      </button>
                    </div>

                    <div className="space-y-6 animate-in slide-in-from-bottom-3 duration-600 delay-500">
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-3">
                          Symptoms
                        </label>
                        <div className="space-y-4">
                          {symptoms.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 bg-purple-500/10 border border-purple-400/30 rounded-xl">
                              {symptoms.map((symptom, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-400/50 rounded-full text-sm text-purple-200 group hover:bg-purple-500/30 transition-all duration-200"
                                >
                                  <span>{symptom.name}</span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    symptom.severity === 'mild' ? 'bg-green-400/30 text-green-300' :
                                    symptom.severity === 'moderate' ? 'bg-amber-400/30 text-amber-300' :
                                    'bg-red-400/30 text-red-300'
                                  }`}>
                                    {symptom.severity}
                                  </span>
                                  <button
                                    onClick={() => removeFromSymptomList(index)}
                                    className="p-0.5 rounded-full hover:bg-red-500/40 text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110"
                                    title="Remove symptom"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={clearSymptomList}
                                className="px-2 py-1 text-xs text-purple-300 hover:text-purple-200 underline transition-colors duration-200"
                                title="Clear all symptoms"
                              >
                                Clear all
                              </button>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newSymptomName}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 50) {
                                  setNewSymptomName(value);
                                } else {
                                  addToast('Symptom name cannot exceed 50 characters', { type: 'warning', title: 'Character Limit' });
                                }
                              }}
                              placeholder="Add symptom (e.g., headache, nausea, fever)"
                              maxLength={50}
                              className="flex-1 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-300 focus:scale-[1.01]"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && newSymptomName.trim()) {
                                  addToSymptomList(newSymptomName.trim());
                                }
                              }}
                            />
                            <select
                              value={newSymptomSeverity}
                              onChange={(e) => setNewSymptomSeverity(e.target.value as 'mild' | 'moderate' | 'severe')}
                              className="p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer"
                            >
                              <option value="mild" className="bg-gray-800 text-white">Mild</option>
                              <option value="moderate" className="bg-gray-800 text-white">Moderate</option>
                              <option value="severe" className="bg-gray-800 text-white">Severe</option>
                            </select>
                            <button
                              onClick={() => {
                                if (newSymptomName.trim()) {
                                  addToSymptomList(newSymptomName.trim());
                                }
                              }}
                              disabled={!newSymptomName.trim()}
                              className="p-4 bg-purple-500/20 hover:bg-purple-500/30 disabled:bg-gray-500/20 text-purple-200 disabled:text-gray-400 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                              title="Add symptom"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-purple-300 text-xs">
                              Add symptoms with their severity levels. Press Enter or click + to add.
                            </p>
                            <p className="text-purple-300 text-xs">
                              {symptoms.length}/20 symptoms
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-purple-200 text-sm font-medium">
                            Description
                          </label>
                          <button
                            onClick={toggleSpeechModal}
                            className="p-2 rounded-full bg-white/10 hover:bg-purple-500/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 group"
                            title="Use voice input"
                          >
                            <Mic 
                              className="text-purple-300 group-hover:text-purple-200 transition-colors duration-300" 
                              size={16} 
                            />
                          </button>
                        </div>
                        <textarea
                          value={newDescription}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 500) {
                              setNewDescription(value);
                            } else {
                              addToast('Description cannot exceed 500 characters', { type: 'warning', title: 'Character Limit' });
                            }
                          }}
                          placeholder="Describe your health concerns in detail..."
                          maxLength={500}
                          className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm resize-none text-lg leading-relaxed transition-all duration-300 focus:scale-[1.01]"
                          rows={6}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              handleSaveEdit();
                            }
                          }}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-purple-300 text-xs">
                            {newDescription.length}/500 characters
                          </p>
                          <p className="text-purple-300 text-xs">
                            Press Ctrl+Enter to start analysis
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-3">
                          Since When
                        </label>
                        <input
                          type="date"
                          value={newSince}
                          onChange={(e) => {
                            setNewSince(e.target.value);
                          }}
                          className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-300 focus:scale-[1.01]"
                        />
                        <p className="text-purple-300 text-xs mt-2">
                          Select when your symptoms started
                        </p>
                      </div>

                      <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <AlertCircle className="text-purple-300" size={16} />
                          Ready for Analysis?
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className={`flex items-center gap-2 ${symptoms.length > 0 ? 'text-green-300' : 'text-purple-300'}`}>
                            <div className={`w-2 h-2 rounded-full ${symptoms.length > 0 ? 'bg-green-400' : 'bg-purple-400'}`}></div>
                            <span>At least one symptom added ({symptoms.length}/20)</span>
                          </div>
                          <div className={`flex items-center gap-2 ${newDescription.trim() ? 'text-green-300' : 'text-purple-300'}`}>
                            <div className={`w-2 h-2 rounded-full ${newDescription.trim() ? 'bg-green-400' : 'bg-purple-400'}`}></div>
                            <span>Health concerns described ({newDescription.length}/500)</span>
                          </div>
                          <div className={`flex items-center gap-2 ${newSince ? 'text-green-300' : 'text-purple-300'}`}>
                            <div className={`w-2 h-2 rounded-full ${newSince ? 'bg-green-400' : 'bg-purple-400'}`}></div>
                            <span>Symptom start date selected</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveEdit}
                          disabled={
                            !newDescription.trim() || 
                            !newSince || 
                            symptoms.length === 0 || 
                            isLoading
                          }
                          className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-lg hover:shadow-purple-500/25 disabled:hover:scale-100"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="animate-spin" size={20} />
                              <span>Starting Analysis...</span>
                            </>
                          ) : editingSymptom ? (
                            <>
                              <Edit className="text-white transition-transform duration-300 group-hover:rotate-90" size={20} />
                              <span>Update Symptom</span>
                            </>
                          ) : (
                            <>
                              <Play className="text-white transition-transform duration-300 group-hover:rotate-90" size={20} />
                              <span>Start Analysis</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isLoading}
                          className="py-4 px-6 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-purple-200 disabled:text-purple-400 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 'finding-illness' && illnessResponse && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Brain className="text-purple-300" size={20} />
                      AI is Analyzing Your Symptoms
                    </h3>
                    <TypingText
                      text={illnessResponse}
                      speed={25}
                      onComplete={() => {
                        addToast('Symptom analysis completed successfully!', { type: 'success' });
                      }}
                    />
                  </div>
                )}

                {currentStep === 'finding-drugs' && drugsResponse && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Activity className="text-purple-300" size={20} />
                      AI is Finding Your Medications
                    </h3>
                    <TypingText
                      text={drugsResponse}
                      speed={25}
                      onComplete={() => {
                        addToast('Medication recommendations ready!', { type: 'success' });
                      }}
                    />
                  </div>
                )}

                {currentStep === 'finding-products' && showProducts && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Target className="text-purple-300" size={20} />
                      Searching Available Products
                    </h3>
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/30 p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="text-green-300" size={18} />
                        <span className="text-green-200 font-medium">Products Successfully Located!</span>
                      </div>
                      <p className="text-green-100 text-sm">
                        Found {6} available products that match your medication needs. All items are ready for purchase.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                <RecommendedProducts
                  symptoms={symptoms}
                  isVisible={showProducts}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <SpeechModal
        isOpen={isSpeechModalOpen}
        onClose={toggleSpeechModal}
        onTranscriptComplete={handleSpeechTranscript}
      />
    </div>
  );
}
