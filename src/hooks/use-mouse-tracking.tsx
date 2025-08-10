import { useState, useEffect } from 'react';
import { IMousePosition } from '../interfaces/IDiagnostic';

export const useMouseTracking = () => {
  const [mousePosition, setMousePosition] = useState<IMousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
};
