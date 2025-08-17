import { useState, useEffect } from 'react';
import { ISymptom } from '../interfaces/IDiagnostic';
import { useService } from './use-service';
import { useMutation } from './use-mutation';
import { Symptom } from '../declarations/symptom/symptom.did';
import { v4 as uuidv4 } from 'uuid';

const SYMPTOMS_STORAGE_KEY = 'diagnoai_symptoms';
const HISTORY_STORAGE_KEY = 'diagnoai_history';

export interface IHistoryItem {
  id: string;
  date: string;
  title: string;
  symptoms: string[];
  diagnosis: string;
  status: 'completed' | 'in-progress';
  severity: 'mild' | 'moderate' | 'severe';
}

export const useDiagnostic = () => {
  const [symptoms, setSymptoms] = useState<ISymptom[]>([]);
  const [history, setHistory] = useState<IHistoryItem[]>([]);
  const [newSymptomIllness, setNewSymptomIllness] = useState('');
  const [newSymptomDescription, setNewSymptomDescription] = useState('');
  const [newSymptomSeverity, setNewSymptomSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [newSymptomSince, setNewSymptomSince] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'input' | 'review' | 'analysis'
  >('input');
  const { symptomService, historyService } = useService();

  useEffect(() => {
    const savedSymptoms = localStorage.getItem(SYMPTOMS_STORAGE_KEY);
    if (savedSymptoms) {
      try {
        const parsedSymptoms = JSON.parse(savedSymptoms);
        setSymptoms(parsedSymptoms);
      } catch (error) {
        console.error('Error parsing saved symptoms:', error);
        localStorage.removeItem(SYMPTOMS_STORAGE_KEY);
      }
    }

    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      } catch (error) {
        console.error('Error parsing saved history:', error);
        localStorage.removeItem(HISTORY_STORAGE_KEY);
        setHistory([
          {
            id: '1',
            date: '2024-12-15',
            title: 'Headache Analysis',
            symptoms: ['Migraine', 'Nausea'],
            diagnosis: 'Tension Headache',
            status: 'completed',
            severity: 'moderate'
          },
          {
            id: '2',
            date: '2024-12-10',
            title: 'Back Pain Assessment',
            symptoms: ['Lower Back Pain', 'Stiffness'],
            diagnosis: 'Muscle Strain',
            status: 'completed',
            severity: 'mild'
          },
          {
            id: '3',
            date: '2024-12-08',
            title: 'Fever Symptoms',
            symptoms: ['High Temperature', 'Chills', 'Fatigue'],
            diagnosis: 'Viral Infection',
            status: 'completed',
            severity: 'severe'
          },
          {
            id: '4',
            date: '2024-12-05',
            title: 'Stomach Issues',
            symptoms: ['Abdominal Pain', 'Bloating'],
            diagnosis: 'Indigestion',
            status: 'completed',
            severity: 'mild'
          },
          {
            id: '5',
            date: '2024-12-01',
            title: 'Sleep Problems',
            symptoms: ['Insomnia', 'Restlessness'],
            diagnosis: 'Sleep Disorder',
            status: 'in-progress',
            severity: 'moderate'
          }
        ]);
      }
    } else {
      setHistory([
        {
          id: '1',
          date: '2024-12-15',
          title: 'Headache Analysis',
          symptoms: ['Migraine', 'Nausea'],
          diagnosis: 'Tension Headache',
          status: 'completed',
          severity: 'moderate'
        },
        {
          id: '2',
          date: '2024-12-10',
          title: 'Back Pain Assessment',
          symptoms: ['Lower Back Pain', 'Stiffness'],
          diagnosis: 'Muscle Strain',
          status: 'completed',
          severity: 'mild'
        },
        {
          id: '3',
          date: '2024-12-08',
          title: 'Fever Symptoms',
          symptoms: ['High Temperature', 'Chills', 'Fatigue'],
          diagnosis: 'Viral Infection',
          status: 'completed',
          severity: 'severe'
        },
        {
          id: '4',
          date: '2024-12-05',
          title: 'Stomach Issues',
          symptoms: ['Abdominal Pain', 'Bloating'],
          diagnosis: 'Indigestion',
          status: 'completed',
          severity: 'mild'
        },
        {
          id: '5',
          date: '2024-12-01',
          title: 'Sleep Problems',
          symptoms: ['Insomnia', 'Restlessness'],
          diagnosis: 'Sleep Disorder',
          status: 'in-progress',
          severity: 'moderate'
        }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SYMPTOMS_STORAGE_KEY, JSON.stringify(symptoms));
  }, [symptoms]);

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

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
    if (newSymptomDescription.trim()) {
      const symptom: ISymptom = {
        id: Date.now().toString(),
        illness: 'General Assessment',
        description: newSymptomDescription.trim(),
        severity: newSymptomSeverity,
        since: newSymptomSince.trim() || undefined,
      };

      setSymptoms((prev) => [...prev, symptom]);
      setNewSymptomIllness('');
      setNewSymptomDescription('');
      setNewSymptomSeverity('mild');
      setNewSymptomSince('');
      setShowAddForm(false);
    }
  };

  const removeSymptom = (id: string) => {
    setSymptoms((prev) => prev.filter((symptom) => symptom.id !== id));
  };

  const updateSymptom = (id: string, updatedSymptom: Partial<ISymptom>) => {
    setSymptoms((prev) => prev.map(symptom => 
      symptom.id === id ? { ...symptom, ...updatedSymptom } : symptom
    ));
  };

  const clearAllSymptoms = () => {
    setSymptoms([]);
    localStorage.removeItem(SYMPTOMS_STORAGE_KEY);
  };

  const getProgressPercentage = () => {
    return Math.min(symptoms.length * 12.5, 100);
  };

  const addToHistory = (title: string, diagnosis: string) => {
    const newHistoryItem: IHistoryItem = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      title,
      symptoms: symptoms.map(s => s.illness),
      diagnosis,
      status: 'completed',
      severity: symptoms.length > 0 ? symptoms[0].severity || 'mild' : 'mild'
    };
    
    setHistory(prev => [newHistoryItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  return {
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
  };
};
