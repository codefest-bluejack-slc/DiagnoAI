import React, { useEffect, useState, useRef } from 'react';

export default function ScrollMarquee() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const text = "WELCOME TO THE FUTURE OF DIAGNOSTICS • REVOLUTIONIZING HEALTHCARE WITH AI TECHNOLOGY • DIAGNOAI LEADS THE WAY";

  const renderFloatingText = (text: string, index: number) => {
    return text.split('').map((char, charIndex) => (
      <span
        key={`${index}-${charIndex}`}
        className="inline-block gradient-text-glow"
        style={{
          animation: `floatChar 3s ease-in-out infinite`,
          animationDelay: `${(charIndex * 0.1 + index * 0.5)}s`,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      const startPoint = windowHeight;
      const endPoint = -sectionHeight;
      const totalDistance = startPoint - endPoint;
      const currentPosition = sectionTop - endPoint;
      
      const progress = Math.max(0, Math.min(1, 1 - (currentPosition / totalDistance)));
      const movement = progress * window.innerWidth * 1.5;
      
      setScrollOffset(window.innerWidth - movement);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatChar {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative flex items-center justify-center py-8 bg-gradient-to-b from-purple-900/5 to-transparent overflow-hidden"
    >
      <div className="w-full flex items-center justify-center">
        <div 
          className="flex whitespace-nowrap transition-transform duration-100 ease-out"
          style={{
            transform: `translateX(${scrollOffset}px)`,
            willChange: 'transform',
          }}
        >
          <h1 
            className="font-bold text-center relative mx-8"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {renderFloatingText(text, 0)}
          </h1>
          
          <h1 
            className="font-bold text-center relative mx-8"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {renderFloatingText(text, 1)}
          </h1>
          
          <h1 
            className="font-bold text-center relative mx-8"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {renderFloatingText(text, 2)}
          </h1>
        </div>
      </div>
    </section>
  );
}
