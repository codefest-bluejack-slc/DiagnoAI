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
} from 'lucide-react';
import Navbar from '../components/common/navbar';
import Tooltip from '../components/common/tooltip';
import { SpeechModal } from '../components/modals/speech-modal';
import { HistoryModal } from '../components/modals/history-modal';
import { IDiagnosticPageProps } from '../interfaces/IDiagnostic';
import { ISymptom } from '../interfaces/IDiagnostic';
import { useDiagnostic } from '../hooks/use-diagnostic';
import { useMouseTracking } from '../hooks/use-mouse-tracking';
import { v4 as uuidv4 } from 'uuid';
import {
  getSeverityColor,
  getStepIcon,
  getSeverityIcon,
} from '../utils/diagnostic-utils';
import '../styles/diagnostic-page.css';

export default function DiagnosticPage({}: IDiagnosticPageProps) {
  const mousePosition = useMouseTracking();
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
    symptoms,
    setSymptoms,
    history,
    newSymptomIllness,
    setNewSymptomIllness,
    newSymptomDescription,
    setNewSymptomDescription,
    newSymptomSeverity,
    setNewSymptomSeverity,
    newSymptomSince,
    setNewSymptomSince,
    showAddForm,
    setShowAddForm,
    currentStep,
    setCurrentStep,
    addSymptom,
    removeSymptom,
    updateSymptom,
    clearAllSymptoms,
    getProgressPercentage,
    addToHistory,
    clearHistory,
  } = useDiagnostic();

  const mockHistoryData = history.length > 0 ? history : [
    {
      id: '1',
      date: '2024-12-15',
      title: 'Headache Analysis',
      symptoms: ['Migraine', 'Nausea', 'Light Sensitivity'],
      diagnosis: 'Tension Headache',
      status: 'completed' as const,
      severity: 'moderate' as const
    },
    {
      id: '2',
      date: '2024-12-10',
      title: 'Back Pain Assessment',
      symptoms: ['Lower Back Pain', 'Stiffness', 'Muscle Spasm'],
      diagnosis: 'Muscle Strain',
      status: 'completed' as const,
      severity: 'mild' as const
    },
    {
      id: '3',
      date: '2024-12-08',
      title: 'Fever Symptoms',
      symptoms: ['High Temperature', 'Chills', 'Fatigue', 'Body Aches'],
      diagnosis: 'Viral Infection',
      status: 'completed' as const,
      severity: 'severe' as const
    },
    {
      id: '4',
      date: '2024-12-05',
      title: 'Stomach Issues',
      symptoms: ['Abdominal Pain', 'Bloating', 'Nausea'],
      diagnosis: 'Indigestion',
      status: 'completed' as const,
      severity: 'mild' as const
    },
    {
      id: '5',
      date: '2024-12-01',
      title: 'Sleep Problems',
      symptoms: ['Insomnia', 'Restlessness', 'Anxiety', 'Racing Thoughts'],
      diagnosis: 'Sleep Disorder',
      status: 'in-progress' as const,
      severity: 'moderate' as const
    },
    {
      id: '6',
      date: '2024-11-28',
      title: 'Respiratory Issues',
      symptoms: ['Cough', 'Shortness of Breath', 'Chest Tightness'],
      diagnosis: 'Bronchitis',
      status: 'completed' as const,
      severity: 'moderate' as const
    }
  ];

  const [isExiting, setIsExiting] = useState(false);
  const [exitingElement, setExitingElement] = useState<'card' | 'form' | null>(null);

  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  const handleHideAddForm = () => {
    setShowAddForm(false);
  };

  const handleAddSymptom = () => {
    addSymptom();
  };

  const handleEditSymptom = (symptomId: string) => {
    const symptom = symptoms.find(s => s.id === symptomId);
    if (symptom) {
      setNewSymptomIllness(symptom.illness);
      setNewSymptomDescription(symptom.description);
      setNewSymptomSeverity(symptom.severity || 'mild');
      setNewSymptomSince(symptom.since || '');
      setEditingSymptom(symptomId);
      setShowAddForm(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingSymptom) {
      updateSymptom(editingSymptom, {
        illness: newSymptomIllness.trim(),
        description: newSymptomDescription.trim(),
        severity: newSymptomSeverity,
        since: newSymptomSince.trim() || undefined,
      });
      
      setNewSymptomIllness('');
      setNewSymptomDescription('');
      setNewSymptomSeverity('mild');
      setNewSymptomSince('');
      setEditingSymptom(null);
      setShowAddForm(false);
    } else {
      addSymptom();
    }
  };

  const handleCancelEdit = () => {
    setNewSymptomIllness('');
    setNewSymptomDescription('');
    setNewSymptomSeverity('mild');
    setNewSymptomSince('');
    setEditingSymptom(null);
    setShowAddForm(false);
  };

  const handleStartDiagnostic = () => {
    setCurrentStep('analysis');
  };

  const toggleSpeechModal = () => {
    setIsSpeechModalOpen(!isSpeechModalOpen);
  };

  const handleSpeechTranscript = (transcript: string) => {
    setNewSymptomDescription(transcript);
    setIsSpeechModalOpen(false);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all health concerns?')) {
      clearAllSymptoms();
      setEditingSymptom(null);
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
        historyData={mockHistoryData}
        onClearHistory={clearHistory}
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
        <History 
          className="group-hover:rotate-12 transition-transform duration-300 text-purple-300" 
          size={20} 
        />
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
              Describe your symptoms and get intelligent health insights
            </p>
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
                    {['input', 'review', 'analysis'].map((step, index) => (
                      <div
                        key={step}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
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
                              ? 'Input Health Concerns'
                              : step === 'review'
                                ? 'Review & Confirm'
                                : 'AI Analysis'}
                          </p>
                          <p className="text-purple-300 text-xs">
                            {step === 'input'
                              ? 'Describe health concerns'
                              : step === 'review'
                                ? 'Verify information'
                                : 'Get insights'}
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
                        Add Health Assessment
                      </h3>
                      <p className="text-purple-200 mb-6 transform transition-all duration-300 group-hover:scale-105">
                        Describe your health concerns and symptoms
                      </p>
                      <div className="inline-flex items-center gap-2 text-purple-300 text-sm">
                        <span>Start your health assessment</span>
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
                          {editingSymptom ? 'Edit Health Assessment' : 'Add Health Assessment'}
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
                          value={newSymptomDescription}
                          onChange={(e) =>
                            setNewSymptomDescription(e.target.value)
                          }
                          placeholder="Describe your health concern in detail... e.g., 'I have been experiencing sharp pain in my lower back when standing, along with stiffness in the morning'"
                          className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm resize-none text-lg leading-relaxed transition-all duration-300 focus:scale-[1.01]"
                          rows={6}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              addSymptom();
                            }
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-3">
                          Symptoms
                        </label>
                        <div className="space-y-3">
                          {symptoms.length === 0 ? (
                            <p className="text-purple-300 text-sm italic">No symptoms added yet. Add symptoms from your description.</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {symptoms.map((symptom, index) => (
                                <div
                                  key={symptom.id}
                                  className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-400/50 rounded-full text-sm text-purple-200"
                                >
                                  <span>{symptom.illness}</span>
                                  <button
                                    onClick={() => removeSymptom(symptom.id)}
                                    className="p-1 rounded-full hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200"
                                    title="Remove symptom"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newSymptomIllness}
                              onChange={(e) => setNewSymptomIllness(e.target.value)}
                              placeholder="Add a symptom (e.g., headache, back pain, fever)"
                              className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-300"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && newSymptomIllness.trim()) {
                                  const symptom: ISymptom = {
                                    id: uuidv4(),
                                    illness: newSymptomIllness.trim(),
                                    description: '',
                                    severity: newSymptomSeverity,
                                  };
                                  setSymptoms(prev => [...prev, symptom]);
                                  setNewSymptomIllness('');
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                if (newSymptomIllness.trim()) {
                                  const symptom: ISymptom = {
                                    id: uuidv4(),
                                    illness: newSymptomIllness.trim(),
                                    description: '',
                                    severity: newSymptomSeverity,
                                  };
                                  setSymptoms(prev => [...prev, symptom]);
                                  setNewSymptomIllness('');
                                }
                              }}
                              disabled={!newSymptomIllness.trim()}
                              className="px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 disabled:bg-gray-500/20 text-purple-200 disabled:text-gray-400 rounded-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-purple-200 text-sm font-medium mb-3">
                            Severity Level
                          </label>
                          <div className="relative">
                            <select
                              value={newSymptomSeverity}
                              onChange={(e) => setNewSymptomSeverity(e.target.value as 'mild' | 'moderate' | 'severe')}
                              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-300 focus:scale-[1.01] appearance-none cursor-pointer"
                            >
                              <option value="mild" className="bg-gray-800 text-white">Mild</option>
                              <option value="moderate" className="bg-gray-800 text-white">Moderate</option>
                              <option value="severe" className="bg-gray-800 text-white">Severe</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                newSymptomSeverity === 'mild' ? 'bg-green-400' :
                                newSymptomSeverity === 'moderate' ? 'bg-amber-400' : 'bg-red-400'
                              }`}></div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-purple-200 text-sm font-medium mb-3">
                            Since (Date)
                          </label>
                          <input
                            type="date"
                            value={newSymptomSince}
                            onChange={(e) => setNewSymptomSince(e.target.value)}
                            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-300 focus:scale-[1.01]"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveEdit}
                          disabled={!newSymptomDescription.trim()}
                          className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-lg hover:shadow-purple-500/25 disabled:hover:scale-100"
                        >
                          {editingSymptom ? (
                            <Edit className="text-white transition-transform duration-300 group-hover:rotate-90" size={20} />
                          ) : (
                            <Plus className="text-white transition-transform duration-300 group-hover:rotate-90" size={20} />
                          )}
                          <span>{editingSymptom ? 'Update Health Assessment' : 'Add Health Assessment'}</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="py-4 px-6 bg-white/10 hover:bg-white/20 text-purple-200 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                <div className="tips-card">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <Stethoscope className="text-purple-300" size={20} />
                      Health Assessments ({symptoms.length})
                    </h4>
                    <div className="flex items-center gap-2">
                      {symptoms.length >= 2 && (
                        <button
                          onClick={handleStartDiagnostic}
                          className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-medium rounded-lg transition-all duration-300 flex items-center gap-1.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                        >
                          <Play size={12} />
                          Start
                        </button>
                      )}
                      {symptoms.length > 0 && (
                        <button
                          onClick={handleClearAll}
                          className="px-2 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 text-xs font-medium rounded-lg transition-all duration-300 flex items-center gap-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                        >
                          <RefreshCw size={10} />
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {symptoms.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <Plus className="text-purple-300" size={20} />
                        </div>
                        <p className="text-purple-200 text-sm">
                          No health assessments added yet
                        </p>
                        <p className="text-purple-300 text-xs mt-1">
                          Click "Add Health Assessment" to start
                        </p>
                      </div>
                    ) : (
                      symptoms.map((symptom, index) => (
                        <div
                          key={symptom.id}
                          className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Heart className="w-3 h-3 text-purple-400" />
                                <h5 className="text-white text-sm font-medium">
                                  {symptom.illness}
                                </h5>
                              </div>
                              <p className="text-purple-200 text-xs leading-relaxed mb-2 pl-5">
                                {symptom.description.length > 45 
                                  ? `${symptom.description.substring(0, 45)}...` 
                                  : symptom.description}
                              </p>
                              <div className="flex items-center gap-1.5 pl-5">
                                {symptom.severity && (
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                                    symptom.severity === 'mild' ? 'bg-green-400/20 text-green-400' :
                                    symptom.severity === 'moderate' ? 'bg-amber-400/20 text-amber-400' :
                                    'bg-red-400/20 text-red-400'
                                  }`}>
                                    {symptom.severity === 'mild' ? (
                                      <Shield className="w-2.5 h-2.5" />
                                    ) : symptom.severity === 'moderate' ? (
                                      <AlertCircle className="w-2.5 h-2.5" />
                                    ) : (
                                      <Zap className="w-2.5 h-2.5" />
                                    )}
                                    {symptom.severity}
                                  </span>
                                )}
                                {symptom.since && (
                                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-400/20 text-blue-400 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" />
                                    Since {new Date(symptom.since).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={() => handleEditSymptom(symptom.id)}
                                className="p-1.5 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                                title="Edit"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => removeSymptom(symptom.id)}
                                className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-1 focus:ring-red-400/50"
                                title="Remove"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

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
