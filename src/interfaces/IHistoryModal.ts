import { ISymptom } from './IDiagnostic';

export interface IHistoryItem {
  id: string;
  date?: string;
  since?: string;
  title?: string;
  description?: string;
  symptoms: ISymptom[] | string[];
  diagnosis?: string;
  status: 'completed' | 'in-progress';
  severity: 'mild' | 'moderate' | 'severe';
}

export interface IHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyData: IHistoryItem[];
  onClearHistory: () => Promise<void>;
  isLoading?: boolean;
}
