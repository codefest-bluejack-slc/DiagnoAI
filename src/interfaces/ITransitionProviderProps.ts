import { ReactNode } from 'react';

export interface ITransitionProviderProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}