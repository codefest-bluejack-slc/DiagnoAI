import { useState } from 'react';
import { ISymptom } from '../interfaces/IDiagnostic';
import { useService } from './use-service';
import { useMutation } from './use-mutation';
import { Symptom } from '../declarations/symptom/symptom.did';
import { v4 as uuidv4 } from 'uuid';

export const useDiagnostic = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [newSymptomDescription, setNewSymptomDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'input' | 'review' | 'analysis'
  >('input');
  const { symptomService } = useService();
  const addSymptomMutation = useMutation({
    mutationFn: (symptom: Symptom) => symptomService.addSymptom(symptom),
    onSuccess: (data) => {
      console.log('Symptom added successfully:', data);
      if (!data) return;
      setSymptoms((prev) => [...prev, data]);
      setNewSymptomDescription('');
      setShowAddForm(false);
    },
    onError: (error) => {
      console.error('Error adding symptom:', error);
    }
  });

  const addSymptom = () => {
    if (newSymptomDescription.trim()) {
      const symptom: Symptom = {
        id: Date.now().toString(),
        description: newSymptomDescription.trim(),
        historyId: uuidv4(),
        severity: 'mild',
        duration: BigInt(0),
      };

      setSymptoms((prev) => [...prev, symptom]);
      setNewSymptomDescription('');
      

      setShowAddForm(false);
    }
  };

  const removeSymptom = (id: string) => {
    setSymptoms((prev) => prev.filter((symptom) => symptom.id !== id));
  };

  const getProgressPercentage = () => {
    const maxSymptoms = 8;
    return Math.min((symptoms.length / maxSymptoms) * 100, 100);
  };

  return {
    symptoms,
    newSymptomDescription,
    setNewSymptomDescription,
    showAddForm,
    setShowAddForm,
    currentStep,
    setCurrentStep,
    addSymptom,
    removeSymptom,
    getProgressPercentage,
  };
};
