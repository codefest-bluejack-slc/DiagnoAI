export interface IHistoryItem {
  id: string;
  date: string;
  title: string;
  symptoms: string[];
  diagnosis: string;
  status: 'completed' | 'in-progress';
  severity: 'mild' | 'moderate' | 'severe';
}

export interface IHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyData: IHistoryItem[];
  onClearHistory: () => void;
}
