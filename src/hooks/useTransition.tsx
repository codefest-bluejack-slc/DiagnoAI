import { useContext } from 'react';
import { ITransitionContextType } from '../interfaces/ITransitionContextType';
import { createContext } from 'react';

export const TransitionContext = createContext<ITransitionContextType | null>(null);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider');
  }
  return context;
};