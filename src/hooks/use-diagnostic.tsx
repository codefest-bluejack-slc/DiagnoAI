import { useState, useEffect } from 'react';
import { ISymptom, IHealthAssessment } from '../interfaces/IDiagnostic';
import { IHistoryItem } from '../interfaces/IHistoryModal';
import { useService } from './use-service';
import { useMutation } from './use-mutation';
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
  const { symptomService, historyService } = useService();

  useEffect(() => {
    loadHistoryFromBackend();
  }, []);

  const loadHistoryFromBackend = async () => {
    try {
      setIsLoading(true);
      const historyData = await historyService.getMyHistories();
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history from backend:', error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addSymptomMutation = useMutation({
    mutationFn: async (symptom: { name: string; severity: string; historyId: string }) => {
      const symptomData: Symptom = {
        id: Date.now().toString(),
        historyId: symptom.historyId,
        name: symptom.name,
        severity: symptom.severity,
      };
      return symptomService.addSymptom(symptomData);
    },
    onSuccess: (data) => {
      console.log('Symptom added successfully:', data);
      if (!data) return;
      setNewSymptomName('');
      setShowAddForm(false);
    },
    onError: (error) => {
      console.error('Error adding symptom:', error);
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
    }
  });

  const addHistoryMutation = useMutation({
    mutationFn: (assessment: IHealthAssessment) => historyService.addHistory(assessment),
    onSuccess: (data) => {
      console.log('History added successfully:', data);
      loadHistoryFromBackend();
    },
    onError: (error) => {
      console.error('Error adding history:', error);
    }
  });

  const deleteHistoryMutation = useMutation({
    mutationFn: (historyId: string) => historyService.deleteHistory(historyId),
    onSuccess: () => {
      console.log('History deleted successfully');
      loadHistoryFromBackend();
    },
    onError: (error) => {
      console.error('Error deleting history:', error);
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
    },
    onError: (error) => {
      console.error('Error clearing all history:', error);
    }
  });

  const addToSymptomList = (name: string) => {
    if (name.trim()) {
      const newSymptom: ISymptom = {
        name: name.trim(),
        severity: newSymptomSeverity,
      };
      setSymptoms((prev) => [...prev, newSymptom]);
      setNewSymptomName('');
    }
  };

  const removeFromSymptomList = (index: number) => {
    setSymptoms((prev) => prev.filter((_, i) => i !== index));
  };

  const clearSymptomList = () => {
    setSymptoms([]);
  };

  const addAssessment = () => {
    if (newDescription.trim() && newSince) {
      const assessment: IHealthAssessment = {
        id: Date.now().toString(),
        description: newDescription.trim(),
        symptoms: [...symptoms],
        since: newSince,
      };

      setAssessments((prev) => [...prev, assessment]);
      
      addHistoryMutation.mutate(assessment);
      
      symptoms.forEach((symptom) => {
        addSymptomMutation.mutate({
          name: symptom.name,
          severity: symptom.severity,
          historyId: assessment.id
        });
      });

      setNewDescription('');
      setNewSince('');
      setSymptoms([]);
      setShowAddForm(false);
    }
  };

  const removeAssessment = (id: string) => {
    deleteHistoryMutation.mutate(id);
    setAssessments((prev) => prev.filter((assessment) => assessment.id !== id));
  };

  const updateAssessment = (id: string, updatedAssessment: Partial<IHealthAssessment>) => {
    historyService.updateHistory(id, updatedAssessment).then(() => {
      loadHistoryFromBackend();
    }).catch((error) => {
      console.error('Error updating assessment:', error);
    });
    setAssessments((prev) => prev.map(assessment => 
      assessment.id === id ? { ...assessment, ...updatedAssessment } : assessment
    ));
  };

  const clearAllAssessments = () => {
    setAssessments([]);
    setSymptoms([]);
  };

  const getProgressPercentage = () => {
    return Math.min(assessments.length * 12.5, 100);
  };

  const addToHistory = (description: string, diagnosis: string) => {
    const newHistoryItem: IHistoryItem = {
      id: Date.now().toString(),
      since: new Date().toISOString().split('T')[0],
      description,
      symptoms: symptoms,
      diagnosis,
      status: 'completed',
      severity: symptoms.length > 0 ? symptoms[0].severity : 'mild'
    };
    
    const assessment: IHealthAssessment = {
      id: newHistoryItem.id,
      description: newHistoryItem.description,
      symptoms: symptoms,
      since: newHistoryItem.since
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
    addSymptomMutation,
    getHistoryMutation,
    addHistoryMutation,
    deleteHistoryMutation,
    clearAllHistoryMutation,
  };
};
