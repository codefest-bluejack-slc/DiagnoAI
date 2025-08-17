import { useState, useEffect } from 'react';
import { ISymptom, IHealthAssessment } from '../interfaces/IDiagnostic';
import { useService } from './use-service';
import { useMutation } from './use-mutation';
import { Symptom } from '../declarations/symptom/symptom.did';

const ASSESSMENTS_STORAGE_KEY = 'diagnoai_assessments';
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
  const { symptomService, historyService } = useService();

  useEffect(() => {
    const savedAssessments = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
    if (savedAssessments) {
      try {
        const parsedAssessments = JSON.parse(savedAssessments);
        setAssessments(parsedAssessments);
      } catch (error) {
        console.error('Error parsing saved assessments:', error);
        localStorage.removeItem(ASSESSMENTS_STORAGE_KEY);
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
    localStorage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(assessments));
  }, [assessments]);

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
      setNewDescription('');
      setNewSince('');
      setSymptoms([]);
      setShowAddForm(false);
    }
  };

  const removeAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((assessment) => assessment.id !== id));
  };

  const updateAssessment = (id: string, updatedAssessment: Partial<IHealthAssessment>) => {
    setAssessments((prev) => prev.map(assessment => 
      assessment.id === id ? { ...assessment, ...updatedAssessment } : assessment
    ));
  };

  const clearAllAssessments = () => {
    setAssessments([]);
    setSymptoms([]);
    localStorage.removeItem(ASSESSMENTS_STORAGE_KEY);
  };

  const getProgressPercentage = () => {
    return Math.min(assessments.length * 12.5, 100);
  };

  const addToHistory = (title: string, diagnosis: string) => {
    const newHistoryItem: IHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title,
      symptoms: symptoms.map(s => s.name),
      diagnosis,
      status: 'completed',
      severity: symptoms.length > 0 ? symptoms[0].severity : 'mild'
    };
    
    setHistory(prev => [newHistoryItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
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
  };
};
