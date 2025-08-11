import React from 'react';
import { AnimatedIconProps } from '../../interfaces/IAnimatedIcon';

export const Virus: React.FC<AnimatedIconProps> = ({
  delay = 0,
  finalPosition,
  size = 30,
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
      <circle
        className="virus-body"
        cx="50"
        cy="50"
        r="22"
        stroke="rgba(255, 255, 255, 0.7)"
        strokeWidth="2"
        fill="rgba(255, 255, 255, 0.05)"
      />
      <g
        className="virus-spike"
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="50" y1="28" x2="50" y2="15" />
        <line x1="50" y1="72" x2="50" y2="85" />
        <line x1="28" y1="50" x2="15" y2="50" />
        <line x1="72" y1="50" x2="85" y2="50" />
        <line x1="35" y1="35" x2="25" y2="25" />
        <line x1="65" y1="35" x2="75" y2="25" />
        <line x1="35" y1="65" x2="25" y2="75" />
        <line x1="65" y1="65" x2="75" y2="75" />
      </g>
    </svg>
  </div>
);
