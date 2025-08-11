import React from 'react';
import { AnimatedIconProps } from '../../interfaces/IAnimatedIcon';

export const MedicalCross: React.FC<AnimatedIconProps> = ({
  delay = 0,
  finalPosition,
  size = 32,
}) => (
  <div
    className="medical-particle"
    style={
      {
        '--final-x': `${finalPosition.x}%`,
        '--final-y': `${finalPosition.y}%`,
        animationDelay: `${delay}s`,
      } as React.CSSProperties
    }
  >
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g
        className="medical-cross"
        fill="rgba(255, 255, 255, 0.8)"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="1.5"
      >
        <rect x="30" y="10" width="40" height="80" rx="8" />
        <rect x="10" y="30" width="80" height="40" rx="8" />
      </g>
    </svg>
  </div>
);
