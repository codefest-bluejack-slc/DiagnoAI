import React from 'react';
import { AnimatedIconProps } from '../../interfaces/IAnimatedIcon';

export const Syringe: React.FC<AnimatedIconProps> = ({
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
        stroke="rgba(255, 255, 255, 0.7)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path className="syringe-body" d="M 60 80 V 25 H 40 V 80" />
        <path className="syringe-body" d="M50 80 L 50 95 L 55 100" />
        <rect
          className="syringe-liquid-action"
          x="42"
          y="22"
          width="16"
          height="55"
          rx="3"
          fill="rgba(255, 255, 255, 0.15)"
        />
        <g className="syringe-plunger-action">
          <path
            d="M50 22 V 5"
            stroke="rgba(255, 255, 255, 0.7)"
            strokeWidth="2"
          />
          <rect
            x="35"
            y="0"
            width="30"
            height="8"
            rx="4"
            fill="rgba(255, 255, 255, 0.6)"
          />
        </g>
      </g>
    </svg>
  </div>
);
