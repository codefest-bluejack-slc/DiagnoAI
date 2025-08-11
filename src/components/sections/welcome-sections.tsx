import React, { useEffect, useState } from 'react';
import {
  MedicalCross,
  Stethoscope,
  DNAStrand,
  Heartbeat,
  Syringe,
  Virus,
  PillBottle,
  TestTube,
} from '../svg';
import '../../styles/welcome-sections.css';

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
      TestTube,
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
        y: 50 + distance * Math.sin(angle),
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
      <div className="medical-particles-container">{medicinalIcons}</div>

      <div className="welcome-content relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              DiagnoAI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Advanced AI-powered medical diagnostics and medicine discovery
            platform. Get instant health insights and find the right medications
            with our intelligent system.
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
