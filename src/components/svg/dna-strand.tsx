import React from 'react';
import { AnimatedIconProps } from '../../interfaces/IAnimatedIcon';

export const DNAStrand: React.FC<AnimatedIconProps> = ({
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
        strokeLinecap="round"
        stroke="rgba(255, 255, 255, 0.6)"
        fill="none"
        strokeWidth="2"
      >
        <path
          className="dna-strand"
          d="M40 10 C 60 30, 20 50, 40 70 S 80 90, 60 110"
        />
        <path
          className="dna-strand"
          d="M60 10 C 40 30, 80 50, 60 70 S 20 90, 40 110"
        />
        <line
          className="dna-rung"
          x1="40"
          y1="24"
          x2="54"
          y2="20"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
        />
        <line
          className="dna-rung"
          x1="33"
          y1="40"
          x2="59"
          y2="40"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
        />
        <line
          className="dna-rung"
          x1="40"
          y1="56"
          x2="60"
          y2="60"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
        />
        <line
          className="dna-rung"
          x1="40"
          y1="84"
          x2="54"
          y2="80"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  </div>
);
