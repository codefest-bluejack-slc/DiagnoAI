import '../../styles/loading.css';
import React from 'react';

export function Loading() {
    return (
    <div className="loader-container">
      <svg className="diagnoai-loader" viewBox="-10 -10 120 120" xmlns="http://www.w3.org/2000/svg">
        <g className="network">
          {/* Connecting Lines (yang bagian luar)*/}
          <path className="line" d="M 20 20 L 50 10 L 80 20 L 90 50 L 80 80 L 50 90 L 20 80 L 10 50 Z" />

          {/* Nodes (buletannya) */}
          <circle className="node" cx="20" cy="20" r="4"/>
          <circle className="node" cx="50" cy="10" r="5"/>
          <circle className="node" cx="80" cy="20" r="4"/>
          <circle className="node" cx="90" cy="50" r="5"/>
          <circle className="node" cx="80" cy="80" r="4"/>
          <circle className="node" cx="50" cy="90" r="5"/>
          <circle className="node" cx="20" cy="80" r="4"/>
          <circle className="node" cx="10" cy="50" r="5"/>
        </g>

        {/* + ditengah */}
        <path className="plus" d="M50 35 V65 M35 50 H65" />
      </svg>
    </div>
  );
}