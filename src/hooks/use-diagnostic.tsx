import { useState } from 'react';
import { ISymptom } from '../interfaces/IDiagnostic';

export const useDiagnostic = () => {
  const [symptoms, setSymptoms] = useState<ISymptom[]>([]);
  const [newSymptomDescription, setNewSymptomDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentStep, setCurrentStep] = useState<'input' | 'review' | 'analysis'>('input');

  const addSymptom = () => {
    if (newSymptomDescription.trim()) {
      const symptom: ISymptom = {
        id: Date.now().toString(),
        description: newSymptomDescription.trim()
      };
      
      setSymptoms(prev => [...prev, symptom]);
      setNewSymptomDescription('');
      setShowAddForm(false);
    }
  };

  const removeSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(symptom => symptom.id !== id));
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
    getProgressPercentage
  };
};
