import { useState, useEffect } from 'react';
import { ISymptom, IHealthAssessment } from '../interfaces/IDiagnostic';
import { IHistoryItem } from '../interfaces/IHistoryModal';
import { useService } from './use-service';
import { useMutation } from './use-mutation';
import { useToast } from './use-toast';
import { Symptom } from '../declarations/symptom/symptom.did';
import { DiagnosisService } from '../services/diagnosis.service';

export const useDiagnostic = () => {
  const [history, setHistory] = useState<IHistoryItem[]>([]);
  const [newSymptomName, setNewSymptomName] = useState('');
  const [newSymptomSeverity, setNewSymptomSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [newDescription, setNewDescription] = useState('');
  const [newSince, setNewSince] = useState('');
  const [symptoms, setSymptoms] = useState<ISymptom[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'input' | 'finding-illness' | 'finding-drugs' | 'finding-products'
  >('input');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const { symptomService, historyService } = useService();
  const { addToast } = useToast();

  const USE_TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true';

  // if (USE_TEST_MODE) {
  //   console.log('Diagnostic hook initialized in TEST MODE');
  // }

  useEffect(() => {
    loadHistoryFromBackend();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('connecting');
      await historyService.ensureInitialized();
      await symptomService.ensureInitialized();
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('disconnected');
      addToast('Backend connection failed', { type: 'error' });
    }
  };

  const loadHistoryFromBackend = async () => {
    try {
      setIsLoading(true);
      await testConnection();
      
      const historyData = await historyService.getMyHistories();
      // setHistory(historyData);
      
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error loading history from backend:', error);
      setHistory([]);
      setConnectionStatus('disconnected');
      addToast('Failed to load data from backend', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const addSymptomMutation = useMutation({
    mutationFn: async (input: { symptom: { name: string; severity: string; historyId: string }; username: string }) => {
      const { symptom, username } = input;
      const symptomData: Symptom = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        historyId: symptom.historyId,
        name: symptom.name,
        severity: symptom.severity,
      };
      return symptomService.addSymptom(username, symptomData);
    },
    onSuccess: (data) => {
      console.log('Symptom added successfully:', data);
    },
    onError: (error) => {
      console.error('Error adding symptom:', error);
      addToast('Failed to add symptom to backend', { type: 'error' });
    }
  });

  const getHistoryMutation = useMutation({
    mutationFn: () => historyService.getMyHistories(),
    onSuccess: (data) => {
      console.log('History fetched successfully:', data);
      if (data) {
        // setHistory(data);
      }
    },
    onError: (error) => {
      console.error('Error fetching history:', error);
      setHistory([]);
      addToast('Failed to load history from backend', { type: 'error' });
    }
  });

  const addHistoryMutation = useMutation({
    mutationFn: (input : {assessment: IHealthAssessment, username: string}) => historyService.addHistory(input.username,input.assessment),
    onSuccess: (data) => {
      console.log('History added successfully:', data);
      addToast('Assessment saved successfully!', { type: 'success' });
      loadHistoryFromBackend();
    },
    onError: (error) => {
      console.error('Error adding history:', error);
      addToast('Failed to save assessment', { type: 'error' });
    }
  });

  const deleteHistoryMutation = useMutation({
    mutationFn: (historyId: string) => historyService.deleteHistory(historyId),
    onSuccess: () => {
      console.log('History deleted successfully');
      addToast('Assessment deleted successfully', { type: 'success' });
      loadHistoryFromBackend();
    },
    onError: (error) => {
      console.error('Error deleting history:', error);
      addToast('Failed to delete assessment', { type: 'error' });
    }
  });

  const clearAllHistoryMutation = useMutation({
    mutationFn: async () => {
      const deletePromises = history.map(item => historyService.deleteHistory(item.id));
      await Promise.all(deletePromises);
    },
    onSuccess: () => {
      console.log('All history cleared successfully');
      setHistory([]);
      addToast('All history cleared successfully', { type: 'success' });
    },
    onError: (error) => {
      console.error('Error clearing all history:', error);
      addToast('Failed to clear history', { type: 'error' });
    }
  });

    const addToSymptomList = (name: string, severity?: 'mild' | 'moderate' | 'severe') => {
    if (!name || name.trim().length === 0) {
      addToast('Symptom name is required', { type: 'warning', title: 'Validation Error' });
      return;
    }
    
    if (name.trim().length > 100) {
      addToast('Symptom name must be less than 100 characters', { type: 'warning', title: 'Validation Error' });
      return;
    }

    if (symptoms.length >= 20) {
      addToast('Maximum 20 symptoms allowed', { type: 'warning', title: 'Limit Reached' });
      return;
    }

    const isDuplicate = symptoms.some(symptom => 
      symptom.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      addToast('This symptom has already been added', { type: 'warning', title: 'Duplicate Symptom' });
      return;
    }

    const newSymptom: ISymptom = {
      name: name.trim(),
      severity: severity || newSymptomSeverity,
    };
    setSymptoms((prev) => [...prev, newSymptom]);
    setNewSymptomName('');
    addToast(`Successfully added symptom: ${name.trim()}`, { type: 'success', duration: 2000 });
  };

  const removeFromSymptomList = (index: number) => {
    const removedSymptom = symptoms[index];
    setSymptoms((prev) => prev.filter((_, i) => i !== index));
    if (removedSymptom) {
      addToast(`Removed symptom: ${removedSymptom.name}`, { type: 'info', duration: 2000 });
    }
  };

  const clearSymptomList = () => {
    if (symptoms.length > 0) {
      setSymptoms([]);
      addToast('All symptoms cleared', { type: 'info', duration: 2000 });
    }
  };

  const startDiagnostic = async (
    onIllnessFound?: (response: string) => void,
    onDrugsFound?: (response: string) => void,
    onProductsReady?: () => void,
    onFullResponse?: (response: any) => void
  ) => {
    if (!newDescription.trim()) {
      addToast('Description is required', { type: 'warning', title: 'Validation Error' });
      return;
    }
    
    if (newDescription.trim().length < 10) {
      addToast('Description must be at least 10 characters long', { type: 'warning', title: 'Validation Error' });
      return;
    }
    
    if (newDescription.trim().length > 500) {
      addToast('Description must be less than 500 characters', { type: 'warning', title: 'Validation Error' });
      return;
    }
    
    if (!newSince) {
      addToast('Date is required', { type: 'warning', title: 'Validation Error' });
      return;
    }
    
    const selectedDate = new Date(newSince);
    const today = new Date();
    if (selectedDate > today) {
      addToast('Date cannot be in the future', { type: 'warning', title: 'Validation Error' });
      return;
    }
    
    if (symptoms.length === 0) {
      addToast('At least one symptom is required', { type: 'warning', title: 'Validation Error' });
      return;
    }
    
    if (symptoms.length > 20) {
      addToast('Maximum 20 symptoms allowed', { type: 'warning', title: 'Validation Error' });
      return;
    }

    try {
      setIsLoading(true);
      
      setCurrentStep('finding-illness');
      addToast('Starting comprehensive symptom analysis...', { type: 'success' });

      const diagnosisRequest = {
        description: newDescription.trim(),
        symptoms: symptoms.map(symptom => ({
          name: symptom.name,
          severity: symptom.severity
        })),
        since: newSince
      };

      try {
        let diagnosisResponse;
        
        diagnosisResponse = await DiagnosisService.getStructuredDiagnosis(diagnosisRequest);
        
        if (onFullResponse) {
          onFullResponse(diagnosisResponse);
        }
        
        if (onIllnessFound && diagnosisResponse.diagnosis) {
          onIllnessFound(diagnosisResponse.diagnosis);
        }
        
        setTimeout(() => {
          setCurrentStep('finding-drugs');
          addToast('Searching for suitable medications...', { type: 'success' });
          
          const drugsResponse = diagnosisResponse.recommendation_agent_response?.answer || generateDrugsResponse(symptoms);
          
          setTimeout(() => {
            if (onDrugsFound) {
              onDrugsFound(drugsResponse);
            }
            
            setTimeout(() => {
              setCurrentStep('finding-products');
              addToast('Locating available products in marketplace...', { type: 'success' });
              
              setTimeout(() => {
                if (onProductsReady) {
                  onProductsReady();
                }
                setIsLoading(false);
                addToast('Complete health analysis finished successfully!', { type: 'success' });
              }, 1000);
            }, 2000);
          }, 2000);
        }, USE_TEST_MODE ? 3000 : 3000);
      } catch (diagnosisError) {
        console.warn('Diagnosis service unavailable, using fallback:', diagnosisError);
        
        const illnessResponse = generateIllnessResponse(newDescription, symptoms, newSince);
        
        setTimeout(() => {
          if (onIllnessFound) {
            onIllnessFound(illnessResponse);
          }
          
          setTimeout(() => {
            setCurrentStep('finding-drugs');
            addToast('Searching for suitable medications...', { type: 'success' });
            
            const drugsResponse = generateDrugsResponse(symptoms);
            
            setTimeout(() => {
              if (onDrugsFound) {
                onDrugsFound(drugsResponse);
              }
              
              setTimeout(() => {
                setCurrentStep('finding-products');
                addToast('Locating available products in marketplace...', { type: 'success' });
                
                setTimeout(() => {
                  if (onProductsReady) {
                    onProductsReady();
                  }
                  setIsLoading(false);
                  addToast('Complete health analysis finished successfully!', { type: 'success' });
                }, 1000);
              }, 2000);
            }, 2000);
          }, 3000);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error starting diagnostic:', error);
      addToast('Failed to start diagnostic', { type: 'error', title: 'Diagnostic Error' });
      setIsLoading(false);
      setCurrentStep('input');
    }
  };

  const generateIllnessResponse = (description: string, symptoms: ISymptom[], since: string): string => {
    const severeCounts = symptoms.filter(s => s.severity === 'severe').length;
    const moderateCounts = symptoms.filter(s => s.severity === 'moderate').length;
    const mildCounts = symptoms.filter(s => s.severity === 'mild').length;
    
    const daysSince = Math.floor((new Date().getTime() - new Date(since).getTime()) / (1000 * 3600 * 24));
    
    let response = `🔍 AI Illness Analysis Complete\n\n`;
    response += `Based on your symptoms: ${symptoms.map(s => s.name).join(', ')}\n\n`;
    
    if (severeCounts > 0) {
      response += `🚨 **Primary Concern**: Acute condition requiring immediate attention\n`;
      response += `Your severe symptoms suggest a condition that needs prompt medical evaluation.\n\n`;
    } else if (moderateCounts > 1) {
      response += `⚠️ **Primary Concern**: Moderate condition requiring monitoring\n`;
      response += `Multiple moderate symptoms indicate a developing condition that should be addressed.\n\n`;
    } else {
      response += `✅ **Primary Concern**: Mild condition with manageable symptoms\n`;
      response += `Your symptoms appear to be manageable with proper care and monitoring.\n\n`;
    }
    
    response += `📊 **Symptom Analysis**:\n`;
    if (severeCounts > 0) response += `• ${severeCounts} severe symptom${severeCounts > 1 ? 's' : ''} detected\n`;
    if (moderateCounts > 0) response += `• ${moderateCounts} moderate symptom${moderateCounts > 1 ? 's' : ''} identified\n`;
    if (mildCounts > 0) response += `• ${mildCounts} mild symptom${mildCounts > 1 ? 's' : ''} noted\n`;
    
    response += `\n⏱️ **Duration**: Symptoms present for ${daysSince} day${daysSince !== 1 ? 's' : ''}\n\n`;
    
    response += `🎯 **Possible Conditions**:\n`;
    if (symptoms.some(s => s.name.toLowerCase().includes('fever'))) {
      response += `• Viral or bacterial infection\n`;
    }
    if (symptoms.some(s => s.name.toLowerCase().includes('headache'))) {
      response += `• Tension headache or migraine\n`;
    }
    if (symptoms.some(s => s.name.toLowerCase().includes('nausea'))) {
      response += `• Digestive system disturbance\n`;
    }
    response += `• General inflammatory response\n`;
    
    response += `\n⚠️ This is an AI analysis for informational purposes only. Please consult a healthcare professional for proper diagnosis.`;
    
    return response;
  };

  const generateDrugsResponse = (symptoms: ISymptom[]): string => {
    const severeCounts = symptoms.filter(s => s.severity === 'severe').length;
    const moderateCounts = symptoms.filter(s => s.severity === 'moderate').length;
    
    let response = `💊 AI Medication Recommendations\n\n`;
    response += `Based on your symptoms, here are suitable medication categories:\n\n`;
    
    response += `🎯 **Recommended Medications**:\n\n`;
    
    if (symptoms.some(s => s.name.toLowerCase().includes('fever'))) {
      response += `🌡️ **For Fever**:\n`;
      response += `• Paracetamol (Acetaminophen) - 500mg every 6-8 hours\n`;
      response += `• Ibuprofen - 200-400mg every 6-8 hours\n\n`;
    }
    
    if (symptoms.some(s => s.name.toLowerCase().includes('headache'))) {
      response += `🧠 **For Headache**:\n`;
      response += `• Aspirin - 325-650mg every 4 hours\n`;
      response += `• Paracetamol - 500mg every 6 hours\n\n`;
    }
    
    if (symptoms.some(s => s.name.toLowerCase().includes('nausea'))) {
      response += `🤢 **For Nausea**:\n`;
      response += `• Domperidone - 10mg before meals\n`;
      response += `• Ondansetron - 4-8mg as needed\n\n`;
    }
    
    response += `🍯 **General Support**:\n`;
    response += `• Vitamin C - 1000mg daily for immune support\n`;
    response += `• Multivitamin - Daily for nutritional support\n`;
    response += `• Probiotics - For digestive health\n\n`;
    
    if (severeCounts > 0) {
      response += `🚨 **Important**: Severe symptoms require prescription medications. Please consult a doctor immediately.\n\n`;
    }
    
    response += `⚠️ **Safety Guidelines**:\n`;
    response += `• Always follow recommended dosages\n`;
    response += `• Check for drug allergies before use\n`;
    response += `• Consult pharmacist for drug interactions\n`;
    response += `• Stop use if adverse reactions occur\n\n`;
    
    response += `📋 This is an AI recommendation. Always consult healthcare professionals before taking any medication.`;
    
    return response;
  };

  const generateAIResponse = (description: string, symptoms: ISymptom[], since: string): string => {
    const severeCounts = symptoms.filter(s => s.severity === 'severe').length;
    const moderateCounts = symptoms.filter(s => s.severity === 'moderate').length;
    const mildCounts = symptoms.filter(s => s.severity === 'mild').length;
    
    const daysSince = Math.floor((new Date().getTime() - new Date(since).getTime()) / (1000 * 3600 * 24));
    
    let response = `Hello! I've analyzed your health concerns. Based on your description of "${description.substring(0, 50)}${description.length > 50 ? '...' : ''}" and the ${symptoms.length} symptom${symptoms.length > 1 ? 's' : ''} you've reported, here's my assessment:\n\n`;
    
    response += `📊 Symptom Analysis:\n`;
    if (severeCounts > 0) response += `• ${severeCounts} severe symptom${severeCounts > 1 ? 's' : ''}\n`;
    if (moderateCounts > 0) response += `• ${moderateCounts} moderate symptom${moderateCounts > 1 ? 's' : ''}\n`;
    if (mildCounts > 0) response += `• ${mildCounts} mild symptom${mildCounts > 1 ? 's' : ''}\n`;
    
    response += `\n⏰ Duration: These symptoms have been present for ${daysSince} day${daysSince !== 1 ? 's' : ''}.\n\n`;
    
    if (severeCounts > 0) {
      response += `🚨 Immediate Attention Recommended:\nYour severe symptoms require prompt medical evaluation. Please consider consulting a healthcare professional as soon as possible.\n\n`;
    } else if (moderateCounts > 1) {
      response += `⚠️ Medical Consultation Suggested:\nWith multiple moderate symptoms, it would be wise to schedule an appointment with your healthcare provider within the next few days.\n\n`;
    } else {
      response += `✅ Monitor and Self-Care:\nYour symptoms appear manageable. Continue monitoring and consider basic self-care measures.\n\n`;
    }
    
    response += `💡 Recommendations:\n`;
    response += `• Keep a symptom diary to track changes\n`;
    response += `• Stay hydrated and get adequate rest\n`;
    response += `• Avoid known triggers if applicable\n`;
    if (severeCounts > 0) {
      response += `• Seek immediate medical attention if symptoms worsen\n`;
    }
    
    response += `\n⚠️ Important Disclaimer: This analysis is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.`;
    
    return response;
  };

  const refreshData = async () => {
    await loadHistoryFromBackend();
    addToast('Data refreshed', { type: 'success', duration: 2000 });
  };

  const getProgressPercentage = () => {
    if (currentStep === 'input') return 0;
    if (currentStep === 'finding-illness') return 25;
    if (currentStep === 'finding-drugs') return 50;
    if (currentStep === 'finding-products') return 100;
    return 0;
  };

  const addToHistory = (description: string, diagnosis: string,username : string) => {
    const newHistoryItem: IHistoryItem = {
      id: Date.now().toString(),
      since: new Date().toISOString().split('T')[0],
      description: description || '',
      symptoms: symptoms,
      diagnosis: diagnosis || '',
      status: 'completed',
      severity: symptoms.length > 0 ? symptoms[0].severity : 'mild'
    };
    
    const assessment: IHealthAssessment = {
      id: newHistoryItem.id,
      description: newHistoryItem.description || '',
      symptoms: symptoms,
      since: newHistoryItem.since || ''
    };
    
    addHistoryMutation.mutate({assessment, username});
  };

  const clearHistory = async () => {
    await clearAllHistoryMutation.mutate();
  };

  return {
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
    isLoading,
    connectionStatus,
    startDiagnostic,
    addToSymptomList,
    removeFromSymptomList,
    clearSymptomList,
    getProgressPercentage,
    addToHistory,
    clearHistory,
    loadHistoryFromBackend,
    refreshData,
    testConnection,
    addSymptomMutation,
    getHistoryMutation,
    addHistoryMutation,
    deleteHistoryMutation,
    clearAllHistoryMutation,
  };
};
