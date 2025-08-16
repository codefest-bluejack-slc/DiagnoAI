import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { IToast, IToastPosition } from '../../interfaces/IToast';

interface ToastProps {
  toast: IToast;
  onClose: (id: string) => void;
}

const getToastIcon = (type: IToast['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={20} className="text-green-500" />;
    case 'error':
      return <AlertCircle size={20} className="text-red-500" />;
    case 'warning':
      return <AlertTriangle size={20} className="text-yellow-500" />;
    case 'info':
    default:
      return <Info size={20} className="text-blue-500" />;
  }
};

const getToastStyles = (type: IToast['type']) => {
  switch (type) {
    case 'success':
      return 'border-green-200/50 bg-green-50/90 text-green-800';
    case 'error':
      return 'border-red-200/50 bg-red-50/90 text-red-800';
    case 'warning':
      return 'border-yellow-200/50 bg-yellow-50/90 text-yellow-800';
    case 'info':
    default:
      return 'border-blue-200/50 bg-blue-50/90 text-blue-800';
  }
};

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Progress bar animation
    if (toast.autoClose && toast.duration) {
      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / (toast.duration || 3000)) * 100);
        setProgress(remaining);
        
        if (remaining > 0 && !isExiting) {
          requestAnimationFrame(updateProgress);
        }
      };
      requestAnimationFrame(updateProgress);

      // Start exit animation before removal
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onClose(toast.id), 300);
      }, toast.duration - 300);

      return () => clearTimeout(exitTimer);
    }
  }, [toast.autoClose, toast.duration, toast.id, onClose, isExiting]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 300);
  };

  return (
    <div 
      className={`
        relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm
        shadow-lg transition-all duration-300 ease-out
        ${getToastStyles(toast.type)}
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100 scale-100' : ''}
        ${!isVisible ? 'translate-x-full opacity-0 scale-95' : ''}
        ${isExiting ? 'translate-x-full opacity-0 scale-95' : ''}
      `}
      style={{
        transform: isVisible && !isExiting ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.95)',
        opacity: isVisible && !isExiting ? 1 : 0,
      }}
    >
      <div className="relative">
        {getToastIcon(toast.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-semibold text-sm mb-1">
            {toast.title}
          </div>
        )}
        <div className="text-sm">
          {typeof toast.message === 'string' ? toast.message : toast.message}
        </div>
      </div>

      {toast.closable && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

const getPositionClasses = (position: IToastPosition): string => {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4';
    case 'top-center':
      return 'top-4 left-1/2 -translate-x-1/2';
    case 'top-right':
      return 'top-4 right-4';
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'bottom-center':
      return 'bottom-4 left-1/2 -translate-x-1/2';
    case 'bottom-right':
      return 'bottom-4 right-4';
    default:
      return 'top-4 right-4';
  }
};

interface ToastContainerProps {
  toasts: IToast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<IToastPosition, IToast[]>);

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`fixed z-50 max-w-sm w-full space-y-2 ${getPositionClasses(position as IToastPosition)}`}
        >
          {positionToasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={onClose} />
          ))}
        </div>
      ))}
    </>
  );
};

export default Toast;
