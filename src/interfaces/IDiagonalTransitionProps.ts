export interface IDiagonalTransitionProps {
  isTransitioning: boolean;
  onTransitionComplete: () => void;
  onTransitionEnd?: () => void;
}
