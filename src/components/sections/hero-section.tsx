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

interface FlyingCharacter {
  id: string;
  char: string;
  startX: number;
  startY: number;
  finalX: number;
  finalY: number;
  delay: number;
  duration: number;
}

export default function HeroSection() {
  const [animatedIcons, setAnimatedIcons] = useState<IAnimatedHeroIcon[]>([]);
  const [flyingChars, setFlyingChars] = useState<FlyingCharacter[]>([]);
  const [titleAnimationComplete, setTitleAnimationComplete] = useState(false);

  useEffect(() => {
    const titleText = "DiagnoAI";
    const chars = titleText.split('');
    
    const flyingCharacters: FlyingCharacter[] = chars.map((char, index) => {
      const side = Math.floor(Math.random() * 4);
      let startX, startY;
      
      const minDistance = 500;
      // tar kalo ganti font sizenya bakalan bug jadinya pake extradistance bwt amanin
      const extraDistance = Math.random() * 800;
      
      switch(side) {
        case 0:
          startX = Math.random() * window.innerWidth;
          startY = -(minDistance + extraDistance);
          break;
        case 1:
          startX = window.innerWidth + minDistance + extraDistance;
          startY = Math.random() * window.innerHeight;
          break;
        case 2:
          startX = Math.random() * window.innerWidth;
          startY = window.innerHeight + minDistance + extraDistance;
          break;
        default:
          startX = -(minDistance + extraDistance);
          startY = Math.random() * window.innerHeight;
          break;
      }
      
      return {
        id: `char-${index}`,
        char,
        startX,
        startY,
        finalX: 0,
        finalY: 0,
        delay: index * 0.08 + Math.random() * 0.2,
        duration: 2.8 + Math.random() * 0.7,
      };
    });

    setFlyingChars(flyingCharacters);

    const maxDelay = Math.max(...flyingCharacters.map(char => char.delay + char.duration));
    setTimeout(() => {
      setTitleAnimationComplete(true);
    }, (maxDelay + 0.5) * 1000);
  }, []);

  useEffect(() => {
    if (!titleAnimationComplete) return;

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
  }, [titleAnimationComplete]);

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

      <div className="relative z-10 max-w-6xl">
        <div className="mb-8 relative">
          <div className="relative inline-block">
            {flyingChars.map((charData, index) => {
              const isDiagno = index < 6;
              const isAI = index >= 6;
              return (
                <span
                  key={charData.id}
                  className={`flying-char inline-block text-10xl sm:text-9xl md:text-10xl lg:text-11xl xl:text-12xl 2xl:text-13xl font-black leading-none tracking-tight ${
                    isDiagno 
                      ? 'color-text-primary font-title-elegant' 
                      : isAI 
                        ? 'color-primary font-title-modern' 
                        : ''
                  }`}
                  style={{
                    '--start-x': `${charData.startX}px`,
                    '--start-y': `${charData.startY}px`,
                    '--final-x': '0px',
                    '--final-y': '0px',
                    '--delay': `${charData.delay}s`,
                    '--duration': `${charData.duration}s`,
                    animationDelay: `${charData.delay}s`,
                    animationDuration: `${charData.duration}s`,
                    animationFillMode: 'both',
                    textShadow: isDiagno 
                      ? '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2)' 
                      : '0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.6), 0 0 90px rgba(168, 85, 247, 0.4)',
                  } as React.CSSProperties}
                >
                  {charData.char}
                </span>
              );
            })}
          </div>
        </div>
        
        <div className={`transition-all duration-1000 delay-500 ${titleAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl color-text-secondary mb-12 leading-relaxed max-w-4xl mx-auto font-medium">
            Advanced AI-powered diagnostic assistance for healthcare professionals. 
            Precision medicine meets intelligent technology.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 transition-all duration-1000 delay-700 ${titleAnimationComplete ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
            <button className="bg-primary hover:bg-primary-dark transition-all duration-300 
                             px-10 sm:px-12 py-5 sm:py-6 rounded-xl text-white font-semibold text-xl sm:text-2xl
                             shadow-lg hover:shadow-glow transform hover:-translate-y-2 hover:scale-105
                             flex items-center gap-4">
              <Activity size={28} />
              Start Diagnosis
            </button>
            
            <button className="bg-glass hover:bg-glass-hover transition-all duration-300 
                             px-10 sm:px-12 py-5 sm:py-6 rounded-xl color-text-primary font-semibold text-xl sm:text-2xl
                             border border-default hover:border-hover transform hover:-translate-y-2 hover:scale-105
                             flex items-center gap-4">
              <Brain size={28} />
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
