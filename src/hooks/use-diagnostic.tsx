import { useState } from 'react';
import { ISymptom } from '../interfaces/IDiagnostic';

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
    const maxSymptoms = 8;
    return Math.min((symptoms.length / maxSymptoms) * 100, 100);
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
