import { useState } from 'react';
import { ISymptom } from '../interfaces/IDiagnostic';
import { useService } from './use-service';
import { useMutation } from './use-mutation';
import { Symptom } from '../declarations/symptom/symptom.did';
import { v4 as uuidv4 } from 'uuid';

export const useDiagnostic = () => {
  const [symptoms, setSymptoms] = useState<ISymptom[]>([]);
  const [newSymptomIllness, setNewSymptomIllness] = useState('');
  const [newSymptomDescription, setNewSymptomDescription] = useState('');
  const [newSymptomSeverity, setNewSymptomSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [newSymptomDuration, setNewSymptomDuration] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'input' | 'review' | 'analysis'
  >('input');
  const { symptomService, historyService } = useService();
  const addSymptomMutation = useMutation({
    mutationFn: (symptom: Symptom) => symptomService.addSymptom(symptom),
    onSuccess: (data) => {
      console.log('Symptom added successfully:', data);
      if (!data) return;
      setNewSymptomDescription('');
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
      // if (!data) return;
      // setSymptoms((prev) => [...prev, data]);
    },
    onError: (error) => {
      console.error('Error fetching symptom:', error);
    }
  });

  const addSymptom = () => {
    if (newSymptomIllness.trim() && newSymptomDescription.trim()) {
      const symptom: ISymptom = {
        id: Date.now().toString(),
        illness: newSymptomIllness.trim(),
        description: newSymptomDescription.trim(),
        severity: newSymptomSeverity,
        duration: newSymptomDuration.trim() || undefined,
      };

      setSymptoms((prev) => [...prev, symptom]);
      setNewSymptomIllness('');
      setNewSymptomDescription('');
      setNewSymptomSeverity('mild');
      setNewSymptomDuration('');
      setShowAddForm(false);
    }
  };

  const removeSymptom = (id: string) => {
    setSymptoms((prev) => prev.filter((symptom) => symptom.id !== id));
  };

  const getProgressPercentage = () => {
    return Math.min(symptoms.length * 12.5, 100);
  };

  return {
    symptoms,
    newSymptomIllness,
    setNewSymptomIllness,
    newSymptomDescription,
    setNewSymptomDescription,
    newSymptomSeverity,
    setNewSymptomSeverity,
    newSymptomDuration,
    setNewSymptomDuration,
    showAddForm,
    setShowAddForm,
    currentStep,
    setCurrentStep,
    addSymptom,
    removeSymptom,
    getProgressPercentage,
  };
};
