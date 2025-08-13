import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Stethoscope, 
  Brain, 
  Shield, 
  Plus, 
  Zap, 
  Eye,
  Pill,
  UserCheck,
  Microscope,
  HeartPulse,
} from 'lucide-react';
import { IAnimatedHeroIcon } from '../../interfaces/IAnimatedIcon';

const medicalIcons = [
  Heart, Activity, Stethoscope, Brain, Shield, Plus, 
  Zap, Eye, Pill, UserCheck, Microscope, HeartPulse
];


export default function HeroSection() {
  const [animatedIcons, setAnimatedIcons] = useState<IAnimatedHeroIcon[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const iconsToSpawn = 1 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < iconsToSpawn; i++) {
        setTimeout(() => {
          const IconComponent = medicalIcons[Math.floor(Math.random() * medicalIcons.length)];
          const newIcon : IAnimatedHeroIcon = {
            id: Date.now() + Math.random() + i,
            icon: IconComponent,
            angle: Math.random() * 360,
            duration: 6 + Math.random() * 2,
            delay: Math.random() * 0.5,
            size: 30 + Math.random() * 16,
          };

          setAnimatedIcons(prev => [...prev, newIcon]);

          setTimeout(() => {
            setAnimatedIcons(prev => prev.filter(icon => icon.id !== newIcon.id));
          }, (newIcon.duration + newIcon.delay + 0.5) * 1000);
        }, i * 150);
      }
    }, 500 + Math.random() * 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full px-6 sm:px-8 md:px-12 lg:px-16 text-center relative">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0">
        {animatedIcons.map((iconData) => (
          <div
            key={iconData.id}
            className="absolute animate-icon-expand"
            style={{
              '--angle': `${iconData.angle}deg`,
              '--duration': `${iconData.duration}s`,
              '--delay': `${iconData.delay}s`,
              animationDuration: `${iconData.duration}s`,
              animationDelay: `${iconData.delay}s`,
            } as React.CSSProperties}
          >
            <iconData.icon 
              size={iconData.size} 
              className="text-purple-300/80"
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6 leading-tight">
            <span className="color-text-primary">Diagno</span>
            <span className="color-primary">AI</span>
          </h1>
        </div>
        
        <p className="text-xl sm:text-2xl lg:text-3xl color-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
          Advanced AI-powered diagnostic assistance for healthcare professionals. 
          Precision medicine meets intelligent technology.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button className="bg-primary hover:bg-primary-dark transition-all duration-300 
                           px-8 sm:px-10 py-4 sm:py-5 rounded-xl text-white font-semibold text-lg sm:text-xl
                           shadow-lg hover:shadow-glow transform hover:-translate-y-2 hover:scale-105
                           flex items-center gap-3">
            <Activity size={24} />
            Start Diagnosis
          </button>
          
          <button className="bg-glass hover:bg-glass-hover transition-all duration-300 
                           px-8 sm:px-10 py-4 sm:py-5 rounded-xl color-text-primary font-semibold text-lg sm:text-xl
                           border border-default hover:border-hover transform hover:-translate-y-2 hover:scale-105
                           flex items-center gap-3">
            <Brain size={24} />
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
