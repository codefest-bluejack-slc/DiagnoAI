import React from 'react';
import { AnimatedIconProps } from '../../interfaces/IAnimatedIcon';

export const TestTube: React.FC<AnimatedIconProps> = ({
  delay = 0,
  finalPosition,
  size = 26,
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
        <path
          className="test-tube-body"
          d="M40 20 H 60 V 70 C 60 78, 52 78, 50 78 S 40 78, 40 70 Z"
        />
        <rect
          x="42"
          y="55"
          width="16"
          height="20"
          rx="3"
          fill="rgba(255, 255, 255, 0.15)"
        />
        <g fill="rgba(255, 255, 255, 0.3)">
          <circle className="bubble bubble-1" cx="45" cy="68" r="1.5" />
          <circle className="bubble bubble-2" cx="53" cy="65" r="2" />
          <circle className="bubble bubble-3" cx="48" cy="62" r="1" />
        </g>
        <line
          x1="42"
          y1="22"
          x2="58"
          y2="22"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  </div>
);
