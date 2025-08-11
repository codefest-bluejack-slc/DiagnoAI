import React from 'react';
import { AnimatedIconProps } from '../../interfaces/IAnimatedIcon';

export const Stethoscope: React.FC<AnimatedIconProps> = ({
  delay = 0,
  finalPosition,
  size = 36,
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
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="rgba(255, 255, 255, 0.7)"
        fill="none"
        strokeWidth="2.5"
      >
        <path
          className="stethoscope-tube"
          d="M35 25 C15 30 25 70 50 85 C 75 70 85 30 65 25"
        />
        <path className="stethoscope-details" d="M35 25 Q30 15 25 20" />
        <path className="stethoscope-details" d="M65 25 Q70 15 75 20" />
        <circle
          className="stethoscope-details"
          cx="50"
          cy="85"
          r="15"
          fill="rgba(255, 255, 255, 0.1)"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="2"
        />
        <circle
          className="stethoscope-details"
          cx="50"
          cy="85"
          r="8"
          strokeWidth="1.5"
          fill="none"
        />
      </g>
    </svg>
  </div>
);
