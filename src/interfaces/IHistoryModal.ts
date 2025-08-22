import { ISymptom } from './IDiagnostic';

export interface IMedicine {
  brand_name: string;
  generic_name: string;
  manufacturer: string;
  product_ndc: string;
}

export interface IHistoryItem {
  id: string;
  userId: string;
  username: string;
  diagnosis: string;
  medicine_response: string;
  medicines: IMedicine[];
  symptoms: ISymptom[];
  date?: string;
  status?: 'completed' | 'in-progress';
  severity?: 'mild' | 'moderate' | 'severe';
}

export interface IHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyData: IHistoryItem[];
  onClearHistory: () => Promise<void>;
  isLoading?: boolean;
}
