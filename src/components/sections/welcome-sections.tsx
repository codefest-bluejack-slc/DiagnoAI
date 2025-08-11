import React, { useEffect, useState } from 'react';
import '../../styles/welcome-sections.css';

interface AnimatedIconProps {
  delay?: number;
  finalPosition: { x: number; y: number };
  size?: number;
}

const MedicalCross: React.FC<AnimatedIconProps> = ({ delay = 0, finalPosition, size = 32 }) => (
  <div 
    className="medical-particle"
    style={{
      '--final-x': `${finalPosition.x}%`,
      '--final-y': `${finalPosition.y}%`,
      animationDelay: `${delay}s`
    } as React.CSSProperties}
  >
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g className="medical-cross" fill="rgba(255, 255, 255, 0.8)" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5">
        <rect x="30" y="10" width="40" height="80" rx="8"/>
        <rect x="10" y="30" width="80" height="40" rx="8"/>
      </g>
    </svg>
  </div>
);

const Stethoscope: React.FC<AnimatedIconProps> = ({ delay = 0, finalPosition, size = 36 }) => (
  <div 
    className="medical-particle"
    style={{
      '--final-x': `${finalPosition.x}%`,
      '--final-y': `${finalPosition.y}%`,
      animationDelay: `${delay}s`
    } as React.CSSProperties}
  >
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g strokeLinecap="round" strokeLinejoin="round" stroke="rgba(255, 255, 255, 0.7)" fill="none" strokeWidth="2.5">
        <path className="stethoscope-tube" d="M35 25 C15 30 25 70 50 85 C 75 70 85 30 65 25"/>
        <path className="stethoscope-details" d="M35 25 Q30 15 25 20"/>
        <path className="stethoscope-details" d="M65 25 Q70 15 75 20"/>
        <circle className="stethoscope-details" cx="50" cy="85" r="15" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2"/>
        <circle className="stethoscope-details" cx="50" cy="85" r="8" strokeWidth="1.5" fill="none"/>
      </g>
    </svg>
  </div>
);

const DNAStrand: React.FC<AnimatedIconProps> = ({ delay = 0, finalPosition, size = 28 }) => (
  <div 
    className="medical-particle"
    style={{
      '--final-x': `${finalPosition.x}%`,
      '--final-y': `${finalPosition.y}%`,
      animationDelay: `${delay}s`
    } as React.CSSProperties}
  >
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g strokeLinecap="round" stroke="rgba(255, 255, 255, 0.6)" fill="none" strokeWidth="2">
        <path className="dna-strand" d="M40 10 C 60 30, 20 50, 40 70 S 80 90, 60 110"/>
        <path className="dna-strand" d="M60 10 C 40 30, 80 50, 60 70 S 20 90, 40 110"/>
        <line className="dna-rung" x1="40" y1="24" x2="54" y2="20" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5"/>
        <line className="dna-rung" x1="33" y1="40" x2="59" y2="40" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5"/>
        <line className="dna-rung" x1="40" y1="56" x2="60" y2="60" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5"/>
        <line className="dna-rung" x1="40" y1="84" x2="54" y2="80" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5"/>
      </g>
    </svg>
  </div>
);

const Heartbeat: React.FC<AnimatedIconProps> = ({ delay = 0, finalPosition, size = 40 }) => (
  <div 
    className="medical-particle"
    style={{
      '--final-x': `${finalPosition.x}%`,
      '--final-y': `${finalPosition.y}%`,
      animationDelay: `${delay}s`
    } as React.CSSProperties}
  >
    <svg width={size} height={size/2} viewBox="0 0 100 100">
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

const Syringe: React.FC<AnimatedIconProps> = ({ delay = 0, finalPosition, size = 32 }) => (
  <div 
    className="medical-particle"
    style={{
      '--final-x': `${finalPosition.x}%`,
      '--final-y': `${finalPosition.y}%`,
      animationDelay: `${delay}s`
    } as React.CSSProperties}
  >
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path className="syringe-body" d="M 60 80 V 25 H 40 V 80"/>
        <path className="syringe-body" d="M50 80 L 50 95 L 55 100"/>
        <rect className="syringe-liquid-action" x="42" y="22" width="16" height="55" rx="3" fill="rgba(255, 255, 255, 0.15)"/>
        <g className="syringe-plunger-action">
          <path d="M50 22 V 5" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2"/>
          <rect x="35" y="0" width="30" height="8" rx="4" fill="rgba(255, 255, 255, 0.6)"/>
        </g>
      </g>
    </svg>
  </div>
);

const Virus: React.FC<AnimatedIconProps> = ({ delay = 0, finalPosition, size = 30 }) => (
  <div 
    className="medical-particle"
    style={{
      '--final-x': `${finalPosition.x}%`,
      '--final-y': `${finalPosition.y}%`,
      animationDelay: `${delay}s`
    } as React.CSSProperties}
  >
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle className="virus-body" cx="50" cy="50" r="22" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" fill="rgba(255, 255, 255, 0.05)"/>
      <g className="virus-spike" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" strokeLinecap="round">
        <line x1="50" y1="28" x2="50" y2="15"/>
        <line x1="50" y1="72" x2="50" y2="85"/>
        <line x1="28" y1="50" x2="15" y2="50"/>
        <line x1="72" y1="50" x2="85" y2="50"/>
        <line x1="35" y1="35" x2="25" y2="25"/>
        <line x1="65" y1="35" x2="75" y2="25"/>
        <line x1="35" y1="65" x2="25" y2="75"/>
        <line x1="65" y1="65" x2="75" y2="75"/>
      </g>
    </svg>
  </div>
);

const PillBottle: React.FC<AnimatedIconProps> = ({ delay = 0, finalPosition, size = 28 }) => (
  <div 
    className="medical-particle"
    style={{
      '--final-x': `${finalPosition.x}%`,
      '--final-y': `${finalPosition.y}%`,
      animationDelay: `${delay}s`
    } as React.CSSProperties}
  >
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" fill="none" strokeLinecap="round">
        <rect className="pill-bottle" x="30" y="20" width="40" height="12" rx="4"/>
        <path className="pill-bottle" d="M35 32 V 80 C 35 85.5, 39.5 90, 45 90 H 55 C 60.5 90, 65 85.5, 65 80 V 32"/>
        <rect x="33" y="34" width="34" height="48" rx="3" fill="rgba(255, 255, 255, 0.1)"/>
        <g fill="rgba(255, 255, 255, 0.4)">
          <circle className="pill pill-1" cx="45" cy="75" r="3"/>
          <circle className="pill pill-2" cx="55" cy="65" r="3"/>
          <circle className="pill pill-3" cx="43" cy="55" r="3"/>
          <circle className="pill pill-4" cx="52" cy="45" r="2.5"/>
        </g>
      </g>
    </svg>
  </div>
);

const TestTube: React.FC<AnimatedIconProps> = ({ delay = 0, finalPosition, size = 26 }) => (
  <div 
    className="medical-particle"
    style={{
      '--final-x': `${finalPosition.x}%`,
      '--final-y': `${finalPosition.y}%`,
      animationDelay: `${delay}s`
    } as React.CSSProperties}
  >
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" fill="none" strokeLinecap="round">
        <path className="test-tube-body" d="M40 20 H 60 V 70 C 60 78, 52 78, 50 78 S 40 78, 40 70 Z"/>
        <rect x="42" y="55" width="16" height="20" rx="3" fill="rgba(255, 255, 255, 0.15)"/>
        <g fill="rgba(255, 255, 255, 0.3)">
          <circle className="bubble bubble-1" cx="45" cy="68" r="1.5"/>
          <circle className="bubble bubble-2" cx="53" cy="65" r="2"/>
          <circle className="bubble bubble-3" cx="48" cy="62" r="1"/>
        </g>
        <line x1="42" y1="22" x2="58" y2="22" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5"/>
      </g>
    </svg>
  </div>
);

export const WelcomeSections: React.FC = () => {
  const [medicinalIcons, setMedicinalIcons] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const iconComponents = [
      MedicalCross,
      Stethoscope,
      DNAStrand,
      Heartbeat,
      Syringe,
      Virus,
      PillBottle,
      TestTube
    ];

    let particleId = 0;
    let activeParticles: JSX.Element[] = [];

    const generateParticle = () => {
      const IconComponent = iconComponents[particleId % iconComponents.length];
      
      // Random direction for infinite spreading
      const angle = Math.random() * 2 * Math.PI;
      const distance = 150; // Distance to travel beyond viewport
      
      const finalPosition = {
        x: 50 + distance * Math.cos(angle),
        y: 50 + distance * Math.sin(angle)
      };

      const newParticle = (
        <IconComponent
          key={`particle-${particleId}`}
          delay={0}
          finalPosition={finalPosition}
          size={8 + Math.random() * 12} // Start smaller
        />
      );

      activeParticles.push(newParticle);
      particleId++;

      // Remove particles that are old (simulate going off-screen)
      if (activeParticles.length > 24) {
        activeParticles = activeParticles.slice(-24);
      }

      setMedicinalIcons([...activeParticles]);
    };

    // Generate initial burst
    for (let i = 0; i < 8; i++) {
      setTimeout(() => generateParticle(), i * 200);
    }

    // Continuous generation
    const interval = setInterval(generateParticle, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome-sections relative">
      <div className="medical-particles-container">
        {medicinalIcons}
      </div>
      
      <div className="welcome-content relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              DiagnoAI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Advanced AI-powered medical diagnostics and medicine discovery platform. 
            Get instant health insights and find the right medications with our intelligent system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Diagnosis
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};