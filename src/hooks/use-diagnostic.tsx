import { useState, useEffect } from 'react';
import { ISymptom, IHealthAssessment } from '../interfaces/IDiagnostic';
import { IHistoryItem } from '../interfaces/IHistoryModal';
import { useService } from './use-service';
import { useMutation } from './use-mutation';
import { useToast } from './use-toast';
import { Symptom } from '../declarations/symptom/symptom.did';

export const useDiagnostic = () => {
  const [assessments, setAssessments] = useState<IHealthAssessment[]>([]);
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
      
      const assessmentData: IHealthAssessment[] = historyData.map(item => ({
        id: item.id,
        description: item.description || '',
        symptoms: Array.isArray(item.symptoms) ? item.symptoms.filter((symptom): symptom is ISymptom => 
          typeof symptom === 'object' && 'name' in symptom && 'severity' in symptom
        ) : [],
        since: item.since || item.date || ''
      }));
      
      setAssessments(assessmentData);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error loading history from backend:', error);
      setHistory([]);
      setAssessments([]);
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

  const addAssessment = async () => {
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

    const assessment: IHealthAssessment = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      description: newDescription.trim(),
      symptoms: [...symptoms],
      since: newSince,
    };

    try {
      setIsLoading(true);
      
      await addHistoryMutation.mutate(assessment);
      
      const symptomPromises = symptoms.map((symptom) =>
        addSymptomMutation.mutate({
          name: symptom.name,
          severity: symptom.severity,
          historyId: assessment.id
        })
      );
      
      await Promise.allSettled(symptomPromises);
      
      setAssessments((prev) => [...prev, assessment]);
      setNewDescription('');
      setNewSince('');
      setSymptoms([]);
      setShowAddForm(false);
      
      await loadHistoryFromBackend();
      
    } catch (error) {
      console.error('Error adding assessment:', error);
      addToast('Failed to save assessment', { type: 'error', title: 'Save Error' });
    } finally {
      setIsLoading(false);
    }
  };

  const removeAssessment = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteHistoryMutation.mutate(id);
      setAssessments((prev) => prev.filter((assessment) => assessment.id !== id));
    } catch (error) {
      console.error('Error removing assessment:', error);
      addToast('Failed to remove assessment', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAssessment = async (id: string, updatedAssessment: Partial<IHealthAssessment>) => {
    if (updatedAssessment.description && updatedAssessment.description.trim().length < 10) {
      addToast('Description must be at least 10 characters long', { type: 'warning', title: 'Validation Error' });
      return;
    }
    
    if (updatedAssessment.description && updatedAssessment.description.trim().length > 500) {
      addToast('Description must be less than 500 characters', { type: 'warning', title: 'Validation Error' });
      return;
    }
    
    if (updatedAssessment.since) {
      const selectedDate = new Date(updatedAssessment.since);
      const today = new Date();
      if (selectedDate > today) {
        addToast('Date cannot be in the future', { type: 'warning', title: 'Validation Error' });
        return;
      }
    }
    
    if (updatedAssessment.symptoms && updatedAssessment.symptoms.length === 0) {
      addToast('At least one symptom is required', { type: 'warning', title: 'Validation Error' });
      return;
    }
    
    if (updatedAssessment.symptoms && updatedAssessment.symptoms.length > 20) {
      addToast('Maximum 20 symptoms allowed', { type: 'warning', title: 'Validation Error' });
      return;
    }

    try {
      setIsLoading(true);
      await historyService.updateHistory(id, updatedAssessment);
      setAssessments((prev) => prev.map(assessment => 
        assessment.id === id ? { ...assessment, ...updatedAssessment } : assessment
      ));
      addToast('Assessment updated successfully', { type: 'success', title: 'Update Success' });
      await loadHistoryFromBackend();
    } catch (error) {
      console.error('Error updating assessment:', error);
      addToast('Failed to update assessment', { type: 'error', title: 'Update Error' });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadHistoryFromBackend();
    addToast('Data refreshed', { type: 'success', duration: 2000 });
  };

  const clearAllAssessments = async () => {
    try {
      setIsLoading(true);
      await clearAllHistoryMutation.mutate();
      setAssessments([]);
      setSymptoms([]);
    } catch (error) {
      console.error('Error clearing assessments:', error);
      addToast('Failed to clear all assessments', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = () => {
    return Math.min(assessments.length * 12.5, 100);
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
    assessments,
    setAssessments,
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
    addAssessment,
    removeAssessment,
    updateAssessment,
    addToSymptomList,
    removeFromSymptomList,
    clearSymptomList,
    clearAllAssessments,
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
