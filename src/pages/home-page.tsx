import React, { useState } from 'react';
import Navbar from '../components/common/navbar';
import HeroSection from '../components/sections/hero-section';
import ScrollMarquee from '../components/sections/scroll-marquee';
import { useMouseTracking } from '../hooks/use-mouse-tracking';
import '../styles/diagnostic-page.css';

export default function HomePage() {
  const mousePosition = useMouseTracking();
  const [particles] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      size: 0.2 + Math.random() * 0.3,
    })),
  );

  return (
    <div className="diagnostic-container">
      <div className="background-orbs">
        <div className="background-orb-1"></div>
        <div className="background-orb-2"></div>
        <div className="background-orb-3"></div>
      </div>

      <div
        className="mouse-glow"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--primary-purple-200) 0%, transparent 50%)`,
        }}
      ></div>

      <div className="floating-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              width: `${particle.size}rem`,
              height: `${particle.size}rem`,
            }}
          />
        ))}
      </div>

      <Navbar />
      
      <main>
        <section className="h-screen flex items-center">
          <div className="w-full">
            <HeroSection />
          </div>
        </section>
        
        <ScrollMarquee />
      </main>
    </div>
  );
}
