import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/use-toast';
import { ToastContainer } from '../components/common/toast';
import { IToastContext } from '../interfaces/IToast';

const ToastContext = createContext<IToastContext | undefined>(undefined);

export const useToastContext = (): IToastContext => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, addToast, removeToast, clearAllToasts } = useToast();

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};
  