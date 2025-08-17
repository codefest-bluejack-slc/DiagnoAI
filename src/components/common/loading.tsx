import '../../styles/loading.css';
import React from 'react';

export function Loading() {
  return (
    <div className="loader-container">
      <svg
        className="diagnoai-loader"
        viewBox="-10 -10 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="network">
          {/* Connecting Lines (yang bagian luar)*/}
          {/* Nodes (buletannya) */}
          <circle className="node" cx="20" cy="20" r="4" />
          <circle className="node" cx="50" cy="10" r="5" />
          <circle className="node" cx="80" cy="20" r="4" />
          <circle className="node" cx="90" cy="50" r="5" />
          <circle className="node" cx="80" cy="80" r="4" />
          <circle className="node" cx="50" cy="90" r="5" />
          <circle className="node" cx="20" cy="80" r="4" />
          <circle className="node" cx="10" cy="50" r="5" />
        </g>
      </svg>
    </div>
  );
}
