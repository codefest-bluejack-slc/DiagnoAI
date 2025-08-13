import { ReactNode, ReactElement } from 'react';

export interface ITooltip {
  content: ReactNode;
  children: ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  className?: string;
  disabled?: boolean;
}
