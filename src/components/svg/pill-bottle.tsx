import React from 'react';
import { AnimatedIconProps } from '../../interfaces/IAnimatedIcon';

export const PillBottle: React.FC<AnimatedIconProps> = ({
  delay = 0,
  finalPosition,
  size = 28,
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
        stroke="rgba(255, 255, 255, 0.7)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      >
        <rect
          className="pill-bottle"
          x="30"
          y="20"
          width="40"
          height="12"
          rx="4"
        />
        <path
          className="pill-bottle"
          d="M35 32 V 80 C 35 85.5, 39.5 90, 45 90 H 55 C 60.5 90, 65 85.5, 65 80 V 32"
        />
        <rect
          x="33"
          y="34"
          width="34"
          height="48"
          rx="3"
          fill="rgba(255, 255, 255, 0.1)"
        />
        <g fill="rgba(255, 255, 255, 0.4)">
          <circle className="pill pill-1" cx="45" cy="75" r="3" />
          <circle className="pill pill-2" cx="55" cy="65" r="3" />
          <circle className="pill pill-3" cx="43" cy="55" r="3" />
          <circle className="pill pill-4" cx="52" cy="45" r="2.5" />
        </g>
      </g>
    </svg>
  </div>
);
