import React, { useEffect, useState } from 'react';
import { Stethoscope, Syringe, Hospital, HeartPulse, Pill, TestTube, Shield, UserCheck, Activity, Cross, Microscope } from 'lucide-react';
import '../../styles/welcome-sections.css';

export const WelcomeSections: React.FC = () => {
  const [medicinalIcons, setMedicinalIcons] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const iconComponents = [
      Hospital,
      Stethoscope,
      HeartPulse,
      Syringe,
      Shield,
      Pill,
      TestTube,
      UserPlus,
      Activity,
      Cross,
      Zap,
    ];

    let particleId = 0;
    let activeParticles: JSX.Element[] = [];

    const generateParticle = () => {
      const IconComponent = iconComponents[particleId % iconComponents.length];

      const angle = Math.random() * 2 * Math.PI;
      const distance = 60;

      const finalPosition = {
        x: 50 + distance * Math.cos(angle),
        y: 50 + distance * Math.sin(angle),
      };

      const newParticle = (
        <div
          key={`particle-${particleId}`}
          className="medical-particle"
          style={
            {
              '--final-x': `${finalPosition.x}%`,
              '--final-y': `${finalPosition.y}%`,
              animationDelay: `${Math.random() * 2}s`,
            } as React.CSSProperties
          }
        >
          <IconComponent size={24 + Math.random() * 32} color="#fff" />
        </div>
      );

      activeParticles.push(newParticle);
      particleId++;

      if (activeParticles.length > 24) {
        activeParticles = activeParticles.slice(-24);
      }

      setMedicinalIcons([...activeParticles]);
    };

    for (let i = 0; i < 8; i++) {
      setTimeout(() => generateParticle(), i * 200);
    }

    const interval = setInterval(generateParticle, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome-sections relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid-pattern"></div>
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-blue-900/20"></div>
      
      {/* Animated particles */}
      <div className="medical-particles-container">{medicinalIcons}</div>

      {/* Floating accent elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-20 w-1 h-1 bg-blue-400/40 rounded-full animate-ping"></div>
      <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-pink-400/20 rounded-full animate-bounce"></div>
      
      <div className="welcome-content relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="max-w-5xl mx-auto">
          {/* Medical badge indicator */}
          <div className="inline-flex items-center px-4 py-2 mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-300">
            <Cross className="w-4 h-4 mr-2 text-emerald-400" />
            AI-Powered Medical Platform
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent font-extrabold">
              DiagnoAI
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300/90 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Experience the future of healthcare with our advanced AI-powered diagnostic platform. 
            Get precise health insights, discover optimal treatments, and connect with medical professionals 
            through our intelligent ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-2xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 border-0">
              <span className="flex items-center justify-center">
                <Activity className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Start Diagnosis
              </span>
            </button>
            <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>

          {/* Feature indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <HeartPulse className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">Real-time Analysis</h3>
              <p className="text-gray-400 text-sm text-center">Instant health assessments powered by advanced AI algorithms</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <Shield className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-400 text-sm text-center">Your health data is protected with enterprise-grade security</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <Zap className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-sm text-center">Get comprehensive results in seconds, not hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
