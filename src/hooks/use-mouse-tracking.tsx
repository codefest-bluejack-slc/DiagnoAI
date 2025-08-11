import { useState, useEffect, useCallback } from 'react';
import { IMousePosition } from '../interfaces/IDiagnostic';

export const useMouseTracking = () => {
  const [mousePosition, setMousePosition] = useState<IMousePosition>({
    x: 0,
    y: 0,
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return mousePosition;
};
