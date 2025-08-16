import { ReactNode } from 'react';

export type IToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface IToast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: ReactNode;
  duration?: number;
  autoClose?: boolean;
  closable?: boolean;
  position?: IToastPosition;
}

export interface IToastOptions {
  type?: IToast['type'];
  title?: string;
  duration?: number;
  autoClose?: boolean;
  closable?: boolean;
  position?: IToast['position'];
}

export interface IToastContext {
  toasts: IToast[];
  addToast: (message: ReactNode, options?: IToastOptions) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}
