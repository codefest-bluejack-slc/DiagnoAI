import React, { useEffect, useState, useRef } from 'react';

const titleSentence = "WELCOME TO THE FUTURE OF DIAGNOSTICS • REVOLUTIONIZING HEALTHCARE WITH AI TECHNOLOGY • DIAGNOAI LEADS THE WAY";

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
      className="relative min-h-screen flex items-start justify-center pt-8 bg-gradient-to-b from-purple-900/5 to-transparent"
    >
      <div className="w-full max-w-[98vw] px-2 flex items-center justify-center overflow-hidden">
        <h1 
          className={`text-[12vw] md:text-[10vw] lg:text-[8vw] xl:text-[6vw] font-bold text-center relative group transition-all duration-1000 whitespace-nowrap ${
            isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{
            transform: `translateX(${isInView ? (sectionProgress - 0.5) * 100 : -50}%)`,
            willChange: 'transform, opacity',
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
