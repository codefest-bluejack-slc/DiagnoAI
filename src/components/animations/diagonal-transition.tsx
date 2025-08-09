import { useEffect, useState } from 'react';
import '../../styles/diagonal-transition.css';
import { ITransitionProvider } from '../../interfaces/ITransitionProvider';
import { TransitionContext } from '../../hooks/useTransition';

export function TransitionProvider({ children, currentPage, onPageChange }: ITransitionProvider) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPage, setNextPage] = useState(currentPage);
  const [animationPhase, setAnimationPhase] = useState<'closing' | 'opening' | 'idle'>('idle');
  const [isReverse, setIsReverse] = useState(false);
  const [displayedPage, setDisplayedPage] = useState(currentPage);

  const navigateTo = (page: string) => {
    if (page !== currentPage && !isTransitioning) {
      setNextPage(page);
      setIsTransitioning(true);
    }
  };

  useEffect(() => {
    if (currentPage !== displayedPage && !isTransitioning) {
      setDisplayedPage(currentPage);
    }
  }, [currentPage, displayedPage, isTransitioning]);

  useEffect(() => {
    if (isTransitioning && animationPhase === 'idle') {
      setIsReverse(Math.random() < 0.5);
      setAnimationPhase('closing');
    }
  }, [isTransitioning, animationPhase]);

  const getLeftOverlayClass = () => {
    if (animationPhase === 'closing') {
      return isReverse ? 'diagonal-closing-left-reverse' : 'diagonal-closing-left';
    }
    return isReverse ? 'diagonal-opening-left-reverse' : 'diagonal-opening-left';
  };

  const getRightOverlayClass = () => {
    if (animationPhase === 'closing') {
      return isReverse ? 'diagonal-closing-right-reverse' : 'diagonal-closing-right';
    }
    return isReverse ? 'diagonal-opening-right-reverse' : 'diagonal-opening-right';
  };

  const handleAnimationEnd = () => {
    if (animationPhase === 'closing') {
      setDisplayedPage(nextPage);
      onPageChange(nextPage);
      setAnimationPhase('opening');
    } else if (animationPhase === 'opening') {
      setAnimationPhase('idle');
      setIsTransitioning(false);
    }
  };

  const shouldShowChildren = displayedPage === currentPage || isTransitioning;

  return (
    <TransitionContext.Provider value={{ navigateTo, isTransitioning }}>
      {shouldShowChildren && children}
      {animationPhase !== 'idle' && (
        <div className="diagonal-transition">
          <div 
            className={`diagonal-overlay-left ${getLeftOverlayClass()}`}
            onAnimationEnd={handleAnimationEnd}
          />
          <div className={`diagonal-overlay-right ${getRightOverlayClass()}`} />
        </div>
      )}
    </TransitionContext.Provider>
  );
}
