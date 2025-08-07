import { useEffect, useState } from 'react';
import '../../styles/diagonal-transition.css';

interface DiagonalTransitionProps {
  isTransitioning: boolean;
  onTransitionComplete: () => void;
  onTransitionEnd?: () => void;
}

export default function DiagonalTransition({ 
  isTransitioning, 
  onTransitionComplete, 
  onTransitionEnd 
}: DiagonalTransitionProps) {
  const [animationPhase, setAnimationPhase] = useState<'closing' | 'opening' | 'idle'>('idle');

  useEffect(() => {
    if (isTransitioning) {
      setAnimationPhase('closing');
      
      const closeTimer = setTimeout(() => {
        onTransitionComplete();
        setAnimationPhase('opening');
      }, 400);

      const openTimer = setTimeout(() => {
        setAnimationPhase('idle');
        if (onTransitionEnd) {
          onTransitionEnd();
        }
      }, 800);

      return () => {
        clearTimeout(closeTimer);
        clearTimeout(openTimer);
      };
    }
  }, [isTransitioning, onTransitionComplete, onTransitionEnd]);

  if (animationPhase === 'idle') return null;

  return (
    <div className="diagonal-transition">
      <div 
        className={`diagonal-overlay-left ${
          animationPhase === 'closing' ? 'diagonal-closing-left' : 'diagonal-opening-left'
        }`}
      />
      <div 
        className={`diagonal-overlay-right ${
          animationPhase === 'closing' ? 'diagonal-closing-right' : 'diagonal-opening-right'
        }`}
      />
    </div>
  );
}
