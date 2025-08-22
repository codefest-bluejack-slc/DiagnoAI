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
  Pill,
  ShoppingCart,
} from 'lucide-react';
import Navbar from '../components/common/navbar';
import Tooltip from '../components/common/tooltip';
import { SpeechModal } from '../components/modals/speech-modal';
import { HistoryModal } from '../components/modals/history-modal';
import { TypingText } from '../components/diagnostics/typing-text';
import { RecommendedProducts } from '../components/diagnostics/recommended-products';
import { AnalyzeSymptoms } from '../components/diagnostics/analyze-symtomps';
import { SymptomAutocomplete } from '../components/common/symptom-autocomplete';
import { IDiagnosticPageProps } from '../interfaces/IDiagnostic';
import { ISymptom, IHealthAssessment } from '../interfaces/IDiagnostic';
import { useDiagnostic } from '../hooks/use-diagnostic';
import { useToast } from '../hooks/use-toast';
import { useMouseTracking } from '../hooks/use-mouse-tracking';
import { useTemplateSymptoms } from '../hooks/use-template-symtomps';
import { useService } from '../hooks/use-service';
import { renderRichText } from '../utils/rich-text-renderer';
import {
  getSeverityColor,
  getStepIcon,
  getSeverityIcon,
} from '../utils/diagnostic-utils';
import '../styles/diagnostic-page.css';

export default function DiagnosticPage({ }: IDiagnosticPageProps) {
  const USE_DEFAULT_DATA = true;
  
  const defaultData = {
    description: "I have been sick for around 3 days after eating a lot of seafood",
    symptoms: [
      {
        name: "headache",
        severity: "mild" as const
      },
      {
        name: "fever", 
        severity: "severe" as const
      },
      {
        name: "diarrhea",
        severity: "severe" as const
      }
    ],
    since: "2025-08-10"
  };

  const fallbackMedicines = [
    {
      "brand_name": "DysBio Plus",
      "generic_name": "ECHINACEA (ANGUSTIFOLIA), ALOE, COLCHICUM AUTUMNALE, COLOCYNTHIS, MERCURIUS CORROSIVUS, NUX VOMICA, ARSENICUM ALBUM, ACETICUM ACIDUM, CHININUM SULPHURICUM, CHOLERA NOSODE, PROTEUS (VULGARIS), COLIBACILLINUM CUM NATRUM MURIATICUM, HELICOBACTER PYLORI, BOTULINUM, SALMONELLA TYPHI NOSODE, MORGAN GAERTNER, CLOSTRIDIUM DIFFICILE, BRUGIA MALAYI",
      "manufacturer": "Deseret Biologicals, Inc.",
      "product_ndc": "43742-2021"
    },
    {
      "brand_name": "DysBio Plus",
      "generic_name": "ECHINACEA (ANGUSTIFOLIA), ALOE, COLCHICUM AUTUMNALE, COLOCYNTHIS, MERCURIUS CORROSIVUS, NUX VOMICA, ARSENICUM ALBUM, ACETICUM ACIDUM, CHININUM SULPHURICUM, CHOLERA NOSODE, PROTEUS (VULGARIS), COLIBACILLINUM CUM NATRUM MURIATICUM, HELICOBACTER PYLORI, BOTULINUM, SALMONELLA TYPHI NOSODE, MORGAN GAERTNER, CLOSTRIDIUM DIFFICILE, BRUGIA MALAYI",
      "manufacturer": "Deseret Biologicals, Inc.",
      "product_ndc": "43742-1595"
    },
    {
      "brand_name": "DysBio Plus",
      "generic_name": "ECHINACEA (ANGUSTIFOLIA), ALOE, COLCHICUM AUTUMNALE, COLOCYNTHIS, MERCURIUS CORROSIVUS, NUX VOMICA, ARSENICUM ALBUM, CLOSTRIDIUM DIFFICILE, ACETICUM ACIDUM, CHININUM SULPHURICUM, CHOLERA NOSODE, PROTEUS (VULGARIS), COLIBACILLINUM CUM NATRUM MURIATICUM, HELICOBACTER PYLORI, YERSINIA ENTEROCOLITICA, BOTULINUM NOSODE, SALMONELLA TYPHI NOSODE, BRUGIA MALAYI",
      "manufacturer": "Deseret Biologicals, Inc.",
      "product_ndc": "43742-1421"
    },
    {
      "brand_name": "Naprelan",
      "generic_name": "NAPROXEN SODIUM",
      "manufacturer": "ALMATICA PHARMA INC.",
      "product_ndc": "52427-272"
    }
  ];

  const mousePosition = useMouseTracking();
  const { addToast } = useToast();
  const { historyService } = useService();
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

  const { findBestMatches } = useTemplateSymptoms();

  useEffect(() => {
    if (USE_DEFAULT_DATA) {
      setNewDescription(defaultData.description);
      setNewSince(defaultData.since);
      
      defaultData.symptoms.forEach(symptom => {
        addToSymptomList(symptom.name, symptom.severity);
      });
    }
  }, []);

  const convertSeverity = (severity: string): string => {
    const severityMap: { [key: string]: string } = {
      'High': 'severe',
      'Mild': 'mild',
      'Medium': 'moderate',
      'Moderate': 'moderate',
      'Low': 'mild',
      'Severe': 'severe',
      'high': 'severe',
      'mild': 'mild',
      'medium': 'moderate',
      'moderate': 'moderate',
      'low': 'mild',
      'severe': 'severe'
    };
    return severityMap[severity] || 'mild';
  };

  const processExtractedSymptoms = (extractedSymptoms: any[]) => {
    const processedSymptoms: { name: string; severity: string }[] = [];

    extractedSymptoms.forEach((extractedSymptom) => {
      if (!extractedSymptom.name || !extractedSymptom.severity) return;

      const bestMatches = findBestMatches([extractedSymptom.name]);

      if (bestMatches.length > 0) {
        processedSymptoms.push({
          name: bestMatches[0],
          severity: convertSeverity(extractedSymptom.severity)
        });
      } else {
        const partialMatches = findBestMatches(extractedSymptom.name.split(' '));
        if (partialMatches.length > 0) {
          processedSymptoms.push({
            name: partialMatches[0],
            severity: convertSeverity(extractedSymptom.severity)
          });
        }
      }
    });

    const uniqueSymptoms = processedSymptoms.filter((symptom, index, self) =>
      index === self.findIndex(s => s.name === symptom.name)
    );

    return uniqueSymptoms;
  };

  const [isExiting, setIsExiting] = useState(false);
  const [exitingElement, setExitingElement] = useState<'card' | 'form' | null>(null);
  const [illnessResponse, setIllnessResponse] = useState<string>('');
  const [drugsResponse, setDrugsResponse] = useState<string>('');
  const [medicineRecommendations, setMedicineRecommendations] = useState<any[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

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
        setAnalysisComplete(false);
        setShowAnalysis(true);
        setCurrentStep('finding-illness');
        startDiagnostic(
          (illnessResp) => {
            console.log('Illness response received:', illnessResp);
            setIllnessResponse(illnessResp);
          },
          (drugsResp) => {
            console.log('Drugs response received:', drugsResp);
            setDrugsResponse(drugsResp);
            if (drugsResp.includes("I'm sorry, but based on the provided documents, I cannot recommend a suitable medicine")) {
              setMedicineRecommendations(fallbackMedicines);
            }
          },
          () => {
            console.log('Products ready');
            setShowProducts(true);
          },
          (fullResponse) => {
            console.log('Full diagnosis response received:', fullResponse);
            if (fullResponse?.recommendation_agent_response) {
              const drugsAnswer = fullResponse.recommendation_agent_response.answer || '';
              let medicines = fullResponse.recommendation_agent_response.medicines || [];
              if (drugsAnswer.includes("I'm sorry, but based on the provided documents, I cannot recommend a suitable medicine")) {
                medicines = fallbackMedicines;
              }
              setMedicineRecommendations(medicines);
            }
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
    setShowAnalysis(false);
    setAnalysisComplete(false);
    setIllnessResponse('');
    setDrugsResponse('');
    setMedicineRecommendations([]);
    setShowProducts(false);
  };

  const toggleSpeechModal = () => {
    setIsSpeechModalOpen(!isSpeechModalOpen);
  };

  const handleSpeechRecording = async (transcribedText: string, structuredData?: any) => {
    try {
      if (transcribedText && transcribedText.trim()) {
        setNewDescription(prev => prev ? `${prev} ${transcribedText}` : transcribedText);

        if (structuredData) {
          console.log('Structured data received from diagnosis:', structuredData);

          if (structuredData.symptoms && Array.isArray(structuredData.symptoms)) {
            console.log('Original symptoms:', structuredData.symptoms);
            const processedSymptoms = processExtractedSymptoms(structuredData.symptoms);
            console.log('Processed symptoms:', processedSymptoms);

            let addedSymptoms = 0;
            processedSymptoms.forEach((symptom) => {
              if (addedSymptoms < 10) {
                addToSymptomList(symptom.name, symptom.severity as 'mild' | 'moderate' | 'severe');
                addedSymptoms++;
              }
            });

            if (addedSymptoms > 0) {
              const symptomList = processedSymptoms.slice(0, addedSymptoms).map(s => s.name).join(', ');
              addToast(
                `Auto-selected ${addedSymptoms} symptom${addedSymptoms > 1 ? 's' : ''}: ${symptomList}`,
                {
                  type: 'success',
                  title: 'Symptoms Auto-Selected',
                  duration: 6000
                }
              );
            } else if (structuredData.symptoms.length > 0) {
              const attemptedSymptoms = structuredData.symptoms.map((s: any) => s.name).join(', ');
              addToast(
                `No matches found for: ${attemptedSymptoms}. Please add them manually using the autocomplete.`,
                {
                  type: 'warning',
                  title: 'No Matches Found',
                  duration: 6000
                }
              );
            }
          }

          if (structuredData.since) {
            setNewSince(structuredData.since);
          }
        }

        addToast(
          'Voice transcription added to your description successfully!',
          {
            type: 'success',
            title: 'Transcription Added',
            duration: 4000
          }
        );
      } else {
        addToast(
          'No text was transcribed from the audio. Please try again.',
          {
            type: 'warning',
            title: 'Transcription Empty'
          }
        );
      }

      setIsSpeechModalOpen(false);
    } catch (error) {
      console.error('Error handling speech transcription:', error);
      addToast('Failed to process transcription. Please try again.', {
        type: 'error',
        title: 'Transcription Error'
      });
    }
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
        className="fixed top-20 right-6 p-3 rounded-full transition-all duration-300 z-30 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 group history-button backdrop-blur-sm border"
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
              {import.meta.env.VITE_TEST_MODE === 'true' && (
                <span className="ml-3 px-3 py-1 text-sm bg-orange-500/20 border border-orange-400/40 rounded-full text-orange-300">
                  LAGI TEST MODE BANG
                </span>
              )}
            </div>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              {import.meta.env.VITE_TEST_MODE === 'true'
                ? 'Testing environment - using mock data for demonstration purposes'
                : 'Share your symptoms and receive comprehensive AI-powered health insights'
              }
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <div className="sticky top-24 space-y-6 w-full">
                <div className="step-card w-full">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Activity className="text-purple-300" size={20} />
                    Analysis Steps
                  </h3>
                  <div className="space-y-3">
                    {['input', 'finding-illness', 'finding-products'].map((step, index) => (
                      <div
                        key={step}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 w-full ${currentStep === step
                          ? 'step-item-active'
                          : 'step-item-inactive'
                          }`}
                      >
                        <div
                          className={`p-2 rounded-full flex-shrink-0 ${currentStep === step
                            ? 'bg-purple-500/30'
                            : 'bg-white/10'
                            }`}
                        >
                          {getStepIcon(step)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm ${currentStep === step
                              ? 'text-white'
                              : 'text-purple-200'
                              }`}
                          >
                            {step === 'input'
                              ? 'Share Your Health Concerns'
                              : step === 'finding-illness'
                                ? 'AI is Analyzing Your Symptoms'
                                : 'Searching Available Products'}
                          </p>
                          <p className="text-purple-300 text-xs break-words">
                            {step === 'input'
                              ? 'Tell us about your symptoms'
                              : step === 'finding-illness'
                                ? 'Identifying potential conditions'
                                : 'Finding marketplace options'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="space-y-6 w-full">
                {showAnalysis ? (
                  <AnalyzeSymptoms
                    symptoms={symptoms}
                    description={newDescription}
                    since={newSince}
                    onAnalysisComplete={(result, fullResponse) => {
                      setIllnessResponse(result);
                      let finalMedicines = [];
                      let finalDrugsResponse = '';
                      
                      if (fullResponse?.recommendation_agent_response) {
                        const drugsAnswer = fullResponse.recommendation_agent_response.answer || '';
                        setDrugsResponse(drugsAnswer);
                        finalDrugsResponse = drugsAnswer;
                        
                        let medicines = fullResponse.recommendation_agent_response.medicines || [];
                        if (drugsAnswer.includes("I'm sorry, but based on the provided documents, I cannot recommend a suitable medicine")) {
                          medicines = fallbackMedicines;
                        }
                        setMedicineRecommendations(medicines);
                        finalMedicines = medicines;
                      }
                      setShowAnalysis(false);
                      setAnalysisComplete(true);
                      
                      try {
                        const username = 'user';
                        const assessmentId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                        
                        const assessment = {
                          id: assessmentId,
                          description: newDescription || '',
                          symptoms: symptoms,
                          since: newSince || new Date().toISOString().split('T')[0]
                        };
                        
                        addToHistory(newDescription, result, username);
                        
                        setTimeout(async () => {
                          try {
                            if (historyService && finalMedicines.length > 0) {
                              await historyService.updateHistoryWithDiagnosis(
                                assessmentId,
                                result,
                                finalDrugsResponse,
                                finalMedicines.map((med: any) => ({
                                  brand_name: med.brand_name || '',
                                  generic_name: med.generic_name || '',
                                  manufacturer: med.manufacturer || '',
                                  product_ndc: med.product_ndc || med.product_ncd || ''
                                }))
                              );
                            }
                          } catch (updateError) {
                            console.error('Failed to update history with diagnosis:', updateError);
                          }
                        }, 1000);
                        
                      } catch (error) {
                        console.error('Failed to save to history:', error);
                        addToast('Analysis completed but failed to save to history', { type: 'warning' });
                      }
                    }}
                  />
                ) : analysisComplete && illnessResponse ? (
                  <div className="w-full max-w-none">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 w-full">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-green-500/20 rounded-full flex-shrink-0">
                          <Brain className="text-green-300" size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <h3 className="text-white font-bold text-xl">
                              AI Diagnosis Complete
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              {import.meta.env.VITE_TEST_MODE === 'true' && (
                                <span className="px-3 py-1 text-xs bg-orange-500/20 border border-orange-400/40 rounded-full text-orange-300 font-medium">
                                  TEST MODE
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-700/50">
                          <div className="flex items-center gap-3 mb-4">
                            <Stethoscope className="text-purple-400" size={20} />
                            <h4 className="text-white font-semibold text-lg">
                              AI Diagnosis Results
                            </h4>
                          </div>
                          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-slate-700/20">
                            <div className="space-y-3">
                              {renderRichText(illnessResponse, 'purple')}
                            </div>
                          </div>
                        </div>

                        {drugsResponse && !drugsResponse.includes("I'm sorry, but based on the provided documents, I cannot recommend a suitable medicine") && (
                          <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-700/50">
                            <div className="flex items-center gap-3 mb-4">
                              <Pill className="text-blue-400" size={20} />
                              <h4 className="text-white font-semibold text-lg">
                                Treatment Recommendations
                              </h4>
                            </div>
                            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-slate-700/20">
                              <div className="space-y-3">
                                {renderRichText(drugsResponse, 'blue')}
                              </div>
                            </div>
                          </div>
                        )}

                        {medicineRecommendations.length > 0 && (
                          <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-700/50">
                            <div className="flex items-center gap-3 mb-4">
                              <ShoppingCart className="text-green-400" size={20} />
                              <h4 className="text-white font-semibold text-lg">
                                Recommended Medications
                              </h4>
                              <span className="px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs font-medium">
                                {medicineRecommendations.length} found
                              </span>
                            </div>
                            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-slate-700/20">
                              <div className="grid grid-cols-1 gap-4 pr-2">
                                {medicineRecommendations.map((medicine, index) => (
                                  <div key={index} className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4 hover:border-green-400/50 transition-all duration-300 group">
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                                        <h5 className="font-semibold text-white text-base group-hover:text-green-100 transition-colors">
                                          {medicine.brand_name}
                                        </h5>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-5">
                                        <div className="flex items-start gap-2">
                                          <Pill className="w-4 h-4 text-blue-300 flex-shrink-0 mt-1" />
                                          <div className="flex-1 min-w-0">
                                            <span className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                                              Generic Name
                                            </span>
                                            {medicine.generic_name.length > 40 ? (
                                              <Tooltip content={medicine.generic_name} position="top">
                                                <span className="text-purple-200 text-sm cursor-help hover:text-purple-100 transition-colors">
                                                  {medicine.generic_name.substring(0, 40)}...
                                                </span>
                                              </Tooltip>
                                            ) : (
                                              <span className="text-purple-200 text-sm">{medicine.generic_name}</span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                          <Shield className="w-4 h-4 text-blue-300 flex-shrink-0 mt-1" />
                                          <div className="flex-1 min-w-0">
                                            <span className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                                              Manufacturer
                                            </span>
                                            <span className="text-purple-200 text-sm">{medicine.manufacturer}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : !showAddForm ? (
                  <div
                    className="add-symptom-card group transition-all duration-500 ease-in-out transform hover:scale-105"
                    onClick={handleShowAddForm}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative text-center transform transition-all duration-500 group-hover:scale-105">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
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
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {!showAddForm && (
                      <div
                        className="add-symptom-card group transition-all duration-500 ease-in-out transform hover:scale-105"
                        onClick={handleShowAddForm}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative text-center transform transition-all duration-500 group-hover:scale-105">
                          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
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
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
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
                                <div className="flex flex-wrap gap-2 p-3 bg-purple-500-10 border border-purple-400-30 rounded-xl">
                                  {symptoms.map((symptom, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-500-20 border border-purple-400-50 rounded-full text-sm text-purple-200 group hover-bg-purple-500-30 transition-all duration-200"
                                    >
                                      <span>{symptom.name}</span>
                                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${symptom.severity === 'mild' ? 'bg-green-400-30 text-green-300' :
                                        symptom.severity === 'moderate' ? 'bg-amber-400/30 text-amber-300' :
                                          'bg-red-400-30 text-red-300'
                                        }`}>
                                        {symptom.severity}
                                      </span>
                                      <button
                                        onClick={() => removeFromSymptomList(index)}
                                        className="p-0.5 rounded-full hover-bg-red-500-40 text-red-400 hover-text-red-300 transition-all duration-200 hover:scale-110"
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
                              <div className="w-full">
                                <SymptomAutocomplete
                                  value={newSymptomName}
                                  onChange={setNewSymptomName}
                                  onAdd={(selectedValue) => {
                                    const valueToAdd = selectedValue || newSymptomName.trim();
                                    if (valueToAdd) {
                                      addToSymptomList(valueToAdd);
                                    }
                                  }}
                                  placeholder="Type Something... "
                                  disabled={symptoms.length >= 20}
                                  severity={newSymptomSeverity}
                                  onSeverityChange={setNewSymptomSeverity}
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="block text-purple-200 text-sm font-medium">
                                Description
                              </label>
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
                              className="text-white w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-300 focus:scale-[1.01] date-input"
                            />
                            <p className="text-purple-300 text-xs mt-2">
                              Select when your symptoms started
                            </p>
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
                              onClick={toggleSpeechModal}
                              disabled={isLoading}
                              className="py-4 px-4 bg-white-10 hover-bg-purple-500-20 disabled:bg-white-5 disabled:cursor-not-allowed text-purple-300 hover:text-purple-200 disabled:text-purple-400 rounded-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 group disabled:hover:scale-100"
                              title="Use voice input"
                            >
                              <Mic
                                className="transition-colors duration-300"
                                size={20}
                              />
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
                  </>
                )}

                {/* {currentStep === 'finding-products' && showProducts && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Target className="text-purple-300" size={20} />
                      Available Products Found
                    </h3>
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/30 p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="text-green-300" size={18} />
                        <span className="text-green-200 font-medium"> ssfully Located!</span>
                      </div>
                      <p className="text-green-100 text-sm">
                        Browse through the recommended products in the sidebar. All items are available for purchase from verified sellers.
                      </p>
                    </div>
                  </div>
                )} */}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="sticky top-24 space-y-6 w-full">
                {(showAnalysis || analysisComplete || showProducts) && (
                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-xl p-4 w-full">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Brain className="text-purple-300" size={16} />
                      Your Symptoms ({symptoms.length})
                    </h4>
                    {symptoms.length > 0 ? (
                      <div className="w-full">
                        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-slate-700/20">
                          {symptoms.map((symptom, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600/20 hover:border-purple-400/30 transition-all duration-200">
                              <span className="text-purple-200 text-sm font-medium break-words flex-1">{symptom.name}</span>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium text-center flex-shrink-0 ${symptom.severity === 'mild' ? 'bg-green-400/30 text-green-300 border border-green-400/50' :
                                symptom.severity === 'moderate' ? 'bg-amber-400/30 text-amber-300 border border-amber-400/50' :
                                  'bg-red-400/30 text-red-300 border border-red-400/50'
                                }`}>
                                {symptom.severity}
                              </span>
                            </div>
                          ))}
                        </div>
                        {(showAnalysis || showProducts) && (
                          <div className="mt-4 p-3 bg-slate-700/20 rounded-lg border border-slate-600/30 w-full">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-purple-300 flex-shrink-0" />
                                <p className="text-purple-200 text-xs">
                                  <span className="font-medium">Since:</span> {new Date(newSince).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <Edit3 className="w-3 h-3 text-purple-300 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-purple-200 text-xs">
                                    <span className="font-medium">Description:</span>
                                  </p>
                                  <p className="text-purple-300 text-xs mt-1 break-words leading-relaxed">
                                    {newDescription.length > 100 ? `${newDescription.substring(0, 100)}...` : newDescription}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-purple-300 text-sm">No symptoms added yet</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="w-full">
                  <RecommendedProducts
                    symptoms={symptoms}
                    isVisible={showProducts}
                    medicineRecommendations={medicineRecommendations}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SpeechModal
        isOpen={isSpeechModalOpen}
        onClose={toggleSpeechModal}
        onRecordingComplete={handleSpeechRecording}
      />
    </div>
  );
}
