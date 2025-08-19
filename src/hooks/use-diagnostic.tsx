import { useState, useEffect } from 'react';
import { ISymptom, IHealthAssessment } from '../interfaces/IDiagnostic';
import { IHistoryItem } from '../interfaces/IHistoryModal';
import { useService } from './use-service';
import { useMutation } from './use-mutation';
import { useToast } from './use-toast';
import { Symptom } from '../declarations/symptom/symptom.did';

export const useDiagnostic = () => {
  const [history, setHistory] = useState<IHistoryItem[]>([]);
  const [newSymptomName, setNewSymptomName] = useState('');
  const [newSymptomSeverity, setNewSymptomSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [newDescription, setNewDescription] = useState('');
  const [newSince, setNewSince] = useState('');
  const [symptoms, setSymptoms] = useState<ISymptom[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'input' | 'review' | 'analysis'
  >('input');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const { symptomService, historyService } = useService();
  const { addToast } = useToast();

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
      setHistory(historyData);
      
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
    mutationFn: async (symptom: { name: string; severity: string; historyId: string }) => {
      const symptomData: Symptom = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        historyId: symptom.historyId,
        name: symptom.name,
        severity: symptom.severity,
      };
      return symptomService.addSymptom(symptomData);
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
        setHistory(data);
      }
    },
    onError: (error) => {
      console.error('Error fetching history:', error);
      setHistory([]);
      addToast('Failed to load history from backend', { type: 'error' });
    }
  });

  const addHistoryMutation = useMutation({
    mutationFn: (assessment: IHealthAssessment) => historyService.addHistory(assessment),
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

  const addToSymptomList = (name: string) => {
    if (!name.trim()) {
      addToast('Symptom name is required', { type: 'warning', title: 'Validation Error' });
      return;
    }
    
    if (name.trim().length < 2) {
      addToast('Symptom name must be at least 2 characters long', { type: 'warning', title: 'Validation Error' });
      return;
    }
    
    if (name.trim().length > 50) {
      addToast('Symptom name must be less than 50 characters', { type: 'warning', title: 'Validation Error' });
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
      severity: newSymptomSeverity,
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

  const startDiagnostic = async (onResponseGenerated?: (response: string) => void) => {
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
      setCurrentStep('analysis');
      addToast('Starting diagnostic analysis...', { type: 'success' });
      
      const response = generateAIResponse(newDescription, symptoms, newSince);
      
      setTimeout(() => {
        onResponseGenerated?.(response);
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error starting diagnostic:', error);
      addToast('Failed to start diagnostic', { type: 'error', title: 'Diagnostic Error' });
      setIsLoading(false);
    }
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
    if (currentStep === 'review') return 50;
    if (currentStep === 'analysis') return 100;
    return 0;
  };

  const addToHistory = (description: string, diagnosis: string) => {
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
    
    addHistoryMutation.mutate(assessment);
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
