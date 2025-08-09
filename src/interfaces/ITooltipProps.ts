import { ReactNode, ReactElement } from 'react';

export interface ITooltipProps {
  content: ReactNode;
  children: ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  className?: string;
  arrow?: boolean;
  disabled?: boolean;
  offset?: number;
  maxWidth?: number;
}
