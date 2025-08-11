import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/navbar';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles] = useState(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2
    }))
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ 
      background: 'linear-gradient(to bottom right, var(--background-dark), var(--primary-purple-darker), var(--tertiary-indigo-darker))',
      fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif" 
    }}>
      
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: 'var(--primary-purple-500)' }}></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full blur-3xl animate-pulse [animation-delay:1s]" style={{ background: 'var(--secondary-pink-300)' }}></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl animate-pulse [animation-delay:2s]" style={{ background: 'var(--tertiary-indigo-400)' }}></div>
      </div>
      
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--primary-purple-200) 0%, transparent 50%)`
        }}
      ></div>
      
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              background: 'var(--text-secondary)'
            }}
          />
        ))}
      </div>
      
      <Navbar />
      
      <main className="relative z-10 min-h-screen">
      </main>
    </div>
  );
}
