import React from 'react';
import { AnimatedIconProps } from '../../interfaces/IAnimatedIcon';

export const Heartbeat: React.FC<AnimatedIconProps> = ({
  delay = 0,
  finalPosition,
  size = 40,
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
    <svg width={size} height={size / 2} viewBox="0 0 100 100">
      <path
        className="ekg-line"
        d="M 5 50 L 25 50 L 35 25 L 45 75 L 55 30 L 65 50 L 95 50"
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
