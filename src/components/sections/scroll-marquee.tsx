import React, { useEffect, useState, useRef } from 'react';

const titleSentence = "WELCOME TO THE FUTURE OF DIAGNOSTICS • REVOLUTIONIZING HEALTHCARE WITH AI TECHNOLOGY • DIAGNOAI LEADS THE WAY";

export default function ScrollMarquee() {
  const [translateX, setTranslateX] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollY.current;
          
          setTranslateX(prev => {
            const movement = scrollDelta * 0.02;
            let newX = prev + movement;
            
            if (newX > 100) {
              newX = -100;
            } else if (newX < -100) {
              newX = 100;
            }
            
            return newX;
          });
          
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    const throttledScroll = () => handleScroll();
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-start justify-center pt-8 bg-gradient-to-b from-purple-900/5 to-transparent"
    >
      <div className="w-full px-2 flex items-center justify-center overflow-hidden">
        <h1 
          className="font-bold text-center relative group transition-all duration-300 whitespace-nowrap opacity-100 scale-100"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            transform: `translateX(${translateX}%)`,
            willChange: 'transform',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          <span className="inline-block animate-float-title gradient-text-glow">WELCOME TO THE FUTURE</span>
          <span className="inline-block animate-float-title-delayed mx-2 gradient-text-glow">OF DIAGNOSTICS</span>
          <span className="inline-block animate-float-title mx-2 gradient-text-glow">•</span>
          <span className="inline-block animate-float-title-delayed gradient-text-glow">REVOLUTIONIZING</span>
          <span className="inline-block animate-float-title mx-2 gradient-text-glow">HEALTHCARE</span>
          <span className="inline-block animate-float-title-delayed mx-2 gradient-text-glow">•</span>
          <span className="inline-block animate-float-title gradient-text-glow">DIAGNOAI</span>
          <span className="inline-block animate-float-title-delayed mx-2 gradient-text-glow">LEADS THE WAY</span>
        </h1>
      </div>
    </section>
  );
}
