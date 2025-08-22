export interface IMedicine {
  brand_name: string;
  generic_name: string;
  manufacturer: string;
  product_ndc: string;
}

export interface ISymptom {
  id: string;
  historyId: string;
  name: string;
  severity: string;
}

export interface IHistory {
  id: string;
  userId: string;
  username: string;
  diagnosis: string;
  medicine_response: string;
  medicines: IMedicine[];
}

export interface IHistoryResponse {
  id: string;
  userId: string;
  username: string;
  diagnosis: string;
  medicines: IMedicine[];
  medicine_response: string;
  symptoms: ISymptom[];
}

export interface IHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyData: IHistoryResponse[];
  onClearHistory: () => Promise<void>;
  isLoading?: boolean;
}
