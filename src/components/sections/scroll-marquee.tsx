import React, { useEffect, useState } from 'react';

const titleWords = [
  "PRECISION",
  "MEDICINE",
  "MEETS",
  "ARTIFICIAL",
  "INTELLIGENCE",
  "FOR",
  "BETTER",
  "HEALTHCARE"
];

export default function ScrollMarquee() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-purple-900/5 to-transparent">
      <div className="relative w-full max-w-7xl mx-auto px-6">
        {titleWords.map((word, index) => {
          const moveX = scrollY * 0.5 - index * 100;
          const moveY = index * 80;
          
          return (
            <div
              key={word}
              className="absolute select-none pointer-events-none"
              style={{
                transform: `translate(${moveX}px, ${moveY}px)`,
                fontSize: `${4 - index * 0.2}rem`,
                fontWeight: '900',
                letterSpacing: '0.15em',
                color: '#a855f7',
                textShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
                opacity: Math.max(0.1, 1 - scrollY * 0.003 + index * 0.1),
                right: '0',
                top: '50%',
                marginTop: '-2rem',
                willChange: 'transform, opacity',
                background: 'linear-gradient(45deg, #a855f7, #6366f1, #ec4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
    </section>
  );
}
