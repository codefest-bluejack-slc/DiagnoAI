import React, { useEffect, useState, useRef } from 'react';

const titleSentence = "PRECISION MEDICINE MEETS ARTIFICIAL INTELLIGENCE FOR BETTER HEALTHCARE";

export default function ScrollMarquee() {
  const [sectionProgress, setSectionProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
      setSectionProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-start overflow-hidden bg-gradient-to-b from-purple-900/5 to-transparent"
    >
      <div className="relative w-full h-full flex items-center justify-start">
        <div className="w-full">
          <div
            className="select-none pointer-events-none transition-all duration-700 ease-out whitespace-nowrap"
            style={{
              transform: `translateX(${isInView ? sectionProgress * 100 - 100 : -100}%)`,
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              fontWeight: '900',
              letterSpacing: '0.1em',
              opacity: isInView ? Math.max(0.3, 1 - sectionProgress * 0.1) : 0.3,
              willChange: 'transform, opacity',
              background: `linear-gradient(135deg, #a855f7 0%, #6366f1 30%, #ec4899 60%, #f59e0b 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 50px rgba(168, 85, 247, 0.6)',
              filter: `brightness(${1 + sectionProgress * 0.3})`,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textTransform: 'uppercase',
              paddingLeft: '2rem',
            }}
          >
            {titleSentence}
          </div>
        </div>
      </div>
    </section>
  );
}
