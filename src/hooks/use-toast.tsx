import { useState, useCallback, useRef } from 'react';
import { IToast, IToastOptions } from '../interfaces/IToast';

export const useToast = () => {
  const [toasts, setToasts] = useState<IToast[]>([]);
  const toastIdRef = useRef(0);

  const generateId = useCallback((): string => {
    return `toast-${++toastIdRef.current}-${Date.now()}`;
  }, []);

  const addToast = useCallback((message: React.ReactNode, options: IToastOptions = {}): string => {
    const id = generateId();
    const toast: IToast = {
      id,
      message,
      type: options.type || 'info',
      title: options.title,
      duration: options.duration || 4000,
      autoClose: options.autoClose !== false,
      closable: options.closable !== false,
      position: options.position || 'top-right',
    };

    setToasts(prev => [...prev, toast]);

    if (toast.autoClose && toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, [generateId]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
  };
};
