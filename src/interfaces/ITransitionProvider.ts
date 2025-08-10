import { ReactNode } from 'react';

export interface ITransitionProvider {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}
